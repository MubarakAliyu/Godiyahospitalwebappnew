import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FlaskConical, 
  ArrowLeft,
  Search,
  Plus,
  X,
  Save,
  FileText,
  Download,
  Send,
  DollarSign,
  User,
  Phone,
  Calendar,
  Building,
  Trash2,
  Eye,
  Filter,
  CheckCircle2,
  AlertCircle
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

interface AvailableTest {
  id: string;
  name: string;
  price: number;
  category: string;
  status: 'Available' | 'Unavailable';
  description?: string;
}

interface SelectedTest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Patient {
  fileNumber: string;
  name: string;
  phone: string;
  age: string;
  gender: string;
}

// Mock available tests data
const mockAvailableTests: AvailableTest[] = [
  { id: 'T-001', name: 'Complete Blood Count', price: 2500, category: 'Hematology', status: 'Available', description: 'CBC with differential' },
  { id: 'T-002', name: 'Malaria Test', price: 1000, category: 'Parasitology', status: 'Available', description: 'Rapid diagnostic test' },
  { id: 'T-003', name: 'Blood Sugar (Fasting)', price: 1500, category: 'Chemistry', status: 'Available', description: 'Fasting blood glucose' },
  { id: 'T-004', name: 'Lipid Profile', price: 5000, category: 'Chemistry', status: 'Available', description: 'Total cholesterol, HDL, LDL, Triglycerides' },
  { id: 'T-005', name: 'Liver Function Test', price: 4500, category: 'Chemistry', status: 'Available', description: 'AST, ALT, Bilirubin' },
  { id: 'T-006', name: 'Kidney Function Test', price: 4000, category: 'Chemistry', status: 'Available', description: 'Creatinine, Urea, Electrolytes' },
  { id: 'T-007', name: 'Urinalysis', price: 1500, category: 'Urine', status: 'Available', description: 'Complete urine examination' },
  { id: 'T-008', name: 'Urine Culture', price: 3000, category: 'Microbiology', status: 'Available', description: 'Urine culture and sensitivity' },
  { id: 'T-009', name: 'Stool Examination', price: 1200, category: 'Parasitology', status: 'Available', description: 'Microscopy and culture' },
  { id: 'T-010', name: 'Thyroid Function Test', price: 6500, category: 'Endocrinology', status: 'Available', description: 'TSH, T3, T4' },
  { id: 'T-011', name: 'HbA1c', price: 3500, category: 'Chemistry', status: 'Available', description: 'Glycated hemoglobin' },
  { id: 'T-012', name: 'Hepatitis B Surface Antigen', price: 2000, category: 'Serology', status: 'Available', description: 'HBsAg screening' },
  { id: 'T-013', name: 'HIV Screening', price: 1500, category: 'Serology', status: 'Available', description: 'HIV 1&2 antibody test' },
  { id: 'T-014', name: 'Pregnancy Test', price: 800, category: 'Serology', status: 'Available', description: 'HCG test' },
  { id: 'T-015', name: 'Blood Grouping', price: 1000, category: 'Hematology', status: 'Available', description: 'ABO and Rh typing' },
  { id: 'T-016', name: 'ESR', price: 800, category: 'Hematology', status: 'Available', description: 'Erythrocyte sedimentation rate' },
  { id: 'T-017', name: 'Widal Test', price: 1500, category: 'Serology', status: 'Available', description: 'Typhoid fever screening' },
  { id: 'T-018', name: 'X-Ray Chest', price: 4000, category: 'Radiology', status: 'Unavailable', description: 'Chest radiograph' },
  { id: 'T-019', name: 'ECG', price: 2500, category: 'Cardiology', status: 'Available', description: 'Electrocardiogram' },
  { id: 'T-020', name: 'Sputum Culture', price: 3500, category: 'Microbiology', status: 'Available', description: 'Culture and sensitivity' },
];

// Mock patient data for auto-suggest
const mockPatients: Patient[] = [
  { fileNumber: 'GH-2025-001', name: 'Aisha Mohammed', phone: '+234 803 456 7890', age: '34', gender: 'Female' },
  { fileNumber: 'GH-2025-002', name: 'Ibrahim Usman', phone: '+234 806 123 4567', age: '45', gender: 'Male' },
  { fileNumber: 'GH-2025-003', name: 'Fatima Sani', phone: '+234 805 987 6543', age: '52', gender: 'Female' },
  { fileNumber: 'GH-2025-004', name: 'Musa Bello', phone: '+234 807 234 5678', age: '28', gender: 'Male' },
  { fileNumber: 'GH-2025-005', name: 'Zainab Ahmad', phone: '+234 808 345 6789', age: '29', gender: 'Female' },
];

export function AddInvoice() {
  const navigate = useNavigate();
  const { addNotification } = useEMRStore();

  // Invoice Information State
  const [invoiceNumber, setInvoiceNumber] = useState('GH-LB-INV-001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [technicianName, setTechnicianName] = useState('Lab Technician');
  const [department] = useState('Laboratory');
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [fileNumber, setFileNumber] = useState('');
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Patient Auto-Suggest
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  // Test Inventory State
  const [availableTests, setAvailableTests] = useState<AvailableTest[]>(mockAvailableTests);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected Tests State
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([]);
  const [discount, setDiscount] = useState(0);

  // Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Unpaid'>('Unpaid');

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
    setShowSuggestions(false);
  };

  // Handle walk-in toggle
  const handleWalkInToggle = (checked: boolean) => {
    setIsWalkIn(checked);
    if (checked) {
      setFileNumber('WALK-IN-' + Date.now());
      setShowSuggestions(false);
    } else {
      setFileNumber('');
      setPatientName('');
      setPhoneNumber('');
    }
  };

  // Filter available tests
  const filteredTests = availableTests.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || test.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Paginate tests
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique categories
  const categories = Array.from(new Set(availableTests.map((test) => test.category)));

  // Add test to selected
  const handleAddTest = (test: AvailableTest) => {
    if (test.status === 'Unavailable') {
      toast.error('Test Unavailable', {
        description: `${test.name} is currently unavailable.`,
      });
      return;
    }

    const existing = selectedTests.find((t) => t.id === test.id);
    if (existing) {
      toast.warning('Test Already Added', {
        description: `${test.name} is already in the invoice.`,
      });
      return;
    }

    setSelectedTests((prev) => [
      ...prev,
      { id: test.id, name: test.name, price: test.price, quantity: 1 },
    ]);

    toast.success('Test Added', {
      description: `${test.name} added to invoice.`,
    });
  };

  // Remove test from selected
  const handleRemoveTest = (testId: string) => {
    const test = selectedTests.find((t) => t.id === testId);
    setSelectedTests((prev) => prev.filter((t) => t.id !== testId));
    
    if (test) {
      toast.info('Test Removed', {
        description: `${test.name} removed from invoice.`,
      });
    }
  };

  // Update test quantity
  const handleUpdateQuantity = (testId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedTests((prev) =>
      prev.map((test) => (test.id === testId ? { ...test, quantity } : test))
    );
  };

  // Calculate totals
  const subtotal = selectedTests.reduce((sum, test) => sum + test.price * test.quantity, 0);
  const total = subtotal - discount;

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
    if (!phoneNumber.trim()) {
      toast.error('Validation Error', { description: 'Phone number is required.' });
      return false;
    }
    if (selectedTests.length === 0) {
      toast.error('Validation Error', { description: 'Please add at least one test to the invoice.' });
      return false;
    }
    return true;
  };

  // Save as draft
  const handleSaveDraft = () => {
    if (!validateForm()) return;

    toast.success('Draft Saved', {
      description: `Invoice ${invoiceNumber} saved as draft.`,
    });

    addNotification({
      id: Date.now(),
      title: 'Invoice Draft Saved',
      message: `Invoice ${invoiceNumber} for ${patientName} saved as draft`,
      type: 'info',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Low',
    });
  };

  // Generate invoice
  const handleGenerateInvoice = () => {
    if (!validateForm()) return;
    setPreviewModalOpen(true);
  };

  // Confirm and finalize invoice
  const handleConfirmInvoice = () => {
    toast.success('Invoice Created', {
      description: `Invoice ${invoiceNumber} created successfully for ${patientName}.`,
    });

    // Add notifications
    addNotification({
      id: Date.now(),
      title: 'Lab Invoice Created',
      message: `Invoice ${invoiceNumber} - ₦${total.toLocaleString()} - ${patientName}`,
      type: 'success',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'High',
    });

    if (paymentStatus === 'Paid') {
      addNotification({
        id: Date.now() + 1,
        title: 'Payment Recorded',
        message: `Payment of ₦${total.toLocaleString()} received for invoice ${invoiceNumber}`,
        type: 'success',
        status: 'Unread',
        timestamp: new Date().toISOString(),
        priority: 'Medium',
      });
    }

    setPreviewModalOpen(false);
    
    // Reset form or navigate
    setTimeout(() => {
      navigate('/emr/laboratory-staff/dashboard');
    }, 1500);
  };

  // Send to cashier
  const handleSendToCashier = () => {
    toast.success('Sent to Cashier', {
      description: `Invoice ${invoiceNumber} sent to cashier for payment processing.`,
    });

    addNotification({
      id: Date.now(),
      title: 'Invoice Sent to Cashier',
      message: `Invoice ${invoiceNumber} - ₦${total.toLocaleString()} sent for payment`,
      type: 'info',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Medium',
    });

    setPreviewModalOpen(false);
    
    setTimeout(() => {
      navigate('/emr/laboratory-staff/dashboard');
    }, 1500);
  };

  // Download PDF
  const handleDownloadPDF = () => {
    toast.success('PDF Downloaded', {
      description: `Invoice ${invoiceNumber} downloaded successfully.`,
    });
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
              onClick={() => navigate('/emr/laboratory-staff/dashboard')}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Add New Test Invoice</h1>
          <p className="text-muted-foreground">Create invoice for walk-in or existing patient</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL - Invoice Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Invoice Information
              </CardTitle>
              <CardDescription>Auto-generated and patient details</CardDescription>
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
                    <Label className="text-xs text-muted-foreground">Technician</Label>
                    <p className="font-semibold">{technicianName}</p>
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
                  <Label className="font-semibold">Walk-In Patient</Label>
                  <p className="text-xs text-muted-foreground">Enable for non-registered patients</p>
                </div>
                <Switch checked={isWalkIn} onCheckedChange={handleWalkInToggle} />
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div className="relative">
                  <Label>Patient File Number</Label>
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
                          <p className="font-semibold text-sm">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.fileNumber}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                <div>
                  <Label>Patient Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter patient name"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <Label>Phone Number</Label>
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

                <div>
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes or instructions..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT PANEL - Test Inventory */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary" />
                Test Inventory
              </CardTitle>
              <CardDescription>Search and add tests to invoice</CardDescription>
              
              {/* Search and Filter */}
              <div className="flex items-center gap-3 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-semibold text-xs text-muted-foreground">Test Name</th>
                        <th className="text-left py-2 px-3 font-semibold text-xs text-muted-foreground">Price</th>
                        <th className="text-left py-2 px-3 font-semibold text-xs text-muted-foreground">Status</th>
                        <th className="text-left py-2 px-3 font-semibold text-xs text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {paginatedTests.map((test, index) => (
                          <motion.tr
                            key={test.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.03 }}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-3 px-3">
                              <div>
                                <p className="font-semibold text-sm">{test.name}</p>
                                <p className="text-xs text-muted-foreground">{test.category}</p>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold text-sm">₦{test.price.toLocaleString()}</p>
                            </td>
                            <td className="py-3 px-3">
                              {test.status === 'Available' ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Unavailable
                                </Badge>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleAddTest(test)}
                                disabled={test.status === 'Unavailable'}
                                className="h-8"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>

                  {paginatedTests.length === 0 && (
                    <div className="text-center py-8">
                      <FlaskConical className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-muted-foreground">No tests found</p>
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

      {/* Selected Tests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" />
              Selected Tests ({selectedTests.length})
            </CardTitle>
            <CardDescription>Tests added to this invoice</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Test Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Quantity</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Subtotal</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTests.map((test, index) => (
                      <motion.tr
                        key={test.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <p className="font-semibold text-sm">{test.name}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-sm">₦{test.price.toLocaleString()}</p>
                        </td>
                        <td className="py-4 px-4">
                          <Input
                            type="number"
                            min="1"
                            value={test.quantity}
                            onChange={(e) => handleUpdateQuantity(test.id, parseInt(e.target.value) || 1)}
                            className="w-20 h-9"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-sm text-primary">
                            ₦{(test.price * test.quantity).toLocaleString()}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveTest(test.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FlaskConical className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No tests added yet</p>
                <p className="text-sm text-muted-foreground mt-1">Add tests from the inventory above</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Summary Card */}
      {selectedTests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <Card className="w-full lg:w-96">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="font-semibold">₦{subtotal.toLocaleString()}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Discount</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max={subtotal}
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-32 h-9"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <p className="font-bold text-lg">Total Amount</p>
                <p className="font-bold text-2xl text-primary">₦{total.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-end gap-3 pt-6 border-t"
      >
        <Button
          variant="outline"
          onClick={() => navigate('/emr/laboratory-staff/dashboard')}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          disabled={selectedTests.length === 0}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
        <Button
          onClick={handleGenerateInvoice}
          disabled={selectedTests.length === 0}
          className="bg-primary hover:bg-primary/90"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Invoice
        </Button>
      </motion.div>

      {/* Generate Invoice Modal */}
      <Dialog open={previewModalOpen} onOpenChange={(open) => !open && setPreviewModalOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Invoice Preview</DialogTitle>
                <DialogDescription>Review and finalize laboratory invoice</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Invoice Header */}
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold text-primary">Godiya Hospital</h2>
              <p className="text-sm text-muted-foreground">Laboratory Department</p>
              <p className="text-xs text-muted-foreground mt-1">Birnin Kebbi, Nigeria</p>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Invoice Number</Label>
                <p className="font-bold text-primary">{invoiceNumber}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Date</Label>
                <p className="font-semibold">{new Date(invoiceDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Patient Name</Label>
                <p className="font-semibold">{patientName}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">File Number</Label>
                <p className="font-semibold">{fileNumber}</p>
              </div>
            </div>

            <Separator />

            {/* Tests List */}
            <div>
              <h3 className="font-semibold mb-3">Tests Ordered</h3>
              <div className="space-y-2">
                {selectedTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{test.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {test.quantity}</p>
                    </div>
                    <p className="font-bold">₦{(test.price * test.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="font-semibold">₦{subtotal.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Discount</p>
                <p className="font-semibold text-red-600">-₦{discount.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="font-bold text-lg">Total Amount</p>
                <p className="font-bold text-2xl text-primary">₦{total.toLocaleString()}</p>
              </div>
            </div>

            <Separator />

            {/* Payment Status Selection */}
            <div>
              <Label>Payment Status</Label>
              <Select value={paymentStatus} onValueChange={(value: 'Paid' | 'Unpaid') => setPaymentStatus(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setPreviewModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleSendToCashier} className="w-full sm:w-auto">
              <Send className="w-4 h-4 mr-2" />
              Send to Cashier
            </Button>
            <Button onClick={handleConfirmInvoice} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
