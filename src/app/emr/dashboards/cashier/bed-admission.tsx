import { toast } from 'sonner';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Eye,
  Calendar,
  Bed,
  Download,
  Filter,
  Banknote,
  CreditCard,
  Building2,
  Trash2,
  User,
  Home
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';

// Bed Admission Invoice Interface
interface BedAdmissionInvoice {
  id: string;
  admissionNo: string;
  patientId: string;
  patientName: string;
  ward: string;
  bedNumber: string;
  admissionDate: string;
  dischargeDate?: string;
  numberOfDays: number;
  dailyRate: number;
  amount: number;
  status: 'Paid' | 'Pending';
  paymentMethod?: string;
  paymentDate?: string;
  paymentTime?: string;
  attendingDoctor: string;
}

// Admission Breakdown Modal
function AdmissionBreakdownModal({
  isOpen,
  onClose,
  admission
}: {
  isOpen: boolean;
  onClose: () => void;
  admission: BedAdmissionInvoice | null;
}) {
  if (!admission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Bed className="w-6 h-6 text-primary" />
            Bed Admission Details
          </DialogTitle>
          <DialogDescription>
            Detailed breakdown for admission {admission.admissionNo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Admission Info Card */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4 border border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Admission No</p>
                <p className="font-mono font-semibold">{admission.admissionNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge 
                  variant={admission.status === 'Paid' ? 'default' : 'secondary'}
                  className={admission.status === 'Paid' ? 'bg-secondary' : 'bg-yellow-500/10 text-yellow-700'}
                >
                  {admission.status === 'Paid' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {admission.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                  {admission.status}
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
                  <p className="font-semibold">{admission.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">File Number</p>
                  <p className="font-mono text-sm">{admission.patientId}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ward</p>
                  <Badge variant="outline" className="font-medium">
                    <Home className="w-3 h-3 mr-1" />
                    {admission.ward}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bed Number</p>
                  <Badge variant="outline" className="font-medium">
                    <Bed className="w-3 h-3 mr-1" />
                    {admission.bedNumber}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Attending Doctor</p>
                  <Badge variant="outline">
                    <User className="w-3 h-3 mr-1" />
                    {admission.attendingDoctor}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Daily Rate</p>
                  <p className="font-semibold text-secondary">₦{admission.dailyRate.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admission Timeline */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Admission Timeline
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Admission Date</span>
                <span className="font-semibold">{new Date(admission.admissionDate).toLocaleDateString()}</span>
              </div>
              {admission.dischargeDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Discharge Date</span>
                  <span className="font-semibold">{new Date(admission.dischargeDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-sm text-muted-foreground">Number of Days</span>
                <Badge variant="secondary" className="font-bold">
                  {admission.numberOfDays} {admission.numberOfDays === 1 ? 'day' : 'days'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Cost Calculation */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Cost Breakdown
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Daily Rate</span>
                <span className="font-medium">₦{admission.dailyRate.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Number of Days</span>
                <span className="font-medium">{admission.numberOfDays}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-sm text-muted-foreground">Calculation</span>
                <span className="font-mono text-sm">
                  ₦{admission.dailyRate.toLocaleString()} × {admission.numberOfDays} days
                </span>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-white">Total Amount</span>
              <span className="text-3xl font-bold text-white">
                ₦{admission.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {admission.status === 'Paid' && admission.paymentMethod && (
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <Badge variant="outline">{admission.paymentMethod}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                  <p className="font-medium">{admission.paymentDate}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Confirm Payment Modal
function ConfirmPaymentModal({
  isOpen,
  onClose,
  admission,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  admission: BedAdmissionInvoice | null;
  onConfirm: (pin: string, paymentMethod: string) => void;
}) {
  const [pin, setPin] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [pinError, setPinError] = useState('');

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
    if (!paymentMethod) {
      toast.error('Payment Method Required', {
        description: 'Please select a payment method',
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
    onConfirm(pin, paymentMethod);

    // Show success message
    toast.success('Payment Confirmed', {
      description: `Payment of ₦${admission?.amount.toLocaleString()} confirmed for ${admission?.patientName}`,
    });

    // Print receipt if requested
    if (printReceipt && admission) {
      setTimeout(() => {
        toast.success('Receipt Printed', {
          description: `Bed admission receipt for ${admission.patientName} has been sent to the printer`,
        });
      }, 500);
    }

    // Reset form
    setPin('');
    setPaymentMethod('');
    onClose();
  };

  const handleCancel = () => {
    setPin('');
    setPaymentMethod('');
    setPinError('');
    onClose();
  };

  if (!admission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm Bed Admission Payment</DialogTitle>
          <DialogDescription>
            Review admission details and enter your PIN to confirm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Admission Summary Card */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Admission No</span>
              <span className="font-mono font-semibold">{admission.admissionNo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Patient Name</span>
              <span className="font-semibold">{admission.patientName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">File Number</span>
              <span className="font-medium font-mono">{admission.patientId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ward & Bed</span>
              <span className="font-medium">{admission.ward} - Bed {admission.bedNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Number of Days</span>
              <Badge variant="secondary">{admission.numberOfDays} {admission.numberOfDays === 1 ? 'day' : 'days'}</Badge>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Amount</span>
                <span className="text-3xl font-bold text-primary">
                  ₦{admission.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Select */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    <span>Cash</span>
                  </div>
                </SelectItem>
                <SelectItem value="card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Card Payment</span>
                  </div>
                </SelectItem>
                <SelectItem value="transfer">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Bank Transfer</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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

export function CashierBedAdmissionPage() {
  // State for bed admission invoices (mock data for now - will be replaced with store)
  const [admissions, setAdmissions] = useState<BedAdmissionInvoice[]>([
    {
      id: '1',
      admissionNo: 'ADM-001',
      patientId: 'GH-PT-00001',
      patientName: 'Aisha Mohammed',
      ward: 'General Ward A',
      bedNumber: 'A-12',
      admissionDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      dischargeDate: new Date().toISOString(),
      numberOfDays: 5,
      dailyRate: 8000,
      amount: 40000,
      status: 'Pending',
      attendingDoctor: 'Dr. Suleiman Yusuf'
    },
    {
      id: '2',
      admissionNo: 'ADM-002',
      patientId: 'GH-PT-00002',
      patientName: 'Ibrahim Suleiman',
      ward: 'ICU',
      bedNumber: 'ICU-03',
      admissionDate: new Date(Date.now() - 3 * 86400000).toISOString(),
      dischargeDate: new Date().toISOString(),
      numberOfDays: 3,
      dailyRate: 25000,
      amount: 75000,
      status: 'Paid',
      paymentMethod: 'Cash',
      paymentDate: new Date().toLocaleDateString(),
      paymentTime: new Date().toLocaleTimeString(),
      attendingDoctor: 'Dr. Amina Bello'
    },
    {
      id: '3',
      admissionNo: 'ADM-003',
      patientId: 'GH-PT-00003',
      patientName: 'Fatima Abdullahi',
      ward: 'Maternity Ward',
      bedNumber: 'M-08',
      admissionDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      dischargeDate: new Date().toISOString(),
      numberOfDays: 2,
      dailyRate: 15000,
      amount: 30000,
      status: 'Pending',
      attendingDoctor: 'Dr. Maryam Ibrahim'
    },
    {
      id: '4',
      admissionNo: 'ADM-004',
      patientId: 'GH-PT-00004',
      patientName: 'Musa Garba',
      ward: 'Private Ward B',
      bedNumber: 'PB-05',
      admissionDate: new Date(Date.now() - 7 * 86400000).toISOString(),
      dischargeDate: new Date(Date.now() - 86400000).toISOString(),
      numberOfDays: 6,
      dailyRate: 18000,
      amount: 108000,
      status: 'Paid',
      paymentMethod: 'Card',
      paymentDate: new Date(Date.now() - 86400000).toLocaleDateString(),
      paymentTime: '02:45 PM',
      attendingDoctor: 'Dr. Usman Ahmed'
    },
    {
      id: '5',
      admissionNo: 'ADM-005',
      patientId: 'GH-PT-00005',
      patientName: 'Zainab Usman',
      ward: 'General Ward B',
      bedNumber: 'B-15',
      admissionDate: new Date(Date.now() - 4 * 86400000).toISOString(),
      dischargeDate: new Date().toISOString(),
      numberOfDays: 4,
      dailyRate: 8000,
      amount: 32000,
      status: 'Pending',
      attendingDoctor: 'Dr. Suleiman Yusuf'
    },
  ]);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<BedAdmissionInvoice | null>(null);

  // Filter and search admissions
  const filteredAdmissions = useMemo(() => {
    return admissions.filter(admission => {
      const matchesSearch = 
        admission.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admission.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admission.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admission.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admission.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admission.attendingDoctor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === 'all' ||
        admission.status.toLowerCase() === statusFilter.toLowerCase();

      let matchesDate = true;
      if (dateFrom && dateTo) {
        const admissionDate = new Date(admission.admissionDate);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        matchesDate = admissionDate >= fromDate && admissionDate <= toDate;
      } else if (dateFrom) {
        const admissionDate = new Date(admission.admissionDate);
        const fromDate = new Date(dateFrom);
        matchesDate = admissionDate >= fromDate;
      } else if (dateTo) {
        const admissionDate = new Date(admission.admissionDate);
        const toDate = new Date(dateTo);
        matchesDate = admissionDate <= toDate;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [admissions, searchQuery, statusFilter, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredAdmissions.length / itemsPerPage);
  const paginatedAdmissions = filteredAdmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayAdmissions = admissions.filter(adm => adm.admissionDate.startsWith(today));
    const paidToday = todayAdmissions.filter(adm => adm.status === 'Paid');
    const revenueToday = paidToday.reduce((sum, adm) => sum + adm.amount, 0);

    return {
      total: admissions.length,
      paidToday: paidToday.length,
      pending: admissions.filter(adm => adm.status === 'Pending').length,
      revenue: revenueToday,
    };
  }, [admissions]);

  // Handlers
  const handleConfirmPayment = (admission: BedAdmissionInvoice) => {
    setSelectedAdmission(admission);
    setIsPaymentModalOpen(true);
  };

  const handleViewAdmission = (admission: BedAdmissionInvoice) => {
    setSelectedAdmission(admission);
    setIsViewModalOpen(true);
  };

  const handleDeleteAdmission = (admission: BedAdmissionInvoice) => {
    setSelectedAdmission(admission);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAdmission) {
      setAdmissions(prev => prev.filter(adm => adm.id !== selectedAdmission.id));
      toast.success('Admission Deleted', {
        description: `Admission ${selectedAdmission.admissionNo} has been deleted successfully`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedAdmission(null);
    }
  };

  const handlePrintReceipt = (admission: BedAdmissionInvoice) => {
    toast.success('Receipt Printed', {
      description: `Bed admission receipt for ${admission.patientName} (${admission.admissionNo}) has been sent to the printer`,
    });
  };

  const handlePaymentConfirm = (pin: string, paymentMethod: string) => {
    if (selectedAdmission) {
      setAdmissions(prev => prev.map(adm => 
        adm.id === selectedAdmission.id 
          ? {
              ...adm,
              status: 'Paid' as const,
              paymentMethod,
              paymentDate: new Date().toLocaleDateString(),
              paymentTime: new Date().toLocaleTimeString()
            }
          : adm
      ));
    }
  };

  const handleExport = () => {
    toast.success('Export Success', {
      description: `Exporting ${filteredAdmissions.length} bed admission records to CSV`,
    });
  };

  const handlePrintReport = () => {
    toast.success('Report Generated', {
      description: 'Bed admission payments report has been sent to the printer',
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bed Admission Payments</h1>
          <p className="text-muted-foreground">
            Manage bed admission and ward charges
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handlePrintReport} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bed className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Admissions</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
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
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid Today</p>
                  <p className="text-2xl font-bold">{stats.paidToday}</p>
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <DollarSign className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className="text-2xl font-bold">₦{stats.revenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>Filter admissions by search query, status, and date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by admission no, patient name, ward, bed..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="date-from">From Date</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date-to">To Date</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bed Admission Invoices</CardTitle>
              <CardDescription>
                Showing {paginatedAdmissions.length} of {filteredAdmissions.length} admissions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission No</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Ward & Bed</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAdmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No admissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAdmissions.map((admission) => (
                    <TableRow key={admission.id}>
                      <TableCell>
                        <div className="font-mono font-semibold">{admission.admissionNo}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(admission.admissionDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{admission.patientName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{admission.patientId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{admission.ward}</div>
                        <div className="text-xs text-muted-foreground">Bed {admission.bedNumber}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {admission.numberOfDays} {admission.numberOfDays === 1 ? 'day' : 'days'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{admission.attendingDoctor}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-bold text-secondary">₦{admission.amount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          ₦{admission.dailyRate.toLocaleString()}/day
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={admission.status === 'Paid' ? 'default' : 'secondary'}
                          className={admission.status === 'Paid' ? 'bg-secondary' : 'bg-yellow-500/10 text-yellow-700'}
                        >
                          {admission.status === 'Paid' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {admission.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                          {admission.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewAdmission(admission)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {admission.status === 'Pending' ? (
                            <Button
                              size="sm"
                              onClick={() => handleConfirmPayment(admission)}
                            >
                              <DollarSign className="w-4 h-4 mr-1" />
                              Pay
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePrintReceipt(admission)}
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteAdmission(admission)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AdmissionBreakdownModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        admission={selectedAdmission}
      />

      <ConfirmPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        admission={selectedAdmission}
        onConfirm={handlePaymentConfirm}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Admission Record?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete admission {selectedAdmission?.admissionNo} for {selectedAdmission?.patientName}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
