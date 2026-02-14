import { toast } from 'sonner';
import { generateFilePaymentReceiptPDF, type FilePaymentReceiptData } from '@/app/emr/utils/file-payment-receipt-pdf';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  DollarSign,
  Printer,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Eye,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/app/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { useEMRStore } from '@/app/emr/store/emr-store';
import { Patient } from '@/app/emr/store/types';

// Fixed Fees
const INDIVIDUAL_FILE_FEE = 1500;
const FAMILY_FILE_FEE = 3000;

// Confirm Payment Modal
function ConfirmPaymentModal({
  isOpen,
  onClose,
  patient,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onConfirm: (pin: string) => void;
}) {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const amount = patient?.fileType === 'Family' ? FAMILY_FILE_FEE : INDIVIDUAL_FILE_FEE;

  const handleConfirm = (printReceipt: boolean = false) => {
    // Validate PIN
    if (!pin) {
      setPinError('PIN is required');
      toast.error('PIN Required', {
        description: 'Please enter your 4-digit PIN to confirm payment',
      });
      return;
    }
    if (pin.length !== 4) {
      setPinError('PIN must be 4 digits');
      toast.error('Invalid PIN Length', {
        description: 'PIN must be exactly 4 digits',
      });
      return;
    }

    // Simulate PIN verification
    if (pin !== '1234') {
      setPinError('Incorrect PIN');
      toast.error('Invalid PIN', {
        description: 'The PIN you entered is incorrect. Please try again.',
      });
      return;
    }

    // Clear errors
    setPinError('');

    // Confirm payment
    onConfirm(pin);

    // Show success message
    toast.success('File Payment Confirmed', {
      description: `Payment of ₦${amount.toLocaleString()} confirmed for ${patient?.fullName}`,
    });

    // Print receipt if requested
    if (printReceipt) {
      const receiptData: FilePaymentReceiptData = {
        receiptId: `GH-FILE-${Date.now()}`,
        patientName: patient?.fullName || '',
        patientId: patient?.id || '',
        fileNo: patient?.id || '',
        fileType: patient?.fileType || 'Individual',
        amount: amount,
        paymentMethod: 'Cash', // Default to Cash, can be enhanced later
        paymentDate: new Date().toLocaleDateString(),
        paymentTime: new Date().toLocaleTimeString(),
        cashierName: 'Cashier', // Get from auth context
        cashierId: 'GH-STF-001',
        parentFileId: patient?.parentFileId
      };
      generateFilePaymentReceiptPDF(receiptData);
      toast.success('Receipt Printed', {
        description: `Receipt for ${patient?.fullName} has been sent to the printer`,
      });
    }

    // Reset form
    setPin('');
    onClose();
  };

  const handleCancel = () => {
    setPin('');
    setPinError('');
    onClose();
  };

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm File Payment</DialogTitle>
          <DialogDescription>
            Review payment details and enter your PIN to confirm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Payment Summary Card */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Patient Name</span>
              <span className="font-semibold">{patient.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">File Number</span>
              <span className="font-medium font-mono">{patient.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">File Type</span>
              <Badge variant={patient.fileType === 'Family' ? 'default' : 'secondary'}>
                {patient.fileType}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Gender</span>
              <span className="font-medium">{patient.gender}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="font-medium">{patient.phoneNumber}</span>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">File Registration Fee</span>
                <span className="text-3xl font-bold text-primary">
                  ₦{amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Digit PIN Input */}
          <div className="space-y-2">
            <Label htmlFor="pin">Enter 4-Digit PIN *</Label>
            <Input
              id="pin"
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setPin(value);
                setPinError('');
              }}
              placeholder="••••"
              className={`text-center text-2xl tracking-[1em] font-bold ${pinError ? 'border-destructive' : ''}`}
            />
            {pinError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {pinError}
              </p>
            )}
            <p className="text-xs text-muted-foreground">Default PIN: 1234</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirm(false)}
              className="flex-1"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm
            </Button>
            <Button
              onClick={() => handleConfirm(true)}
              className="flex-1"
            >
              <Printer className="w-4 h-4 mr-2" />
              Confirm & Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// View Subfiles Modal (for Family Files)
function ViewSubfilesModal({
  isOpen,
  onClose,
  parentPatient,
  subfiles
}: {
  isOpen: boolean;
  onClose: () => void;
  parentPatient: Patient | null;
  subfiles: Patient[];
}) {
  if (!parentPatient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Family Members - {parentPatient.fullName}
          </DialogTitle>
          <DialogDescription>
            Viewing all subfiles under this family file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Parent File Info */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">{parentPatient.fullName} (Parent File)</p>
                <p className="text-sm text-muted-foreground">File No: {parentPatient.id}</p>
              </div>
              <Badge variant="default">Family</Badge>
            </div>
          </div>

          {/* Subfiles Table */}
          {subfiles.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S/N</TableHead>
                    <TableHead>Member Name</TableHead>
                    <TableHead>File No</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subfiles.map((subfile, index) => (
                    <TableRow key={subfile.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{subfile.fullName}</TableCell>
                      <TableCell className="font-mono text-sm">{subfile.id}</TableCell>
                      <TableCell>{subfile.gender}</TableCell>
                      <TableCell>
                        <Badge variant={subfile.status === 'Active' ? 'default' : 'secondary'}>
                          {subfile.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No subfiles found under this family file</p>
            </div>
          )}

          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Cancel Payment Modal
function CancelPaymentModal({
  isOpen,
  onClose,
  patient,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onConfirm: () => void;
}) {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-destructive">
            <AlertCircle className="w-6 h-6" />
            Cancel Payment
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
            <p className="text-sm text-muted-foreground mb-2">Patient:</p>
            <p className="font-semibold text-lg">{patient.fullName}</p>
            <p className="text-sm text-muted-foreground">File No: {patient.id}</p>
          </div>

          <p className="text-sm text-muted-foreground">
            Canceling this payment will permanently remove the payment record. 
            This action cannot be undone.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            No, Keep It
          </Button>
          <Button variant="destructive" onClick={() => {
            onConfirm();
            onClose();
          }}>
            <Trash2 className="w-4 h-4 mr-2" />
            Yes, Cancel Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CashierFilePaymentsPage() {
  const { patients, updatePatient } = useEMRStore();

  // Filter to show only patients (files) - both Individual and Family
  const allFiles = useMemo(() => {
    return patients.filter(p => !p.parentFileId); // Exclude subfiles
  }, [patients]);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubfilesModalOpen, setIsSubfilesModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Filter and search files
  const filteredFiles = useMemo(() => {
    return allFiles.filter(file => {
      const matchesSearch = 
        file.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.phoneNumber.includes(searchQuery);

      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'paid' && file.status !== 'Pending Payment') ||
        (statusFilter === 'pending' && file.status === 'Pending Payment');

      return matchesSearch && matchesStatus;
    });
  }, [allFiles, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get subfiles for a family file
  const getSubfiles = (parentId: string) => {
    return patients.filter(p => p.parentFileId === parentId);
  };

  // Handlers
  const handleConfirmPayment = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPaymentModalOpen(true);
  };

  const handleViewSubfiles = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsSubfilesModalOpen(true);
    toast.info('Subfile Opened', {
      description: `Viewing family members for ${patient.fullName}`,
    });
  };

  const handlePrintReceipt = (patient: Patient) => {
    const amount = patient.fileType === 'Family' ? FAMILY_FILE_FEE : INDIVIDUAL_FILE_FEE;
    const receiptData: FilePaymentReceiptData = {
      receiptId: `GH-FILE-${Date.now()}`,
      patientName: patient.fullName,
      patientId: patient.id,
      fileNo: patient.id,
      fileType: patient.fileType,
      amount: amount,
      paymentMethod: 'Cash',
      paymentDate: new Date().toLocaleDateString(),
      paymentTime: new Date().toLocaleTimeString(),
      cashierName: 'Cashier',
      cashierId: 'GH-STF-001',
      parentFileId: patient.parentFileId
    };
    generateFilePaymentReceiptPDF(receiptData);
    toast.success('Receipt Printed', {
      description: `Receipt for ${patient.fullName} (${patient.id}) has been sent to the printer`,
    });
  };

  const handleCancelPayment = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsCancelModalOpen(true);
  };

  const handlePaymentConfirm = (pin: string) => {
    if (selectedPatient) {
      // Update patient status to Active (payment confirmed)
      updatePatient(selectedPatient.id, { 
        status: 'Active'
      });
    }
  };

  const handleCancelConfirm = () => {
    if (selectedPatient) {
      // Reset to Pending Payment
      updatePatient(selectedPatient.id, { 
        status: 'Pending Payment'
      });
      toast.success('Payment Cancelled', {
        description: `Payment for ${selectedPatient.fullName} has been cancelled`,
      });
    }
  };

  // Calculate statistics
  const stats = {
    total: allFiles.length,
    pending: allFiles.filter(f => f.status === 'Pending Payment').length,
    paid: allFiles.filter(f => f.status !== 'Pending Payment').length,
    individual: allFiles.filter(f => f.fileType === 'Individual').length,
    family: allFiles.filter(f => f.fileType === 'Family').length,
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">File Payments</h1>
        <p className="text-muted-foreground">
          Manage and confirm file registration payments
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold">{stats.paid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Individual</p>
                <p className="text-2xl font-bold">{stats.individual}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Family</p>
                <p className="text-2xl font-bold">{stats.family}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search by File No, Name, or Phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            File Registration Payments
            <Badge variant="secondary" className="ml-2">
              {filteredFiles.length} files
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedFiles.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">S/N</TableHead>
                    <TableHead>File No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>File Type</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFiles.map((file, index) => {
                    const isPaid = file.status !== 'Pending Payment';
                    const fee = file.fileType === 'Family' ? FAMILY_FILE_FEE : INDIVIDUAL_FILE_FEE;
                    const subfiles = getSubfiles(file.id);

                    return (
                      <TableRow key={file.id}>
                        <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">{file.id}</TableCell>
                        <TableCell className="font-medium">{file.fullName}</TableCell>
                        <TableCell>{file.gender}</TableCell>
                        <TableCell>{file.phoneNumber}</TableCell>
                        <TableCell>
                          <Badge variant={file.fileType === 'Family' ? 'default' : 'secondary'}>
                            {file.fileType}
                            {file.fileType === 'Family' && subfiles.length > 0 && (
                              <span className="ml-1">({subfiles.length})</span>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">₦{fee.toLocaleString()}</TableCell>
                        <TableCell>
                          {isPaid ? (
                            <Badge variant="default" className="bg-secondary">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {file.fileType === 'Family' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewSubfiles(file)}
                                title="View Subfiles"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            {!isPaid ? (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleConfirmPayment(file)}
                              >
                                <DollarSign className="w-4 h-4 mr-1" />
                                Confirm
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePrintReceipt(file)}
                                >
                                  <Printer className="w-4 h-4 mr-1" />
                                  Print
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCancelPayment(file)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium text-muted-foreground mb-2">No files found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'File registrations will appear here'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredFiles.length)} of{' '}
                {filteredFiles.length} files
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => {
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <div key={`ellipsis-${page}`} className="flex items-center">
                            <span className="px-2 text-muted-foreground">...</span>
                            <Button
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-10"
                            >
                              {page}
                            </Button>
                          </div>
                        );
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      );
                    })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ConfirmPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        onConfirm={handlePaymentConfirm}
      />

      <ViewSubfilesModal
        isOpen={isSubfilesModalOpen}
        onClose={() => {
          setIsSubfilesModalOpen(false);
          setSelectedPatient(null);
        }}
        parentPatient={selectedPatient}
        subfiles={selectedPatient ? getSubfiles(selectedPatient.id) : []}
      />

      <CancelPaymentModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
}