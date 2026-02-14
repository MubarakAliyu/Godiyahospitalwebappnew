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
  const [selectedRequest, setSelectedRequest] = useState<typeof mockAdmissionRequests[0] | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

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

  const confirmApprove = () => {
    if (!selectedRequest) return;
    
    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id ? { ...req, status: 'Approved' } : req
      )
    );
    toast.success('Admission request approved successfully', {
      description: `${selectedRequest.patientName} has been approved for admission.`,
    });
    setIsApproveModalOpen(false);
    setSelectedRequest(null);
    setApprovalNotes('');
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
                            <Button size="sm" variant="outline">
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-full bg-green-100">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Approve Admission Request</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Confirm approval for {selectedRequest?.patientName}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {/* Request Details */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Requested By:</span>
                <span className="font-semibold">{selectedRequest?.doctor}</span>
              </div>
            </div>
            
            <p className="text-sm text-center text-muted-foreground">
              Are you sure you want to approve this admission request?
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsApproveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmApprove}
            >
              <Check className="w-4 h-4 mr-2" />
              Approve Request
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
    </div>
  );
}