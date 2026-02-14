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
  AlertCircle,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  ClipboardList,
  Search,
  Filter,
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
  patientName: string;
  patientId: string;
  fileNumber: string;
  tests: string[];
  testsCount: number;
  requestDate: string;
  status: 'Pending' | 'Paid' | 'Completed';
  priority: 'Normal' | 'Urgent' | 'Critical';
  doctor: string;
  amount: number;
  isPaid: boolean;
  patientPhone?: string;
  patientAge?: string;
  patientGender?: string;
  clinicalNotes?: string;
  results?: string;
}

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

interface QuickActionCardProps {
  title: string;
  count: number;
  icon: any;
  onClick: () => void;
  color?: string;
  highlight?: boolean;
}

function QuickActionCard({ title, count, icon: Icon, onClick, color = 'primary', highlight }: QuickActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          highlight ? 'border-primary border-2' : ''
        }`}
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div 
              className="p-3 rounded-xl"
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
            <Badge variant={highlight ? 'default' : 'secondary'} className="text-lg px-3 py-1">
              {count}
            </Badge>
          </div>
          <h4 className="text-lg font-semibold text-foreground">{title}</h4>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LaboratoryDashboardHome() {
  const navigate = useNavigate();
  const { addNotification } = useEMRStore();

  // State for lab tests
  const [labTests, setLabTests] = useState<LabTest[]>([
    {
      id: 'LAB-001',
      patientName: 'Fatima Ahmed',
      patientId: 'GH-P-2024-001',
      fileNumber: 'GH-F-001',
      tests: ['Full Blood Count', 'ESR'],
      testsCount: 2,
      requestDate: '2024-02-13',
      status: 'Pending',
      priority: 'Urgent',
      doctor: 'Dr. Ibrahim Suleiman',
      amount: 8500,
      isPaid: false,
      patientPhone: '+234 803 456 7890',
      patientAge: '34',
      patientGender: 'Female',
      clinicalNotes: 'Patient presenting with fever and body weakness for 3 days',
    },
    {
      id: 'LAB-002',
      patientName: 'Musa Usman',
      patientId: 'GH-P-2024-002',
      fileNumber: 'GH-F-002',
      tests: ['Urinalysis'],
      testsCount: 1,
      requestDate: '2024-02-13',
      status: 'Paid',
      priority: 'Normal',
      doctor: 'Dr. Amina Yusuf',
      amount: 3500,
      isPaid: true,
      patientPhone: '+234 806 123 4567',
      patientAge: '45',
      patientGender: 'Male',
      clinicalNotes: 'Routine check-up',
    },
    {
      id: 'LAB-003',
      patientName: 'Hauwa Bello',
      patientId: 'GH-P-2024-003',
      fileNumber: 'GH-F-003',
      tests: ['Blood Sugar (Fasting)', 'Blood Sugar (Random)'],
      testsCount: 2,
      requestDate: '2024-02-13',
      status: 'Completed',
      priority: 'Normal',
      doctor: 'Dr. Ibrahim Suleiman',
      amount: 5000,
      isPaid: true,
      patientPhone: '+234 805 987 6543',
      patientAge: '52',
      patientGender: 'Female',
      clinicalNotes: 'Diabetic patient - monitoring blood sugar levels',
      results: 'Fasting: 126 mg/dL, Random: 180 mg/dL - Elevated levels detected',
    },
    {
      id: 'LAB-004',
      patientName: 'Abdullahi Musa',
      patientId: 'GH-P-2024-004',
      fileNumber: 'GH-F-004',
      tests: ['Malaria Parasite Test', 'Full Blood Count', 'Typhoid Test'],
      testsCount: 3,
      requestDate: '2024-02-13',
      status: 'Paid',
      priority: 'Critical',
      doctor: 'Dr. Amina Yusuf',
      amount: 12000,
      isPaid: true,
      patientPhone: '+234 807 234 5678',
      patientAge: '28',
      patientGender: 'Male',
      clinicalNotes: 'High fever, chills, suspected malaria and typhoid',
    },
    {
      id: 'LAB-005',
      patientName: 'Zainab Ibrahim',
      patientId: 'GH-P-2024-005',
      fileNumber: 'GH-F-005',
      tests: ['Pregnancy Test', 'Blood Group'],
      testsCount: 2,
      requestDate: '2024-02-12',
      status: 'Completed',
      priority: 'Normal',
      doctor: 'Dr. Khadija Abubakar',
      amount: 4500,
      isPaid: true,
      patientPhone: '+234 808 345 6789',
      patientAge: '29',
      patientGender: 'Female',
      clinicalNotes: 'ANC booking visit',
      results: 'Pregnancy Test: Positive, Blood Group: O+',
    },
  ]);

  // Modal states
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<LabTest | null>(null);

  // Filter and pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Edit form state
  const [editFormData, setEditFormData] = useState<Partial<LabTest>>({});

  // Calculate KPIs
  const totalTests = labTests.length;
  const pendingTests = labTests.filter(t => t.status === 'Pending').length;
  const completedTests = labTests.filter(t => t.status === 'Completed').length;
  const testsToday = labTests.filter(t => t.requestDate === '2024-02-13').length;
  const paidTests = labTests.filter(t => t.status === 'Paid').length;

  // Filter tests
  const filteredTests = labTests.filter(test => {
    const matchesSearch = 
      test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.fileNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Paginate tests
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle View
  const handleView = (test: LabTest) => {
    setSelectedTest(test);
    setViewModalOpen(true);
  };

  // Handle Edit
  const handleEdit = (test: LabTest) => {
    setSelectedTest(test);
    setEditFormData(test);
    setEditModalOpen(true);
  };

  // Handle Delete
  const handleDeleteClick = (test: LabTest) => {
    setTestToDelete(test);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (testToDelete) {
      setLabTests(labTests.filter(t => t.id !== testToDelete.id));
      toast.success('Test Deleted', {
        description: `Test ${testToDelete.id} for ${testToDelete.patientName} has been deleted.`,
      });
      addNotification({
        id: Date.now(),
        title: 'Test Deleted',
        message: `Test ${testToDelete.id} has been removed from the system`,
        type: 'info',
        status: 'Unread',
        timestamp: new Date().toISOString(),
        priority: 'Medium',
      });
      setDeleteDialogOpen(false);
      setTestToDelete(null);
    }
  };

  // Handle Edit Save
  const handleEditSave = () => {
    if (selectedTest && editFormData) {
      setLabTests(labTests.map(t => 
        t.id === selectedTest.id ? { ...t, ...editFormData } : t
      ));
      toast.success('Test Updated', {
        description: `Test ${selectedTest.id} has been updated successfully.`,
      });
      addNotification({
        id: Date.now(),
        title: 'Test Updated',
        message: `Test ${selectedTest.id} for ${selectedTest.patientName} has been updated`,
        type: 'success',
        status: 'Unread',
        timestamp: new Date().toISOString(),
        priority: 'Low',
      });
      setEditModalOpen(false);
      setSelectedTest(null);
    }
  };

  // Process Test
  const handleProcessTest = (test: LabTest) => {
    const updatedTests = labTests.map(t => 
      t.id === test.id ? { ...t, status: 'Completed' as const } : t
    );
    setLabTests(updatedTests);
    toast.success('Test Processed', {
      description: `Test ${test.id} for ${test.patientName} has been marked as completed.`,
    });
    addNotification({
      id: Date.now(),
      title: 'Test Completed',
      message: `${test.patientName}'s ${test.tests.join(', ')} test has been completed`,
      type: 'success',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'High',
    });
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

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'Urgent':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Urgent</Badge>;
      case 'Normal':
        return <Badge variant="secondary">Normal</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Laboratory Dashboard</h1>
        <p className="text-muted-foreground">Manage lab tests, results, and diagnostic services</p>
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

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="All Tests"
            count={totalTests}
            icon={ClipboardList}
            onClick={() => {
              navigate('/emr/laboratory-staff/all-lab-tests');
            }}
            color="primary"
            highlight={statusFilter === 'all'}
          />
          <QuickActionCard
            title="Pending Tests"
            count={pendingTests}
            icon={Clock}
            onClick={() => {
              navigate('/emr/laboratory-staff/pending-tests');
            }}
            color="secondary"
            highlight={statusFilter === 'Pending'}
          />
          <QuickActionCard
            title="Paid Tests"
            count={paidTests}
            icon={DollarSign}
            onClick={() => {
              setStatusFilter('Paid');
              toast.info('Showing Paid Tests');
            }}
            color="secondary"
            highlight={statusFilter === 'Paid'}
          />
          <QuickActionCard
            title="Invoices"
            count={labTests.filter(t => t.isPaid).length}
            icon={FileText}
            onClick={() => {
              navigate('/emr/laboratory/invoices');
              toast.info('Opening Invoices');
            }}
            color="primary"
          />
        </div>
      </div>

      {/* Recent Lab Tests Table */}
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
                  Recent Lab Tests
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
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Patient Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Tests Count</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Priority</th>
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
                          <p className="font-medium text-sm">{test.id}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-sm">{test.patientName}</p>
                            <p className="text-xs text-muted-foreground">{test.fileNumber}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary">{test.testsCount} {test.testsCount === 1 ? 'Test' : 'Tests'}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm">{new Date(test.requestDate).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4 px-4">
                          {getPriorityBadge(test.priority)}
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
                                    onClick={() => handleView(test)}
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
                                    onClick={() => handleEdit(test)}
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
                                onClick={() => handleProcessTest(test)}
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
                    <p className="font-semibold">{selectedTest.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Request Date</Label>
                    <p className="font-semibold">{new Date(selectedTest.requestDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedTest.status)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Priority</Label>
                    <div className="mt-1">{getPriorityBadge(selectedTest.priority)}</div>
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
                      <span className="font-medium">{test}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Clinical Notes */}
              {selectedTest.clinicalNotes && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Clinical Notes</h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">{selectedTest.clinicalNotes}</p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Test Results */}
              {selectedTest.results && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Test Results</h3>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-900">{selectedTest.results}</p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Amount</Label>
                    <p className="font-semibold text-lg">₦{selectedTest.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Payment Status</Label>
                    <div className="mt-1">
                      <Badge variant={selectedTest.isPaid ? 'default' : 'destructive'}>
                        {selectedTest.isPaid ? 'Paid' : 'Unpaid'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
            {selectedTest && selectedTest.status === 'Paid' && (
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  handleProcessTest(selectedTest);
                  setViewModalOpen(false);
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Completed
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editFormData.status} 
                  onValueChange={(value: any) => setEditFormData({...editFormData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select 
                  value={editFormData.priority} 
                  onValueChange={(value: any) => setEditFormData({...editFormData, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Clinical Notes</Label>
              <Textarea
                id="edit-notes"
                value={editFormData.clinicalNotes || ''}
                onChange={(e) => setEditFormData({...editFormData, clinicalNotes: e.target.value})}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-results">Test Results</Label>
              <Textarea
                id="edit-results"
                value={editFormData.results || ''}
                onChange={(e) => setEditFormData({...editFormData, results: e.target.value})}
                rows={4}
                placeholder="Enter test results here..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount (₦)</Label>
              <Input
                id="edit-amount"
                type="number"
                value={editFormData.amount || ''}
                onChange={(e) => setEditFormData({...editFormData, amount: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-secondary hover:bg-secondary/90"
              onClick={handleEditSave}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save Changes
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
              Are you sure you want to delete test <strong>{testToDelete?.id}</strong> for <strong>{testToDelete?.patientName}</strong>? This action cannot be undone.
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