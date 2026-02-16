import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PackageCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Search,
  Download,
  Filter,
  FileText,
  CheckCircle2,
  DollarSign,
  Truck,
  Clock,
  User,
  Phone,
  Calendar,
  Pill,
  CreditCard,
  Printer,
  RotateCcw,
  Package,
  ShoppingBag,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useEMRStore } from '@/app/emr/store/emr-store';
import { usePharmacyStore } from '@/app/emr/store/pharmacy-store';
import { addAuditLog } from '@/app/emr/store/audit-store';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Separator } from '@/app/components/ui/separator';

interface KPICardProps {
  title: string;
  value: number;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
  tooltip?: string;
  prefix?: string;
}

interface DispensedDrug {
  drugId: string;
  name: string;
  dosage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface PaidPrescription {
  id: string;
  invoiceId: string;
  prescriptionId: string;
  fileNumber: string;
  patientName: string;
  patientPhone: string;
  patientAge: string;
  patientGender: string;
  patientType: 'IPD' | 'OPD';
  dispensedDrugs: DispensedDrug[];
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'Transfer' | 'Insurance';
  paymentStatus: 'Paid' | 'Partial' | 'Refunded';
  dispatchStatus: 'Pending' | 'Dispatched' | 'Collected';
  prescribedBy: string;
  dispensedBy: string;
  date: string;
  paidAt: string;
  notes?: string;
}

// Mock paid prescriptions data
const mockPaidPrescriptions: PaidPrescription[] = [
  {
    id: '1',
    invoiceId: 'GH-PH-INV-001',
    prescriptionId: 'RX-001',
    fileNumber: 'GH-2025-001',
    patientName: 'Aisha Mohammed',
    patientPhone: '+234 803 456 7890',
    patientAge: '34',
    patientGender: 'Female',
    patientType: 'OPD',
    dispensedDrugs: [
      { drugId: 'D-001', name: 'Paracetamol 500mg', dosage: '500mg', quantity: 20, price: 50, subtotal: 1000 },
      { drugId: 'D-003', name: 'Ibuprofen 400mg', dosage: '400mg', quantity: 15, price: 75, subtotal: 1125 },
    ],
    amount: 2125,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    dispatchStatus: 'Collected',
    prescribedBy: 'Dr. Kabir Ahmed',
    dispensedBy: 'Pharmacist John Doe',
    date: '2025-02-13',
    paidAt: '2025-02-13T10:30:00',
    notes: 'Patient collected medication'
  },
  {
    id: '2',
    invoiceId: 'GH-PH-INV-002',
    prescriptionId: 'RX-002',
    fileNumber: 'GH-2025-002',
    patientName: 'Ibrahim Usman',
    patientPhone: '+234 806 123 4567',
    patientAge: '45',
    patientGender: 'Male',
    patientType: 'IPD',
    dispensedDrugs: [
      { drugId: 'D-002', name: 'Amoxicillin 250mg', dosage: '250mg', quantity: 30, price: 150, subtotal: 4500 },
      { drugId: 'D-005', name: 'Metformin 500mg', dosage: '500mg', quantity: 60, price: 120, subtotal: 7200 },
    ],
    amount: 11700,
    paymentMethod: 'Insurance',
    paymentStatus: 'Paid',
    dispatchStatus: 'Dispatched',
    prescribedBy: 'Dr. Fatima Bello',
    dispensedBy: 'Pharmacist Jane Smith',
    date: '2025-02-12',
    paidAt: '2025-02-12T14:15:00',
    notes: 'IPD patient - delivered to ward'
  },
  {
    id: '3',
    invoiceId: 'GH-PH-INV-003',
    prescriptionId: 'RX-003',
    fileNumber: 'GH-2025-003',
    patientName: 'Fatima Sani',
    patientPhone: '+234 805 987 6543',
    patientAge: '52',
    patientGender: 'Female',
    patientType: 'OPD',
    dispensedDrugs: [
      { drugId: 'D-016', name: 'Losartan 50mg', dosage: '50mg', quantity: 30, price: 170, subtotal: 5100 },
      { drugId: 'D-020', name: 'Amlodipine 5mg', dosage: '5mg', quantity: 30, price: 130, subtotal: 3900 },
    ],
    amount: 9000,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    dispatchStatus: 'Pending',
    prescribedBy: 'Dr. Musa Ibrahim',
    dispensedBy: 'Pharmacist John Doe',
    date: '2025-02-11',
    paidAt: '2025-02-11T16:45:00',
  },
  {
    id: '4',
    invoiceId: 'GH-PH-INV-004',
    prescriptionId: 'RX-004',
    fileNumber: 'GH-2025-004',
    patientName: 'Musa Bello',
    patientPhone: '+234 807 234 5678',
    patientAge: '28',
    patientGender: 'Male',
    patientType: 'OPD',
    dispensedDrugs: [
      { drugId: 'D-007', name: 'Cetirizine 10mg', dosage: '10mg', quantity: 10, price: 60, subtotal: 600 },
    ],
    amount: 600,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    dispatchStatus: 'Collected',
    prescribedBy: 'Dr. Zainab Ali',
    dispensedBy: 'Pharmacist Jane Smith',
    date: '2025-02-13',
    paidAt: '2025-02-13T09:20:00',
  },
  {
    id: '5',
    invoiceId: 'GH-PH-INV-005',
    prescriptionId: 'RX-005',
    fileNumber: 'GH-2025-005',
    patientName: 'Zainab Ahmad',
    patientPhone: '+234 808 345 6789',
    patientAge: '29',
    patientGender: 'Female',
    patientType: 'IPD',
    dispensedDrugs: [
      { drugId: 'D-012', name: 'Vitamin B Complex', dosage: '1 tablet', quantity: 30, price: 100, subtotal: 3000 },
      { drugId: 'D-013', name: 'Prednisolone 5mg', dosage: '5mg', quantity: 20, price: 90, subtotal: 1800 },
    ],
    amount: 4800,
    paymentMethod: 'Transfer',
    paymentStatus: 'Paid',
    dispatchStatus: 'Dispatched',
    prescribedBy: 'Dr. Kabir Ahmed',
    dispensedBy: 'Pharmacist John Doe',
    date: '2025-02-10',
    paidAt: '2025-02-10T11:30:00',
    notes: 'Post-operative care'
  },
  {
    id: '6',
    invoiceId: 'GH-PH-INV-006',
    prescriptionId: 'RX-006',
    fileNumber: 'GH-2025-006',
    patientName: 'Yusuf Abdullahi',
    patientPhone: '+234 809 876 5432',
    patientAge: '38',
    patientGender: 'Male',
    patientType: 'OPD',
    dispensedDrugs: [
      { drugId: 'D-009', name: 'Atorvastatin 20mg', dosage: '20mg', quantity: 30, price: 250, subtotal: 7500 },
    ],
    amount: 7500,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    dispatchStatus: 'Collected',
    prescribedBy: 'Dr. Amina Hassan',
    dispensedBy: 'Pharmacist Jane Smith',
    date: '2025-02-09',
    paidAt: '2025-02-09T15:10:00',
  },
  {
    id: '7',
    invoiceId: 'GH-PH-INV-007',
    prescriptionId: 'RX-007',
    fileNumber: 'GH-2025-007',
    patientName: 'Hauwa Aliyu',
    patientPhone: '+234 810 234 5678',
    patientAge: '41',
    patientGender: 'Female',
    patientType: 'OPD',
    dispensedDrugs: [
      { drugId: 'D-010', name: 'Azithromycin 500mg', dosage: '500mg', quantity: 6, price: 300, subtotal: 1800 },
      { drugId: 'D-001', name: 'Paracetamol 500mg', dosage: '500mg', quantity: 10, price: 50, subtotal: 500 },
    ],
    amount: 2300,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    dispatchStatus: 'Pending',
    prescribedBy: 'Dr. Kabir Ahmed',
    dispensedBy: 'Pharmacist John Doe',
    date: '2025-02-08',
    paidAt: '2025-02-08T13:25:00',
  },
  {
    id: '8',
    invoiceId: 'GH-PH-INV-008',
    prescriptionId: 'RX-008',
    fileNumber: 'GH-2025-008',
    patientName: 'Suleiman Garba',
    patientPhone: '+234 811 345 6789',
    patientAge: '55',
    patientGender: 'Male',
    patientType: 'IPD',
    dispensedDrugs: [
      { drugId: 'D-014', name: 'Levothyroxine 50mcg', dosage: '50mcg', quantity: 30, price: 140, subtotal: 4200 },
      { drugId: 'D-012', name: 'Vitamin B Complex', dosage: '1 tablet', quantity: 30, price: 100, subtotal: 3000 },
    ],
    amount: 7200,
    paymentMethod: 'Insurance',
    paymentStatus: 'Paid',
    dispatchStatus: 'Dispatched',
    prescribedBy: 'Dr. Fatima Bello',
    dispensedBy: 'Pharmacist Jane Smith',
    date: '2025-02-07',
    paidAt: '2025-02-07T10:40:00',
  },
];

function KPICard({ title, value, icon: Icon, trend, trendValue, color = 'primary', tooltip, prefix = '' }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startValue = 0;
    const duration = 1000;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(startValue));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-foreground">
                      {prefix}{displayValue.toLocaleString()}
                    </h3>
                  </div>
                  <div 
                    className="p-3 rounded-xl"
                    style={{
                      backgroundColor: color === 'primary' ? '#1e40af15' : color === 'secondary' ? '#05966915' : color === 'warning' ? '#f5900b15' : '#dc262615'
                    }}
                  >
                    <Icon 
                      className="w-6 h-6"
                      style={{
                        color: color === 'primary' ? '#1e40af' : color === 'secondary' ? '#059669' : color === 'warning' ? '#f59e0b' : '#dc2626'
                      }}
                    />
                  </div>
                </div>
                {trend && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor()}`}>
                    {getTrendIcon()}
                    <span>{trendValue}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

export function PaidPrescriptionsPanel() {
  const { addNotification } = useEMRStore();
  const { updatePrescriptionStatus } = usePharmacyStore();

  // State
  const [prescriptions, setPrescriptions] = useState<PaidPrescription[]>(mockPaidPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [dispatchStatusFilter, setDispatchStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<PaidPrescription | null>(null);

  // Calculate KPIs
  const totalPrescriptions = prescriptions.length;
  const totalRevenue = prescriptions.reduce((sum, p) => sum + p.amount, 0);
  const pendingDispatch = prescriptions.filter(p => p.dispatchStatus === 'Pending').length;
  const collectedToday = prescriptions.filter(p => {
    const today = new Date().toISOString().split('T')[0];
    return p.dispatchStatus === 'Collected' && p.date === today;
  }).length;

  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch = prescription.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.fileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.prescriptionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPaymentStatus = paymentStatusFilter === 'all' || prescription.paymentStatus === paymentStatusFilter;
    const matchesDispatchStatus = dispatchStatusFilter === 'all' || prescription.dispatchStatus === dispatchStatusFilter;
    
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const prescriptionDate = new Date(prescription.date);
      if (dateFrom) {
        matchesDate = matchesDate && prescriptionDate >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDate = matchesDate && prescriptionDate <= new Date(dateTo);
      }
    }
    
    return matchesSearch && matchesPaymentStatus && matchesDispatchStatus && matchesDate;
  });

  // Paginate
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const paginatedPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setPaymentStatusFilter('all');
    setDispatchStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
    toast.info('Filters Reset', {
      description: 'All filters have been cleared.',
    });
  };

  // Open view modal
  const openViewModal = (prescription: PaidPrescription) => {
    setSelectedPrescription(prescription);
    setViewModalOpen(true);
  };

  // Print invoice
  const handlePrintInvoice = (prescription: PaidPrescription) => {
    // Generate invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${prescription.invoiceId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background: white; color: #000; }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1e40af; padding-bottom: 20px; }
            .header h1 { color: #1e40af; font-size: 32px; margin-bottom: 5px; }
            .header p { color: #666; font-size: 14px; line-height: 1.6; }
            .invoice-info { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
            .info-section h3 { color: #1e40af; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #059669; padding-bottom: 8px; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: 600; color: #333; }
            .info-value { color: #666; text-align: right; }
            .drugs-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            .drugs-table th { background: #1e40af; color: white; padding: 12px; text-align: left; font-size: 14px; }
            .drugs-table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; }
            .drugs-table tr:nth-child(even) { background: #f9fafb; }
            .drugs-table .text-right { text-align: right; }
            .drugs-table .text-center { text-align: center; }
            .total-section { text-align: right; margin-top: 30px; padding-top: 20px; border-top: 3px solid #1e40af; }
            .total-label { font-size: 20px; font-weight: 600; color: #333; }
            .total-amount { font-size: 32px; font-weight: bold; color: #059669; margin-top: 10px; }
            .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 2px solid #eee; color: #666; font-size: 12px; }
            .footer p { margin: 5px 0; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .badge-paid { background: #dcfce7; color: #166534; }
            .badge-ipd { background: #dbeafe; color: #1e40af; }
            .badge-opd { background: #dcfce7; color: #166534; }
            .notes-section { margin-top: 30px; padding: 15px; background: #f9fafb; border-left: 4px solid #1e40af; border-radius: 4px; }
            .notes-section strong { color: #1e40af; }
            @media print { 
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <h1>GODIYA HOSPITAL</h1>
              <p>Birnin Kebbi, Kebbi State, Nigeria</p>
              <p>Phone: +234 XXX XXX XXXX | Email: info@godiyahospital.com</p>
            </div>

            <div class="invoice-info">
              <div class="info-section">
                <h3>Patient Information</h3>
                <div class="info-row">
                  <span class="info-label">File Number:</span>
                  <span class="info-value">${prescription.fileNumber}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Patient Name:</span>
                  <span class="info-value">${prescription.patientName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Age / Gender:</span>
                  <span class="info-value">${prescription.patientAge}y / ${prescription.patientGender}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${prescription.patientPhone}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Patient Type:</span>
                  <span class="info-value"><span class="badge badge-${prescription.patientType.toLowerCase()}">${prescription.patientType}</span></span>
                </div>
              </div>

              <div class="info-section">
                <h3>Invoice Details</h3>
                <div class="info-row">
                  <span class="info-label">Invoice ID:</span>
                  <span class="info-value" style="color: #1e40af; font-weight: 600;">${prescription.invoiceId}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Prescription ID:</span>
                  <span class="info-value">${prescription.prescriptionId}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Date:</span>
                  <span class="info-value">${new Date(prescription.date).toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Time:</span>
                  <span class="info-value">${new Date(prescription.paidAt).toLocaleTimeString()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Payment Method:</span>
                  <span class="info-value">${prescription.paymentMethod}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Payment Status:</span>
                  <span class="info-value"><span class="badge badge-paid">${prescription.paymentStatus}</span></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Prescribed By:</span>
                  <span class="info-value">${prescription.prescribedBy}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Dispensed By:</span>
                  <span class="info-value">${prescription.dispensedBy}</span>
                </div>
              </div>
            </div>

            <table class="drugs-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Drug Name</th>
                  <th>Dosage</th>
                  <th class="text-center">Quantity</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${prescription.dispensedDrugs.map((drug, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${drug.name}</strong></td>
                    <td>${drug.dosage}</td>
                    <td class="text-center">${drug.quantity}</td>
                    <td class="text-right">₦${drug.price.toLocaleString()}</td>
                    <td class="text-right"><strong>₦${drug.subtotal.toLocaleString()}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total-section">
              <div style="margin-bottom: 10px;">
                <span class="total-label">Total Amount:</span>
              </div>
              <div class="total-amount">₦${prescription.amount.toLocaleString()}</div>
            </div>

            ${prescription.notes ? `
              <div class="notes-section">
                <strong>Notes:</strong> ${prescription.notes}
              </div>
            ` : ''}

            <div class="footer">
              <p><strong>Thank you for choosing Godiya Hospital!</strong></p>
              <p>This is a computer-generated invoice and does not require a signature.</p>
              <p>Printed on: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    // Write content and print
    const frameDoc = printFrame.contentWindow || printFrame.contentDocument;
    if (frameDoc) {
      const doc = frameDoc.document || frameDoc;
      doc.open();
      doc.write(invoiceHTML);
      doc.close();

      // Wait for content to load then print
      setTimeout(() => {
        try {
          if (printFrame.contentWindow) {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
          }
          
          // Remove iframe after printing
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 1000);

          toast.success('Invoice Printing', {
            description: `Invoice ${prescription.invoiceId} sent to printer`,
          });

          addNotification({
            id: Date.now(),
            title: 'Invoice Printed',
            message: `${prescription.invoiceId} printed for ${prescription.patientName}`,
            type: 'info',
            status: 'Unread',
            timestamp: new Date().toISOString(),
            priority: 'Low',
          });
        } catch (error) {
          toast.error('Print Error', {
            description: 'Unable to print invoice. Please try again.',
          });
        }
      }, 500);
    }
  };

  // Print & Dispense - Print invoice, then update status to Dispensed
  const handlePrintAndDispense = (prescription: PaidPrescription) => {
    // First, generate and print the invoice
    handlePrintInvoice(prescription);

    // Then update the dispatch status to "Collected" (Dispensed)
    setPrescriptions(prev =>
      prev.map(p =>
        p.id === prescription.id
          ? { ...p, dispatchStatus: 'Collected' as const }
          : p
      )
    );

    // Show success toast for dispensing
    toast.success('Prescription Dispensed', {
      description: `${prescription.invoiceId} for ${prescription.patientName} has been dispensed successfully.`,
    });

    // Add notification for dispensing
    addNotification({
      id: Date.now() + 100,
      title: 'Prescription Dispensed',
      message: `${prescription.invoiceId} dispensed to ${prescription.patientName}`,
      type: 'success',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'High',
    });

    // Add audit log for dispensing
    addAuditLog({
      action: 'Prescription Dispensed',
      module: 'Pharmacy',
      patientId: prescription.id,
      patientName: prescription.patientName,
      metadata: {
        invoiceId: prescription.invoiceId,
        prescriptionId: prescription.prescriptionId,
        amount: prescription.amount,
        dispensedBy: prescription.dispensedBy,
      },
    });

    // Close modal after dispensing
    setTimeout(() => {
      setViewModalOpen(false);
      setSelectedPrescription(null);
    }, 1500);
  };

  // Export as CSV
  const exportAsCSV = () => {
    const headers = ['Invoice ID', 'Prescription ID', 'File Number', 'Patient Name', 'Amount', 'Payment Method', 'Payment Status', 'Dispatch Status', 'Date'];
    const csvData = filteredPrescriptions.map(prescription => [
      prescription.invoiceId,
      prescription.prescriptionId,
      prescription.fileNumber,
      prescription.patientName,
      prescription.amount,
      prescription.paymentMethod,
      prescription.paymentStatus,
      prescription.dispatchStatus,
      prescription.date
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paid-prescriptions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast.success('CSV Exported', {
      description: `${filteredPrescriptions.length} records exported successfully.`,
    });
  };

  // Export as PDF
  const exportAsPDF = () => {
    toast.success('PDF Export', {
      description: 'PDF export functionality will be implemented.',
    });
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'Partial':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Partial
          </Badge>
        );
      case 'Refunded':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get dispatch status badge
  const getDispatchStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Dispatched':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Truck className="w-3 h-3 mr-1" />
            Dispatched
          </Badge>
        );
      case 'Collected':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <PackageCheck className="w-3 h-3 mr-1" />
            Collected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Paid Prescriptions</h1>
        <p className="text-muted-foreground">Dispatch queue and revenue tracking</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Prescriptions" 
          value={totalPrescriptions} 
          icon={PackageCheck} 
          trend="up"
          trendValue="+18% from last month"
          color="primary"
          tooltip="Total paid prescriptions"
        />
        <KPICard 
          title="Total Revenue" 
          value={totalRevenue} 
          icon={DollarSign} 
          trend="up"
          trendValue="+24% increase"
          color="secondary"
          tooltip="Revenue from paid prescriptions"
          prefix="₦"
        />
        <KPICard 
          title="Pending Dispatch" 
          value={pendingDispatch} 
          icon={Truck} 
          trend="neutral"
          trendValue="Awaiting collection"
          color="warning"
          tooltip="Prescriptions awaiting dispatch"
        />
        <KPICard 
          title="Collected Today" 
          value={collectedToday} 
          icon={ShoppingBag} 
          trend="up"
          trendValue="Today's collections"
          color="secondary"
          tooltip="Prescriptions collected today"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filters
          </CardTitle>
          <CardDescription>Search and filter paid prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="mb-2 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice, file, patient..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Payment Status</Label>
              <Select value={paymentStatusFilter} onValueChange={(value) => {
                setPaymentStatusFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Dispatch Status</Label>
              <Select value={dispatchStatusFilter} onValueChange={(value) => {
                setDispatchStatusFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Dispatch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dispatch</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Dispatched">Dispatched</SelectItem>
                  <SelectItem value="Collected">Collected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Date From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label className="mb-2 block">Date To</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-1/4"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" onClick={handleResetFilters}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={exportAsCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={exportAsPDF}>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Paid Prescriptions List</CardTitle>
              <CardDescription>
                Showing {paginatedPrescriptions.length} of {filteredPrescriptions.length} prescriptions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Invoice ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">File Number</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Patient Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Payment Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Dispatch Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedPrescriptions.map((prescription, index) => (
                    <motion.tr
                      key={prescription.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-sm text-primary">{prescription.invoiceId}</p>
                          <p className="text-xs text-muted-foreground">{prescription.prescriptionId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-sm">{prescription.fileNumber}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs mt-1 ${prescription.patientType === 'IPD' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}
                          >
                            {prescription.patientType}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-sm">{prescription.patientName}</p>
                          <p className="text-xs text-muted-foreground">{prescription.patientAge}y • {prescription.patientGender}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-sm text-primary">₦{prescription.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{prescription.paymentMethod}</p>
                      </td>
                      <td className="py-3 px-4">
                        {getPaymentStatusBadge(prescription.paymentStatus)}
                      </td>
                      <td className="py-3 px-4">
                        {getDispatchStatusBadge(prescription.dispatchStatus)}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-semibold">{new Date(prescription.date).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">{new Date(prescription.paidAt).toLocaleTimeString()}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => openViewModal(prescription)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handlePrintInvoice(prescription)}
                                >
                                  <Printer className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Print Invoice</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {paginatedPrescriptions.length === 0 && (
              <div className="text-center py-12">
                <PackageCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold text-muted-foreground mb-2">No paid prescriptions found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • {filteredPrescriptions.length} total records
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Paid Prescription Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Receipt className="w-6 h-6 text-primary" />
              Paid Prescription Details
            </DialogTitle>
            <DialogDescription className="text-base">
              Complete transaction and dispensing information
            </DialogDescription>
          </DialogHeader>

          {selectedPrescription && (
            <div className="space-y-6 py-4">
              {/* Patient & Invoice Info */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Patient Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">File Number</Label>
                      <p className="font-semibold">{selectedPrescription.fileNumber}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Patient Name</Label>
                      <p className="font-semibold">{selectedPrescription.patientName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Age / Gender</Label>
                        <p className="font-semibold text-sm">{selectedPrescription.patientAge}y • {selectedPrescription.patientGender}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Patient Type</Label>
                        <Badge 
                          variant="outline" 
                          className={selectedPrescription.patientType === 'IPD' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}
                        >
                          {selectedPrescription.patientType}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <p className="font-semibold text-sm">{selectedPrescription.patientPhone}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Invoice Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Invoice ID</Label>
                      <p className="font-semibold text-primary">{selectedPrescription.invoiceId}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Prescription ID</Label>
                      <p className="font-semibold">{selectedPrescription.prescriptionId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Date</Label>
                        <p className="font-semibold text-sm">{new Date(selectedPrescription.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Time</Label>
                        <p className="font-semibold text-sm">{new Date(selectedPrescription.paidAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Prescribed By</Label>
                      <p className="font-semibold text-sm">{selectedPrescription.prescribedBy}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Dispensed By</Label>
                      <p className="font-semibold text-sm">{selectedPrescription.dispensedBy}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Drugs Dispensed */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Pill className="w-5 h-5 text-primary" />
                    Drugs Dispensed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">#</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Drug Name</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Dosage</th>
                          <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">Quantity</th>
                          <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">Unit Price</th>
                          <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPrescription.dispensedDrugs.map((drug, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="py-3 px-3 text-sm">{idx + 1}</td>
                            <td className="py-3 px-3">
                              <p className="font-semibold text-sm">{drug.name}</p>
                            </td>
                            <td className="py-3 px-3 text-sm">{drug.dosage}</td>
                            <td className="py-3 px-3 text-center">
                              <Badge variant="outline" className="text-xs">{drug.quantity}</Badge>
                            </td>
                            <td className="py-3 px-3 text-right text-sm">₦{drug.price.toLocaleString()}</td>
                            <td className="py-3 px-3 text-right">
                              <p className="font-bold text-sm text-primary">₦{drug.subtotal.toLocaleString()}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Payment Method:</span>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        <CreditCard className="w-3 h-3 mr-1" />
                        {selectedPrescription.paymentMethod}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Payment Status:</span>
                      {getPaymentStatusBadge(selectedPrescription.paymentStatus)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Dispatch Status:</span>
                      {getDispatchStatusBadge(selectedPrescription.dispatchStatus)}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold">Total Amount:</span>
                      <span className="text-4xl font-bold text-primary">
                        ₦{selectedPrescription.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedPrescription.notes && (
                <Card>
                  <CardContent className="p-4">
                    <Label className="text-xs text-muted-foreground mb-2 block">Notes</Label>
                    <p className="text-sm p-3 bg-muted/50 rounded-lg">{selectedPrescription.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => {
              setViewModalOpen(false);
              setSelectedPrescription(null);
            }}>
              Close
            </Button>
            {selectedPrescription && (
              <Button 
                onClick={() => handlePrintAndDispense(selectedPrescription)}
                className="bg-primary hover:bg-primary/90"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print & Dispense
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}