import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pill, 
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Edit,
  Trash2,
  Search,
  Download,
  Plus,
  X,
  AlertTriangle,
  Package,
  DollarSign,
  Calendar,
  Filter,
  FileText,
  CheckCircle2,
  XCircle,
  PackageX,
  PackageCheck,
  RotateCcw
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Separator } from '@/app/components/ui/separator';
import { Textarea } from '@/app/components/ui/textarea';

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

interface Drug {
  id: string;
  drugId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  reorderLevel: number;
  expiryDate: string;
  batchNumber: string;
  manufacturer: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired';
  description?: string;
  lastRestocked?: string;
}

// Mock data for drugs
const mockDrugs: Drug[] = [
  { id: '1', drugId: 'D-001', name: 'Paracetamol 500mg', category: 'Analgesic', price: 50, quantity: 450, reorderLevel: 100, expiryDate: '2026-12-31', batchNumber: 'PA-2024-001', manufacturer: 'PharmaCo Ltd', status: 'In Stock', description: 'Pain reliever and fever reducer', lastRestocked: '2025-01-15' },
  { id: '2', drugId: 'D-002', name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 150, quantity: 280, reorderLevel: 80, expiryDate: '2026-08-15', batchNumber: 'AM-2024-002', manufacturer: 'BioMed Inc', status: 'In Stock', description: 'Broad-spectrum antibiotic', lastRestocked: '2025-01-10' },
  { id: '3', drugId: 'D-003', name: 'Ibuprofen 400mg', category: 'Analgesic', price: 75, quantity: 320, reorderLevel: 100, expiryDate: '2026-10-20', batchNumber: 'IB-2024-003', manufacturer: 'HealthPlus', status: 'In Stock', description: 'Anti-inflammatory pain reliever', lastRestocked: '2025-01-20' },
  { id: '4', drugId: 'D-004', name: 'Omeprazole 20mg', category: 'Antacid', price: 200, quantity: 0, reorderLevel: 50, expiryDate: '2027-03-10', batchNumber: 'OM-2024-004', manufacturer: 'MediCare Pharma', status: 'Out of Stock', description: 'Proton pump inhibitor', lastRestocked: '2024-12-01' },
  { id: '5', drugId: 'D-005', name: 'Metformin 500mg', category: 'Antidiabetic', price: 120, quantity: 500, reorderLevel: 100, expiryDate: '2026-05-25', batchNumber: 'MF-2024-005', manufacturer: 'DiabCare Ltd', status: 'In Stock', description: 'Type 2 diabetes medication', lastRestocked: '2025-02-01' },
  { id: '6', drugId: 'D-006', name: 'Ciprofloxacin 500mg', category: 'Antibiotic', price: 180, quantity: 5, reorderLevel: 60, expiryDate: '2025-01-15', batchNumber: 'CP-2024-006', manufacturer: 'AntiBio Pharma', status: 'Expired', description: 'Fluoroquinolone antibiotic', lastRestocked: '2024-06-15' },
  { id: '7', drugId: 'D-007', name: 'Cetirizine 10mg', category: 'Antihistamine', price: 60, quantity: 600, reorderLevel: 100, expiryDate: '2027-02-28', batchNumber: 'CT-2024-007', manufacturer: 'AllergyCare', status: 'In Stock', description: 'Antihistamine for allergies', lastRestocked: '2025-01-25' },
  { id: '8', drugId: 'D-008', name: 'Lisinopril 10mg', category: 'Antihypertensive', price: 160, quantity: 35, reorderLevel: 70, expiryDate: '2025-01-10', batchNumber: 'LS-2024-008', manufacturer: 'CardioMed', status: 'Expired', description: 'ACE inhibitor for hypertension', lastRestocked: '2024-07-01' },
  { id: '9', drugId: 'D-009', name: 'Atorvastatin 20mg', category: 'Statin', price: 250, quantity: 180, reorderLevel: 80, expiryDate: '2026-11-30', batchNumber: 'AT-2024-009', manufacturer: 'LipidCare', status: 'In Stock', description: 'Cholesterol-lowering medication', lastRestocked: '2025-01-18' },
  { id: '10', drugId: 'D-010', name: 'Azithromycin 500mg', category: 'Antibiotic', price: 300, quantity: 150, reorderLevel: 60, expiryDate: '2026-09-15', batchNumber: 'AZ-2024-010', manufacturer: 'MacroMed', status: 'In Stock', description: 'Macrolide antibiotic', lastRestocked: '2025-02-05' },
  { id: '11', drugId: 'D-011', name: 'Diclofenac 50mg', category: 'NSAID', price: 80, quantity: 40, reorderLevel: 100, expiryDate: '2026-07-20', batchNumber: 'DC-2024-011', manufacturer: 'PainRelief Inc', status: 'Low Stock', description: 'Non-steroidal anti-inflammatory', lastRestocked: '2024-12-15' },
  { id: '12', drugId: 'D-012', name: 'Vitamin B Complex', category: 'Supplement', price: 100, quantity: 380, reorderLevel: 150, expiryDate: '2027-01-15', batchNumber: 'VB-2024-012', manufacturer: 'VitaHealth', status: 'In Stock', description: 'B vitamin supplement', lastRestocked: '2025-01-30' },
  { id: '13', drugId: 'D-013', name: 'Prednisolone 5mg', category: 'Steroid', price: 90, quantity: 220, reorderLevel: 100, expiryDate: '2026-06-30', batchNumber: 'PR-2024-013', manufacturer: 'SteroMed', status: 'In Stock', description: 'Corticosteroid medication', lastRestocked: '2025-01-12' },
  { id: '14', drugId: 'D-014', name: 'Levothyroxine 50mcg', category: 'Thyroid', price: 140, quantity: 190, reorderLevel: 80, expiryDate: '2026-12-20', batchNumber: 'LV-2024-014', manufacturer: 'ThyroMed', status: 'In Stock', description: 'Thyroid hormone replacement', lastRestocked: '2025-02-08' },
  { id: '15', drugId: 'D-015', name: 'Salbutamol Inhaler', category: 'Bronchodilator', price: 350, quantity: 45, reorderLevel: 50, expiryDate: '2026-08-30', batchNumber: 'SB-2024-015', manufacturer: 'RespiroMed', status: 'Low Stock', description: 'Fast-acting bronchodilator', lastRestocked: '2024-12-20' },
  { id: '16', drugId: 'D-016', name: 'Losartan 50mg', category: 'Antihypertensive', price: 170, quantity: 260, reorderLevel: 100, expiryDate: '2026-10-25', batchNumber: 'LT-2024-016', manufacturer: 'CardioPlus', status: 'In Stock', description: 'Angiotensin receptor blocker', lastRestocked: '2025-01-28' },
  { id: '17', drugId: 'D-017', name: 'Insulin Glargine', category: 'Antidiabetic', price: 2500, quantity: 25, reorderLevel: 30, expiryDate: '2025-12-31', batchNumber: 'IN-2024-017', manufacturer: 'DiabCare Pro', status: 'Low Stock', description: 'Long-acting insulin', lastRestocked: '2024-11-15' },
  { id: '18', drugId: 'D-018', name: 'Multivitamin Syrup', category: 'Supplement', price: 180, quantity: 120, reorderLevel: 80, expiryDate: '2026-09-10', batchNumber: 'MV-2024-018', manufacturer: 'KidsHealth', status: 'In Stock', description: 'Multivitamin for children', lastRestocked: '2025-02-02' },
  { id: '19', drugId: 'D-019', name: 'Hydrocortisone Cream', category: 'Topical', price: 220, quantity: 85, reorderLevel: 60, expiryDate: '2026-11-15', batchNumber: 'HC-2024-019', manufacturer: 'DermaCare', status: 'In Stock', description: 'Topical corticosteroid', lastRestocked: '2025-01-22' },
  { id: '20', drugId: 'D-020', name: 'Amlodipine 5mg', category: 'Antihypertensive', price: 130, quantity: 310, reorderLevel: 120, expiryDate: '2027-03-20', batchNumber: 'AM-2024-020', manufacturer: 'HyperCare', status: 'In Stock', description: 'Calcium channel blocker', lastRestocked: '2025-02-10' },
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
                      backgroundColor: color === 'primary' ? '#1e40af15' : color === 'secondary' ? '#05966915' : color === 'destructive' ? '#dc262615' : '#f5900b15'
                    }}
                  >
                    <Icon 
                      className="w-6 h-6"
                      style={{
                        color: color === 'primary' ? '#1e40af' : color === 'secondary' ? '#059669' : color === 'destructive' ? '#dc2626' : '#f59e0b'
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

export function DrugsPanel() {
  const { addNotification } = useEMRStore();

  // State
  const [drugs, setDrugs] = useState<Drug[]>(mockDrugs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expiryDateFrom, setExpiryDateFrom] = useState('');
  const [expiryDateTo, setExpiryDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    reorderLevel: '',
    expiryDate: '',
    batchNumber: '',
    manufacturer: '',
    description: '',
  });

  // Calculate KPIs
  const totalDrugs = drugs.length;
  const inStockDrugs = drugs.filter(d => d.status === 'In Stock').length;
  const lowStockDrugs = drugs.filter(d => d.status === 'Low Stock').length;
  const outOfStockDrugs = drugs.filter(d => d.status === 'Out of Stock').length;
  const expiredDrugs = drugs.filter(d => d.status === 'Expired').length;
  const totalInventoryValue = drugs.reduce((sum, d) => sum + (d.price * d.quantity), 0);

  // Filter drugs
  const filteredDrugs = drugs.filter((drug) => {
    const matchesSearch = drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         drug.drugId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         drug.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || drug.status === statusFilter;
    
    let matchesExpiry = true;
    if (expiryDateFrom || expiryDateTo) {
      const drugExpiry = new Date(drug.expiryDate);
      if (expiryDateFrom) {
        matchesExpiry = matchesExpiry && drugExpiry >= new Date(expiryDateFrom);
      }
      if (expiryDateTo) {
        matchesExpiry = matchesExpiry && drugExpiry <= new Date(expiryDateTo);
      }
    }
    
    return matchesSearch && matchesStatus && matchesExpiry;
  });

  // Paginate
  const totalPages = Math.ceil(filteredDrugs.length / itemsPerPage);
  const paginatedDrugs = filteredDrugs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setExpiryDateFrom('');
    setExpiryDateTo('');
    setCurrentPage(1);
    toast.info('Filters Reset', {
      description: 'All filters have been cleared.',
    });
  };

  // Handle add drug
  const handleAddDrug = () => {
    if (!formData.name || !formData.category || !formData.price || !formData.quantity || !formData.expiryDate) {
      toast.error('Validation Error', {
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const newDrug: Drug = {
      id: String(drugs.length + 1),
      drugId: `D-${String(drugs.length + 1).padStart(3, '0')}`,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      reorderLevel: parseInt(formData.reorderLevel) || 50,
      expiryDate: formData.expiryDate,
      batchNumber: formData.batchNumber || `BATCH-${Date.now()}`,
      manufacturer: formData.manufacturer || 'Unknown',
      status: parseInt(formData.quantity) === 0 ? 'Out of Stock' : parseInt(formData.quantity) < (parseInt(formData.reorderLevel) || 50) ? 'Low Stock' : 'In Stock',
      description: formData.description,
      lastRestocked: new Date().toISOString().split('T')[0],
    };

    setDrugs([...drugs, newDrug]);
    setAddModalOpen(false);
    resetForm();

    toast.success('Drug Added', {
      description: `${newDrug.name} has been added to inventory.`,
    });

    addNotification({
      id: Date.now(),
      title: 'New Drug Added',
      message: `${newDrug.name} added to inventory - ${newDrug.quantity} units`,
      type: 'success',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Medium',
    });
  };

  // Handle edit drug
  const handleEditDrug = () => {
    if (!selectedDrug || !formData.name || !formData.category || !formData.price || !formData.quantity || !formData.expiryDate) {
      toast.error('Validation Error', {
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const updatedDrug: Drug = {
      ...selectedDrug,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      reorderLevel: parseInt(formData.reorderLevel) || 50,
      expiryDate: formData.expiryDate,
      batchNumber: formData.batchNumber || selectedDrug.batchNumber,
      manufacturer: formData.manufacturer || selectedDrug.manufacturer,
      status: new Date(formData.expiryDate) < new Date() ? 'Expired' : parseInt(formData.quantity) === 0 ? 'Out of Stock' : parseInt(formData.quantity) < (parseInt(formData.reorderLevel) || 50) ? 'Low Stock' : 'In Stock',
      description: formData.description,
    };

    setDrugs(drugs.map(d => d.id === selectedDrug.id ? updatedDrug : d));
    setEditModalOpen(false);
    setSelectedDrug(null);
    resetForm();

    toast.success('Drug Updated', {
      description: `${updatedDrug.name} has been updated successfully.`,
    });

    addNotification({
      id: Date.now(),
      title: 'Drug Updated',
      message: `${updatedDrug.name} inventory updated - ${updatedDrug.quantity} units`,
      type: 'info',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Low',
    });

    // Check for low stock alert
    if (updatedDrug.status === 'Low Stock') {
      addNotification({
        id: Date.now() + 1,
        title: 'Low Stock Alert',
        message: `${updatedDrug.name} is below reorder level`,
        type: 'warning',
        status: 'Unread',
        timestamp: new Date().toISOString(),
        priority: 'High',
      });
    }
  };

  // Handle delete drug
  const handleDeleteDrug = () => {
    if (!selectedDrug) return;

    setDrugs(drugs.filter(d => d.id !== selectedDrug.id));
    setDeleteDialogOpen(false);

    toast.success('Drug Deleted', {
      description: `${selectedDrug.name} has been removed from inventory.`,
    });

    addNotification({
      id: Date.now(),
      title: 'Drug Deleted',
      message: `${selectedDrug.name} removed from inventory`,
      type: 'warning',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Medium',
    });

    setSelectedDrug(null);
  };

  // Open edit modal
  const openEditModal = (drug: Drug) => {
    setSelectedDrug(drug);
    setFormData({
      name: drug.name,
      category: drug.category,
      price: String(drug.price),
      quantity: String(drug.quantity),
      reorderLevel: String(drug.reorderLevel),
      expiryDate: drug.expiryDate,
      batchNumber: drug.batchNumber,
      manufacturer: drug.manufacturer,
      description: drug.description || '',
    });
    setEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (drug: Drug) => {
    setSelectedDrug(drug);
    setViewModalOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (drug: Drug) => {
    setSelectedDrug(drug);
    setDeleteDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
      reorderLevel: '',
      expiryDate: '',
      batchNumber: '',
      manufacturer: '',
      description: '',
    });
  };

  // Export as CSV
  const exportAsCSV = () => {
    const headers = ['Drug ID', 'Name', 'Category', 'Price', 'Quantity', 'Reorder Level', 'Expiry Date', 'Batch Number', 'Manufacturer', 'Status'];
    const csvData = filteredDrugs.map(drug => [
      drug.drugId,
      drug.name,
      drug.category,
      drug.price,
      drug.quantity,
      drug.reorderLevel,
      drug.expiryDate,
      drug.batchNumber,
      drug.manufacturer,
      drug.status
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drugs-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast.success('CSV Exported', {
      description: `${filteredDrugs.length} records exported successfully.`,
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
      case 'In Stock':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            In Stock
          </Badge>
        );
      case 'Low Stock':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Low Stock
          </Badge>
        );
      case 'Out of Stock':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <PackageX className="w-3 h-3 mr-1" />
            Out of Stock
          </Badge>
        );
      case 'Expired':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Drugs Inventory</h1>
          <p className="text-muted-foreground">Manage and track pharmaceutical inventory</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Drug
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Drugs" 
          value={totalDrugs} 
          icon={Pill} 
          trend="up"
          trendValue="+5 from last month"
          color="primary"
          tooltip="Total number of drugs in inventory"
        />
        <KPICard 
          title="In Stock" 
          value={inStockDrugs} 
          icon={PackageCheck} 
          trend="up"
          trendValue="Adequately stocked"
          color="secondary"
          tooltip="Drugs with sufficient stock"
        />
        <KPICard 
          title="Low Stock" 
          value={lowStockDrugs} 
          icon={AlertTriangle} 
          trend="down"
          trendValue="Requires attention"
          color="warning"
          tooltip="Drugs below reorder level"
        />
        <KPICard 
          title="Total Value" 
          value={totalInventoryValue} 
          icon={DollarSign} 
          trend="up"
          trendValue="+8% increase"
          color="primary"
          tooltip="Total inventory value"
          prefix="₦"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filters
          </CardTitle>
          <CardDescription>Search and filter drugs inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="mb-2 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, category..."
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
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Expiry From</Label>
              <Input
                type="date"
                value={expiryDateFrom}
                onChange={(e) => {
                  setExpiryDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div>
              <Label className="mb-2 block">Expiry To</Label>
              <Input
                type="date"
                value={expiryDateTo}
                onChange={(e) => {
                  setExpiryDateTo(e.target.value);
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

      {/* Drugs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Drugs List</CardTitle>
              <CardDescription>
                Showing {paginatedDrugs.length} of {filteredDrugs.length} drugs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Drug ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Expiry Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedDrugs.map((drug, index) => (
                    <motion.tr
                      key={drug.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-semibold text-sm text-primary">{drug.drugId}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-sm">{drug.name}</p>
                          <p className="text-xs text-muted-foreground">Batch: {drug.batchNumber}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">{drug.category}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-sm">₦{drug.price.toLocaleString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-sm">{drug.quantity}</p>
                          <p className="text-xs text-muted-foreground">Min: {drug.reorderLevel}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{new Date(drug.expiryDate).toLocaleDateString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(drug.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="ghost" onClick={() => openViewModal(drug)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="ghost" onClick={() => openEditModal(drug)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Drug</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => openDeleteDialog(drug)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete Drug</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {paginatedDrugs.length === 0 && (
              <div className="text-center py-12">
                <PackageX className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold text-muted-foreground mb-2">No drugs found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new drug</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • {filteredDrugs.length} total records
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

      {/* Add Drug Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Drug
            </DialogTitle>
            <DialogDescription>
              Add a new drug to the inventory system
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Drug Name *</Label>
                <Input
                  placeholder="e.g., Paracetamol 500mg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Category *</Label>
                <Input
                  placeholder="e.g., Analgesic"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div>
                <Label>Price (₦) *</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div>
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div>
                <Label>Reorder Level</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                />
              </div>

              <div>
                <Label>Expiry Date *</Label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>

              <div>
                <Label>Batch Number</Label>
                <Input
                  placeholder="BATCH-2025-001"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                />
              </div>

              <div>
                <Label>Manufacturer</Label>
                <Input
                  placeholder="PharmaCo Ltd"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Drug description and usage..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAddModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddDrug} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Drug
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Drug Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Edit Drug
            </DialogTitle>
            <DialogDescription>
              Update drug information and inventory details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Drug Name *</Label>
                <Input
                  placeholder="e.g., Paracetamol 500mg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Category *</Label>
                <Input
                  placeholder="e.g., Analgesic"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div>
                <Label>Price (₦) *</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div>
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div>
                <Label>Reorder Level</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                />
              </div>

              <div>
                <Label>Expiry Date *</Label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>

              <div>
                <Label>Batch Number</Label>
                <Input
                  placeholder="BATCH-2025-001"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                />
              </div>

              <div>
                <Label>Manufacturer</Label>
                <Input
                  placeholder="PharmaCo Ltd"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Drug description and usage..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditModalOpen(false);
              setSelectedDrug(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditDrug} className="bg-primary hover:bg-primary/90">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Update Drug
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Drug Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Drug Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this drug
            </DialogDescription>
          </DialogHeader>

          {selectedDrug && (
            <div className="space-y-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{selectedDrug.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDrug.drugId}</p>
                </div>
                {getStatusBadge(selectedDrug.status)}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <p className="font-semibold">{selectedDrug.category}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Price</Label>
                  <p className="font-semibold text-primary">₦{selectedDrug.price.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Quantity in Stock</Label>
                  <p className="font-semibold">{selectedDrug.quantity} units</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Reorder Level</Label>
                  <p className="font-semibold">{selectedDrug.reorderLevel} units</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Batch Number</Label>
                  <p className="font-semibold">{selectedDrug.batchNumber}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Manufacturer</Label>
                  <p className="font-semibold">{selectedDrug.manufacturer}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Expiry Date</Label>
                  <p className="font-semibold">{new Date(selectedDrug.expiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Last Restocked</Label>
                  <p className="font-semibold">{selectedDrug.lastRestocked ? new Date(selectedDrug.lastRestocked).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              {selectedDrug.description && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <p className="text-sm mt-1">{selectedDrug.description}</p>
                  </div>
                </>
              )}

              <Separator />

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Inventory Value:</span>
                  <span className="text-xl font-bold text-primary">
                    ₦{(selectedDrug.price * selectedDrug.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setViewModalOpen(false);
              setSelectedDrug(null);
            }}>
              Close
            </Button>
            {selectedDrug && (
              <Button onClick={() => {
                setViewModalOpen(false);
                openEditModal(selectedDrug);
              }} className="bg-primary hover:bg-primary/90">
                <Edit className="w-4 h-4 mr-2" />
                Edit Drug
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Drug
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedDrug?.name}</strong>? This action cannot be undone and the inventory record will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedDrug(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDrug}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Drug
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
