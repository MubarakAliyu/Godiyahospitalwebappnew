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
  Activity,
  Download,
  Filter,
  Banknote,
  CreditCard,
  Building2,
  Trash2,
  User,
  FileText
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

// Charge Item Interface
interface ChargeItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Admission Charge Invoice Interface
interface AdmissionChargeInvoice {
  id: string;
  chargeNo: string;
  patientId: string;
  patientName: string;
  admissionNo: string;
  charges: ChargeItem[];
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
  paymentMethod?: string;
  paymentDate?: string;
  paymentTime?: string;
  chargedBy: string;
  category: string;
}

// Charge Breakdown Modal
function ChargeBreakdownModal({
  isOpen,
  onClose,
  charge
}: {
  isOpen: boolean;
  onClose: () => void;
  charge: AdmissionChargeInvoice | null;
}) {
  if (!charge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Admission Charge Details
          </DialogTitle>
          <DialogDescription>
            Detailed breakdown for charge invoice {charge.chargeNo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Charge Info Card */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4 border border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Charge No</p>
                <p className="font-mono font-semibold">{charge.chargeNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge 
                  variant={charge.status === 'Paid' ? 'default' : 'secondary'}
                  className={charge.status === 'Paid' ? 'bg-secondary' : 'bg-yellow-500/10 text-yellow-700'}
                >
                  {charge.status === 'Paid' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {charge.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                  {charge.status}
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
                  <p className="font-semibold">{charge.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">File Number</p>
                  <p className="font-mono text-sm">{charge.patientId}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Admission No</p>
                  <Badge variant="outline" className="font-mono">
                    {charge.admissionNo}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <Badge variant="outline" className="font-medium">
                    {charge.category}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Charged By</p>
                  <Badge variant="outline">
                    <User className="w-3 h-3 mr-1" />
                    {charge.chargedBy}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-medium">{new Date(charge.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charges Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Charge Items
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {charge.charges.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center text-muted-foreground font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-semibold">{item.description}</TableCell>
                    <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₦{item.unitPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold text-secondary">
                      ₦{item.subtotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-white">Total Amount</span>
              <span className="text-3xl font-bold text-white">
                ₦{charge.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {charge.status === 'Paid' && charge.paymentMethod && (
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <Badge variant="outline">{charge.paymentMethod}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                  <p className="font-medium">{charge.paymentDate}</p>
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
  charge,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  charge: AdmissionChargeInvoice | null;
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
      description: `Payment of ₦${charge?.amount.toLocaleString()} confirmed for ${charge?.patientName}`,
    });

    // Print receipt if requested
    if (printReceipt && charge) {
      setTimeout(() => {
        toast.success('Receipt Printed', {
          description: `Admission charge receipt for ${charge.patientName} has been sent to the printer`,
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

  if (!charge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm Admission Charge Payment</DialogTitle>
          <DialogDescription>
            Review charge details and enter your PIN to confirm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Charge Summary Card */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Charge No</span>
              <span className="font-mono font-semibold">{charge.chargeNo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Patient Name</span>
              <span className="font-semibold">{charge.patientName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">File Number</span>
              <span className="font-medium font-mono">{charge.patientId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Admission No</span>
              <span className="font-mono">{charge.admissionNo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Category</span>
              <Badge variant="outline">{charge.category}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Charge Items</span>
              <span className="font-medium">{charge.charges.length} item(s)</span>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Amount</span>
                <span className="text-3xl font-bold text-primary">
                  ₦{charge.amount.toLocaleString()}
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

export function CashierAdmissionChargesPage() {
  // State for admission charge invoices (mock data for now - will be replaced with store)
  const [charges, setCharges] = useState<AdmissionChargeInvoice[]>([
    {
      id: '1',
      chargeNo: 'CHG-001',
      patientId: 'GH-PT-00001',
      patientName: 'Aisha Mohammed',
      admissionNo: 'ADM-001',
      charges: [
        { id: '1', description: 'X-Ray Examination', quantity: 1, unitPrice: 15000, subtotal: 15000 },
        { id: '2', description: 'IV Fluid Administration', quantity: 3, unitPrice: 2500, subtotal: 7500 },
        { id: '3', description: 'Nursing Care (Daily)', quantity: 5, unitPrice: 3000, subtotal: 15000 },
      ],
      amount: 37500,
      date: new Date().toISOString(),
      status: 'Pending',
      chargedBy: 'Nurse Halima Bello',
      category: 'Medical Procedures'
    },
    {
      id: '2',
      chargeNo: 'CHG-002',
      patientId: 'GH-PT-00002',
      patientName: 'Ibrahim Suleiman',
      admissionNo: 'ADM-002',
      charges: [
        { id: '1', description: 'CT Scan', quantity: 1, unitPrice: 45000, subtotal: 45000 },
        { id: '2', description: 'Blood Transfusion', quantity: 2, unitPrice: 12000, subtotal: 24000 },
      ],
      amount: 69000,
      date: new Date().toISOString(),
      status: 'Paid',
      paymentMethod: 'Cash',
      paymentDate: new Date().toLocaleDateString(),
      paymentTime: new Date().toLocaleTimeString(),
      chargedBy: 'Nurse Maryam Ahmed',
      category: 'Diagnostic & Treatment'
    },
    {
      id: '3',
      chargeNo: 'CHG-003',
      patientId: 'GH-PT-00003',
      patientName: 'Fatima Abdullahi',
      admissionNo: 'ADM-003',
      charges: [
        { id: '1', description: 'Ultrasound Scan', quantity: 2, unitPrice: 8000, subtotal: 16000 },
        { id: '2', description: 'ECG Test', quantity: 1, unitPrice: 5000, subtotal: 5000 },
        { id: '3', description: 'Oxygen Therapy', quantity: 2, unitPrice: 4000, subtotal: 8000 },
      ],
      amount: 29000,
      date: new Date().toISOString(),
      status: 'Pending',
      chargedBy: 'Nurse Halima Bello',
      category: 'Diagnostic Tests'
    },
    {
      id: '4',
      chargeNo: 'CHG-004',
      patientId: 'GH-PT-00004',
      patientName: 'Musa Garba',
      admissionNo: 'ADM-004',
      charges: [
        { id: '1', description: 'Minor Surgery', quantity: 1, unitPrice: 85000, subtotal: 85000 },
        { id: '2', description: 'Anesthesia', quantity: 1, unitPrice: 25000, subtotal: 25000 },
        { id: '3', description: 'Surgical Supplies', quantity: 1, unitPrice: 15000, subtotal: 15000 },
      ],
      amount: 125000,
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'Paid',
      paymentMethod: 'Card',
      paymentDate: new Date(Date.now() - 86400000).toLocaleDateString(),
      paymentTime: '03:15 PM',
      chargedBy: 'Dr. Usman Ahmed',
      category: 'Surgical Procedures'
    },
    {
      id: '5',
      chargeNo: 'CHG-005',
      patientId: 'GH-PT-00005',
      patientName: 'Zainab Usman',
      admissionNo: 'ADM-005',
      charges: [
        { id: '1', description: 'Physical Therapy', quantity: 4, unitPrice: 6000, subtotal: 24000 },
        { id: '2', description: 'Wound Dressing', quantity: 4, unitPrice: 2000, subtotal: 8000 },
      ],
      amount: 32000,
      date: new Date().toISOString(),
      status: 'Pending',
      chargedBy: 'Nurse Maryam Ahmed',
      category: 'Therapy & Care'
    },
  ]);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<AdmissionChargeInvoice | null>(null);

  // Filter and search charges
  const filteredCharges = useMemo(() => {
    return charges.filter(charge => {
      const chargeDescriptions = charge.charges.map(c => c.description).join(' ').toLowerCase();
      const matchesSearch = 
        charge.chargeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        charge.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        charge.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        charge.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        charge.chargedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chargeDescriptions.includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === 'all' ||
        charge.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesCategory = 
        categoryFilter === 'all' ||
        charge.category === categoryFilter;

      let matchesDate = true;
      if (dateFrom && dateTo) {
        const chargeDate = new Date(charge.date);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        matchesDate = chargeDate >= fromDate && chargeDate <= toDate;
      } else if (dateFrom) {
        const chargeDate = new Date(charge.date);
        const fromDate = new Date(dateFrom);
        matchesDate = chargeDate >= fromDate;
      } else if (dateTo) {
        const chargeDate = new Date(charge.date);
        const toDate = new Date(dateTo);
        matchesDate = chargeDate <= toDate;
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [charges, searchQuery, statusFilter, categoryFilter, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredCharges.length / itemsPerPage);
  const paginatedCharges = filteredCharges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCharges = charges.filter(chg => chg.date.startsWith(today));
    const paidToday = todayCharges.filter(chg => chg.status === 'Paid');
    const revenueToday = paidToday.reduce((sum, chg) => sum + chg.amount, 0);

    return {
      total: charges.length,
      paidToday: paidToday.length,
      pending: charges.filter(chg => chg.status === 'Pending').length,
      revenue: revenueToday,
    };
  }, [charges]);

  // Handlers
  const handleConfirmPayment = (charge: AdmissionChargeInvoice) => {
    setSelectedCharge(charge);
    setIsPaymentModalOpen(true);
  };

  const handleViewCharge = (charge: AdmissionChargeInvoice) => {
    setSelectedCharge(charge);
    setIsViewModalOpen(true);
  };

  const handleDeleteCharge = (charge: AdmissionChargeInvoice) => {
    setSelectedCharge(charge);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCharge) {
      setCharges(prev => prev.filter(chg => chg.id !== selectedCharge.id));
      toast.success('Charge Deleted', {
        description: `Charge ${selectedCharge.chargeNo} has been deleted successfully`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedCharge(null);
    }
  };

  const handlePrintReceipt = (charge: AdmissionChargeInvoice) => {
    toast.success('Receipt Printed', {
      description: `Admission charge receipt for ${charge.patientName} (${charge.chargeNo}) has been sent to the printer`,
    });
  };

  const handlePaymentConfirm = (pin: string, paymentMethod: string) => {
    if (selectedCharge) {
      setCharges(prev => prev.map(chg => 
        chg.id === selectedCharge.id 
          ? {
              ...chg,
              status: 'Paid' as const,
              paymentMethod,
              paymentDate: new Date().toLocaleDateString(),
              paymentTime: new Date().toLocaleTimeString()
            }
          : chg
      ));
    }
  };

  const handleExport = () => {
    toast.success('Export Success', {
      description: `Exporting ${filteredCharges.length} admission charge records to CSV`,
    });
  };

  const handlePrintReport = () => {
    toast.success('Report Generated', {
      description: 'Admission charges report has been sent to the printer',
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admission Charges</h1>
          <p className="text-muted-foreground">
            Manage additional charges during patient admission
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
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Charges</p>
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
          <CardDescription>Filter charges by search query, status, category, and date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by charge no, patient, admission..."
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

            {/* Category Filter */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Medical Procedures">Medical Procedures</SelectItem>
                  <SelectItem value="Diagnostic & Treatment">Diagnostic & Treatment</SelectItem>
                  <SelectItem value="Diagnostic Tests">Diagnostic Tests</SelectItem>
                  <SelectItem value="Surgical Procedures">Surgical Procedures</SelectItem>
                  <SelectItem value="Therapy & Care">Therapy & Care</SelectItem>
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

      {/* Charges Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Admission Charge Invoices</CardTitle>
              <CardDescription>
                Showing {paginatedCharges.length} of {filteredCharges.length} charges
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Charge No</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Admission No</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCharges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No charges found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCharges.map((charge) => (
                    <TableRow key={charge.id}>
                      <TableCell>
                        <div className="font-mono font-semibold">{charge.chargeNo}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(charge.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{charge.patientName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{charge.patientId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">{charge.admissionNo}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{charge.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{charge.charges.length} item(s)</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-bold text-secondary">₦{charge.amount.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={charge.status === 'Paid' ? 'default' : 'secondary'}
                          className={charge.status === 'Paid' ? 'bg-secondary' : 'bg-yellow-500/10 text-yellow-700'}
                        >
                          {charge.status === 'Paid' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {charge.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                          {charge.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewCharge(charge)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {charge.status === 'Pending' ? (
                            <Button
                              size="sm"
                              onClick={() => handleConfirmPayment(charge)}
                            >
                              <DollarSign className="w-4 h-4 mr-1" />
                              Pay
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePrintReceipt(charge)}
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCharge(charge)}
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
      <ChargeBreakdownModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        charge={selectedCharge}
      />

      <ConfirmPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        charge={selectedCharge}
        onConfirm={handlePaymentConfirm}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Charge Record?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete charge {selectedCharge?.chargeNo} for {selectedCharge?.patientName}?
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
