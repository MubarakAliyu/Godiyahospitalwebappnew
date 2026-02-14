import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pill, 
  ArrowLeft,
  Search,
  Plus,
  X,
  Save,
  FileText,
  Download,
  DollarSign,
  User,
  Phone,
  Calendar,
  Building,
  Trash2,
  Eye,
  Filter,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  Package,
  Minus,
  UserCheck,
  PackageX,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useEMRStore } from '@/app/emr/store/emr-store';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
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
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';

interface Drug {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  reorderLevel: number;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired';
  batchNumber?: string;
}

interface SelectedDrug {
  id: string;
  name: string;
  price: number;
  quantity: number;
  available: number;
}

interface Patient {
  fileNumber: string;
  name: string;
  phone: string;
  age: string;
  gender: string;
  type: 'IPD' | 'OPD';
}

// Mock drug inventory data
const mockDrugs: Drug[] = [
  { id: 'D-001', name: 'Paracetamol 500mg', price: 50, category: 'Analgesic', quantity: 450, reorderLevel: 100, expiryDate: '2026-12-31', status: 'In Stock', batchNumber: 'PA-2024-001' },
  { id: 'D-002', name: 'Amoxicillin 250mg', price: 150, category: 'Antibiotic', quantity: 280, reorderLevel: 80, expiryDate: '2026-08-15', status: 'In Stock', batchNumber: 'AM-2024-002' },
  { id: 'D-003', name: 'Ibuprofen 400mg', price: 75, category: 'Analgesic', quantity: 320, reorderLevel: 100, expiryDate: '2026-10-20', status: 'In Stock', batchNumber: 'IB-2024-003' },
  { id: 'D-004', name: 'Omeprazole 20mg', price: 200, category: 'Antacid', quantity: 0, reorderLevel: 50, expiryDate: '2027-03-10', status: 'Out of Stock', batchNumber: 'OM-2024-004' },
  { id: 'D-005', name: 'Metformin 500mg', price: 120, category: 'Antidiabetic', quantity: 500, reorderLevel: 100, expiryDate: '2026-05-25', status: 'In Stock', batchNumber: 'MF-2024-005' },
  { id: 'D-006', name: 'Ciprofloxacin 500mg', price: 180, category: 'Antibiotic', quantity: 5, reorderLevel: 60, expiryDate: '2025-01-15', status: 'Expired', batchNumber: 'CP-2024-006' },
  { id: 'D-007', name: 'Cetirizine 10mg', price: 60, category: 'Antihistamine', quantity: 600, reorderLevel: 100, expiryDate: '2027-02-28', status: 'In Stock', batchNumber: 'CT-2024-007' },
  { id: 'D-008', name: 'Lisinopril 10mg', price: 160, category: 'Antihypertensive', quantity: 35, reorderLevel: 70, expiryDate: '2025-01-10', status: 'Expired', batchNumber: 'LS-2024-008' },
  { id: 'D-009', name: 'Atorvastatin 20mg', price: 250, category: 'Statin', quantity: 180, reorderLevel: 80, expiryDate: '2026-11-30', status: 'In Stock', batchNumber: 'AT-2024-009' },
  { id: 'D-010', name: 'Azithromycin 500mg', price: 300, category: 'Antibiotic', quantity: 150, reorderLevel: 60, expiryDate: '2026-09-15', status: 'In Stock', batchNumber: 'AZ-2024-010' },
  { id: 'D-011', name: 'Diclofenac 50mg', price: 80, category: 'NSAID', quantity: 40, reorderLevel: 100, expiryDate: '2026-07-20', status: 'Low Stock', batchNumber: 'DC-2024-011' },
  { id: 'D-012', name: 'Vitamin B Complex', price: 100, category: 'Supplement', quantity: 380, reorderLevel: 150, expiryDate: '2027-01-15', status: 'In Stock', batchNumber: 'VB-2024-012' },
  { id: 'D-013', name: 'Prednisolone 5mg', price: 90, category: 'Steroid', quantity: 220, reorderLevel: 100, expiryDate: '2026-06-30', status: 'In Stock', batchNumber: 'PR-2024-013' },
  { id: 'D-014', name: 'Levothyroxine 50mcg', price: 140, category: 'Thyroid', quantity: 190, reorderLevel: 80, expiryDate: '2026-12-20', status: 'In Stock', batchNumber: 'LV-2024-014' },
  { id: 'D-015', name: 'Salbutamol Inhaler', price: 350, category: 'Bronchodilator', quantity: 45, reorderLevel: 50, expiryDate: '2026-08-30', status: 'Low Stock', batchNumber: 'SB-2024-015' },
  { id: 'D-016', name: 'Losartan 50mg', price: 170, category: 'Antihypertensive', quantity: 260, reorderLevel: 100, expiryDate: '2026-10-25', status: 'In Stock', batchNumber: 'LT-2024-016' },
  { id: 'D-017', name: 'Insulin Glargine', price: 2500, category: 'Antidiabetic', quantity: 25, reorderLevel: 30, expiryDate: '2025-12-31', status: 'Low Stock', batchNumber: 'IN-2024-017' },
  { id: 'D-018', name: 'Multivitamin Syrup', price: 180, category: 'Supplement', quantity: 120, reorderLevel: 80, expiryDate: '2026-09-10', status: 'In Stock', batchNumber: 'MV-2024-018' },
  { id: 'D-019', name: 'Hydrocortisone Cream', price: 220, category: 'Topical', quantity: 85, reorderLevel: 60, expiryDate: '2026-11-15', status: 'In Stock', batchNumber: 'HC-2024-019' },
  { id: 'D-020', name: 'Amlodipine 5mg', price: 130, category: 'Antihypertensive', quantity: 310, reorderLevel: 120, expiryDate: '2027-03-20', status: 'In Stock', batchNumber: 'AM-2024-020' },
];

// Mock patient data
const mockPatients: Patient[] = [
  { fileNumber: 'GH-2025-001', name: 'Aisha Mohammed', phone: '+234 803 456 7890', age: '34', gender: 'Female', type: 'OPD' },
  { fileNumber: 'GH-2025-002', name: 'Ibrahim Usman', phone: '+234 806 123 4567', age: '45', gender: 'Male', type: 'IPD' },
  { fileNumber: 'GH-2025-003', name: 'Fatima Sani', phone: '+234 805 987 6543', age: '52', gender: 'Female', type: 'OPD' },
  { fileNumber: 'GH-2025-004', name: 'Musa Bello', phone: '+234 807 234 5678', age: '28', gender: 'Male', type: 'OPD' },
  { fileNumber: 'GH-2025-005', name: 'Zainab Ahmad', phone: '+234 808 345 6789', age: '29', gender: 'Female', type: 'IPD' },
];

// Generate invoice number
const generateInvoiceNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100);
  return `GH-PH-INV-${String(random).padStart(3, '0')}`;
};

export function AddSales() {
  const navigate = useNavigate();
  const { addNotification } = useEMRStore();

  // Invoice Information State
  const [invoiceNumber] = useState(generateInvoiceNumber());
  const [invoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [cashierName] = useState('Pharmacist');
  const [department] = useState('Pharmacy');
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [fileNumber, setFileNumber] = useState('');
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [patientType, setPatientType] = useState<'OPD' | 'IPD'>('OPD');
  const [notes, setNotes] = useState('');

  // Patient Auto-Suggest
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  // Drug Inventory State
  const [drugs, setDrugs] = useState<Drug[]>(mockDrugs);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Drugs State
  const [selectedDrugs, setSelectedDrugs] = useState<SelectedDrug[]>([]);
  const [discount, setDiscount] = useState(0);

  // Modal State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [saleComplete, setSaleComplete] = useState(false);

  // Auto-suggest for patient file number
  useEffect(() => {
    if (fileNumber.trim() && !isWalkIn) {
      const filtered = mockPatients.filter(
        (patient) =>
          patient.fileNumber.toLowerCase().includes(fileNumber.toLowerCase()) ||
          patient.name.toLowerCase().includes(fileNumber.toLowerCase())
      );
      setFilteredPatients(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [fileNumber, isWalkIn]);

  // Handle patient selection from suggestions
  const handleSelectPatient = (patient: Patient) => {
    setFileNumber(patient.fileNumber);
    setPatientName(patient.name);
    setPhoneNumber(patient.phone);
    setPatientType(patient.type);
    setShowSuggestions(false);

    toast.success('Patient Selected', {
      description: `${patient.name} - ${patient.fileNumber}`,
    });
  };

  // Handle walk-in toggle
  const handleWalkInToggle = (checked: boolean) => {
    setIsWalkIn(checked);
    if (checked) {
      setFileNumber('WALK-IN-' + Date.now());
      setShowSuggestions(false);
      setPatientType('OPD');
    } else {
      setFileNumber('');
      setPatientName('');
      setPhoneNumber('');
    }
  };

  // Filter drugs
  const filteredDrugs = drugs.filter((drug) => {
    const matchesSearch = drug.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || drug.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || drug.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Paginate drugs
  const totalPages = Math.ceil(filteredDrugs.length / itemsPerPage);
  const paginatedDrugs = filteredDrugs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique categories
  const categories = Array.from(new Set(drugs.map((drug) => drug.category)));

  // Add drug to cart
  const handleAddDrug = (drug: Drug, quantity: number = 1) => {
    // Check if drug is expired or out of stock
    if (drug.status === 'Expired') {
      toast.error('Drug Expired', {
        description: `${drug.name} has expired and cannot be dispensed.`,
      });
      return;
    }

    if (drug.status === 'Out of Stock' || drug.quantity === 0) {
      toast.error('Out of Stock', {
        description: `${drug.name} is currently out of stock.`,
      });
      return;
    }

    // Check if quantity exceeds available stock
    if (quantity > drug.quantity) {
      toast.error('Insufficient Stock', {
        description: `Only ${drug.quantity} units available for ${drug.name}.`,
      });
      return;
    }

    const existing = selectedDrugs.find((d) => d.id === drug.id);
    if (existing) {
      // Check total quantity
      const newQuantity = existing.quantity + quantity;
      if (newQuantity > drug.quantity) {
        toast.error('Insufficient Stock', {
          description: `Cannot add more. Only ${drug.quantity} units available.`,
        });
        return;
      }

      setSelectedDrugs((prev) =>
        prev.map((d) =>
          d.id === drug.id ? { ...d, quantity: newQuantity } : d
        )
      );

      toast.success('Quantity Updated', {
        description: `${drug.name} quantity increased to ${newQuantity}.`,
      });
    } else {
      setSelectedDrugs((prev) => [
        ...prev,
        { 
          id: drug.id, 
          name: drug.name, 
          price: drug.price, 
          quantity: quantity,
          available: drug.quantity
        },
      ]);

      toast.success('Drug Added', {
        description: `${drug.name} added to cart.`,
      });
    }
  };

  // Remove drug from cart
  const handleRemoveDrug = (drugId: string) => {
    const drug = selectedDrugs.find((d) => d.id === drugId);
    setSelectedDrugs((prev) => prev.filter((d) => d.id !== drugId));
    
    if (drug) {
      toast.info('Drug Removed', {
        description: `${drug.name} removed from cart.`,
      });
    }
  };

  // Update drug quantity in cart
  const handleUpdateQuantity = (drugId: string, quantity: number) => {
    if (quantity < 1) return;

    const drug = selectedDrugs.find((d) => d.id === drugId);
    if (!drug) return;

    // Check if quantity exceeds available stock
    if (quantity > drug.available) {
      toast.error('Insufficient Stock', {
        description: `Only ${drug.available} units available.`,
      });
      return;
    }

    setSelectedDrugs((prev) =>
      prev.map((d) => (d.id === drugId ? { ...d, quantity } : d))
    );
  };

  // Calculate totals
  const subtotal = selectedDrugs.reduce((sum, drug) => sum + drug.price * drug.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  // Validate form
  const validateForm = () => {
    if (!patientName.trim()) {
      toast.error('Validation Error', { description: 'Patient name is required.' });
      return false;
    }
    if (!isWalkIn && !fileNumber.trim()) {
      toast.error('Validation Error', { description: 'File number is required for registered patients.' });
      return false;
    }
    if (selectedDrugs.length === 0) {
      toast.error('Validation Error', { description: 'Please add at least one drug to the sale.' });
      return false;
    }
    return true;
  };

  // Handle submit sale
  const handleSubmitSale = () => {
    if (!validateForm()) return;
    setConfirmModalOpen(true);
  };

  // Confirm and finalize sale
  const handleConfirmSale = () => {
    // Deduct inventory
    selectedDrugs.forEach((selectedDrug) => {
      setDrugs((prev) =>
        prev.map((drug) =>
          drug.id === selectedDrug.id
            ? { 
                ...drug, 
                quantity: drug.quantity - selectedDrug.quantity,
                status: drug.quantity - selectedDrug.quantity === 0 
                  ? 'Out of Stock' 
                  : drug.quantity - selectedDrug.quantity < drug.reorderLevel 
                  ? 'Low Stock' 
                  : drug.status 
              }
            : drug
        )
      );
    });

    setSaleComplete(true);
    setConfirmModalOpen(false);
    setInvoiceModalOpen(true);

    toast.success('Sale Completed', {
      description: `Invoice ${invoiceNumber} created successfully.`,
    });

    // Add notifications
    addNotification({
      id: Date.now(),
      title: 'Pharmacy Sale Completed',
      message: `Invoice ${invoiceNumber} - ₦${total.toLocaleString()} - ${patientName}`,
      type: 'success',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'High',
    });

    addNotification({
      id: Date.now() + 1,
      title: 'Payment Received',
      message: `Payment of ₦${total.toLocaleString()} received for invoice ${invoiceNumber}`,
      type: 'success',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Medium',
    });

    // Check for low stock alerts
    selectedDrugs.forEach((selectedDrug) => {
      const drug = drugs.find((d) => d.id === selectedDrug.id);
      if (drug && drug.quantity - selectedDrug.quantity < drug.reorderLevel) {
        addNotification({
          id: Date.now() + Math.random(),
          title: 'Low Stock Alert',
          message: `${drug.name} is below reorder level (${drug.quantity - selectedDrug.quantity} units remaining)`,
          type: 'warning',
          status: 'Unread',
          timestamp: new Date().toISOString(),
          priority: 'High',
        });
      }
    });
  };

  // Cancel sale
  const handleCancelSale = () => {
    if (selectedDrugs.length > 0) {
      if (confirm('Are you sure you want to cancel this sale? All items will be removed.')) {
        setSelectedDrugs([]);
        setPatientName('');
        setFileNumber('');
        setPhoneNumber('');
        setNotes('');
        setDiscount(0);
        setIsWalkIn(false);

        toast.info('Sale Cancelled', {
          description: 'All items have been removed from the cart.',
        });
      }
    } else {
      navigate('/emr/pharmacy-staff/dashboard');
    }
  };

  // Print invoice
  const handlePrintInvoice = () => {
    window.print();
    toast.success('Printing Invoice', {
      description: 'Invoice sent to printer.',
    });
  };

  // Download PDF
  const handleDownloadPDF = () => {
    toast.success('PDF Downloaded', {
      description: `Invoice ${invoiceNumber} downloaded successfully.`,
    });
  };

  // Close invoice modal and navigate back
  const handleCloseInvoiceModal = () => {
    setInvoiceModalOpen(false);
    setTimeout(() => {
      navigate('/emr/pharmacy-staff/dashboard');
    }, 500);
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/emr/pharmacy-staff/dashboard')}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Add New Sale</h1>
          <p className="text-muted-foreground">Point of Sale - Dispense medications and generate invoice</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL - Sale Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Sale Information
              </CardTitle>
              <CardDescription>Auto-generated invoice and customer details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto-Generated Fields */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-sm text-muted-foreground">Auto-Generated</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Invoice Number</Label>
                    <p className="font-semibold text-primary">{invoiceNumber}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Date</Label>
                    <p className="font-semibold">{new Date(invoiceDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Cashier</Label>
                    <p className="font-semibold">{cashierName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Department</Label>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      <Building className="w-3 h-3 mr-1" />
                      {department}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Walk-In Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-semibold">Walk-In Customer</Label>
                  <p className="text-xs text-muted-foreground">Enable for non-registered customers</p>
                </div>
                <Switch checked={isWalkIn} onCheckedChange={handleWalkInToggle} />
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <div className="relative">
                  <Label>Customer File Number</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={fileNumber}
                      onChange={(e) => setFileNumber(e.target.value)}
                      placeholder={isWalkIn ? 'Auto-generated for walk-in' : 'Search by file number or name...'}
                      disabled={isWalkIn}
                      className="pl-9"
                    />
                  </div>
                  
                  {/* Auto-Suggest Dropdown */}
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                    >
                      {filteredPatients.map((patient) => (
                        <div
                          key={patient.fileNumber}
                          onClick={() => handleSelectPatient(patient)}
                          className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-sm">{patient.name}</p>
                              <p className="text-xs text-muted-foreground">{patient.fileNumber}</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={patient.type === 'IPD' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}
                            >
                              {patient.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                <div>
                  <Label>Customer Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter customer name"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <Label>Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+234 xxx xxx xxxx"
                      className="pl-9"
                    />
                  </div>
                </div>

                {!isWalkIn && (
                  <div>
                    <Label>Patient Type</Label>
                    <Select value={patientType} onValueChange={(value: 'OPD' | 'IPD') => setPatientType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPD">OPD (Out-Patient)</SelectItem>
                        <SelectItem value="IPD">IPD (In-Patient)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes or prescription reference..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT PANEL - Drug Inventory */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                Drug Inventory
              </CardTitle>
              <CardDescription>Search and add drugs to cart</CardDescription>
              
              {/* Search and Filters */}
              <div className="space-y-3 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search drugs..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Select value={categoryFilter} onValueChange={(value) => {
                    setCategoryFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-semibold text-xs text-muted-foreground">Drug Name</th>
                        <th className="text-left py-2 px-3 font-semibold text-xs text-muted-foreground">Price</th>
                        <th className="text-left py-2 px-3 font-semibold text-xs text-muted-foreground">Available</th>
                        <th className="text-left py-2 px-3 font-semibold text-xs text-muted-foreground">Status</th>
                        <th className="text-left py-2 px-3 font-semibold text-xs text-muted-foreground">Qty</th>
                        <th className="text-left py-2 px-3 font-semibold text-xs text-muted-foreground">Add</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {paginatedDrugs.map((drug, index) => (
                          <DrugRow 
                            key={drug.id}
                            drug={drug}
                            index={index}
                            onAdd={handleAddDrug}
                          />
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>

                  {paginatedDrugs.length === 0 && (
                    <div className="text-center py-8">
                      <PackageX className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-muted-foreground">No drugs found</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-8"
                      >
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Selected Drugs Cart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Cart ({selectedDrugs.length} {selectedDrugs.length === 1 ? 'item' : 'items'})
            </CardTitle>
            <CardDescription>Drugs added to this sale</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDrugs.length > 0 ? (
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Drug Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Quantity</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Total</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {selectedDrugs.map((drug, index) => (
                          <motion.tr
                            key={drug.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.03 }}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <p className="font-semibold text-sm">{drug.name}</p>
                              <p className="text-xs text-muted-foreground">Available: {drug.available} units</p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-sm">₦{drug.price.toLocaleString()}</p>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateQuantity(drug.id, drug.quantity - 1)}
                                  disabled={drug.quantity <= 1}
                                  className="h-7 w-7 p-0"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={drug.quantity}
                                  onChange={(e) => handleUpdateQuantity(drug.id, parseInt(e.target.value) || 1)}
                                  className="w-16 h-7 text-center"
                                  min={1}
                                  max={drug.available}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateQuantity(drug.id, drug.quantity + 1)}
                                  disabled={drug.quantity >= drug.available}
                                  className="h-7 w-7 p-0"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-primary">₦{(drug.price * drug.quantity).toLocaleString()}</p>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleRemoveDrug(drug.id)}
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Remove from cart</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                <Separator />

                {/* Totals Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="w-32">Discount (%)</Label>
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-32"
                      min={0}
                      max={100}
                    />
                  </div>

                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Subtotal:</span>
                      <span className="text-sm font-semibold">₦{subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-green-600">
                        <span className="text-sm font-medium">Discount ({discount}%):</span>
                        <span className="text-sm font-semibold">-₦{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-2xl font-bold text-primary">₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancelSale}
                    className="px-6"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitSale}
                    className="px-6 bg-primary hover:bg-primary/90"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Submit & Print Invoice
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold text-muted-foreground mb-2">Cart is empty</p>
                <p className="text-sm text-muted-foreground">Add drugs from the inventory above</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Confirm Sale Modal */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Confirm Sale
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed with this sale? Inventory will be deducted automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Customer:</span>
                <span className="text-sm font-semibold">{patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Invoice Number:</span>
                <span className="text-sm font-semibold text-primary">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Items:</span>
                <span className="text-sm font-semibold">{selectedDrugs.length}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-base font-bold">Total Amount:</span>
                <span className="text-xl font-bold text-primary">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
              <p className="text-xs text-orange-800">
                This action will deduct inventory automatically and cannot be undone. Please verify all details before proceeding.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSale} className="bg-primary hover:bg-primary/90">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm & Generate Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice PDF Modal */}
      <Dialog open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Sale Invoice
            </DialogTitle>
            <DialogDescription>
              Invoice generated successfully - Print or download
            </DialogDescription>
          </DialogHeader>

          {/* Invoice Preview */}
          <div className="space-y-6 py-4" id="invoice-preview">
            {/* Hospital Header */}
            <div className="text-center space-y-2 pb-4 border-b-2 border-primary">
              <h1 className="text-2xl font-bold text-primary">GODIYA HOSPITAL</h1>
              <p className="text-sm text-muted-foreground">Birnin Kebbi, Kebbi State, Nigeria</p>
              <p className="text-sm text-muted-foreground">Phone: +234 XXX XXX XXXX | Email: info@godiyahospital.com</p>
              <Badge className="bg-primary text-white">PHARMACY DEPARTMENT</Badge>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">INVOICE TO:</h3>
                <div>
                  <p className="font-bold">{patientName}</p>
                  {!isWalkIn && <p className="text-sm text-muted-foreground">File: {fileNumber}</p>}
                  {phoneNumber && <p className="text-sm text-muted-foreground">Phone: {phoneNumber}</p>}
                  {!isWalkIn && <p className="text-sm"><Badge variant="outline" className={patientType === 'IPD' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}>{patientType}</Badge></p>}
                </div>
              </div>
              <div className="text-right space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">INVOICE DETAILS:</h3>
                <div>
                  <p className="font-bold text-primary">{invoiceNumber}</p>
                  <p className="text-sm text-muted-foreground">Date: {new Date(invoiceDate).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">Cashier: {cashierName}</p>
                  <p className="text-sm"><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">PAID</Badge></p>
                </div>
              </div>
            </div>

            {/* Invoice Table */}
            <div>
              <table className="w-full border">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left py-2 px-3 border font-semibold text-sm">#</th>
                    <th className="text-left py-2 px-3 border font-semibold text-sm">Drug Name</th>
                    <th className="text-right py-2 px-3 border font-semibold text-sm">Unit Price</th>
                    <th className="text-center py-2 px-3 border font-semibold text-sm">Qty</th>
                    <th className="text-right py-2 px-3 border font-semibold text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDrugs.map((drug, index) => (
                    <tr key={drug.id}>
                      <td className="py-2 px-3 border text-sm">{index + 1}</td>
                      <td className="py-2 px-3 border text-sm font-medium">{drug.name}</td>
                      <td className="py-2 px-3 border text-sm text-right">₦{drug.price.toLocaleString()}</td>
                      <td className="py-2 px-3 border text-sm text-center">{drug.quantity}</td>
                      <td className="py-2 px-3 border text-sm text-right font-semibold">₦{(drug.price * drug.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between py-2 border-b text-green-600">
                    <span className="font-medium">Discount ({discount}%):</span>
                    <span className="font-semibold">-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 bg-primary/10 px-4 rounded-lg">
                  <span className="text-lg font-bold">TOTAL:</span>
                  <span className="text-2xl font-bold text-primary">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {notes && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold text-sm mb-2">Notes:</h3>
                <p className="text-sm text-muted-foreground">{notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground pt-4 border-t space-y-1">
              <p>Thank you for your patronage!</p>
              <p>This is a computer-generated invoice and does not require a signature.</p>
              <p className="font-semibold">Generated on {new Date().toLocaleString()}</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseInvoiceModal}>
              Close
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handlePrintInvoice} className="bg-primary hover:bg-primary/90">
              <FileText className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Drug Row Component for better organization
function DrugRow({ drug, index, onAdd }: { drug: Drug; index: number; onAdd: (drug: Drug, qty: number) => void }) {
  const [quantity, setQuantity] = useState(1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            In Stock
          </Badge>
        );
      case 'Low Stock':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
            <AlertCircle className="w-3 h-3 mr-1" />
            Low Stock
          </Badge>
        );
      case 'Out of Stock':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
            <PackageX className="w-3 h-3 mr-1" />
            Out of Stock
          </Badge>
        );
      case 'Expired':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
            <X className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const isDisabled = drug.status === 'Expired' || drug.status === 'Out of Stock';

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03 }}
      className={`border-b hover:bg-muted/50 transition-colors ${isDisabled ? 'opacity-50' : ''}`}
    >
      <td className="py-3 px-3">
        <div>
          <p className="font-semibold text-sm">{drug.name}</p>
          <p className="text-xs text-muted-foreground">{drug.category}</p>
        </div>
      </td>
      <td className="py-3 px-3">
        <p className="font-semibold text-sm">₦{drug.price.toLocaleString()}</p>
      </td>
      <td className="py-3 px-3">
        <p className="font-semibold text-sm">{drug.quantity}</p>
      </td>
      <td className="py-3 px-3">
        {getStatusBadge(drug.status)}
      </td>
      <td className="py-3 px-3">
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 h-8 text-center"
          min={1}
          max={drug.quantity}
          disabled={isDisabled}
        />
      </td>
      <td className="py-3 px-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  onAdd(drug, quantity);
                  setQuantity(1);
                }}
                disabled={isDisabled}
                className="h-8 w-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isDisabled ? 'Cannot add' : 'Add to cart'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
    </motion.tr>
  );
}
