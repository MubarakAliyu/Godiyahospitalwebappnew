import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FlaskConical, 
  DollarSign, 
  CheckCircle2, 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  FileText,
  Search,
  Download,
  X,
  Upload,
  FileImage,
  User,
  Calendar,
  Clock
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

interface TestRequest {
  id: string;
  testName: string;
  remarks: string;
  technicianComments: string;
}

interface PaidLabTest {
  id: string;
  invoiceId: string;
  fileNumber: string;
  patientName: string;
  patientId: string;
  tests: string[];
  testsCount: number;
  date: string;
  status: 'Paid' | 'Completed';
  amount: number;
  doctor: string;
  patientPhone?: string;
  patientAge?: string;
  patientGender?: string;
  category?: 'OPD' | 'IPD';
  technicianId?: string;
  testRequests?: TestRequest[];
}

// Mock data for paid lab tests
const mockPaidTests: PaidLabTest[] = [
  {
    id: 'LT-2025-001',
    invoiceId: 'INV-LAB-001',
    fileNumber: 'GH-2025-001',
    patientName: 'Aisha Mohammed',
    patientId: 'P-001',
    tests: ['Complete Blood Count', 'ESR', 'Malaria Test'],
    testsCount: 3,
    date: '2025-02-13',
    status: 'Paid',
    amount: 5000,
    doctor: 'Dr. Ibrahim Suleiman',
    patientPhone: '+234 803 456 7890',
    patientAge: '34',
    patientGender: 'Female',
    category: 'OPD',
    technicianId: 'TECH-001',
    testRequests: [
      { id: '1', testName: 'Complete Blood Count', remarks: '', technicianComments: '' },
      { id: '2', testName: 'ESR', remarks: '', technicianComments: '' },
      { id: '3', testName: 'Malaria Test', remarks: '', technicianComments: '' },
    ],
  },
  {
    id: 'LT-2025-002',
    invoiceId: 'INV-LAB-002',
    fileNumber: 'GH-2025-002',
    patientName: 'Ibrahim Usman',
    patientId: 'P-002',
    tests: ['Urinalysis', 'Urine Culture'],
    testsCount: 2,
    date: '2025-02-13',
    status: 'Paid',
    amount: 4500,
    doctor: 'Dr. Amina Yusuf',
    patientPhone: '+234 806 123 4567',
    patientAge: '45',
    patientGender: 'Male',
    category: 'OPD',
    technicianId: 'TECH-002',
    testRequests: [
      { id: '1', testName: 'Urinalysis', remarks: '', technicianComments: '' },
      { id: '2', testName: 'Urine Culture', remarks: '', technicianComments: '' },
    ],
  },
  {
    id: 'LT-2025-003',
    invoiceId: 'INV-LAB-003',
    fileNumber: 'GH-2025-003',
    patientName: 'Fatima Sani',
    patientId: 'P-003',
    tests: ['Lipid Profile'],
    testsCount: 1,
    date: '2025-02-12',
    status: 'Completed',
    amount: 5000,
    doctor: 'Dr. Ibrahim Suleiman',
    patientPhone: '+234 805 987 6543',
    patientAge: '52',
    patientGender: 'Female',
    category: 'IPD',
    technicianId: 'TECH-001',
    testRequests: [
      { id: '1', testName: 'Lipid Profile', remarks: 'Fasting required', technicianComments: 'Sample collected at 8 AM' },
    ],
  },
  {
    id: 'LT-2025-004',
    invoiceId: 'INV-LAB-004',
    fileNumber: 'GH-2025-004',
    patientName: 'Musa Bello',
    patientId: 'P-004',
    tests: ['Liver Function Test', 'Kidney Function Test'],
    testsCount: 2,
    date: '2025-02-13',
    status: 'Paid',
    amount: 8500,
    doctor: 'Dr. Khadija Abubakar',
    patientPhone: '+234 807 234 5678',
    patientAge: '28',
    patientGender: 'Male',
    category: 'OPD',
    technicianId: 'TECH-003',
    testRequests: [
      { id: '1', testName: 'Liver Function Test', remarks: '', technicianComments: '' },
      { id: '2', testName: 'Kidney Function Test', remarks: '', technicianComments: '' },
    ],
  },
  {
    id: 'LT-2025-005',
    invoiceId: 'INV-LAB-005',
    fileNumber: 'GH-2025-005',
    patientName: 'Zainab Ahmad',
    patientId: 'P-005',
    tests: ['Blood Sugar (Fasting)', 'HbA1c'],
    testsCount: 2,
    date: '2025-02-13',
    status: 'Paid',
    amount: 3500,
    doctor: 'Dr. Amina Yusuf',
    patientPhone: '+234 808 345 6789',
    patientAge: '29',
    patientGender: 'Female',
    category: 'OPD',
    technicianId: 'TECH-002',
    testRequests: [
      { id: '1', testName: 'Blood Sugar (Fasting)', remarks: 'Patient fasted for 12 hours', technicianComments: '' },
      { id: '2', testName: 'HbA1c', remarks: '', technicianComments: '' },
    ],
  },
  {
    id: 'LT-2025-006',
    invoiceId: 'INV-LAB-006',
    fileNumber: 'GH-2025-006',
    patientName: 'Umar Abdullahi',
    patientId: 'P-006',
    tests: ['X-Ray Chest', 'Sputum Culture'],
    testsCount: 2,
    date: '2025-02-12',
    status: 'Completed',
    amount: 7000,
    doctor: 'Dr. Ibrahim Suleiman',
    patientPhone: '+234 809 456 7890',
    patientAge: '38',
    patientGender: 'Male',
    category: 'IPD',
    technicianId: 'TECH-001',
    testRequests: [
      { id: '1', testName: 'X-Ray Chest', remarks: 'AP and Lateral views', technicianComments: 'Images uploaded' },
      { id: '2', testName: 'Sputum Culture', remarks: '', technicianComments: 'Results attached' },
    ],
  },
  {
    id: 'LT-2025-007',
    invoiceId: 'INV-LAB-007',
    fileNumber: 'GH-2025-007',
    patientName: 'Hauwa Ibrahim',
    patientId: 'P-007',
    tests: ['Thyroid Function Test'],
    testsCount: 1,
    date: '2025-02-13',
    status: 'Paid',
    amount: 6500,
    doctor: 'Dr. Khadija Abubakar',
    patientPhone: '+234 810 567 8901',
    patientAge: '41',
    patientGender: 'Female',
    category: 'OPD',
    technicianId: 'TECH-003',
    testRequests: [
      { id: '1', testName: 'Thyroid Function Test', remarks: '', technicianComments: '' },
    ],
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

export function PaidLabTests() {
  const { addNotification } = useEMRStore();
  const [labTests, setLabTests] = useState<PaidLabTest[]>(mockPaidTests);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addResultsModalOpen, setAddResultsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<PaidLabTest | null>(null);

  // Add Results Modal State
  const [resultMode, setResultMode] = useState<'summary' | 'upload'>('summary');
  const [summaryResults, setSummaryResults] = useState('');
  const [testRequests, setTestRequests] = useState<TestRequest[]>([]);
  const [technicianId, setTechnicianId] = useState('');

  // Filter and pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate KPIs
  const paidTestsCount = labTests.filter(t => t.status === 'Paid').length;
  const completedTestsCount = labTests.filter(t => t.status === 'Completed').length;
  const totalRevenue = labTests.reduce((sum, test) => sum + test.amount, 0);

  // Filter tests based on search query and status
  const filteredTests = labTests.filter((test) => {
    const matchesSearch = 
      test.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.fileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Paginate tests
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewTest = (test: PaidLabTest) => {
    setSelectedTest(test);
    setViewModalOpen(true);
  };

  const handleAddResults = (test: PaidLabTest) => {
    setSelectedTest(test);
    setTestRequests(test.testRequests || []);
    setTechnicianId(test.technicianId || '');
    setSummaryResults('');
    setResultMode('summary');
    setAddResultsModalOpen(true);
  };

  const handleSaveResults = () => {
    if (!selectedTest) return;

    // Validation
    if (resultMode === 'summary' && !summaryResults.trim()) {
      toast.error('Error', {
        description: 'Please enter summary results before saving.',
      });
      return;
    }

    if (!technicianId.trim()) {
      toast.error('Error', {
        description: 'Please enter Technician ID.',
      });
      return;
    }

    // Update test status to Completed
    setLabTests((prev) =>
      prev.map((test) =>
        test.id === selectedTest.id
          ? { ...test, status: 'Completed' as const, testRequests: testRequests }
          : test
      )
    );

    // Show success toast
    toast.success('Results Saved Successfully', {
      description: `Lab results for ${selectedTest.patientName} have been saved and marked as completed.`,
    });

    // Add notifications for Doctor and Nurse
    addNotification({
      id: Date.now(),
      title: 'Lab Results Ready',
      message: `Lab results ready for ${selectedTest.patientName} (${selectedTest.fileNumber})`,
      type: 'success',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'High',
    });

    addNotification({
      id: Date.now() + 1,
      title: 'Lab Test Completed',
      message: `${selectedTest.tests.join(', ')} completed for ${selectedTest.patientName}`,
      type: 'info',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Medium',
    });

    // Close modal and reset
    setAddResultsModalOpen(false);
    setSelectedTest(null);
    setTestRequests([]);
    setTechnicianId('');
    setSummaryResults('');
  };

  const handleUpdateTestRequest = (testId: string, field: 'remarks' | 'technicianComments', value: string) => {
    setTestRequests((prev) =>
      prev.map((test) =>
        test.id === testId ? { ...test, [field]: value } : test
      )
    );
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Paid Lab Tests</h1>
        <p className="text-muted-foreground">Manage paid laboratory tests and add test results</p>
      </div>

      {/* KPI Mini Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Paid Tests" 
          value={paidTestsCount} 
          icon={DollarSign} 
          trend="up"
          trendValue="+12% from yesterday"
          color="primary"
          tooltip="Total number of paid lab tests"
        />
        <KPICard 
          title="Completed Tests" 
          value={completedTestsCount} 
          icon={CheckCircle2} 
          trend="up"
          trendValue="+8% from yesterday"
          color="secondary"
          tooltip="Tests with results submitted"
        />
        <KPICard 
          title="Total Revenue" 
          value={totalRevenue} 
          icon={Activity} 
          trend="up"
          trendValue="+15% from yesterday"
          color="primary"
          tooltip="Total revenue from paid lab tests"
        />
      </div>

      {/* Paid Tests Table */}
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
                  Paid Lab Tests
                </CardTitle>
                <CardDescription>View paid tests and add laboratory results</CardDescription>
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
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
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
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Invoice ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">File Number</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Test(s)</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
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
                          <p className="font-medium text-sm">{test.invoiceId}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-sm">{test.fileNumber}</p>
                            <p className="text-xs text-muted-foreground">{test.patientName}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {test.tests.slice(0, 2).map((testName, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <FlaskConical className="w-3 h-3 text-primary" />
                                <span className="text-xs text-foreground">{testName}</span>
                              </div>
                            ))}
                            {test.tests.length > 2 && (
                              <p className="text-xs text-muted-foreground">+{test.tests.length - 2} more</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm">{new Date(test.date).toLocaleDateString()}</p>
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

                            {test.status === 'Paid' && (
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => handleAddResults(test)}
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Add Results
                              </Button>
                            )}

                            {test.status === 'Completed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-200 text-green-700"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Completed
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
                  <p className="text-muted-foreground">No paid tests found</p>
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
                    <p className="font-semibold">{selectedTest.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Invoice ID</Label>
                    <p className="font-semibold">{selectedTest.invoiceId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Request Date</Label>
                    <p className="font-semibold">{new Date(selectedTest.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedTest.status)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p className="font-semibold">{selectedTest.category}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Technician ID</Label>
                    <p className="font-semibold">{selectedTest.technicianId || 'N/A'}</p>
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
                  {selectedTest.tests.map((test, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <FlaskConical className="w-4 h-4 text-primary" />
                      <span className="font-medium flex-1">{test}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Total Amount</Label>
                    <p className="font-bold text-2xl text-primary">₦{selectedTest.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Payment Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedTest.status)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Test Results Modal */}
      <Dialog open={addResultsModalOpen} onOpenChange={(open) => !open && setAddResultsModalOpen(false)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Add Test Results</DialogTitle>
                <DialogDescription>
                  Enter laboratory test results and remarks
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedTest && (
            <div className="space-y-6 py-4">
              {/* Patient Info Header */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">File No</Label>
                    <p className="font-semibold">{selectedTest.fileNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Date</Label>
                    <p className="font-semibold">{new Date(selectedTest.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Technician ID</Label>
                    <Input
                      value={technicianId}
                      onChange={(e) => setTechnicianId(e.target.value)}
                      placeholder="Enter technician ID"
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tests Requested Block */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tests Requested</h3>
                <div className="space-y-4">
                  {testRequests.map((test, index) => (
                    <div key={test.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-primary" />
                        <h4 className="font-semibold">{test.testName}</h4>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <Label className="text-sm">Remarks</Label>
                          <Textarea
                            value={test.remarks}
                            onChange={(e) => handleUpdateTestRequest(test.id, 'remarks', e.target.value)}
                            placeholder="Enter any remarks or observations..."
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm">Technician Comments</Label>
                          <Textarea
                            value={test.technicianComments}
                            onChange={(e) => handleUpdateTestRequest(test.id, 'technicianComments', e.target.value)}
                            placeholder="Enter technician comments..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Mode Toggle */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Result Mode</h3>
                <div className="flex gap-3">
                  <Button
                    variant={resultMode === 'summary' ? 'default' : 'outline'}
                    onClick={() => setResultMode('summary')}
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Summary Mode
                  </Button>
                  <Button
                    variant={resultMode === 'upload' ? 'default' : 'outline'}
                    onClick={() => setResultMode('upload')}
                    className="flex-1"
                  >
                    <FileImage className="w-4 h-4 mr-2" />
                    Picture/PDF Mode
                  </Button>
                </div>
              </div>

              {/* Summary Result or Upload */}
              {resultMode === 'summary' ? (
                <div>
                  <Label>Summary Result</Label>
                  <Textarea
                    value={summaryResults}
                    onChange={(e) => setSummaryResults(e.target.value)}
                    placeholder="Enter summary of test results..."
                    rows={6}
                    className="mt-2"
                  />
                </div>
              ) : (
                <div>
                  <Label>Upload Picture/PDF</Label>
                  <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddResultsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveResults} className="bg-primary hover:bg-primary/90">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
