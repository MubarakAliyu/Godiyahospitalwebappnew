import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Search,
  Download,
  Filter,
  FileText,
  DollarSign,
  ShoppingCart,
  Clock,
  Printer,
  RotateCcw,
  Receipt,
  User,
  Phone,
  Calendar,
  Pill,
  CreditCard,
  CheckCircle2,
  BarChart3
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Separator } from '@/app/components/ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

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

interface SaleItem {
  drugId: string;
  name: string;
  dosage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Sale {
  id: string;
  invoiceId: string;
  fileNumber: string;
  patientName: string;
  patientPhone: string;
  patientAge: string;
  patientGender: string;
  patientType: 'IPD' | 'OPD';
  items: SaleItem[];
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'Transfer' | 'Insurance';
  cashier: string;
  date: string;
  time: string;
}

// Mock sales data
const mockSales: Sale[] = [
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
    paymentMethod: 'Cash',
    cashier: 'Pharmacist John Doe',
    date: '2025-02-13',
    time: '10:30:00',
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
    paymentMethod: 'Insurance',
    cashier: 'Pharmacist Jane Smith',
    date: '2025-02-12',
    time: '14:15:00',
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
    paymentMethod: 'Card',
    cashier: 'Pharmacist John Doe',
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
    paymentMethod: 'Cash',
    cashier: 'Pharmacist Jane Smith',
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
    paymentMethod: 'Transfer',
    cashier: 'Pharmacist John Doe',
    date: '2025-02-10',
    time: '11:30:00',
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
    paymentMethod: 'Card',
    cashier: 'Pharmacist Jane Smith',
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
    paymentMethod: 'Cash',
    cashier: 'Pharmacist John Doe',
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
    paymentMethod: 'Insurance',
    cashier: 'Pharmacist Jane Smith',
    date: '2025-02-07',
    time: '10:40:00',
  },
  {
    id: '9',
    invoiceId: 'GH-PH-INV-009',
    fileNumber: 'GH-2025-009',
    patientName: 'Amina Hassan',
    patientPhone: '+234 812 456 7890',
    patientAge: '31',
    patientGender: 'Female',
    patientType: 'OPD',
    items: [
      { drugId: 'D-018', name: 'Omeprazole 20mg', dosage: '20mg', quantity: 14, price: 180, subtotal: 2520 },
    ],
    amount: 2520,
    paymentMethod: 'Cash',
    cashier: 'Pharmacist John Doe',
    date: '2025-02-13',
    time: '11:15:00',
  },
  {
    id: '10',
    invoiceId: 'GH-PH-INV-010',
    fileNumber: 'GH-2025-010',
    patientName: 'Bashir Musa',
    patientPhone: '+234 813 567 8901',
    patientAge: '47',
    patientGender: 'Male',
    patientType: 'OPD',
    items: [
      { drugId: 'D-022', name: 'Diclofenac 50mg', dosage: '50mg', quantity: 20, price: 85, subtotal: 1700 },
      { drugId: 'D-024', name: 'Multivitamin', dosage: '1 tablet', quantity: 30, price: 120, subtotal: 3600 },
    ],
    amount: 5300,
    paymentMethod: 'Transfer',
    cashier: 'Pharmacist Jane Smith',
    date: '2025-02-06',
    time: '14:50:00',
  },
];

// Chart data
const dailyChartData = [
  { date: 'Feb 06', sales: 5300 },
  { date: 'Feb 07', sales: 7200 },
  { date: 'Feb 08', sales: 2300 },
  { date: 'Feb 09', sales: 7500 },
  { date: 'Feb 10', sales: 4800 },
  { date: 'Feb 11', sales: 9000 },
  { date: 'Feb 12', sales: 11700 },
  { date: 'Feb 13', sales: 7245 },
];

const weeklyChartData = [
  { week: 'Week 1', sales: 28500 },
  { week: 'Week 2', sales: 35200 },
  { week: 'Week 3', sales: 31800 },
  { week: 'Week 4', sales: 42300 },
];

const monthlyChartData = [
  { month: 'Sep', sales: 125000 },
  { month: 'Oct', sales: 138000 },
  { month: 'Nov', sales: 142000 },
  { month: 'Dec', sales: 155000 },
  { month: 'Jan', sales: 148000 },
  { month: 'Feb', sales: 137745 },
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

export function SalesReportPanel() {
  const { addNotification } = useEMRStore();

  // State
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [cashierFilter, setCashierFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const itemsPerPage = 10;

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Get unique cashiers and payment methods
  const cashiers = Array.from(new Set(sales.map(s => s.cashier)));
  const paymentMethods = ['Cash', 'Card', 'Transfer', 'Insurance'];

  // Calculate KPIs
  const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalTransactions = sales.length;
  const avgTransaction = totalTransactions > 0 ? Math.floor(totalRevenue / totalTransactions) : 0;
  const todaysSales = sales.filter(s => {
    const today = new Date().toISOString().split('T')[0];
    return s.date === today;
  }).reduce((sum, s) => sum + s.amount, 0);

  // Get chart data based on period
  const getChartData = () => {
    switch (chartPeriod) {
      case 'weekly':
        return weeklyChartData;
      case 'monthly':
        return monthlyChartData;
      default:
        return dailyChartData;
    }
  };

  const getChartXKey = () => {
    switch (chartPeriod) {
      case 'weekly':
        return 'week';
      case 'monthly':
        return 'month';
      default:
        return 'date';
    }
  };

  // Filter sales
  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.fileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPaymentMethod = paymentMethodFilter === 'all' || sale.paymentMethod === paymentMethodFilter;
    const matchesCashier = cashierFilter === 'all' || sale.cashier === cashierFilter;
    
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const saleDate = new Date(sale.date);
      if (dateFrom) {
        matchesDate = matchesDate && saleDate >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDate = matchesDate && saleDate <= new Date(dateTo);
      }
    }
    
    return matchesSearch && matchesPaymentMethod && matchesCashier && matchesDate;
  });

  // Paginate
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setPaymentMethodFilter('all');
    setCashierFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
    toast.info('Filters Reset', {
      description: 'All filters have been cleared.',
    });
  };

  // Open view modal
  const openViewModal = (sale: Sale) => {
    setSelectedSale(sale);
    setViewModalOpen(true);
  };

  // Print invoice
  const handlePrintInvoice = (sale: Sale) => {
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${sale.invoiceId}</title>
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
            .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 2px solid #eee; color: #666; font-size: 12px; }
            .footer p { margin: 5px 0; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .badge-ipd { background: #dbeafe; color: #1e40af; }
            .badge-opd { background: #dcfce7; color: #166534; }
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
              <p>Pharmacy Department - Sales Invoice</p>
              <p>Birnin Kebbi, Kebbi State, Nigeria</p>
            </div>

            <div class="invoice-info">
              <div class="info-section">
                <h3>Patient Information</h3>
                <div class="info-row">
                  <span class="info-label">File Number:</span>
                  <span class="info-value">${sale.fileNumber}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Patient Name:</span>
                  <span class="info-value">${sale.patientName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Age / Gender:</span>
                  <span class="info-value">${sale.patientAge}y / ${sale.patientGender}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${sale.patientPhone}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Patient Type:</span>
                  <span class="info-value"><span class="badge badge-${sale.patientType.toLowerCase()}">${sale.patientType}</span></span>
                </div>
              </div>

              <div class="info-section">
                <h3>Invoice Details</h3>
                <div class="info-row">
                  <span class="info-label">Invoice ID:</span>
                  <span class="info-value" style="color: #1e40af; font-weight: 600;">${sale.invoiceId}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Date:</span>
                  <span class="info-value">${new Date(sale.date).toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Time:</span>
                  <span class="info-value">${sale.time}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Payment Method:</span>
                  <span class="info-value">${sale.paymentMethod}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Cashier:</span>
                  <span class="info-value">${sale.cashier}</span>
                </div>
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
                ${sale.items.map((item, idx) => `
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
              <div class="total-amount">₦${sale.amount.toLocaleString()}</div>
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
            description: `Invoice ${sale.invoiceId} sent to printer`,
          });

          addNotification({
            id: Date.now(),
            title: 'Invoice Printed',
            message: `${sale.invoiceId} printed for ${sale.patientName}`,
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
    const headers = ['S/N', 'Invoice ID', 'File Number', 'Patient Name', 'Amount', 'Payment Method', 'Cashier', 'Date', 'Time'];
    const csvData = filteredSales.map((sale, idx) => [
      idx + 1,
      sale.invoiceId,
      sale.fileNumber,
      sale.patientName,
      sale.amount,
      sale.paymentMethod,
      sale.cashier,
      sale.date,
      sale.time
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast.success('CSV Exported', {
      description: `${filteredSales.length} records exported successfully.`,
    });
  };

  // Print report
  const handlePrintReport = () => {
    const reportHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Report</title>
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
            .sales-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            .sales-table th { background: #1e40af; color: white; padding: 12px; text-align: left; font-size: 14px; }
            .sales-table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13px; color: #333; }
            .sales-table tr:nth-child(even) { background: #f9fafb; }
            .sales-table .text-right { text-align: right; }
            .sales-table .text-center { text-align: center; }
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
              <p>Pharmacy Sales Report</p>
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
                  <span class="meta-label">Total Transactions:</span>
                  <span class="meta-value">${filteredSales.length}</span>
                </div>
              </div>
              <div>
                <div class="meta-item">
                  <span class="meta-label">Total Revenue:</span>
                  <span class="meta-value">₦${filteredSales.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Average Transaction:</span>
                  <span class="meta-value">₦${Math.floor(filteredSales.reduce((sum, s) => sum + s.amount, 0) / filteredSales.length).toLocaleString()}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Prepared By:</span>
                  <span class="meta-value">Pharmacy Department</span>
                </div>
              </div>
            </div>

            <table class="sales-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Invoice ID</th>
                  <th>File Number</th>
                  <th>Patient Name</th>
                  <th class="text-right">Amount</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${filteredSales.map((sale, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${sale.invoiceId}</td>
                    <td>${sale.fileNumber}</td>
                    <td><strong>${sale.patientName}</strong></td>
                    <td class="text-right"><strong>₦${sale.amount.toLocaleString()}</strong></td>
                    <td>${sale.paymentMethod}</td>
                    <td>${new Date(sale.date).toLocaleDateString()}</td>
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
            description: 'Sales report sent to printer',
          });

          addNotification({
            id: Date.now(),
            title: 'Sales Report Printed',
            message: 'Pharmacy sales report generated',
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

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sales Records</h1>
          <p className="text-muted-foreground">Comprehensive pharmacy sales analytics</p>
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
          title="Total Revenue" 
          value={totalRevenue} 
          icon={DollarSign} 
          trend="up"
          trendValue="+18% from last month"
          color="secondary"
          tooltip="Total sales revenue"
          prefix="₦"
        />
        <KPICard 
          title="Total Transactions" 
          value={totalTransactions} 
          icon={ShoppingCart} 
          trend="up"
          trendValue="+12% increase"
          color="primary"
          tooltip="Total number of sales"
        />
        <KPICard 
          title="Avg. Transaction" 
          value={avgTransaction} 
          icon={BarChart3} 
          trend="up"
          trendValue="+5% from average"
          color="primary"
          tooltip="Average transaction value"
          prefix="₦"
        />
        <KPICard 
          title="Today's Sales" 
          value={todaysSales} 
          icon={Clock} 
          trend="up"
          trendValue="Current day sales"
          color="secondary"
          tooltip="Sales for today"
          prefix="₦"
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                Sales Trend Analysis
              </CardTitle>
              <CardDescription>Revenue performance over time</CardDescription>
            </div>
            <Tabs value={chartPeriod} onValueChange={(value) => setChartPeriod(value as any)}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={getChartXKey()} stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <RechartsTooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Sales']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#1e40af" 
                strokeWidth={3}
                dot={{ fill: '#1e40af', r: 5 }}
                activeDot={{ r: 7 }}
                name="Sales Revenue (₦)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filters
          </CardTitle>
          <CardDescription>Search and filter sales records</CardDescription>
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
              <Label className="mb-2 block">Payment Method</Label>
              <Select value={paymentMethodFilter} onValueChange={(value) => {
                setPaymentMethodFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  {paymentMethods.map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Cashier</Label>
              <Select value={cashierFilter} onValueChange={(value) => {
                setCashierFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cashiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cashiers</SelectItem>
                  {cashiers.map(cashier => (
                    <SelectItem key={cashier} value={cashier}>{cashier}</SelectItem>
                  ))}
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
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Sales Transactions</CardTitle>
              <CardDescription>
                Showing {paginatedSales.length} of {filteredSales.length} transactions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">S/N</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Invoice No.</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">File No.</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Patient Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedSales.map((sale, index) => (
                    <motion.tr
                      key={sale.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="text-sm font-semibold">{(currentPage - 1) * itemsPerPage + index + 1}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-sm text-primary">{sale.invoiceId}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-sm">{sale.fileNumber}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs mt-1 ${sale.patientType === 'IPD' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}
                          >
                            {sale.patientType}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-sm">{sale.patientName}</p>
                          <p className="text-xs text-muted-foreground">{sale.paymentMethod}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-sm text-primary">₦{sale.amount.toLocaleString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-semibold">{new Date(sale.date).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">{sale.time}</p>
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
                                  onClick={() => openViewModal(sale)}
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
                                  onClick={() => handlePrintInvoice(sale)}
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
                                  onClick={() => handlePrintInvoice(sale)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download PDF</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {paginatedSales.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold text-muted-foreground mb-2">No sales records found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • {filteredSales.length} total records
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
              Complete sales transaction information
            </DialogDescription>
          </DialogHeader>

          {selectedSale && (
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
                      <p className="font-semibold">{selectedSale.fileNumber}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Patient Name</Label>
                      <p className="font-semibold">{selectedSale.patientName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Age / Gender</Label>
                        <p className="font-semibold text-sm">{selectedSale.patientAge}y • {selectedSale.patientGender}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Patient Type</Label>
                        <Badge 
                          variant="outline" 
                          className={selectedSale.patientType === 'IPD' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}
                        >
                          {selectedSale.patientType}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <p className="font-semibold text-sm">{selectedSale.patientPhone}</p>
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
                      <p className="font-semibold text-primary">{selectedSale.invoiceId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Date</Label>
                        <p className="font-semibold text-sm">{new Date(selectedSale.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Time</Label>
                        <p className="font-semibold text-sm">{selectedSale.time}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Payment Method</Label>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        <CreditCard className="w-3 h-3 mr-1" />
                        {selectedSale.paymentMethod}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Cashier</Label>
                      <p className="font-semibold text-sm">{selectedSale.cashier}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Items List */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Pill className="w-5 h-5 text-primary" />
                    Items Purchased
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
                        {selectedSale.items.map((item, idx) => (
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
                      ₦{selectedSale.amount.toLocaleString()}
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
            {selectedSale && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => handlePrintInvoice(selectedSale)}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button 
                  onClick={() => handlePrintInvoice(selectedSale)}
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
    </div>
  );
}
