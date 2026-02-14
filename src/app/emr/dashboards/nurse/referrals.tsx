import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Activity, Search, Eye, Check, X, Filter, Calendar, Clock,
  FileText, AlertCircle, ChevronDown, User, Phone, MapPin,
  Building2, ArrowRight, Stethoscope
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

// Mock referral requests data
const mockReferrals = [
  {
    id: 'REF-001',
    patientId: 'GH-2024-012',
    patientName: 'Fatima Garba',
    age: 38,
    gender: 'Female',
    fromDoctor: 'Dr. Umar Ibrahim',
    fromDepartment: 'General Medicine',
    toDoctor: 'Dr. Ahmed Suleiman',
    toDepartment: 'Cardiology',
    reason: 'Suspected Heart Condition',
    urgency: 'High',
    status: 'Pending',
    date: '2024-02-11',
    time: '10:45 AM',
  },
  {
    id: 'REF-002',
    patientId: 'GH-2024-034',
    patientName: 'Suleiman Bello',
    age: 52,
    gender: 'Male',
    fromDoctor: 'Dr. Fatima Hassan',
    fromDepartment: 'Emergency',
    toDoctor: 'Dr. Musa Ahmed',
    toDepartment: 'Orthopedics',
    reason: 'Multiple Fractures',
    urgency: 'Critical',
    status: 'Pending',
    date: '2024-02-11',
    time: '11:20 AM',
  },
  {
    id: 'REF-003',
    patientId: 'GH-2024-056',
    patientName: 'Maryam Yusuf',
    age: 29,
    gender: 'Female',
    fromDoctor: 'Dr. Musa Ahmed',
    fromDepartment: 'Obstetrics',
    toDoctor: 'Dr. Fatima Hassan',
    toDepartment: 'Gynecology',
    reason: 'Pregnancy Complications',
    urgency: 'High',
    status: 'Accepted',
    date: '2024-02-11',
    time: '09:30 AM',
  },
];

export function NurseReferrals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [referrals, setReferrals] = useState(mockReferrals);

  // Modal states
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<typeof mockReferrals[0] | null>(null);
  const [acceptanceNotes, setAcceptanceNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter referrals
  const filteredReferrals = useMemo(() => {
    return referrals.filter((referral) => {
      const matchesSearch =
        referral.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
      const matchesUrgency = urgencyFilter === 'all' || referral.urgency === urgencyFilter;

      return matchesSearch && matchesStatus && matchesUrgency;
    });
  }, [referrals, searchQuery, statusFilter, urgencyFilter]);

  const handleAcceptClick = (referral: typeof mockReferrals[0]) => {
    setSelectedReferral(referral);
    setAcceptanceNotes('');
    setIsAcceptModalOpen(true);
  };

  const handleRejectClick = (referral: typeof mockReferrals[0]) => {
    setSelectedReferral(referral);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const confirmAccept = () => {
    if (!selectedReferral) return;
    
    setReferrals((prev) =>
      prev.map((ref) =>
        ref.id === selectedReferral.id ? { ...ref, status: 'Accepted' } : ref
      )
    );
    toast.success('Referral request accepted successfully', {
      description: `${selectedReferral.patientName} has been referred to ${selectedReferral.toDepartment}.`,
    });
    setIsAcceptModalOpen(false);
    setSelectedReferral(null);
    setAcceptanceNotes('');
  };

  const confirmReject = () => {
    if (!selectedReferral || !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setReferrals((prev) =>
      prev.map((ref) =>
        ref.id === selectedReferral.id ? { ...ref, status: 'Rejected' } : ref
      )
    );
    toast.error('Referral request rejected', {
      description: `${selectedReferral.patientName}'s referral request has been rejected.`,
    });
    setIsRejectModalOpen(false);
    setSelectedReferral(null);
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
      Accepted: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700',
    };
    return (
      <Badge className={`${variants[status as keyof typeof variants]} hover:${variants[status as keyof typeof variants]}`}>
        {status}
      </Badge>
    );
  };

  const pendingCount = referrals.filter(r => r.status === 'Pending').length;
  const acceptedCount = referrals.filter(r => r.status === 'Accepted').length;
  const criticalCount = referrals.filter(r => r.urgency === 'Critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Referral Requests</h1>
        <p className="text-muted-foreground mt-1">
          Manage patient referral requests between departments
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
                  <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                  <p className="text-2xl font-bold">{acceptedCount}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold">{referrals.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search referrals..."
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
                <SelectItem value="Accepted">Accepted</SelectItem>
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

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Requests</CardTitle>
          <CardDescription>
            Showing {filteredReferrals.length} of {referrals.length} referrals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referral ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Activity className="w-12 h-12 text-muted-foreground" />
                        <p className="text-muted-foreground">No referral requests found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReferrals.map((referral, index) => (
                    <motion.tr
                      key={referral.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{referral.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{referral.patientName}</p>
                          <p className="text-xs text-muted-foreground">{referral.patientId}</p>
                          <p className="text-xs text-muted-foreground">
                            {referral.age}y, {referral.gender}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{referral.fromDoctor}</p>
                          <p className="text-xs text-muted-foreground">{referral.fromDepartment}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{referral.toDoctor}</p>
                            <p className="text-xs text-muted-foreground">{referral.toDepartment}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{referral.reason}</TableCell>
                      <TableCell>{getUrgencyBadge(referral.urgency)}</TableCell>
                      <TableCell>{getStatusBadge(referral.status)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{referral.date}</p>
                          <p className="text-xs text-muted-foreground">{referral.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {referral.status === 'Pending' ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleAcceptClick(referral)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRejectClick(referral)}
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

      {/* Accept Referral Modal */}
      <Dialog open={isAcceptModalOpen} onOpenChange={setIsAcceptModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-full bg-green-100">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Accept Referral Request</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Confirm acceptance for {selectedReferral?.patientName}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {/* Referral Details */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Referral ID:</span>
                <span className="font-semibold">{selectedReferral?.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Patient:</span>
                <span className="font-semibold">{selectedReferral?.patientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">From:</span>
                <span className="font-semibold">{selectedReferral?.fromDepartment}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">To:</span>
                <span className="font-semibold">{selectedReferral?.toDepartment}</span>
              </div>
            </div>
            
            <p className="text-sm text-center text-muted-foreground">
              Are you sure you want to accept this referral request?
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAcceptModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmAccept}
            >
              <Check className="w-4 h-4 mr-2" />
              Accept Referral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Referral Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-full bg-red-100">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Reject Referral Request</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  This action cannot be undone
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {/* Referral Details */}
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Referral ID:</span>
                <span className="font-semibold">{selectedReferral?.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Patient:</span>
                <span className="font-semibold">{selectedReferral?.patientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reason:</span>
                <span className="font-semibold">{selectedReferral?.reason}</span>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-900">
                Once rejected, this referral will be permanently declined and cannot be recovered.
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
                placeholder="Please provide a clear reason for rejecting this referral request..."
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
              Reject Referral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}