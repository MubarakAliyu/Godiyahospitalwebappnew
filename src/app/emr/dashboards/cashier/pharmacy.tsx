import { toast } from 'sonner';
import { generatePharmacyReceiptPDF, type PharmacyReceiptData, type DrugItem } from '@/app/emr/utils/pharmacy-receipt-pdf';
import { exportPharmacyPaymentsToCSV } from '@/app/emr/utils/csv-export';
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
  Pill,
  Download,
  Filter,
  Banknote,
  CreditCard,
  Building2,
  Trash2
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

// Prescription Invoice Interface
interface PrescriptionInvoice {
  id: string;
  prescriptionNo: string;
  patientId: string;
  patientName: string;
  drugs: DrugItem[];
  pharmacist: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
  paymentMethod?: string;
  paymentDate?: string;
  paymentTime?: string;
}

// Prescription Breakdown Modal
function PrescriptionBreakdownModal({
  isOpen,
  onClose,
  prescription
}: {
  isOpen: boolean;
  onClose: () => void;
  prescription: PrescriptionInvoice | null;
}) {
  if (!prescription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Pill className="w-6 h-6 text-primary" />
            Prescription Breakdown
          </DialogTitle>
          <DialogDescription>
            Detailed medication breakdown for prescription {prescription.prescriptionNo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Prescription Info Card */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4 border border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Prescription No</p>
                <p className="font-mono font-semibold">{prescription.prescriptionNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge 
                  variant={prescription.status === 'Paid' ? 'default' : 'secondary'}
                  className={prescription.status === 'Paid' ? 'bg-secondary' : 'bg-yellow-500/10 text-yellow-700'}
                >
                  {prescription.status === 'Paid' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {prescription.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                  {prescription.status}
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
                  <p className="font-semibold">{prescription.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">File Number</p>
                  <p className="font-mono text-sm">{prescription.patientId}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pharmacist</p>
                  <p className="font-semibold">{prescription.pharmacist}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Prescription Date</p>
                  <p className="font-medium">{new Date(prescription.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Medication Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Medications Prescribed
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Medication Name</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.drugs.map((drug, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center text-muted-foreground font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-semibold">{drug.name}</TableCell>
                    <TableCell className="text-center font-medium">{drug.quantity}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₦{drug.unitPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold text-secondary">
                      ₦{drug.subtotal.toLocaleString()}
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
                ₦{prescription.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {prescription.status === 'Paid' && prescription.paymentMethod && (
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <Badge variant="outline">{prescription.paymentMethod}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                  <p className="font-medium">{prescription.paymentDate}</p>
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
  prescription,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  prescription: PrescriptionInvoice | null;
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
      description: `Payment of ₦${prescription?.amount.toLocaleString()} confirmed for ${prescription?.patientName}`,
    });

    // Print receipt if requested
    if (printReceipt && prescription) {
      const receiptData: PharmacyReceiptData = {
        receiptId: `GH-PHR-${Date.now()}`,
        prescriptionNo: prescription.prescriptionNo,
        patientName: prescription.patientName,
        patientId: prescription.patientId,
        fileNo: prescription.patientId,
        drugs: prescription.drugs,
        totalAmount: prescription.amount,
        paymentMethod: paymentMethod,
        paymentDate: new Date().toLocaleDateString(),
        paymentTime: new Date().toLocaleTimeString(),
        pharmacistName: prescription.pharmacist,
        pharmacistId: 'GH-PHR-001',
        cashierName: 'Cashier',
        cashierId: 'GH-STF-001'
      };
      generatePharmacyReceiptPDF(receiptData);
      setTimeout(() => {
        toast.success('Receipt Printed', {
          description: `Receipt for ${prescription.patientName} has been sent to the printer`,
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

  if (!prescription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm Pharmacy Payment</DialogTitle>
          <DialogDescription>
            Review prescription details and enter your PIN to confirm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Prescription Summary Card */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Prescription No</span>
              <span className="font-mono font-semibold">{prescription.prescriptionNo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Patient Name</span>
              <span className="font-semibold">{prescription.patientName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">File Number</span>
              <span className="font-medium font-mono">{prescription.patientId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pharmacist</span>
              <Badge variant="outline">{prescription.pharmacist}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Medications</span>
              <span className="font-medium">{prescription.drugs.length} item(s)</span>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Amount</span>
                <span className="text-3xl font-bold text-primary">
                  ₦{prescription.amount.toLocaleString()}
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

export function CashierPharmacyPage() {
  // State for prescription invoices (mock data for now - will be replaced with store)
  const [prescriptions, setPrescriptions] = useState<PrescriptionInvoice[]>([
    {
      id: '1',
      prescriptionNo: 'RX-001',
      patientId: 'GH-PT-00001',
      patientName: 'Aisha Mohammed',
      drugs: [
        { name: 'Paracetamol 500mg', quantity: 20, unitPrice: 50, subtotal: 1000 },
        { name: 'Amoxicillin 250mg', quantity: 15, unitPrice: 150, subtotal: 2250 },
        { name: 'Vitamin C 1000mg', quantity: 30, unitPrice: 80, subtotal: 2400 },
      ],
      pharmacist: 'Pharm. Musa Ibrahim',
      amount: 5650,
      date: new Date().toISOString(),
      status: 'Pending'
    },
    {
      id: '2',
      prescriptionNo: 'RX-002',
      patientId: 'GH-PT-00002',
      patientName: 'Ibrahim Suleiman',
      drugs: [
        { name: 'Ibuprofen 400mg', quantity: 24, unitPrice: 60, subtotal: 1440 },
        { name: 'Omeprazole 20mg', quantity: 14, unitPrice: 200, subtotal: 2800 },
      ],
      pharmacist: 'Pharm. Fatima Bello',
      amount: 4240,
      date: new Date().toISOString(),
      status: 'Paid',
      paymentMethod: 'Cash',
      paymentDate: new Date().toLocaleDateString(),
      paymentTime: new Date().toLocaleTimeString()
    },
    {
      id: '3',
      prescriptionNo: 'RX-003',
      patientId: 'GH-PT-00003',
      patientName: 'Fatima Abdullahi',
      drugs: [
        { name: 'Metformin 500mg', quantity: 60, unitPrice: 45, subtotal: 2700 },
        { name: 'Lisinopril 10mg', quantity: 30, unitPrice: 120, subtotal: 3600 },
        { name: 'Aspirin 75mg', quantity: 30, unitPrice: 30, subtotal: 900 },
      ],
      pharmacist: 'Pharm. Usman Garba',
      amount: 7200,
      date: new Date().toISOString(),
      status: 'Pending'
    },
    {
      id: '4',
      prescriptionNo: 'RX-004',
      patientId: 'GH-PT-00004',
      patientName: 'Musa Garba',
      drugs: [
        { name: 'Atorvastatin 20mg', quantity: 30, unitPrice: 180, subtotal: 5400 },
        { name: 'Amlodipine 5mg', quantity: 30, unitPrice: 100, subtotal: 3000 },
      ],
      pharmacist: 'Pharm. Musa Ibrahim',
      amount: 8400,
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'Paid',
      paymentMethod: 'Card',
      paymentDate: new Date(Date.now() - 86400000).toLocaleDateString(),
      paymentTime: '10:30 AM'
    },
    {
      id: '5',
      prescriptionNo: 'RX-005',
      patientId: 'GH-PT-00005',
      patientName: 'Zainab Usman',
      drugs: [
        { name: 'Ciprofloxacin 500mg', quantity: 10, unitPrice: 250, subtotal: 2500 },
        { name: 'Multivitamin Tablets', quantity: 30, unitPrice: 100, subtotal: 3000 },
      ],
      pharmacist: 'Pharm. Fatima Bello',
      amount: 5500,
      date: new Date().toISOString(),
      status: 'Pending'
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
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionInvoice | null>(null);

  // Filter and search prescriptions
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(prescription => {
      const drugList = prescription.drugs.map(d => d.name).join(' ').toLowerCase();
      const matchesSearch = 
        prescription.prescriptionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.pharmacist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drugList.includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === 'all' ||
        prescription.status.toLowerCase() === statusFilter.toLowerCase();

      let matchesDate = true;
      if (dateFrom && dateTo) {
        const prescriptionDate = new Date(prescription.date);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        matchesDate = prescriptionDate >= fromDate && prescriptionDate <= toDate;
      } else if (dateFrom) {
        const prescriptionDate = new Date(prescription.date);
        const fromDate = new Date(dateFrom);
        matchesDate = prescriptionDate >= fromDate;
      } else if (dateTo) {
        const prescriptionDate = new Date(prescription.date);
        const toDate = new Date(dateTo);
        matchesDate = prescriptionDate <= toDate;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [prescriptions, searchQuery, statusFilter, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const paginatedPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayPrescriptions = prescriptions.filter(rx => rx.date.startsWith(today));
    const paidToday = todayPrescriptions.filter(rx => rx.status === 'Paid');
    const revenueToday = paidToday.reduce((sum, rx) => sum + rx.amount, 0);

    return {
      total: prescriptions.length,
      paidToday: paidToday.length,
      pending: prescriptions.filter(rx => rx.status === 'Pending').length,
      revenue: revenueToday,
    };
  }, [prescriptions]);

  // Handlers
  const handleConfirmPayment = (prescription: PrescriptionInvoice) => {
    setSelectedPrescription(prescription);
    setIsPaymentModalOpen(true);
  };

  const handleViewPrescription = (prescription: PrescriptionInvoice) => {
    setSelectedPrescription(prescription);
    setIsViewModalOpen(true);
  };

  const handleDeletePrescription = (prescription: PrescriptionInvoice) => {
    setSelectedPrescription(prescription);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPrescription) {
      setPrescriptions(prev => prev.filter(rx => rx.id !== selectedPrescription.id));
      toast.success('Prescription Deleted', {
        description: `Prescription ${selectedPrescription.prescriptionNo} has been deleted successfully`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedPrescription(null);
    }
  };

  const handlePrintReceipt = (prescription: PrescriptionInvoice) => {
    const receiptData: PharmacyReceiptData = {
      receiptId: `GH-PHR-${Date.now()}`,
      prescriptionNo: prescription.prescriptionNo,
      patientName: prescription.patientName,
      patientId: prescription.patientId,
      fileNo: prescription.patientId,
      drugs: prescription.drugs,
      totalAmount: prescription.amount,
      paymentMethod: prescription.paymentMethod || 'Cash',
      paymentDate: prescription.paymentDate || new Date().toLocaleDateString(),
      paymentTime: prescription.paymentTime || new Date().toLocaleTimeString(),
      pharmacistName: prescription.pharmacist,
      pharmacistId: 'GH-PHR-001',
      cashierName: 'Cashier',
      cashierId: 'GH-STF-001'
    };
    generatePharmacyReceiptPDF(receiptData);
    toast.success('Receipt Printed', {
      description: `Receipt for ${prescription.patientName} (${prescription.prescriptionNo}) has been sent to the printer`,
    });
  };

  const handlePaymentConfirm = (pin: string, paymentMethod: string) => {
    if (selectedPrescription) {
      setPrescriptions(prev => prev.map(rx => 
        rx.id === selectedPrescription.id 
          ? {
              ...rx,
              status: 'Paid' as const,
              paymentMethod,
              paymentDate: new Date().toLocaleDateString(),
              paymentTime: new Date().toLocaleTimeString()
            }
          : rx
      ));
    }
  };

  const handleExport = () => {
    exportPharmacyPaymentsToCSV(filteredPrescriptions);
    toast.success('Export Success', {
      description: `Exporting ${filteredPrescriptions.length} pharmacy prescriptions to CSV`,
    });
  };

  const handlePrintReport = () => {
    toast.success('Report Generated', {
      description: 'Pharmacy payments report has been sent to the printer',
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Pharmacy Payments</h1>
          <p className="text-muted-foreground">
            Manage pharmacy prescription payments
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
                  <Pill className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Prescriptions</p>
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
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
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
                <div className="p-2 rounded-lg bg-green-500/10">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pharmacy Revenue Today</p>
                  <p className="text-2xl font-bold">₦{stats.revenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search by Prescription No, File No, Patient Name, Pharmacist, or Medication..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  placeholder="From Date"
                />
              </div>

              <div className="flex-1">
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  placeholder="To Date"
                />
              </div>

              <Button variant="outline" onClick={handleClearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" />
            Pharmacy Prescriptions
            <Badge variant="secondary" className="ml-2">
              {filteredPrescriptions.length} prescriptions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedPrescriptions.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">S/N</TableHead>
                    <TableHead>Prescription No</TableHead>
                    <TableHead>File No</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Medications</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Pharmacist</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPrescriptions.map((prescription, index) => {
                    const totalQty = prescription.drugs.reduce((sum, d) => sum + d.quantity, 0);
                    const drugsSummary = prescription.drugs.length > 2 
                      ? `${prescription.drugs.slice(0, 2).map(d => d.name).join(', ')}... (+${prescription.drugs.length - 2} more)`
                      : prescription.drugs.map(d => d.name).join(', ');

                    return (
                      <TableRow key={prescription.id}>
                        <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">{prescription.prescriptionNo}</TableCell>
                        <TableCell className="font-mono text-sm">{prescription.patientId}</TableCell>
                        <TableCell className="font-medium">{prescription.patientName}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={prescription.drugs.map(d => d.name).join(', ')}>
                          {drugsSummary}
                        </TableCell>
                        <TableCell className="text-center font-medium">{totalQty}</TableCell>
                        <TableCell className="text-sm">{prescription.pharmacist}</TableCell>
                        <TableCell className="font-semibold">₦{prescription.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(prescription.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {prescription.status === 'Paid' ? (
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewPrescription(prescription)}
                              title="View Breakdown"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {prescription.status === 'Pending' ? (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleConfirmPayment(prescription)}
                              >
                                <DollarSign className="w-4 h-4 mr-1" />
                                Confirm
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePrintReceipt(prescription)}
                              >
                                <Printer className="w-4 h-4 mr-1" />
                                Print
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePrescription(prescription)}
                              title="Delete Prescription"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
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
              <Pill className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium text-muted-foreground mb-2">No prescriptions found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || dateFrom || dateTo
                  ? 'Try adjusting your search or filters'
                  : 'Pharmacy prescriptions will appear here'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredPrescriptions.length)} of{' '}
                {filteredPrescriptions.length} prescriptions
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
      <PrescriptionBreakdownModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        prescription={selectedPrescription}
      />

      <ConfirmPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        prescription={selectedPrescription}
        onConfirm={handlePaymentConfirm}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Prescription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete prescription {selectedPrescription?.prescriptionNo}? 
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
