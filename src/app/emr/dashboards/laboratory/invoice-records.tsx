import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Search,
  Download,
  Eye,
  Printer,
  Trash2,
  Calendar,
  Building,
  User,
  Phone,
  X,
  FlaskConical
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { Separator } from '@/app/components/ui/separator';

interface KPICardProps {
  title: string;
  value: number;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
  tooltip?: string;
}

interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  fileNumber: string;
  patientName: string;
  phoneNumber: string;
  tests: { name: string; price: number; quantity: number }[];
  subtotal: number;
  discount: number;
  total: number;
  date: string;
  status: 'Paid' | 'Unpaid';
  technician: string;
  notes?: string;
}

// Mock invoice data
const mockInvoices: InvoiceRecord[] = [
  {
    id: '1',
    invoiceNumber: 'GH-LB-INV-001',
    fileNumber: 'GH-2025-001',
    patientName: 'Aisha Mohammed',
    phoneNumber: '+234 803 456 7890',
    tests: [
      { name: 'Complete Blood Count', price: 2500, quantity: 1 },
      { name: 'Malaria Test', price: 1000, quantity: 1 }
    ],
    subtotal: 3500,
    discount: 0,
    total: 3500,
    date: '2025-02-13',
    status: 'Paid',
    technician: 'Lab Technician',
    notes: 'Routine checkup'
  },
  {
    id: '2',
    invoiceNumber: 'GH-LB-INV-002',
    fileNumber: 'GH-2025-002',
    patientName: 'Ibrahim Usman',
    phoneNumber: '+234 806 123 4567',
    tests: [
      { name: 'Blood Sugar (Fasting)', price: 1500, quantity: 1 },
      { name: 'Lipid Profile', price: 5000, quantity: 1 },
      { name: 'Liver Function Test', price: 4500, quantity: 1 }
    ],
    subtotal: 11000,
    discount: 1000,
    total: 10000,
    date: '2025-02-13',
    status: 'Paid',
    technician: 'Lab Technician',
  },
  {
    id: '3',
    invoiceNumber: 'GH-LB-INV-003',
    fileNumber: 'WALK-IN-1707827400',
    patientName: 'Fatima Sani',
    phoneNumber: '+234 805 987 6543',
    tests: [
      { name: 'Pregnancy Test', price: 800, quantity: 1 }
    ],
    subtotal: 800,
    discount: 0,
    total: 800,
    date: '2025-02-13',
    status: 'Unpaid',
    technician: 'Lab Technician',
  },
  {
    id: '4',
    invoiceNumber: 'GH-LB-INV-004',
    fileNumber: 'GH-2025-003',
    patientName: 'Musa Bello',
    phoneNumber: '+234 807 234 5678',
    tests: [
      { name: 'HIV Screening', price: 1500, quantity: 1 },
      { name: 'Hepatitis B Surface Antigen', price: 2000, quantity: 1 }
    ],
    subtotal: 3500,
    discount: 0,
    total: 3500,
    date: '2025-02-12',
    status: 'Paid',
    technician: 'Lab Technician',
  },
  {
    id: '5',
    invoiceNumber: 'GH-LB-INV-005',
    fileNumber: 'GH-2025-004',
    patientName: 'Zainab Ahmad',
    phoneNumber: '+234 808 345 6789',
    tests: [
      { name: 'Thyroid Function Test', price: 6500, quantity: 1 },
      { name: 'Complete Blood Count', price: 2500, quantity: 1 }
    ],
    subtotal: 9000,
    discount: 500,
    total: 8500,
    date: '2025-02-12',
    status: 'Unpaid',
    technician: 'Lab Technician',
  },
  {
    id: '6',
    invoiceNumber: 'GH-LB-INV-006',
    fileNumber: 'GH-2025-005',
    patientName: 'Abubakar Hassan',
    phoneNumber: '+234 809 456 7890',
    tests: [
      { name: 'Kidney Function Test', price: 4000, quantity: 1 },
      { name: 'Urinalysis', price: 1500, quantity: 1 }
    ],
    subtotal: 5500,
    discount: 0,
    total: 5500,
    date: '2025-02-11',
    status: 'Paid',
    technician: 'Lab Technician',
  },
  {
    id: '7',
    invoiceNumber: 'GH-LB-INV-007',
    fileNumber: 'GH-2025-006',
    patientName: 'Hauwa Abdullahi',
    phoneNumber: '+234 810 567 8901',
    tests: [
      { name: 'Widal Test', price: 1500, quantity: 1 },
      { name: 'Malaria Test', price: 1000, quantity: 1 }
    ],
    subtotal: 2500,
    discount: 0,
    total: 2500,
    date: '2025-02-11',
    status: 'Paid',
    technician: 'Lab Technician',
  },
  {
    id: '8',
    invoiceNumber: 'GH-LB-INV-008',
    fileNumber: 'GH-2025-007',
    patientName: 'Yusuf Ibrahim',
    phoneNumber: '+234 811 678 9012',
    tests: [
      { name: 'HbA1c', price: 3500, quantity: 1 }
    ],
    subtotal: 3500,
    discount: 0,
    total: 3500,
    date: '2025-02-10',
    status: 'Unpaid',
    technician: 'Lab Technician',
  },
];

function KPICard({ title, value, icon: Icon, trend, trendValue, color = 'primary', tooltip }: KPICardProps) {
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
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-foreground">{displayValue}</h3>
                  </div>
                  <div 
                    className={`p-3 rounded-xl`}
                    style={{
                      backgroundColor: color === 'primary' ? '#1e40af15' : '#05966915'
                    }}
                  >
                    <Icon 
                      className="w-6 h-6"
                      style={{
                        color: color === 'primary' ? '#1e40af' : '#059669'
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

export function InvoiceRecords() {
  const { addNotification } = useEMRStore();

  // State
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  // Calculate KPIs
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((inv) => inv.status === 'Paid').length;
  const unpaidInvoices = invoices.filter((inv) => inv.status === 'Unpaid').length;
  const revenueToday = invoices
    .filter((inv) => inv.date === new Date().toISOString().split('T')[0] && inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.fileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const today = new Date();
      const invoiceDate = new Date(invoice.date);
      if (dateFilter === 'today') {
        matchesDate = invoiceDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = invoiceDate >= weekAgo;
      } else if (dateFilter === 'month') {
        matchesDate = invoiceDate.getMonth() === today.getMonth();
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.total - a.total;
    }
  });

  // Paginate
  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
  const paginatedInvoices = sortedInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle view invoice
  const handleViewInvoice = (invoice: InvoiceRecord) => {
    setSelectedInvoice(invoice);
    setViewModalOpen(true);
  };

  // Handle print invoice
  const handlePrintInvoice = (invoice: InvoiceRecord) => {
    toast.success('Print Started', {
      description: `Printing invoice ${invoice.invoiceNumber}...`,
    });
    window.print();
  };

  // Handle delete invoice
  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoiceToDelete(invoiceId);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!invoiceToDelete) return;

    const invoice = invoices.find((inv) => inv.id === invoiceToDelete);
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceToDelete));

    toast.success('Invoice Deleted', {
      description: `Invoice ${invoice?.invoiceNumber} has been deleted successfully.`,
    });

    addNotification({
      id: Date.now(),
      title: 'Invoice Deleted',
      message: `Invoice ${invoice?.invoiceNumber} deleted from records`,
      type: 'warning',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Medium',
    });

    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const csvContent = [
      ['Invoice Number', 'File Number', 'Patient Name', 'Total', 'Date', 'Status'],
      ...filteredInvoices.map((inv) => [
        inv.invoiceNumber,
        inv.fileNumber,
        inv.patientName,
        inv.total,
        inv.date,
        inv.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lab-invoices-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('CSV Exported', {
      description: 'Invoice records exported successfully.',
    });
  };

  // Download invoice PDF
  const handleDownloadInvoice = () => {
    if (!selectedInvoice) return;

    toast.success('Invoice Downloaded', {
      description: `Invoice ${selectedInvoice.invoiceNumber} downloaded successfully.`,
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    if (status === 'Paid') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
    }
    return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Unpaid</Badge>;
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Invoice Records</h1>
        <p className="text-muted-foreground">View and manage all laboratory invoices</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Invoices" 
          value={totalInvoices} 
          icon={FileText} 
          trend="neutral"
          trendValue="All invoices"
          color="primary"
          tooltip="Total number of invoices created"
        />
        <KPICard 
          title="Paid Invoices" 
          value={paidInvoices} 
          icon={CheckCircle2} 
          trend="up"
          trendValue="+12% from yesterday"
          color="secondary"
          tooltip="Invoices with completed payment"
        />
        <KPICard 
          title="Unpaid Invoices" 
          value={unpaidInvoices} 
          icon={AlertCircle} 
          trend="down"
          trendValue="-5% from yesterday"
          color="primary"
          tooltip="Invoices pending payment"
        />
        <KPICard 
          title="Revenue Today" 
          value={revenueToday} 
          icon={DollarSign} 
          trend="up"
          trendValue="+18% from yesterday"
          color="secondary"
          tooltip="Total revenue collected today"
        />
      </div>

      {/* Invoice Records Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Invoice Records
                </CardTitle>
                <CardDescription>Filter and manage invoice records</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={handleExportCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
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
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
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
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <p className="font-semibold text-sm text-primary">{invoice.invoiceNumber}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-sm">{invoice.fileNumber}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-sm">{invoice.patientName}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-sm">₦{invoice.total.toLocaleString()}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-muted-foreground">
                            {new Date(invoice.date).toLocaleDateString('en-GB')}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleViewInvoice(invoice)}
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
                                    onClick={() => handleDeleteInvoice(invoice.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete Invoice</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {paginatedInvoices.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No invoices found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        size="sm"
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(page)}
                        className="w-8"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* View Invoice Modal */}
      <Dialog open={viewModalOpen} onOpenChange={(open) => !open && setViewModalOpen(false)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Invoice Details</DialogTitle>
                <DialogDescription>Complete invoice information</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6 py-4">
              {/* Invoice Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Invoice Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Invoice Number</Label>
                    <p className="font-semibold">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date</Label>
                    <p className="font-semibold">{new Date(selectedInvoice.date).toLocaleDateString('en-GB')}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Technician</Label>
                    <p className="font-semibold">{selectedInvoice.technician}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Patient Name</Label>
                    <p className="font-semibold">{selectedInvoice.patientName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">File Number</Label>
                    <p className="font-semibold">{selectedInvoice.fileNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Phone Number</Label>
                    <p className="font-semibold">{selectedInvoice.phoneNumber}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tests Ordered */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tests Ordered</h3>
                <div className="space-y-2">
                  {selectedInvoice.tests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 flex-1">
                        <FlaskConical className="w-4 h-4 text-primary" />
                        <span className="font-medium">{test.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Qty: {test.quantity}</p>
                        <p className="font-semibold">₦{(test.price * test.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Financial Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Financial Summary</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">Subtotal</Label>
                    <p className="font-semibold">₦{selectedInvoice.subtotal.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">Discount</Label>
                    <p className="font-semibold text-red-600">-₦{selectedInvoice.discount.toLocaleString()}</p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Total Amount</Label>
                    <p className="font-bold text-2xl text-primary">₦{selectedInvoice.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {selectedInvoice.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Notes</h3>
                    <p className="text-sm text-muted-foreground">{selectedInvoice.notes}</p>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={handleDownloadInvoice}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => selectedInvoice && handlePrintInvoice(selectedInvoice)}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this invoice?
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-red-800">⚠️ Warning</p>
              <p className="text-sm text-red-700">
                This action cannot be undone. The invoice will be permanently removed from the system.
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Invoice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
