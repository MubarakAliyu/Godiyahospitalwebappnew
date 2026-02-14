import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FlaskConical, 
  Clock, 
  CheckCircle2, 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  Search,
  Download,
  Plus,
  X
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
}

interface LabTest {
  id: string;
  testId: string;
  testName: string;
  fees: number;
  createdDate: string;
  status: 'Pending' | 'Paid' | 'Completed';
  patientId?: string;
  patientName?: string;
  fileNumber?: string;
  category?: 'OPD' | 'IPD';
  requestedTests?: string[];
  description?: string;
  doctor?: string;
  patientPhone?: string;
  patientAge?: string;
  patientGender?: string;
}

interface AvailableTest {
  id: string;
  name: string;
  fees: number;
}

// Mock data for lab tests
const mockLabTests: LabTest[] = [
  {
    id: '1',
    testId: 'LT-2025-001',
    testName: 'Complete Blood Count (CBC)',
    fees: 3500,
    createdDate: '2025-02-10',
    status: 'Pending',
    patientId: 'P-001',
    patientName: 'Aisha Mohammed',
    fileNumber: 'GH-2025-001',
    category: 'OPD',
    requestedTests: ['Hemoglobin', 'WBC Count', 'Platelet Count'],
    description: 'Routine blood test for anemia screening',
    doctor: 'Dr. Ibrahim Suleiman',
    patientPhone: '+234 803 456 7890',
    patientAge: '34',
    patientGender: 'Female',
  },
  {
    id: '2',
    testId: 'LT-2025-002',
    testName: 'Malaria Parasite Test',
    fees: 1500,
    createdDate: '2025-02-11',
    status: 'Paid',
    patientId: 'P-002',
    patientName: 'Ibrahim Usman',
    fileNumber: 'GH-2025-002',
    category: 'OPD',
    requestedTests: ['Malaria RDT', 'Blood Film'],
    description: 'Malaria screening for patient with fever',
    doctor: 'Dr. Amina Yusuf',
    patientPhone: '+234 806 123 4567',
    patientAge: '45',
    patientGender: 'Male',
  },
  {
    id: '3',
    testId: 'LT-2025-003',
    testName: 'Lipid Profile',
    fees: 5000,
    createdDate: '2025-02-12',
    status: 'Completed',
    patientId: 'P-003',
    patientName: 'Fatima Sani',
    fileNumber: 'GH-2025-003',
    category: 'IPD',
    requestedTests: ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides'],
    description: 'Cardiovascular risk assessment',
    doctor: 'Dr. Ibrahim Suleiman',
    patientPhone: '+234 805 987 6543',
    patientAge: '52',
    patientGender: 'Female',
  },
  {
    id: '4',
    testId: 'LT-2025-004',
    testName: 'Liver Function Test (LFT)',
    fees: 4500,
    createdDate: '2025-02-12',
    status: 'Pending',
    patientId: 'P-004',
    patientName: 'Musa Bello',
    fileNumber: 'GH-2025-004',
    category: 'OPD',
    requestedTests: ['ALT', 'AST', 'Bilirubin', 'Albumin'],
    description: 'Liver health assessment',
    doctor: 'Dr. Khadija Abubakar',
    patientPhone: '+234 807 234 5678',
    patientAge: '28',
    patientGender: 'Male',
  },
  {
    id: '5',
    testId: 'LT-2025-005',
    testName: 'Urinalysis',
    fees: 2000,
    createdDate: '2025-02-13',
    status: 'Paid',
    patientId: 'P-005',
    patientName: 'Zainab Ahmad',
    fileNumber: 'GH-2025-005',
    category: 'OPD',
    requestedTests: ['Urine pH', 'Protein', 'Glucose', 'Blood'],
    description: 'Urinary tract infection screening',
    doctor: 'Dr. Amina Yusuf',
    patientPhone: '+234 808 345 6789',
    patientAge: '29',
    patientGender: 'Female',
  },
];

// Mock available tests
const mockAvailableTests: AvailableTest[] = [
  { id: '1', name: 'Hemoglobin', fees: 800 },
  { id: '2', name: 'WBC Count', fees: 700 },
  { id: '3', name: 'Platelet Count', fees: 700 },
  { id: '4', name: 'Malaria RDT', fees: 1000 },
  { id: '5', name: 'Blood Film', fees: 500 },
  { id: '6', name: 'Total Cholesterol', fees: 1500 },
  { id: '7', name: 'HDL', fees: 1200 },
  { id: '8', name: 'LDL', fees: 1200 },
  { id: '9', name: 'Triglycerides', fees: 1100 },
  { id: '10', name: 'ALT', fees: 1200 },
  { id: '11', name: 'AST', fees: 1200 },
  { id: '12', name: 'Bilirubin', fees: 1000 },
  { id: '13', name: 'Albumin', fees: 900 },
  { id: '14', name: 'Urine pH', fees: 500 },
  { id: '15', name: 'Protein (Urine)', fees: 500 },
  { id: '16', name: 'Glucose (Urine)', fees: 500 },
  { id: '17', name: 'Blood (Urine)', fees: 500 },
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

export function AllLabTests() {
  const { addNotification } = useEMRStore();
  const [labTests, setLabTests] = useState<LabTest[]>(mockLabTests);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [testToDelete, setTestToDelete] = useState<LabTest | null>(null);
  const [editFormData, setEditFormData] = useState({
    testName: '',
    fees: 0,
    description: '',
  });

  // View Modal State
  const [selectedTests, setSelectedTests] = useState<AvailableTest[]>([]);

  // Filter and pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate KPIs
  const totalTests = labTests.length;
  const pendingTests = labTests.filter(t => t.status === 'Pending').length;
  const completedTests = labTests.filter(t => t.status === 'Completed').length;
  const testsToday = labTests.filter(t => t.createdDate === '2025-02-13').length;

  // Filter tests based on search query and status
  const filteredTests = labTests.filter((test) => {
    const matchesSearch = 
      test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.fileNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Paginate tests
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewTest = (test: LabTest) => {
    setSelectedTest(test);
    setSelectedTests([]);
    setViewModalOpen(true);
  };

  const handleEditTest = (test: LabTest) => {
    setSelectedTest(test);
    setEditFormData({
      testName: test.testName,
      fees: test.fees,
      description: test.description || '',
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (test: LabTest) => {
    setTestToDelete(test);
    setDeleteDialogOpen(true);
  };

  const handleUpdateTest = () => {
    if (!selectedTest) return;

    setLabTests((prev) =>
      prev.map((test) =>
        test.id === selectedTest.id
          ? {
              ...test,
              testName: editFormData.testName,
              fees: editFormData.fees,
              description: editFormData.description,
            }
          : test
      )
    );

    toast.success('Test Updated', {
      description: `Test ${selectedTest.testId} has been updated successfully.`,
    });

    addNotification({
      id: Date.now(),
      title: 'Test Updated',
      message: `Test ${selectedTest.testId} for ${selectedTest.patientName} has been updated`,
      type: 'success',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Low',
    });

    setEditModalOpen(false);
    setSelectedTest(null);
  };

  const confirmDelete = () => {
    if (testToDelete) {
      setLabTests(labTests.filter(t => t.id !== testToDelete.id));
      
      toast.success('Test Deleted', {
        description: `Test ${testToDelete.testId} for ${testToDelete.patientName} has been deleted.`,
      });

      addNotification({
        id: Date.now(),
        title: 'Test Deleted',
        message: `Test ${testToDelete.testId} has been removed from the system`,
        type: 'info',
        status: 'Unread',
        timestamp: new Date().toISOString(),
        priority: 'Medium',
      });

      setDeleteDialogOpen(false);
      setTestToDelete(null);
    }
  };

  const handleProcessTest = () => {
    if (!selectedTest) return;

    setLabTests((prev) =>
      prev.map((test) =>
        test.id === selectedTest.id
          ? {
              ...test,
              status: test.status === 'Pending' ? 'Paid' : 'Completed',
            }
          : test
      )
    );

    toast.success('Test Processed', {
      description: `Test processed successfully - Status: ${selectedTest.status === 'Pending' ? 'Paid' : 'Completed'}`,
    });

    addNotification({
      id: Date.now(),
      title: 'Test Processed',
      message: `${selectedTest.patientName}'s test has been processed`,
      type: 'success',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'High',
    });

    setViewModalOpen(false);
    setSelectedTest(null);
  };

  const handleAddTestToSelection = (test: AvailableTest) => {
    if (!selectedTests.find((t) => t.id === test.id)) {
      setSelectedTests((prev) => [...prev, test]);
    }
  };

  const handleRemoveTestFromSelection = (testId: string) => {
    setSelectedTests((prev) => prev.filter((t) => t.id !== testId));
  };

  const calculateTotalFees = () => {
    return selectedTests.reduce((total, test) => total + test.fees, 0);
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'Paid':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Paid</Badge>;
      case 'Completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">All Lab Tests</h1>
        <p className="text-muted-foreground">Manage and monitor all laboratory tests</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Tests" 
          value={totalTests} 
          icon={FlaskConical} 
          trend="up"
          trendValue="+12% from last week"
          color="primary"
          tooltip="Total number of lab tests in the system"
        />
        <KPICard 
          title="Pending Tests" 
          value={pendingTests} 
          icon={Clock} 
          trend="down"
          trendValue="-5% from yesterday"
          color="secondary"
          tooltip="Tests waiting to be processed"
        />
        <KPICard 
          title="Completed Tests" 
          value={completedTests} 
          icon={CheckCircle2} 
          trend="up"
          trendValue="+18% this week"
          color="secondary"
          tooltip="Tests that have been completed"
        />
        <KPICard 
          title="Tests Today" 
          value={testsToday} 
          icon={Activity} 
          trend="neutral"
          trendValue="Same as yesterday"
          color="primary"
          tooltip="Tests requested today"
        />
      </div>

      {/* Lab Tests Table */}
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
                  <FlaskConical className="w-5 h-5 text-primary" />
                  All Lab Tests
                </CardTitle>
                <CardDescription>View and manage all laboratory test requests</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tests..."
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
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline">
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
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Test ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Test Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Fees</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Created Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
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
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <p className="font-medium text-sm">{test.testId}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-sm">{test.testName}</p>
                            <p className="text-xs text-muted-foreground">{test.fileNumber}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-sm">₦{test.fees.toLocaleString()}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm">{new Date(test.createdDate).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(test.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleViewTest(test)}
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
                                    onClick={() => handleEditTest(test)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Test</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteClick(test)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete Test</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {test.status === 'Paid' && (
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => {
                                  handleProcessTest();
                                }}
                              >
                                Process
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {paginatedTests.length === 0 && (
                <div className="text-center py-12">
                  <FlaskConical className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No tests found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTests.length)} of {filteredTests.length} tests
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

      {/* View Test Modal */}
      <Dialog open={viewModalOpen} onOpenChange={(open) => !open && setViewModalOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FlaskConical className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Test Details</DialogTitle>
                <DialogDescription>
                  Complete information about the laboratory test
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedTest && (
            <div className="space-y-6 py-4">
              {/* Test Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Test Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Test ID</Label>
                    <p className="font-semibold">{selectedTest.testId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Request Date</Label>
                    <p className="font-semibold">{new Date(selectedTest.createdDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedTest.status)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p className="font-semibold">{selectedTest.category}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Requested Doctor</Label>
                    <p className="font-semibold">{selectedTest.doctor}</p>
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
                    <p className="font-semibold">{selectedTest.patientName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">File Number</Label>
                    <p className="font-semibold">{selectedTest.fileNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Age</Label>
                    <p className="font-semibold">{selectedTest.patientAge} years</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Gender</Label>
                    <p className="font-semibold">{selectedTest.patientGender}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-semibold">{selectedTest.patientPhone}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tests Requested */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tests Requested</h3>
                <div className="space-y-2">
                  {selectedTest.requestedTests?.map((test, index) => {
                    const availableTest = mockAvailableTests.find((t) => t.name === test);
                    return (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <FlaskConical className="w-4 h-4 text-primary" />
                        <span className="font-medium flex-1">{test}</span>
                        <Badge variant={availableTest ? 'default' : 'destructive'} className="text-xs">
                          {availableTest ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Available Tests Panel */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Available Tests</h3>
                <div className="border border-border rounded-lg p-4 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {mockAvailableTests.map((test) => (
                      <div
                        key={test.id}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div>
                          <div className="text-sm font-medium text-foreground">{test.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ₦{test.fees.toLocaleString()}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddTestToSelection(test)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Tests Panel */}
              {selectedTests.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Selected Tests</h3>
                    <div className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-2">
                      {selectedTests.map((test) => (
                        <div
                          key={test.id}
                          className="flex items-center justify-between p-2 bg-white rounded-lg"
                        >
                          <div>
                            <div className="text-sm font-medium text-foreground">{test.name}</div>
                            <div className="text-xs text-green-600 font-semibold">
                              ₦{test.fees.toLocaleString()}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveTestFromSelection(test.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Base Amount</Label>
                    <p className="font-semibold text-lg">₦{selectedTest.fees.toLocaleString()}</p>
                  </div>
                  {selectedTests.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground">Additional Tests</Label>
                      <p className="font-semibold text-lg">₦{calculateTotalFees().toLocaleString()}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Total Amount</Label>
                    <p className="font-bold text-2xl text-primary">
                      ₦{(selectedTest.fees + calculateTotalFees()).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
            {selectedTest && (
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={handleProcessTest}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Process Test
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Test Modal */}
      <Dialog open={editModalOpen} onOpenChange={(open) => !open && setEditModalOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Edit className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Edit Test</DialogTitle>
                <DialogDescription>
                  Update test information and details
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-testname">Test Name</Label>
              <Input
                id="edit-testname"
                value={editFormData.testName}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, testName: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-fees">Fees (₦)</Label>
              <Input
                id="edit-fees"
                type="number"
                value={editFormData.fees}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, fees: Number(e.target.value) }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-secondary hover:bg-secondary/90"
              onClick={handleUpdateTest}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Update Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete test <strong>{testToDelete?.testId}</strong> for <strong>{testToDelete?.patientName}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
