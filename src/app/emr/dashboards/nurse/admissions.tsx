import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserPlus, Search, Eye, Check, X, Filter, Calendar, Clock,
  FileText, AlertCircle, ChevronDown, User, Phone, MapPin,
  Building2, Bed, Activity
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { useEMRStore } from '@/app/emr/store/emr-store';

// Mock wards and rooms data
const mockWards = [
  {
    id: 'ward-1',
    name: 'General Ward A',
    type: 'General Ward',
    floor: '1st Floor',
    capacity: 20,
    fee: 15000,
  },
  {
    id: 'ward-2',
    name: 'General Ward B',
    type: 'General Ward',
    floor: '1st Floor',
    capacity: 20,
    fee: 15000,
  },
  {
    id: 'ward-3',
    name: 'Maternity Ward',
    type: 'Maternity Ward',
    floor: '2nd Floor',
    capacity: 15,
    fee: 25000,
  },
  {
    id: 'ward-4',
    name: 'Pediatric Ward',
    type: 'Pediatric',
    floor: '2nd Floor',
    capacity: 12,
    fee: 20000,
  },
  {
    id: 'ward-5',
    name: 'Intensive Care Unit',
    type: 'ICU',
    floor: '3rd Floor',
    capacity: 8,
    fee: 50000,
  },
];

const mockRooms: Record<string, Array<{ id: string; number: string; status: 'Available' | 'Reserved' | 'Occupied' }>> = {
  'ward-1': [
    { id: 'room-1-1', number: 'A-101', status: 'Available' },
    { id: 'room-1-2', number: 'A-102', status: 'Available' },
    { id: 'room-1-3', number: 'A-103', status: 'Occupied' },
    { id: 'room-1-4', number: 'A-104', status: 'Available' },
    { id: 'room-1-5', number: 'A-105', status: 'Reserved' },
    { id: 'room-1-6', number: 'A-106', status: 'Available' },
    { id: 'room-1-7', number: 'A-107', status: 'Occupied' },
    { id: 'room-1-8', number: 'A-108', status: 'Available' },
  ],
  'ward-2': [
    { id: 'room-2-1', number: 'B-201', status: 'Available' },
    { id: 'room-2-2', number: 'B-202', status: 'Occupied' },
    { id: 'room-2-3', number: 'B-203', status: 'Available' },
    { id: 'room-2-4', number: 'B-204', status: 'Reserved' },
    { id: 'room-2-5', number: 'B-205', status: 'Available' },
    { id: 'room-2-6', number: 'B-206', status: 'Available' },
  ],
  'ward-3': [
    { id: 'room-3-1', number: 'M-301', status: 'Available' },
    { id: 'room-3-2', number: 'M-302', status: 'Occupied' },
    { id: 'room-3-3', number: 'M-303', status: 'Available' },
    { id: 'room-3-4', number: 'M-304', status: 'Available' },
    { id: 'room-3-5', number: 'M-305', status: 'Reserved' },
  ],
  'ward-4': [
    { id: 'room-4-1', number: 'P-401', status: 'Available' },
    { id: 'room-4-2', number: 'P-402', status: 'Available' },
    { id: 'room-4-3', number: 'P-403', status: 'Occupied' },
    { id: 'room-4-4', number: 'P-404', status: 'Available' },
  ],
  'ward-5': [
    { id: 'room-5-1', number: 'ICU-501', status: 'Available' },
    { id: 'room-5-2', number: 'ICU-502', status: 'Occupied' },
    { id: 'room-5-3', number: 'ICU-503', status: 'Available' },
    { id: 'room-5-4', number: 'ICU-504', status: 'Reserved' },
  ],
};

// Mock admission requests data
const mockAdmissionRequests = [
  {
    id: 'ADM-001',
    patientId: 'GH-2024-001',
    patientName: 'Ibrahim Abdullahi',
    age: 45,
    gender: 'Male',
    doctor: 'Dr. Musa Ahmed',
    diagnosis: 'Acute Appendicitis',
    requestedDate: '2024-02-11',
    requestedTime: '10:30 AM',
    wardType: 'General Ward',
    bedCategory: 'Standard',
    urgency: 'High',
    status: 'Pending',
    phone: '08012345678',
  },
  {
    id: 'ADM-002',
    patientId: 'GH-2024-045',
    patientName: 'Aisha Mohammed',
    age: 32,
    gender: 'Female',
    doctor: 'Dr. Fatima Hassan',
    diagnosis: 'Pregnancy - High Risk',
    requestedDate: '2024-02-11',
    requestedTime: '11:15 AM',
    wardType: 'Maternity Ward',
    bedCategory: 'Private',
    urgency: 'High',
    status: 'Pending',
    phone: '08098765432',
  },
  {
    id: 'ADM-003',
    patientId: 'GH-2024-023',
    patientName: 'Yusuf Bello',
    age: 68,
    gender: 'Male',
    doctor: 'Dr. Ahmed Suleiman',
    diagnosis: 'Pneumonia',
    requestedDate: '2024-02-11',
    requestedTime: '09:45 AM',
    wardType: 'ICU',
    bedCategory: 'ICU Bed',
    urgency: 'Critical',
    status: 'Pending',
    phone: '08087654321',
  },
  {
    id: 'ADM-004',
    patientId: 'GH-2024-067',
    patientName: 'Halima Usman',
    age: 25,
    gender: 'Female',
    doctor: 'Dr. Umar Ibrahim',
    diagnosis: 'Fracture - Femur',
    requestedDate: '2024-02-11',
    requestedTime: '08:20 AM',
    wardType: 'Orthopedic Ward',
    bedCategory: 'Standard',
    urgency: 'Medium',
    status: 'Pending',
    phone: '08023456789',
  },
  {
    id: 'ADM-005',
    patientId: 'GH-2024-089',
    patientName: 'Muhammad Ali',
    age: 55,
    gender: 'Male',
    doctor: 'Dr. Musa Ahmed',
    diagnosis: 'Diabetes Complications',
    requestedDate: '2024-02-10',
    requestedTime: '03:30 PM',
    wardType: 'General Ward',
    bedCategory: 'Standard',
    urgency: 'Medium',
    status: 'Approved',
    phone: '08034567890',
  },
];

export function NurseAdmissions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [requests, setRequests] = useState(mockAdmissionRequests);

  // Modal states
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockAdmissionRequests[0] | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  
  // New states for enhanced admission modal
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [admissionFee, setAdmissionFee] = useState(0);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter;

      return matchesSearch && matchesStatus && matchesUrgency;
    });
  }, [requests, searchQuery, statusFilter, urgencyFilter]);

  const handleApproveClick = (request: typeof mockAdmissionRequests[0]) => {
    setSelectedRequest(request);
    setApprovalNotes('');
    setIsApproveModalOpen(true);
  };

  const handleRejectClick = (request: typeof mockAdmissionRequests[0]) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const handleViewClick = (request: typeof mockAdmissionRequests[0]) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const confirmApprove = () => {
    if (!selectedRequest || !selectedWard || !selectedRoom) return;
    
    const ward = mockWards.find(w => w.id === selectedWard);
    const room = mockRooms[selectedWard]?.find(r => r.id === selectedRoom);
    
    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id ? {
          ...req,
          status: 'Approved',
          approvedWardId: selectedWard,
          approvedWardName: ward?.name || '',
          approvedRoomId: selectedRoom,
          approvedRoomNumber: room?.number || '',
          approvedFee: admissionFee,
          approvedDate: new Date().toISOString(),
        } : req
      )
    );
    toast.success('Admission request approved successfully', {
      description: `${selectedRequest.patientName} has been approved for ${room?.number} in ${ward?.name}.`,
    });
    setIsApproveModalOpen(false);
    setSelectedRequest(null);
    setApprovalNotes('');
    setSelectedWard('');
    setSelectedRoom('');
    setAdmissionFee(0);
  };

  const confirmReject = () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id ? { ...req, status: 'Rejected' } : req
      )
    );
    toast.error('Admission request rejected', {
      description: `${selectedRequest.patientName}'s admission request has been rejected.`,
    });
    setIsRejectModalOpen(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const getUrgencyBadge = (urgency: string) => {
    const variants = {
      Critical: 'bg-red-100 text-red-700',
      High: 'bg-orange-100 text-orange-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      Low: 'bg-green-100 text-green-700',
    };
    return (
      <Badge className={`${variants[urgency as keyof typeof variants]} hover:${variants[urgency as keyof typeof variants]}`}>
        {urgency}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: 'bg-blue-100 text-blue-700',
      Approved: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700',
    };
    return (
      <Badge className={`${variants[status as keyof typeof variants]} hover:${variants[status as keyof typeof variants]}`}>
        {status}
      </Badge>
    );
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const criticalCount = requests.filter(r => r.urgency === 'Critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admission Requests</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage patient admission requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold">{criticalCount}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-100">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{requests.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setUrgencyFilter('all');
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admission Requests</CardTitle>
          <CardDescription>
            Showing {filteredRequests.length} of {requests.length} requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Ward Type</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <UserPlus className="w-12 h-12 text-muted-foreground" />
                        <p className="text-muted-foreground">No admission requests found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request, index) => (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.patientName}</p>
                          <p className="text-xs text-muted-foreground">{request.patientId}</p>
                          <p className="text-xs text-muted-foreground">
                            {request.age}y, {request.gender}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{request.doctor}</TableCell>
                      <TableCell>{request.diagnosis}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{request.wardType}</p>
                          <p className="text-xs text-muted-foreground">{request.bedCategory}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{request.requestedDate}</p>
                          <p className="text-xs text-muted-foreground">{request.requestedTime}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {request.status === 'Pending' ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApproveClick(request)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRejectClick(request)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleViewClick(request)}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Approve Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-full bg-green-100">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Approve Admission Request</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Select ward and room for {selectedRequest?.patientName}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Patient Details */}
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 space-y-2">
              <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Patient Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Request ID:</span>
                  <span className="font-semibold">{selectedRequest?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient ID:</span>
                  <span className="font-semibold">{selectedRequest?.patientId}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-semibold">{selectedRequest?.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age / Gender:</span>
                  <span className="font-semibold">{selectedRequest?.age}y, {selectedRequest?.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-semibold">{selectedRequest?.phone}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">Diagnosis:</span>
                  <span className="font-semibold">{selectedRequest?.diagnosis}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">Requested By:</span>
                  <span className="font-semibold">{selectedRequest?.doctor}</span>
                </div>
              </div>
            </div>

            {/* Ward Selector */}
            <div className="space-y-2">
              <Label htmlFor="ward-select" className="flex items-center gap-2 text-sm font-semibold">
                <Building2 className="w-4 h-4 text-primary" />
                Select Ward
              </Label>
              <Select 
                value={selectedWard} 
                onValueChange={(value) => {
                  setSelectedWard(value);
                  setSelectedRoom('');
                  const ward = mockWards.find(w => w.id === value);
                  setAdmissionFee(ward?.fee || 0);
                }}
              >
                <SelectTrigger id="ward-select">
                  <SelectValue placeholder="Choose a ward..." />
                </SelectTrigger>
                <SelectContent>
                  {mockWards.map((ward) => (
                    <SelectItem key={ward.id} value={ward.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{ward.name}</span>
                        <span className="text-xs text-muted-foreground ml-4">({ward.floor})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Room Grid Viewer */}
            {selectedWard && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-semibold">
                    <Bed className="w-4 h-4 text-primary" />
                    Select Room
                  </Label>
                  {/* Occupancy Indicator */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-yellow-500"></div>
                      <span>Reserved</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-red-500"></div>
                      <span>Occupied</span>
                    </div>
                  </div>
                </div>

                {/* Room Grid */}
                <div className="grid grid-cols-4 gap-2 p-4 border rounded-lg bg-muted/30">
                  {mockRooms[selectedWard]?.map((room) => (
                    <motion.button
                      key={room.id}
                      type="button"
                      whileHover={{ scale: room.status === 'Available' ? 1.05 : 1 }}
                      whileTap={{ scale: room.status === 'Available' ? 0.95 : 1 }}
                      onClick={() => room.status === 'Available' && setSelectedRoom(room.id)}
                      disabled={room.status !== 'Available'}
                      className={`
                        p-3 rounded-lg border-2 transition-all text-sm font-semibold
                        ${room.status === 'Available' && selectedRoom !== room.id ? 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200 cursor-pointer' : ''}
                        ${room.status === 'Available' && selectedRoom === room.id ? 'bg-green-500 border-green-600 text-white ring-2 ring-green-400' : ''}
                        ${room.status === 'Reserved' ? 'bg-yellow-100 border-yellow-300 text-yellow-800 cursor-not-allowed opacity-60' : ''}
                        ${room.status === 'Occupied' ? 'bg-red-100 border-red-300 text-red-800 cursor-not-allowed opacity-60' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{room.number}</span>
                        {selectedRoom === room.id && (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Fee Display */}
            {selectedWard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg bg-emerald-50 border border-emerald-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">Admission Fee</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-700">
                    ₦{admissionFee.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-emerald-700 mt-2">
                  {mockWards.find(w => w.id === selectedWard)?.name} • {mockWards.find(w => w.id === selectedWard)?.floor}
                </p>
              </motion.div>
            )}

            {/* Instructions */}
            {!selectedWard && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">
                  Please select a ward to view available rooms.
                </p>
              </div>
            )}

            {selectedWard && !selectedRoom && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-orange-900">
                  Please select an available room (green) to proceed with admission.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsApproveModalOpen(false);
                setSelectedWard('');
                setSelectedRoom('');
                setAdmissionFee(0);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmApprove}
              disabled={!selectedWard || !selectedRoom}
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm Admission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-full bg-red-100">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Reject Admission Request</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  This action cannot be undone
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {/* Request Details */}
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Request ID:</span>
                <span className="font-semibold">{selectedRequest?.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Patient:</span>
                <span className="font-semibold">{selectedRequest?.patientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Diagnosis:</span>
                <span className="font-semibold">{selectedRequest?.diagnosis}</span>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-900">
                Once rejected, this request will be permanently declined and cannot be recovered.
              </p>
            </div>

            {/* Reason Input */}
            <div className="space-y-2">
              <Label htmlFor="rejectionReason" className="text-sm font-medium">
                Reason for Rejection <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a clear reason for rejecting this admission request..."
                className="min-h-[100px] resize-none"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectionReason.trim()}
            >
              <X className="w-4 h-4 mr-2" />
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-3 rounded-full ${selectedRequest?.status === 'Approved' ? 'bg-green-100' : selectedRequest?.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'}`}>
                <Eye className={`w-6 h-6 ${selectedRequest?.status === 'Approved' ? 'text-green-600' : selectedRequest?.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'}`} />
              </div>
              <div>
                <DialogTitle className="text-xl">View Admission Request</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Detailed information about the admission request
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Request Details */}
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 space-y-2">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Request Information</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Request ID:</span>
                <span className="font-semibold">{selectedRequest?.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Patient ID:</span>
                <span className="font-semibold">{selectedRequest?.patientId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Patient:</span>
                <span className="font-semibold">{selectedRequest?.patientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Age / Gender:</span>
                <span className="font-semibold">{selectedRequest?.age}y, {selectedRequest?.gender}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-semibold">{selectedRequest?.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Diagnosis:</span>
                <span className="font-semibold">{selectedRequest?.diagnosis}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Requested By:</span>
                <span className="font-semibold">{selectedRequest?.doctor}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ward Type:</span>
                <span className="font-semibold">{selectedRequest?.wardType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bed Category:</span>
                <span className="font-semibold">{selectedRequest?.bedCategory}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Urgency:</span>
                <span className="font-semibold">{selectedRequest?.urgency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                {selectedRequest && getStatusBadge(selectedRequest.status)}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date & Time:</span>
                <span className="font-semibold">{selectedRequest?.requestedDate} {selectedRequest?.requestedTime}</span>
              </div>
            </div>

            {/* Approval Details - Only show if approved */}
            {selectedRequest?.status === 'Approved' && 'approvedWardName' in selectedRequest && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 space-y-3">
                  <h3 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Approval Details
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs mb-1">Assigned Ward</span>
                      <div className="flex items-center gap-2 font-semibold text-green-900">
                        <Building2 className="w-4 h-4" />
                        {(selectedRequest as any).approvedWardName}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs mb-1">Room Number</span>
                      <div className="flex items-center gap-2 font-semibold text-green-900">
                        <Bed className="w-4 h-4" />
                        {(selectedRequest as any).approvedRoomNumber}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Admission Fee:</span>
                      <span className="text-lg font-bold text-green-700">
                        ₦{((selectedRequest as any).approvedFee || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {(selectedRequest as any).approvedDate && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-green-200">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Approved on {new Date((selectedRequest as any).approvedDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Success Message */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-900">
                    This admission request has been approved. The patient can now be admitted to {(selectedRequest as any).approvedRoomNumber} in {(selectedRequest as any).approvedWardName}.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Rejection Info */}
            {selectedRequest?.status === 'Rejected' && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-900">
                  This admission request has been rejected and cannot be processed.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}