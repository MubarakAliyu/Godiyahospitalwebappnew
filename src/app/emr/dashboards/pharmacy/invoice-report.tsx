import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Receipt,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Search,
  Download,
  Filter,
  FileText,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  RotateCcw,
  AlertCircle,
  CreditCard,
  User,
  Phone,
  Calendar,
  Pill,
  CheckCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useEMRStore } from '@/app/emr/store/emr-store';
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

interface InvoiceItem {
  drugId: string;
  name: string;
  dosage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Invoice {
  id: string;
  invoiceId: string;
  fileNumber: string;
  patientName: string;
  patientPhone: string;
  patientAge: string;
  patientGender: string;
  patientType: 'IPD' | 'OPD';
  items: InvoiceItem[];
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Pending';
  paymentMethod?: string;
  cashier?: string;
  date: string;
  time: string;
  paidAt?: string;
}

// Mock invoice data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceId: 'GH-PH-INV-001',
    fileNumber: 'GH-2025-001',
    patientName: 'Aisha Mohammed',
    patientPhone: '+234 803 456 7890',
    patientAge: '34',
    patientGender: 'Female',
    patientType: 'OPD',
    items: [
      { drugId: 'D-001', name: 'Paracetamol 500mg', dosage: '500mg', quantity: 20, price: 50, subtotal: 1000 },
      { drugId: 'D-003', name: 'Ibuprofen 400mg', dosage: '400mg', quantity: 15, price: 75, subtotal: 1125 },
    ],
    amount: 2125,
    status: 'Paid',
    paymentMethod: 'Cash',
    cashier: 'Pharmacist John Doe',
    date: '2025-02-13',
    time: '10:30:00',
    paidAt: '2025-02-13T10:30:00',
  },
  {
    id: '2',
    invoiceId: 'GH-PH-INV-002',
    fileNumber: 'GH-2025-002',
    patientName: 'Ibrahim Usman',
    patientPhone: '+234 806 123 4567',
    patientAge: '45',
    patientGender: 'Male',
    patientType: 'IPD',
    items: [
      { drugId: 'D-002', name: 'Amoxicillin 250mg', dosage: '250mg', quantity: 30, price: 150, subtotal: 4500 },
      { drugId: 'D-005', name: 'Metformin 500mg', dosage: '500mg', quantity: 60, price: 120, subtotal: 7200 },
    ],
    amount: 11700,
    status: 'Paid',
    paymentMethod: 'Insurance',
    cashier: 'Pharmacist Jane Smith',
    date: '2025-02-12',
    time: '14:15:00',
    paidAt: '2025-02-12T14:15:00',
  },
  {
    id: '3',
    invoiceId: 'GH-PH-INV-003',
    fileNumber: 'GH-2025-003',
    patientName: 'Fatima Sani',
    patientPhone: '+234 805 987 6543',
    patientAge: '52',
    patientGender: 'Female',
    patientType: 'OPD',
    items: [
      { drugId: 'D-016', name: 'Losartan 50mg', dosage: '50mg', quantity: 30, price: 170, subtotal: 5100 },
      { drugId: 'D-020', name: 'Amlodipine 5mg', dosage: '5mg', quantity: 30, price: 130, subtotal: 3900 },
    ],
    amount: 9000,
    status: 'Unpaid',
    date: '2025-02-11',
    time: '16:45:00',
  },
  {
    id: '4',
    invoiceId: 'GH-PH-INV-004',
    fileNumber: 'GH-2025-004',
    patientName: 'Musa Bello',
    patientPhone: '+234 807 234 5678',
    patientAge: '28',
    patientGender: 'Male',
    patientType: 'OPD',
    items: [
      { drugId: 'D-007', name: 'Cetirizine 10mg', dosage: '10mg', quantity: 10, price: 60, subtotal: 600 },
    ],
    amount: 600,
    status: 'Pending',
    date: '2025-02-13',
    time: '09:20:00',
  },
  {
    id: '5',
    invoiceId: 'GH-PH-INV-005',
    fileNumber: 'GH-2025-005',
    patientName: 'Zainab Ahmad',
    patientPhone: '+234 808 345 6789',
    patientAge: '29',
    patientGender: 'Female',
    patientType: 'IPD',
    items: [
      { drugId: 'D-012', name: 'Vitamin B Complex', dosage: '1 tablet', quantity: 30, price: 100, subtotal: 3000 },
      { drugId: 'D-013', name: 'Prednisolone 5mg', dosage: '5mg', quantity: 20, price: 90, subtotal: 1800 },
    ],
    amount: 4800,
    status: 'Paid',
    paymentMethod: 'Transfer',
    cashier: 'Pharmacist John Doe',
    date: '2025-02-10',
    time: '11:30:00',
    paidAt: '2025-02-10T11:30:00',
  },
  {
    id: '6',
    invoiceId: 'GH-PH-INV-006',
    fileNumber: 'GH-2025-006',
    patientName: 'Yusuf Abdullahi',
    patientPhone: '+234 809 876 5432',
    patientAge: '38',
    patientGender: 'Male',
    patientType: 'OPD',
    items: [
      { drugId: 'D-009', name: 'Atorvastatin 20mg', dosage: '20mg', quantity: 30, price: 250, subtotal: 7500 },
    ],
    amount: 7500,
    status: 'Unpaid',
    date: '2025-02-09',
    time: '15:10:00',
  },
  {
    id: '7',
    invoiceId: 'GH-PH-INV-007',
    fileNumber: 'GH-2025-007',
    patientName: 'Hauwa Aliyu',
    patientPhone: '+234 810 234 5678',
    patientAge: '41',
    patientGender: 'Female',
    patientType: 'OPD',
    items: [
      { drugId: 'D-010', name: 'Azithromycin 500mg', dosage: '500mg', quantity: 6, price: 300, subtotal: 1800 },
      { drugId: 'D-001', name: 'Paracetamol 500mg', dosage: '500mg', quantity: 10, price: 50, subtotal: 500 },
    ],
    amount: 2300,
    status: 'Pending',
    date: '2025-02-08',
    time: '13:25:00',
  },
  {
    id: '8',
    invoiceId: 'GH-PH-INV-008',
    fileNumber: 'GH-2025-008',
    patientName: 'Suleiman Garba',
    patientPhone: '+234 811 345 6789',
    patientAge: '55',
    patientGender: 'Male',
    patientType: 'IPD',
    items: [
      { drugId: 'D-014', name: 'Levothyroxine 50mcg', dosage: '50mcg', quantity: 30, price: 140, subtotal: 4200 },
      { drugId: 'D-012', name: 'Vitamin B Complex', dosage: '1 tablet', quantity: 30, price: 100, subtotal: 3000 },
    ],
    amount: 7200,
    status: 'Paid',
    paymentMethod: 'Insurance',
    cashier: 'Pharmacist Jane Smith',
    date: '2025-02-07',
    time: '10:40:00',
    paidAt: '2025-02-07T10:40:00',
  },
];

function KPICard({ title, value, icon: Icon, trend, trendValue, color = 'primary', tooltip, prefix = '' }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startValue = 0;
    const numericValue = typeof value === 'number' ? value : 0;
    const duration = 1000;
    const increment = numericValue / (duration / 16);

    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= numericValue) {
        setDisplayValue(numericValue);
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

export function InvoiceReportPanel() {
  const { addNotification } = useEMRStore();

  // State
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [markPaidModalOpen, setMarkPaidModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Mark Paid form
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cashierName, setCashierName] = useState('Pharmacist John Doe');

  // Calculate KPIs
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'Paid').length;
  const unpaidInvoices = invoices.filter(i => i.status === 'Unpaid').length;
  const pendingInvoices = invoices.filter(i => i.status === 'Pending').length;

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.fileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const invoiceDate = new Date(invoice.date);
      if (dateFrom) {
        matchesDate = matchesDate && invoiceDate >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDate = matchesDate && invoiceDate <= new Date(dateTo);
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Paginate
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
    toast.info('Filters Reset', {
      description: 'All filters have been cleared.',
    });
  };

  // Open view modal
  const openViewModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewModalOpen(true);
  };

  // Open mark paid modal
  const openMarkPaidModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentMethod('');
    setMarkPaidModalOpen(true);
  };

  // Handle mark paid
  const handleMarkPaid = () => {
    if (!selectedInvoice || !paymentMethod) {
      toast.error('Invalid Input', {
        description: 'Please select a payment method.',
      });
      return;
    }

    const updatedInvoices = invoices.map(inv => {
      if (inv.id === selectedInvoice.id) {
        return {
          ...inv,
          status: 'Paid' as const,
          paymentMethod,
          cashier: cashierName,
          paidAt: new Date().toISOString(),
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);

    toast.success('Invoice Marked as Paid', {
      description: `${selectedInvoice.invoiceId} has been marked as paid.`,
    });

    addNotification({
      id: Date.now(),
      title: 'Invoice Payment Received',
      message: `${selectedInvoice.invoiceId} - ₦${selectedInvoice.amount.toLocaleString()} paid via ${paymentMethod}`,
      type: 'success',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Medium',
    });

    setMarkPaidModalOpen(false);
    setPaymentMethod('');
  };

  // Print invoice
  const handlePrintInvoice = (invoice: Invoice) => {
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoice.invoiceId}</title>
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
            .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            .items-table th { background: #1e40af; color: white; padding: 12px; text-align: left; font-size: 14px; }
            .items-table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; }
            .items-table tr:nth-child(even) { background: #f9fafb; }
            .items-table .text-right { text-align: right; }
            .items-table .text-center { text-align: center; }
            .total-section { text-align: right; margin-top: 30px; padding-top: 20px; border-top: 3px solid #1e40af; }
            .total-label { font-size: 20px; font-weight: 600; color: #333; }
            .total-amount { font-size: 32px; font-weight: bold; color: #059669; margin-top: 10px; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .badge-paid { background: #dcfce7; color: #166534; }
            .badge-unpaid { background: #fee2e2; color: #991b1b; }
            .badge-pending { background: #fef3c7; color: #92400e; }
            .badge-ipd { background: #dbeafe; color: #1e40af; }
            .badge-opd { background: #dcfce7; color: #166534; }
            .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 2px solid #eee; color: #666; font-size: 12px; }
            .footer p { margin: 5px 0; }
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
              <p>Pharmacy Department - Invoice</p>
              <p>Birnin Kebbi, Kebbi State, Nigeria</p>
            </div>

            <div class="invoice-info">
              <div class="info-section">
                <h3>Patient Information</h3>
                <div class="info-row">
                  <span class="info-label">File Number:</span>
                  <span class="info-value">${invoice.fileNumber}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Patient Name:</span>
                  <span class="info-value">${invoice.patientName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Age / Gender:</span>
                  <span class="info-value">${invoice.patientAge}y / ${invoice.patientGender}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${invoice.patientPhone}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Patient Type:</span>
                  <span class="info-value"><span class="badge-${invoice.patientType.toLowerCase()}">${invoice.patientType}</span></span>
                </div>
              </div>

              <div class="info-section">
                <h3>Invoice Details</h3>
                <div class="info-row">
                  <span class="info-label">Invoice ID:</span>
                  <span class="info-value" style="color: #1e40af; font-weight: 600;">${invoice.invoiceId}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Date:</span>
                  <span class="info-value">${new Date(invoice.date).toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Time:</span>
                  <span class="info-value">${invoice.time}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status:</span>
                  <span class="info-value"><span class="status-badge badge-${invoice.status.toLowerCase()}">${invoice.status}</span></span>
                </div>
                ${invoice.paymentMethod ? `
                <div class="info-row">
                  <span class="info-label">Payment Method:</span>
                  <span class="info-value">${invoice.paymentMethod}</span>
                </div>
                ` : ''}
                ${invoice.cashier ? `
                <div class="info-row">
                  <span class="info-label">Cashier:</span>
                  <span class="info-value">${invoice.cashier}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Description</th>
                  <th>Dosage</th>
                  <th class="text-center">Quantity</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map((item, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${item.name}</strong></td>
                    <td>${item.dosage}</td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-right">₦${item.price.toLocaleString()}</td>
                    <td class="text-right"><strong>₦${item.subtotal.toLocaleString()}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total-section">
              <div style="margin-bottom: 10px;">
                <span class="total-label">Total Amount:</span>
              </div>
              <div class="total-amount">₦${invoice.amount.toLocaleString()}</div>
            </div>

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

    const frameDoc = printFrame.contentWindow || printFrame.contentDocument;
    if (frameDoc) {
      const doc = frameDoc.document || frameDoc;
      doc.open();
      doc.write(invoiceHTML);
      doc.close();

      setTimeout(() => {
        try {
          if (printFrame.contentWindow) {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
          }
          
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 1000);

          toast.success('Invoice Printing', {
            description: `Invoice ${invoice.invoiceId} sent to printer`,
          });

          addNotification({
            id: Date.now(),
            title: 'Invoice Printed',
            message: `${invoice.invoiceId} printed for ${invoice.patientName}`,
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

  // Export as CSV
  const exportAsCSV = () => {
    const headers = ['Invoice ID', 'File Number', 'Patient Name', 'Amount', 'Status', 'Payment Method', 'Date', 'Time'];
    const csvData = filteredInvoices.map(invoice => [
      invoice.invoiceId,
      invoice.fileNumber,
      invoice.patientName,
      invoice.amount,
      invoice.status,
      invoice.paymentMethod || 'N/A',
      invoice.date,
      invoice.time
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast.success('CSV Exported', {
      description: `${filteredInvoices.length} records exported successfully.`,
    });
  };

  // Print report
  const handlePrintReport = () => {
    const reportHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background: white; color: #000; }
            .report-container { max-width: 1000px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1e40af; padding-bottom: 20px; }
            .header h1 { color: #1e40af; font-size: 32px; margin-bottom: 5px; }
            .header p { color: #666; font-size: 14px; line-height: 1.6; }
            .meta-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; }
            .meta-item { display: flex; justify-content: space-between; padding: 8px 0; }
            .meta-label { font-weight: 600; color: #333; }
            .meta-value { color: #666; }
            .invoice-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            .invoice-table th { background: #1e40af; color: white; padding: 12px; text-align: left; font-size: 14px; }
            .invoice-table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13px; color: #333; }
            .invoice-table tr:nth-child(even) { background: #f9fafb; }
            .invoice-table .text-right { text-align: right; }
            .invoice-table .text-center { text-align: center; }
            .badge-paid { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #dcfce7; color: #166534; }
            .badge-unpaid { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #fee2e2; color: #991b1b; }
            .badge-pending { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #fef3c7; color: #92400e; }
            .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 2px solid #eee; color: #666; font-size: 12px; }
            .footer p { margin: 5px 0; }
            @media print { 
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="header">
              <h1>GODIYA HOSPITAL</h1>
              <p>Pharmacy Invoice Report</p>
              <p>Birnin Kebbi, Kebbi State, Nigeria</p>
            </div>

            <div class="meta-info">
              <div>
                <div class="meta-item">
                  <span class="meta-label">Report Date:</span>
                  <span class="meta-value">${new Date().toLocaleDateString()}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Report Time:</span>
                  <span class="meta-value">${new Date().toLocaleTimeString()}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Total Invoices:</span>
                  <span class="meta-value">${filteredInvoices.length}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Paid Invoices:</span>
                  <span class="meta-value">${filteredInvoices.filter(i => i.status === 'Paid').length}</span>
                </div>
              </div>
              <div>
                <div class="meta-item">
                  <span class="meta-label">Unpaid Invoices:</span>
                  <span class="meta-value">${filteredInvoices.filter(i => i.status === 'Unpaid').length}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Pending Invoices:</span>
                  <span class="meta-value">${filteredInvoices.filter(i => i.status === 'Pending').length}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Total Value:</span>
                  <span class="meta-value">₦${filteredInvoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Prepared By:</span>
                  <span class="meta-value">Pharmacy Department</span>
                </div>
              </div>
            </div>

            <table class="invoice-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Invoice ID</th>
                  <th>File Number</th>
                  <th>Patient Name</th>
                  <th class="text-right">Amount</th>
                  <th class="text-center">Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${filteredInvoices.map((invoice, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${invoice.invoiceId}</td>
                    <td>${invoice.fileNumber}</td>
                    <td><strong>${invoice.patientName}</strong></td>
                    <td class="text-right"><strong>₦${invoice.amount.toLocaleString()}</strong></td>
                    <td class="text-center">
                      <span class="badge-${invoice.status.toLowerCase()}">${invoice.status}</span>
                    </td>
                    <td>${new Date(invoice.date).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <p><strong>GODIYA HOSPITAL - Pharmacy Department</strong></p>
              <p>This is a computer-generated report.</p>
              <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow || printFrame.contentDocument;
    if (frameDoc) {
      const doc = frameDoc.document || frameDoc;
      doc.open();
      doc.write(reportHTML);
      doc.close();

      setTimeout(() => {
        try {
          if (printFrame.contentWindow) {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
          }
          
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 1000);

          toast.success('Report Printing', {
            description: 'Invoice report sent to printer',
          });

          addNotification({
            id: Date.now(),
            title: 'Invoice Report Printed',
            message: 'Pharmacy invoice report generated',
            type: 'info',
            status: 'Unread',
            timestamp: new Date().toISOString(),
            priority: 'Low',
          });
        } catch (error) {
          toast.error('Print Error', {
            description: 'Unable to print report. Please try again.',
          });
        }
      }, 500);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'Unpaid':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Unpaid
          </Badge>
        );
      case 'Pending':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Invoice Report</h1>
          <p className="text-muted-foreground">Invoice audit & history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrintReport}>
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
          <Button variant="outline" onClick={exportAsCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Invoices" 
          value={totalInvoices} 
          icon={Receipt} 
          trend="up"
          trendValue="All time invoices"
          color="primary"
          tooltip="Total number of invoices"
        />
        <KPICard 
          title="Paid" 
          value={paidInvoices} 
          icon={CheckCircle2} 
          trend="up"
          trendValue="Completed payments"
          color="secondary"
          tooltip="Total paid invoices"
        />
        <KPICard 
          title="Unpaid" 
          value={unpaidInvoices} 
          icon={XCircle} 
          trend="neutral"
          trendValue="Awaiting payment"
          color="danger"
          tooltip="Total unpaid invoices"
        />
        <KPICard 
          title="Pending" 
          value={pendingInvoices} 
          icon={Clock} 
          trend="neutral"
          trendValue="Processing"
          color="warning"
          tooltip="Total pending invoices"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filters
          </CardTitle>
          <CardDescription>Search and filter invoice records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="mb-2 block">Search Invoice No.</Label>
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
              <Label className="mb-2 block">Status</Label>
              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
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
              className="w-full md:w-1/3"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" onClick={handleResetFilters}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Invoice Records</CardTitle>
              <CardDescription>
                Showing {paginatedInvoices.length} of {filteredInvoices.length} invoices
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Invoice No.</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">File No.</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Patient Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-semibold text-sm text-primary">{invoice.invoiceId}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-sm">{invoice.fileNumber}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs mt-1 ${invoice.patientType === 'IPD' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}
                          >
                            {invoice.patientType}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-sm">{invoice.patientName}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-sm text-primary">₦{invoice.amount.toLocaleString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-semibold">{new Date(invoice.date).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">{invoice.time}</p>
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
                                  onClick={() => openViewModal(invoice)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Invoice</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handlePrintInvoice(invoice)}
                                >
                                  <Printer className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Print Invoice</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handlePrintInvoice(invoice)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download PDF</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {invoice.status !== 'Paid' && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => openMarkPaidModal(invoice)}
                                  >
                                    <CheckCheck className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Mark as Paid</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {paginatedInvoices.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold text-muted-foreground mb-2">No invoices found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • {filteredInvoices.length} total records
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

      {/* View Invoice Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Receipt className="w-6 h-6 text-primary" />
              Invoice Details
            </DialogTitle>
            <DialogDescription className="text-base">
              Complete invoice information
            </DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
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
                      <p className="font-semibold">{selectedInvoice.fileNumber}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Patient Name</Label>
                      <p className="font-semibold">{selectedInvoice.patientName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Age / Gender</Label>
                        <p className="font-semibold text-sm">{selectedInvoice.patientAge}y • {selectedInvoice.patientGender}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Patient Type</Label>
                        <Badge 
                          variant="outline" 
                          className={selectedInvoice.patientType === 'IPD' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}
                        >
                          {selectedInvoice.patientType}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <p className="font-semibold text-sm">{selectedInvoice.patientPhone}</p>
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
                      <p className="font-semibold text-primary">{selectedInvoice.invoiceId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Date</Label>
                        <p className="font-semibold text-sm">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Time</Label>
                        <p className="font-semibold text-sm">{selectedInvoice.time}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                    </div>
                    {selectedInvoice.paymentMethod && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Payment Method</Label>
                        <Badge variant="outline" className="text-sm px-3 py-1 mt-1">
                          <CreditCard className="w-3 h-3 mr-1" />
                          {selectedInvoice.paymentMethod}
                        </Badge>
                      </div>
                    )}
                    {selectedInvoice.cashier && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Cashier</Label>
                        <p className="font-semibold text-sm">{selectedInvoice.cashier}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Items List */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Pill className="w-5 h-5 text-primary" />
                    Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">#</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Item Description</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Dosage</th>
                          <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">Quantity</th>
                          <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">Unit Price</th>
                          <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="py-3 px-3 text-sm">{idx + 1}</td>
                            <td className="py-3 px-3">
                              <p className="font-semibold text-sm">{item.name}</p>
                            </td>
                            <td className="py-3 px-3 text-sm">{item.dosage}</td>
                            <td className="py-3 px-3 text-center">
                              <Badge variant="outline" className="text-xs">{item.quantity}</Badge>
                            </td>
                            <td className="py-3 px-3 text-right text-sm">₦{item.price.toLocaleString()}</td>
                            <td className="py-3 px-3 text-right">
                              <p className="font-bold text-sm text-primary">₦{item.subtotal.toLocaleString()}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Total Summary */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold">Total Amount:</span>
                    <span className="text-4xl font-bold text-primary">
                      ₦{selectedInvoice.amount.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
            {selectedInvoice && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => handlePrintInvoice(selectedInvoice)}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button 
                  onClick={() => handlePrintInvoice(selectedInvoice)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Paid Modal */}
      <Dialog open={markPaidModalOpen} onOpenChange={setMarkPaidModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              Mark Invoice as Paid
            </DialogTitle>
            <DialogDescription className="text-base">
              Record payment for {selectedInvoice?.invoiceId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {selectedInvoice && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Patient Name</Label>
                      <p className="font-semibold text-sm">{selectedInvoice.patientName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Invoice ID</Label>
                      <p className="font-semibold text-sm text-primary">{selectedInvoice.invoiceId}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Amount Due</Label>
                      <p className="font-bold text-lg text-primary">₦{selectedInvoice.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <Label className="mb-2 block">Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Cashier</Label>
              <Input
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                placeholder="Enter cashier name"
                className="h-11"
              />
            </div>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-green-800">Payment Confirmation</p>
                    <p className="text-xs text-green-700">
                      This action will update the invoice status to "Paid" and trigger notifications. 
                      The KPI cards will be updated automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setMarkPaidModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkPaid} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
