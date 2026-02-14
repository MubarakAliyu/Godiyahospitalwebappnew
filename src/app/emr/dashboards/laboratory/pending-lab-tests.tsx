import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FlaskConical, 
  Clock, 
  DollarSign, 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  CheckCircle2,
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
}

interface LabTest {
  id: string;
  fileNumber: string;
  patientName: string;
  patientId: string;
  labTests: string[];
  date: string;
  status: 'Not Paid' | 'Awaiting Payment' | 'Awaiting Results';
  fees: number;
  doctor?: string;
  patientPhone?: string;
  patientAge?: string;
  patientGender?: string;
  category?: 'OPD' | 'IPD';
  requestedTests?: string[];
}

interface AvailableTest {
  id: string;
  name: string;
  fees: number;
}

// Mock data for pending lab tests
const mockPendingTests: LabTest[] = [
  {
    id: 'LT-2025-001',
    fileNumber: 'GH-2025-001',
    patientName: 'Aisha Mohammed',
    patientId: 'P-001',
    labTests: ['Complete Blood Count', 'ESR', 'Malaria Test'],
    date: '2025-02-13',
    status: 'Not Paid',
    fees: 5000,
    doctor: 'Dr. Ibrahim Suleiman',
    patientPhone: '+234 803 456 7890',
    patientAge: '34',
    patientGender: 'Female',
    category: 'OPD',
    requestedTests: ['Hemoglobin', 'WBC Count', 'Platelet Count', 'Malaria RDT'],
  },
  {
    id: 'LT-2025-002',
    fileNumber: 'GH-2025-002',
    patientName: 'Ibrahim Usman',
    patientId: 'P-002',
    labTests: ['Urinalysis', 'Urine Culture'],
    date: '2025-02-13',
    status: 'Awaiting Payment',
    fees: 4500,
    doctor: 'Dr. Amina Yusuf',
    patientPhone: '+234 806 123 4567',
    patientAge: '45',
    patientGender: 'Male',
    category: 'OPD',
    requestedTests: ['Urine pH', 'Protein', 'Glucose'],
  },
  {
    id: 'LT-2025-003',
    fileNumber: 'GH-2025-003',
    patientName: 'Fatima Sani',
    patientId: 'P-003',
    labTests: ['Lipid Profile'],
    date: '2025-02-12',
    status: 'Awaiting Results',
    fees: 5000,
    doctor: 'Dr. Ibrahim Suleiman',
    patientPhone: '+234 805 987 6543',
    patientAge: '52',
    patientGender: 'Female',
    category: 'IPD',
    requestedTests: ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides'],
  },
  {
    id: 'LT-2025-004',
    fileNumber: 'GH-2025-004',
    patientName: 'Musa Bello',
    patientId: 'P-004',
    labTests: ['Liver Function Test', 'Kidney Function Test'],
    date: '2025-02-13',
    status: 'Not Paid',
    fees: 8500,
    doctor: 'Dr. Khadija Abubakar',
    patientPhone: '+234 807 234 5678',
    patientAge: '28',
    patientGender: 'Male',
    category: 'OPD',
    requestedTests: ['ALT', 'AST', 'Bilirubin', 'Creatinine', 'Urea'],
  },
  {
    id: 'LT-2025-005',
    fileNumber: 'GH-2025-005',
    patientName: 'Zainab Ahmad',
    patientId: 'P-005',
    labTests: ['Blood Sugar (Fasting)', 'HbA1c'],
    date: '2025-02-13',
    status: 'Awaiting Payment',
    fees: 3500,
    doctor: 'Dr. Amina Yusuf',
    patientPhone: '+234 808 345 6789',
    patientAge: '29',
    patientGender: 'Female',
    category: 'OPD',
    requestedTests: ['Fasting Blood Sugar', 'HbA1c'],
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
  { id: '13', name: 'Creatinine', fees: 900 },
  { id: '14', name: 'Urea', fees: 900 },
  { id: '15', name: 'Urine pH', fees: 500 },
  { id: '16', name: 'Protein (Urine)', fees: 500 },
  { id: '17', name: 'Glucose (Urine)', fees: 500 },
  { id: '18', name: 'Fasting Blood Sugar', fees: 1500 },
  { id: '19', name: 'HbA1c', fees: 2000 },
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

export function PendingLabTests() {
  const { addNotification } = useEMRStore();
  const [labTests, setLabTests] = useState<LabTest[]>(mockPendingTests);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  // Process Modal State
  const [selectedTests, setSelectedTests] = useState<AvailableTest[]>([]);

  // Filter and pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate KPIs
  const pendingCount = labTests.length;
  const awaitingPayment = labTests.filter(t => t.status === 'Awaiting Payment').length;
  const awaitingResults = labTests.filter(t => t.status === 'Awaiting Results').length;

  // Filter tests based on search query and status
  const filteredTests = labTests.filter((test) => {
    const matchesSearch = 
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

  const handleViewTest = (test: LabTest) => {
    setSelectedTest(test);
    setSelectedTests([]);
    setViewModalOpen(true);
  };

  const handleProcessTest = (test: LabTest) => {
    setSelectedTest(test);
    setSelectedTests([]);
    setProcessModalOpen(true);
  };

  const handleConfirmProcessTest = () => {
    if (!selectedTest) return;

    // Remove from pending list
    setLabTests((prev) => prev.filter((test) => test.id !== selectedTest.id));

    const newStatus = selectedTest.status === 'Not Paid' || selectedTest.status === 'Awaiting Payment' 
      ? 'Paid' 
      : 'Completed';

    toast.success('Lab Test Processed', {
      description: `Test ${selectedTest.id} has been processed successfully.`,
    });

    if (newStatus === 'Paid') {
      toast.success('Payment Recorded', {
        description: `Payment of ₦${(selectedTest.fees + calculateTotalFees()).toLocaleString()} recorded for ${selectedTest.patientName}.`,
      });
    }

    addNotification({
      id: Date.now(),
      title: 'Lab Test Ready',
      message: `${selectedTest.patientName}'s lab test is ready for processing`,
      type: 'success',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'High',
    });

    addNotification({
      id: Date.now() + 1,
      title: 'Invoice Generated',
      message: `Invoice for ${selectedTest.patientName} - ₦${(selectedTest.fees + calculateTotalFees()).toLocaleString()}`,
      type: 'info',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Medium',
    });

    setProcessModalOpen(false);
    setSelectedTest(null);
    setSelectedTests([]);
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
      case 'Not Paid':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Not Paid</Badge>;
      case 'Awaiting Payment':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Awaiting Payment</Badge>;
      case 'Awaiting Results':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Awaiting Results</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Pending Lab Tests</h1>
        <p className="text-muted-foreground">Manage pending laboratory tests and payments</p>
      </div>

      {/* KPI Mini Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Pending Count" 
          value={pendingCount} 
          icon={Clock} 
          trend="up"
          trendValue="+8% from yesterday"
          color="primary"
          tooltip="Total number of pending lab tests"
        />
        <KPICard 
          title="Awaiting Payment" 
          value={awaitingPayment} 
          icon={DollarSign} 
          trend="down"
          trendValue="-3% from yesterday"
          color="secondary"
          tooltip="Tests awaiting payment confirmation"
        />
        <KPICard 
          title="Awaiting Results" 
          value={awaitingResults} 
          icon={Activity} 
          trend="neutral"
          trendValue="Same as yesterday"
          color="primary"
          tooltip="Tests awaiting lab results"
        />
      </div>

      {/* Pending Tests Table */}
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
                  Pending Lab Tests
                </CardTitle>
                <CardDescription>View and process pending laboratory tests</CardDescription>
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
                    <SelectItem value="Not Paid">Not Paid</SelectItem>
                    <SelectItem value="Awaiting Payment">Awaiting Payment</SelectItem>
                    <SelectItem value="Awaiting Results">Awaiting Results</SelectItem>
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
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">File Number</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Patient Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Lab Tests</th>
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
                          <p className="font-medium text-sm">{test.id}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-sm">{test.fileNumber}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-sm">{test.patientName}</p>
                            <p className="text-xs text-muted-foreground">{test.category} Patient</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {test.labTests.map((labTest, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <FlaskConical className="w-3 h-3 text-primary" />
                                <span className="text-xs text-foreground">{labTest}</span>
                              </div>
                            ))}
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

                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                              onClick={() => handleProcessTest(test)}
                            >
                              Process
                            </Button>
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
                  <p className="text-muted-foreground">No pending tests found</p>
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

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Total Amount</Label>
                    <p className="font-bold text-2xl text-primary">₦{selectedTest.fees.toLocaleString()}</p>
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

      {/* Process Lab Test Modal */}
      <Dialog open={processModalOpen} onOpenChange={(open) => !open && setProcessModalOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-600/10">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Process Lab Test</DialogTitle>
                <DialogDescription>
                  Review and process laboratory test payment
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedTest && (
            <div className="space-y-6 py-4">
              {/* Patient Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">Patient Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Patient Name:</span>
                    <span className="ml-2 text-blue-900">{selectedTest.patientName}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">File Number:</span>
                    <span className="ml-2 text-blue-900">{selectedTest.fileNumber}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Selected Tests */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Selected Tests</h3>
                <div className="space-y-2">
                  {selectedTest.labTests.map((test, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <FlaskConical className="w-4 h-4 text-primary" />
                      <span className="font-medium flex-1">{test}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Tests Panel */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Add Additional Tests</h3>
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

              {/* Selected Additional Tests */}
              {selectedTests.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Additional Tests Selected</h3>
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

              {/* Fees Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Fees Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Base Tests</span>
                    <span className="text-sm font-semibold">₦{selectedTest.fees.toLocaleString()}</span>
                  </div>
                  {selectedTests.length > 0 && (
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Additional Tests</span>
                      <span className="text-sm font-semibold">₦{calculateTotalFees().toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg text-white">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-2xl font-bold">
                      ₦{(selectedTest.fees + calculateTotalFees()).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setProcessModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleConfirmProcessTest}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Process Lab Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}