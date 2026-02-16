import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Search,
  Download,
  Filter,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Phone,
  Calendar,
  Building,
  Pill,
  Plus,
  X,
  ShoppingCart,
  RotateCcw,
  FileSpreadsheet,
  Package
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useEMRStore } from '@/app/emr/store/emr-store';
import { usePharmacyStore } from '@/app/emr/store/pharmacy-store';
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
import { ScrollArea } from '@/app/components/ui/scroll-area';

interface KPICardProps {
  title: string;
  value: number;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
  tooltip?: string;
}

interface PrescribedDrug {
  drugId: string;
  name: string;
  dosage: string;
  quantity: number;
  duration: string;
  instructions: string;
}

interface Prescription {
  id: string;
  prescriptionId: string;
  fileNumber: string;
  patientName: string;
  patientPhone: string;
  patientAge: string;
  patientGender: string;
  patientType: 'IPD' | 'OPD';
  prescribedDrugs: PrescribedDrug[];
  prescribedBy: string;
  prescriptionDate: string;
  status: 'Pending' | 'Processing' | 'Ready';
  notes?: string;
}

interface Drug {
  id: string;
  drugId: string;
  name: string;
  price: number;
  quantity: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired';
}

interface SelectedDrug {
  drugId: string;
  name: string;
  price: number;
  quantityPrescribed: number;
  quantityDispensed: number;
  available: number;
}

// Mock prescriptions data
const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    prescriptionId: 'RX-001',
    fileNumber: 'GH-2025-001',
    patientName: 'Aisha Mohammed',
    patientPhone: '+234 803 456 7890',
    patientAge: '34',
    patientGender: 'Female',
    patientType: 'OPD',
    prescribedDrugs: [
      { drugId: 'D-001', name: 'Paracetamol 500mg', dosage: '500mg', quantity: 20, duration: '5 days', instructions: 'Take 2 tablets every 8 hours' },
      { drugId: 'D-003', name: 'Ibuprofen 400mg', dosage: '400mg', quantity: 15, duration: '5 days', instructions: 'Take 1 tablet every 12 hours after meals' },
    ],
    prescribedBy: 'Dr. Kabir Ahmed',
    prescriptionDate: '2025-02-13',
    status: 'Pending',
    notes: 'Patient has fever and body pain'
  },
  {
    id: '2',
    prescriptionId: 'RX-002',
    fileNumber: 'GH-2025-002',
    patientName: 'Ibrahim Usman',
    patientPhone: '+234 806 123 4567',
    patientAge: '45',
    patientGender: 'Male',
    patientType: 'IPD',
    prescribedDrugs: [
      { drugId: 'D-002', name: 'Amoxicillin 250mg', dosage: '250mg', quantity: 30, duration: '10 days', instructions: 'Take 1 capsule every 8 hours' },
      { drugId: 'D-005', name: 'Metformin 500mg', dosage: '500mg', quantity: 60, duration: '30 days', instructions: 'Take 1 tablet twice daily with meals' },
    ],
    prescribedBy: 'Dr. Fatima Bello',
    prescriptionDate: '2025-02-12',
    status: 'Pending',
    notes: 'Diabetic patient with respiratory infection'
  },
  {
    id: '3',
    prescriptionId: 'RX-003',
    fileNumber: 'GH-2025-003',
    patientName: 'Fatima Sani',
    patientPhone: '+234 805 987 6543',
    patientAge: '52',
    patientGender: 'Female',
    patientType: 'OPD',
    prescribedDrugs: [
      { drugId: 'D-016', name: 'Losartan 50mg', dosage: '50mg', quantity: 30, duration: '30 days', instructions: 'Take 1 tablet daily in the morning' },
      { drugId: 'D-020', name: 'Amlodipine 5mg', dosage: '5mg', quantity: 30, duration: '30 days', instructions: 'Take 1 tablet daily in the evening' },
    ],
    prescribedBy: 'Dr. Musa Ibrahim',
    prescriptionDate: '2025-02-11',
    status: 'Processing',
    notes: 'Hypertensive patient - monitor BP regularly'
  },
  {
    id: '4',
    prescriptionId: 'RX-004',
    fileNumber: 'GH-2025-004',
    patientName: 'Musa Bello',
    patientPhone: '+234 807 234 5678',
    patientAge: '28',
    patientGender: 'Male',
    patientType: 'OPD',
    prescribedDrugs: [
      { drugId: 'D-007', name: 'Cetirizine 10mg', dosage: '10mg', quantity: 10, duration: '10 days', instructions: 'Take 1 tablet daily at bedtime' },
    ],
    prescribedBy: 'Dr. Zainab Ali',
    prescriptionDate: '2025-02-13',
    status: 'Pending',
    notes: 'Allergic reaction'
  },
  {
    id: '5',
    prescriptionId: 'RX-005',
    fileNumber: 'GH-2025-005',
    patientName: 'Zainab Ahmad',
    patientPhone: '+234 808 345 6789',
    patientAge: '29',
    patientGender: 'Female',
    patientType: 'IPD',
    prescribedDrugs: [
      { drugId: 'D-012', name: 'Vitamin B Complex', dosage: '1 tablet', quantity: 30, duration: '30 days', instructions: 'Take 1 tablet daily after breakfast' },
      { drugId: 'D-013', name: 'Prednisolone 5mg', dosage: '5mg', quantity: 20, duration: '10 days', instructions: 'Take 2 tablets daily for 5 days, then 1 daily for 5 days' },
    ],
    prescribedBy: 'Dr. Kabir Ahmed',
    prescriptionDate: '2025-02-10',
    status: 'Ready',
    notes: 'Post-operative care'
  },
];

// Mock drugs inventory
const mockDrugs: Drug[] = [
  { id: '1', drugId: 'D-001', name: 'Paracetamol 500mg', price: 50, quantity: 450, status: 'In Stock' },
  { id: '2', drugId: 'D-002', name: 'Amoxicillin 250mg', price: 150, quantity: 280, status: 'In Stock' },
  { id: '3', drugId: 'D-003', name: 'Ibuprofen 400mg', price: 75, quantity: 320, status: 'In Stock' },
  { id: '4', drugId: 'D-004', name: 'Omeprazole 20mg', price: 200, quantity: 0, status: 'Out of Stock' },
  { id: '5', drugId: 'D-005', name: 'Metformin 500mg', price: 120, quantity: 500, status: 'In Stock' },
  { id: '6', drugId: 'D-006', name: 'Ciprofloxacin 500mg', price: 180, quantity: 5, status: 'Expired' },
  { id: '7', drugId: 'D-007', name: 'Cetirizine 10mg', price: 60, quantity: 600, status: 'In Stock' },
  { id: '8', drugId: 'D-008', name: 'Lisinopril 10mg', price: 160, quantity: 35, status: 'Expired' },
  { id: '9', drugId: 'D-009', name: 'Atorvastatin 20mg', price: 250, quantity: 180, status: 'In Stock' },
  { id: '10', drugId: 'D-010', name: 'Azithromycin 500mg', price: 300, quantity: 150, status: 'In Stock' },
  { id: '11', drugId: 'D-011', name: 'Diclofenac 50mg', price: 80, quantity: 40, status: 'Low Stock' },
  { id: '12', drugId: 'D-012', name: 'Vitamin B Complex', price: 100, quantity: 380, status: 'In Stock' },
  { id: '13', drugId: 'D-013', name: 'Prednisolone 5mg', price: 90, quantity: 220, status: 'In Stock' },
  { id: '14', drugId: 'D-014', name: 'Levothyroxine 50mcg', price: 140, quantity: 190, status: 'In Stock' },
  { id: '15', drugId: 'D-015', name: 'Salbutamol Inhaler', price: 350, quantity: 45, status: 'Low Stock' },
  { id: '16', drugId: 'D-016', name: 'Losartan 50mg', price: 170, quantity: 260, status: 'In Stock' },
  { id: '17', drugId: 'D-017', name: 'Insulin Glargine', price: 2500, quantity: 25, status: 'Low Stock' },
  { id: '18', drugId: 'D-018', name: 'Multivitamin Syrup', price: 180, quantity: 120, status: 'In Stock' },
  { id: '19', drugId: 'D-019', name: 'Hydrocortisone Cream', price: 220, quantity: 85, status: 'In Stock' },
  { id: '20', drugId: 'D-020', name: 'Amlodipine 5mg', price: 130, quantity: 310, status: 'In Stock' },
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
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-foreground">{displayValue}</h3>
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

export function PendingPrescriptionsPanel() {
  const { addNotification } = useEMRStore();

  // State
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [drugs] = useState<Drug[]>(mockDrugs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<SelectedDrug[]>([]);

  // Calculate KPIs
  const totalPrescriptions = prescriptions.length;
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending').length;
  const processingPrescriptions = prescriptions.filter(p => p.status === 'Processing').length;
  const readyPrescriptions = prescriptions.filter(p => p.status === 'Ready').length;

  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch = prescription.prescriptionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.fileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    const matchesDate = !dateFilter || prescription.prescriptionDate === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
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
    setStatusFilter('all');
    setDateFilter('');
    setCurrentPage(1);
    toast.info('Filters Reset', {
      description: 'All filters have been cleared.',
    });
  };

  // Open view modal
  const openViewModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    
    // Auto-populate selected drugs from prescription
    const autoSelectedDrugs: SelectedDrug[] = prescription.prescribedDrugs.map(pd => {
      const drug = drugs.find(d => d.drugId === pd.drugId);
      return {
        drugId: pd.drugId,
        name: pd.name,
        price: drug?.price || 0,
        quantityPrescribed: pd.quantity,
        quantityDispensed: pd.quantity,
        available: drug?.quantity || 0,
      };
    });
    
    setSelectedDrugs(autoSelectedDrugs);
    setViewModalOpen(true);
  };

  // Update dispensed quantity
  const handleUpdateDispensedQuantity = (drugId: string, quantity: number) => {
    const drug = selectedDrugs.find(d => d.drugId === drugId);
    if (!drug) return;

    if (quantity < 1) {
      toast.error('Invalid Quantity', {
        description: 'Quantity must be at least 1.',
      });
      return;
    }

    if (quantity > drug.quantityPrescribed) {
      toast.error('Exceeds Prescribed Quantity', {
        description: `Cannot dispense more than ${drug.quantityPrescribed} units.`,
      });
      return;
    }

    if (quantity > drug.available) {
      toast.error('Insufficient Stock', {
        description: `Only ${drug.available} units available in inventory.`,
      });
      return;
    }

    setSelectedDrugs(prev =>
      prev.map(d => d.drugId === drugId ? { ...d, quantityDispensed: quantity } : d)
    );
  };

  // Submit prescription - Send to cashier queue
  const handleSubmitPrescription = () => {
    if (!selectedPrescription) return;

    // Check stock availability for all drugs
    const insufficientStock = selectedDrugs.find(sd => sd.quantityDispensed > sd.available);
    if (insufficientStock) {
      toast.error('Insufficient Stock', {
        description: `${insufficientStock.name} - Only ${insufficientStock.available} units available.`,
      });
      return;
    }

    // Check for out of stock or expired drugs
    const unavailableDrugs = selectedDrugs.filter(sd => {
      const drug = drugs.find(d => d.drugId === sd.drugId);
      return drug && (drug.status === 'Out of Stock' || drug.status === 'Expired');
    });

    if (unavailableDrugs.length > 0) {
      toast.error('Drugs Unavailable', {
        description: `Some drugs are out of stock or expired. Please review the prescription.`,
      });
      return;
    }

    // Calculate total cost
    const totalCost = selectedDrugs.reduce((sum, sd) => sum + (sd.price * sd.quantityDispensed), 0);

    // Update prescription status to Processing (sent to cashier queue)
    setPrescriptions(prev =>
      prev.map(p =>
        p.id === selectedPrescription.id
          ? { ...p, status: 'Processing' as const }
          : p
      )
    );

    toast.success('Prescription Submitted', {
      description: `${selectedPrescription.prescriptionId} sent to cashier queue - Total: ₦${totalCost.toLocaleString()}`,
    });

    // Add notifications
    addNotification({
      id: Date.now(),
      title: 'Prescription Submitted',
      message: `${selectedPrescription.prescriptionId} for ${selectedPrescription.patientName} sent to cashier - ₦${totalCost.toLocaleString()}`,
      type: 'success',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'High',
    });

    addNotification({
      id: Date.now() + 1,
      title: 'Inventory Updated',
      message: `${selectedDrugs.length} drugs dispensed from inventory`,
      type: 'info',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Medium',
    });

    // Check for low stock alerts
    selectedDrugs.forEach(sd => {
      const drug = drugs.find(d => d.drugId === sd.drugId);
      if (drug && drug.quantity - sd.quantityDispensed < 50) {
        addNotification({
          id: Date.now() + Math.random(),
          title: 'Low Stock Alert',
          message: `${drug.name} is running low after dispensing`,
          type: 'warning',
          status: 'Unread',
          timestamp: new Date().toISOString(),
          priority: 'High',
        });
      }
    });

    setViewModalOpen(false);
    setSelectedPrescription(null);
    setSelectedDrugs([]);
  };

  // Export as CSV
  const exportAsCSV = () => {
    const headers = ['Prescription ID', 'File Number', 'Patient Name', 'Prescribed Drugs', 'Date', 'Status', 'Prescribed By'];
    const csvData = filteredPrescriptions.map(prescription => [
      prescription.prescriptionId,
      prescription.fileNumber,
      prescription.patientName,
      prescription.prescribedDrugs.map(d => d.name).join('; '),
      prescription.prescriptionDate,
      prescription.status,
      prescription.prescribedBy
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending-prescriptions-${new Date().toISOString().split('T')[0]}.csv`;
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

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Processing':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
      case 'Ready':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Ready
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Pending Prescriptions</h1>
        <p className="text-muted-foreground">Review and dispense prescribed medications</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Prescriptions" 
          value={totalPrescriptions} 
          icon={ClipboardList} 
          trend="up"
          trendValue="+12 this week"
          color="primary"
          tooltip="Total pending prescriptions"
        />
        <KPICard 
          title="Pending" 
          value={pendingPrescriptions} 
          icon={Clock} 
          trend="neutral"
          trendValue="Awaiting review"
          color="warning"
          tooltip="Prescriptions waiting to be processed"
        />
        <KPICard 
          title="Processing" 
          value={processingPrescriptions} 
          icon={AlertCircle} 
          trend="up"
          trendValue="In progress"
          color="primary"
          tooltip="Prescriptions currently being prepared"
        />
        <KPICard 
          title="Ready" 
          value={readyPrescriptions} 
          icon={CheckCircle2} 
          trend="up"
          trendValue="Ready for pickup"
          color="secondary"
          tooltip="Prescriptions ready for dispensing"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filters
          </CardTitle>
          <CardDescription>Search and filter prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="mb-2 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, file number, patient..."
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Date</Label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
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
              <CardTitle className="text-xl">Prescriptions List</CardTitle>
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
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">File Number</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Patient Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Prescribed Drugs</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
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
                        <p className="font-semibold text-sm text-primary">{prescription.prescriptionId}</p>
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
                        <ScrollArea className="h-20 w-64">
                          <div className="space-y-1">
                            {prescription.prescribedDrugs.map((drug, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <Pill className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-semibold">{drug.name}</p>
                                  <p className="text-muted-foreground">Qty: {drug.quantity} • {drug.duration}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-semibold">{new Date(prescription.prescriptionDate).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">{prescription.prescribedBy}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(prescription.status)}
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
                              <TooltipContent>View & Dispense</TooltipContent>
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
                <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold text-muted-foreground mb-2">No prescriptions found</p>
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

      {/* View & Dispense Prescription Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-[1400px] w-[90vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <FileText className="w-6 h-6 text-primary" />
              Prescription Details & Dispensing
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Review prescription information, select drugs to dispense, and submit to cashier for payment
            </DialogDescription>
          </DialogHeader>

          {selectedPrescription && (
            <div className="space-y-6 py-6">
              {/* TOP SECTION - Patient & Prescription Info (2 Columns) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Information */}
                <Card className="border-2">
                  <CardHeader className="pb-4 bg-blue-50/50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Patient Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">File Number</Label>
                        <p className="font-bold text-base text-primary">{selectedPrescription.fileNumber}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Patient Type</Label>
                        <Badge 
                          variant="outline" 
                          className={`text-sm px-3 py-1.5 ${selectedPrescription.patientType === 'IPD' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-green-100 text-green-700 border-green-300'}`}
                        >
                          {selectedPrescription.patientType}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Patient Name</Label>
                      <p className="font-semibold text-lg">{selectedPrescription.patientName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Age</Label>
                        <p className="font-semibold">{selectedPrescription.patientAge} years</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Gender</Label>
                        <p className="font-semibold">{selectedPrescription.patientGender}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Phone</Label>
                      <p className="font-semibold">{selectedPrescription.patientPhone}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Prescription Details */}
                <Card className="border-2">
                  <CardHeader className="pb-4 bg-green-50/50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-secondary" />
                      Prescription Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5 space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Prescription ID</Label>
                      <p className="font-bold text-base text-secondary">{selectedPrescription.prescriptionId}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Prescribed By</Label>
                      <p className="font-semibold text-base">{selectedPrescription.prescribedBy}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Prescription Date</Label>
                      <p className="font-semibold">{new Date(selectedPrescription.prescriptionDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Status</Label>
                      <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 text-sm px-3 py-1.5">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Dispensing
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Total Medications</Label>
                      <p className="font-bold text-lg">{selectedPrescription.prescribedDrugs.length} drugs prescribed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Prescribed Medications (Full Width) */}
              <Card className="border-2">
                <CardHeader className="pb-4 bg-purple-50/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-600" />
                    Prescribed Medications
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedPrescription.prescribedDrugs.map((drug, idx) => (
                      <div key={idx} className="p-4 border rounded-lg bg-white hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base mb-1">{drug.name}</p>
                            <p className="text-sm text-muted-foreground">{drug.dosage}</p>
                          </div>
                          <Badge variant="outline" className="text-xs px-2 py-0.5 shrink-0">
                            {drug.quantity} units
                          </Badge>
                        </div>
                        <div className="space-y-1.5 text-xs text-muted-foreground">
                          <p><span className="font-medium text-foreground">Duration:</span> {drug.duration}</p>
                          <p><span className="font-medium text-foreground">Instructions:</span> {drug.instructions}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Clinical Notes (if available) */}
              {selectedPrescription.notes && (
                <Card className="border-2 border-blue-200 bg-blue-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Clinical Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed p-4 bg-white rounded-lg border">{selectedPrescription.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Drugs to Dispense Section */}
              <Card className="border-2 border-primary/30">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Package className="w-6 h-6 text-primary" />
                        Drugs to Dispense
                      </CardTitle>
                      <CardDescription className="mt-1 text-base">
                        Review drug availability, adjust quantities, and confirm dispensing details
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-base px-4 py-2 bg-white">
                      {selectedDrugs.length} drugs selected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {selectedDrugs.map((drug, index) => {
                      const inventoryDrug = drugs.find(d => d.drugId === drug.drugId);
                      const isAvailable = inventoryDrug && inventoryDrug.status === 'In Stock';
                      const isLowStock = inventoryDrug && inventoryDrug.status === 'Low Stock';
                      const isOutOfStock = inventoryDrug && (inventoryDrug.status === 'Out of Stock' || inventoryDrug.status === 'Expired');

                      return (
                        <div 
                          key={drug.drugId} 
                          className={`p-5 border-2 rounded-xl transition-all ${
                            isOutOfStock 
                              ? 'bg-red-50/50 border-red-300' 
                              : isLowStock 
                                ? 'bg-orange-50/50 border-orange-300' 
                                : 'bg-green-50/50 border-green-300'
                          }`}
                        >
                          <div className="flex items-start gap-6">
                            {/* Drug Number Badge */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-bold text-primary">{index + 1}</span>
                              </div>
                            </div>

                            {/* Drug Details - Grid Layout */}
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
                              {/* Drug Info - 4 columns */}
                              <div className="lg:col-span-4 space-y-2">
                                <div>
                                  <Label className="text-xs text-muted-foreground mb-1 block">Drug Name</Label>
                                  <p className="font-bold text-base">{drug.name}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs px-2.5 py-1 ${
                                      isOutOfStock 
                                        ? 'bg-red-100 text-red-700 border-red-300' 
                                        : isLowStock 
                                          ? 'bg-orange-100 text-orange-700 border-orange-300' 
                                          : 'bg-green-100 text-green-700 border-green-300'
                                    }`}
                                  >
                                    Available: {drug.available}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 border-blue-300">
                                    Prescribed: {drug.quantityPrescribed}
                                  </Badge>
                                </div>
                                {isOutOfStock && (
                                  <p className="text-xs text-destructive font-semibold flex items-center gap-1.5 mt-2">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Out of Stock - Cannot Dispense
                                  </p>
                                )}
                                {isLowStock && (
                                  <p className="text-xs text-orange-700 font-semibold flex items-center gap-1.5 mt-2">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Low Stock Warning
                                  </p>
                                )}
                              </div>

                              {/* Unit Price - 2 columns */}
                              <div className="lg:col-span-2">
                                <Label className="text-xs text-muted-foreground mb-1 block">Unit Price</Label>
                                <p className="font-bold text-lg text-primary">₦{drug.price.toLocaleString()}</p>
                              </div>

                              {/* Quantity Input - 3 columns */}
                              <div className="lg:col-span-3">
                                <Label className="text-xs text-muted-foreground mb-2 block">Quantity to Dispense</Label>
                                <Input
                                  type="number"
                                  value={drug.quantityDispensed}
                                  onChange={(e) => handleUpdateDispensedQuantity(drug.drugId, parseInt(e.target.value) || 0)}
                                  min={1}
                                  max={Math.min(drug.quantityPrescribed, drug.available)}
                                  disabled={isOutOfStock}
                                  className={`h-12 text-base font-semibold text-center ${
                                    isOutOfStock ? 'bg-red-100 cursor-not-allowed' : 'bg-white'
                                  }`}
                                />
                              </div>

                              {/* Subtotal - 3 columns */}
                              <div className="lg:col-span-3 text-right">
                                <Label className="text-xs text-muted-foreground mb-1 block">Subtotal</Label>
                                <p className="font-bold text-2xl text-primary">
                                  ₦{(drug.price * drug.quantityDispensed).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Summary Section */}
              <Card className="border-4 border-primary/40 bg-gradient-to-br from-blue-50 via-white to-green-50">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center p-4 bg-white rounded-xl border-2 border-blue-200">
                      <Label className="text-sm text-muted-foreground mb-2 block">Total Drugs</Label>
                      <p className="text-3xl font-bold text-blue-600">{selectedDrugs.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">medications</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl border-2 border-green-200">
                      <Label className="text-sm text-muted-foreground mb-2 block">Total Units</Label>
                      <p className="text-3xl font-bold text-green-600">
                        {selectedDrugs.reduce((sum, d) => sum + d.quantityDispensed, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">units to dispense</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl border-2 border-purple-200">
                      <Label className="text-sm text-muted-foreground mb-2 block">Available Drugs</Label>
                      <p className="text-3xl font-bold text-purple-600">
                        {selectedDrugs.filter(d => {
                          const inv = drugs.find(drug => drug.drugId === d.drugId);
                          return inv && inv.status === 'In Stock';
                        }).length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">in stock</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-primary to-secondary rounded-xl border-4 border-primary/50 shadow-lg">
                      <Label className="text-sm text-white/90 mb-2 block font-semibold">TOTAL COST</Label>
                      <p className="text-4xl font-bold text-white drop-shadow-lg">
                        ₦{selectedDrugs.reduce((sum, d) => sum + (d.price * d.quantityDispensed), 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-white/80 mt-2">to be paid at cashier</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="gap-4 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setViewModalOpen(false);
                setSelectedPrescription(null);
                setSelectedDrugs([]);
              }} 
              className="px-10 h-12 text-base"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitPrescription} 
              className="bg-primary hover:bg-primary/90 px-10 h-12 text-base font-semibold"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Submit to Cashier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}