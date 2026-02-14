import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pill,
  AlertTriangle,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  Minus,
  ShoppingCart,
  FileText,
  Calendar,
  ClipboardList,
  PackageSearch,
  PackagePlus,
  Eye,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { useEMRStore } from '@/app/emr/store/emr-store';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';

interface KPICardProps {
  title: string;
  value: number;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
  tooltip?: string;
  prefix?: string;
  onClick?: () => void;
  clickable?: boolean;
}

interface Drug {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  price: number;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired';
}

interface Prescription {
  id: string;
  prescriptionId: string;
  patientName: string;
  fileNumber: string;
  date: string;
  status: 'Pending' | 'Paid' | 'Dispensed';
  amount: number;
  drugs: string[];
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'restock' | 'prescription' | 'alert';
  description: string;
  timestamp: string;
  amount?: number;
  status?: string;
}

// Mock data
const mockDrugs: Drug[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Analgesic', quantity: 45, reorderLevel: 100, price: 50, expiryDate: '2026-12-31', status: 'Low Stock' },
  { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotic', quantity: 28, reorderLevel: 80, price: 150, expiryDate: '2026-08-15', status: 'Low Stock' },
  { id: '3', name: 'Ibuprofen 400mg', category: 'Analgesic', quantity: 62, reorderLevel: 100, price: 75, expiryDate: '2026-10-20', status: 'Low Stock' },
  { id: '4', name: 'Omeprazole 20mg', category: 'Antacid', quantity: 0, reorderLevel: 50, price: 200, expiryDate: '2027-03-10', status: 'Out of Stock' },
  { id: '5', name: 'Metformin 500mg', category: 'Antidiabetic', quantity: 150, reorderLevel: 100, price: 120, expiryDate: '2026-05-25', status: 'In Stock' },
  { id: '6', name: 'Ciprofloxacin 500mg', category: 'Antibiotic', quantity: 5, reorderLevel: 60, price: 180, expiryDate: '2025-01-15', status: 'Expired' },
  { id: '7', name: 'Cetirizine 10mg', category: 'Antihistamine', quantity: 220, reorderLevel: 100, price: 60, expiryDate: '2027-02-28', status: 'In Stock' },
  { id: '8', name: 'Lisinopril 10mg', category: 'Antihypertensive', quantity: 35, reorderLevel: 70, price: 160, expiryDate: '2025-01-10', status: 'Expired' },
];

const mockPrescriptions: Prescription[] = [
  { id: '1', prescriptionId: 'GH-RX-001', patientName: 'Aisha Mohammed', fileNumber: 'GH-2025-001', date: '2025-02-13', status: 'Pending', amount: 3500, drugs: ['Paracetamol 500mg', 'Amoxicillin 250mg'] },
  { id: '2', prescriptionId: 'GH-RX-002', patientName: 'Ibrahim Usman', fileNumber: 'GH-2025-002', date: '2025-02-13', status: 'Paid', amount: 5200, drugs: ['Metformin 500mg', 'Lisinopril 10mg'] },
  { id: '3', prescriptionId: 'GH-RX-003', patientName: 'Fatima Sani', fileNumber: 'GH-2025-003', date: '2025-02-13', status: 'Dispensed', amount: 2100, drugs: ['Ibuprofen 400mg'] },
  { id: '4', prescriptionId: 'GH-RX-004', patientName: 'Musa Bello', fileNumber: 'GH-2025-004', date: '2025-02-12', status: 'Pending', amount: 4800, drugs: ['Ciprofloxacin 500mg', 'Omeprazole 20mg'] },
  { id: '5', prescriptionId: 'GH-RX-005', patientName: 'Zainab Ahmad', fileNumber: 'GH-2025-005', date: '2025-02-12', status: 'Paid', amount: 3300, drugs: ['Cetirizine 10mg', 'Paracetamol 500mg'] },
];

const mockRecentActivity: RecentActivity[] = [
  { id: '1', type: 'sale', description: 'Dispensed prescription GH-RX-002 to Ibrahim Usman', timestamp: '2025-02-13T10:30:00', amount: 5200, status: 'Completed' },
  { id: '2', type: 'restock', description: 'Restocked Paracetamol 500mg - Added 200 units', timestamp: '2025-02-13T09:15:00' },
  { id: '3', type: 'prescription', description: 'New prescription GH-RX-001 received for Aisha Mohammed', timestamp: '2025-02-13T08:45:00', status: 'Pending' },
  { id: '4', type: 'alert', description: 'Low stock alert: Amoxicillin 250mg (28 units remaining)', timestamp: '2025-02-13T08:00:00', status: 'Warning' },
  { id: '5', type: 'sale', description: 'Walk-in sale completed - ₦1,200', timestamp: '2025-02-12T16:20:00', amount: 1200, status: 'Completed' },
];

function KPICard({ title, value, icon: Icon, trend, trendValue, color = 'primary', tooltip, prefix = '', onClick, clickable = false }: KPICardProps) {
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
            <Card 
              className={`hover:shadow-lg transition-all hover:-translate-y-1 h-full ${clickable ? 'cursor-pointer' : ''}`}
              onClick={clickable ? onClick : undefined}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-foreground">
                      {prefix}{displayValue.toLocaleString()}
                    </h3>
                  </div>
                  <div 
                    className={`p-3 rounded-xl`}
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
                {clickable && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-primary font-medium">
                    <span>View details</span>
                    <ArrowRight className="w-3 h-3" />
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

export function PharmacyDashboardHome() {
  const { addNotification } = useEMRStore();
  const navigate = useNavigate();

  // State
  const [drugs] = useState<Drug[]>(mockDrugs);
  const [prescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [recentActivity] = useState<RecentActivity[]>(mockRecentActivity);

  // Calculate KPIs
  const totalDrugs = drugs.length;
  const lowStockCount = drugs.filter(d => d.status === 'Low Stock' || d.status === 'Out of Stock').length;
  const expiredCount = drugs.filter(d => d.status === 'Expired').length;
  
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending').length;
  const paidPrescriptions = prescriptions.filter(p => p.status === 'Paid' || p.status === 'Dispensed').length;
  const totalIncome = prescriptions.filter(p => p.status === 'Paid' || p.status === 'Dispensed').reduce((sum, p) => sum + p.amount, 0);
  const totalInventoryValue = drugs.reduce((sum, d) => sum + (d.price * d.quantity), 0);

  // Low stock items
  const lowStockItems = drugs.filter(d => d.status === 'Low Stock').slice(0, 5);

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ShoppingCart className="w-4 h-4 text-green-600" />;
      case 'restock':
        return <PackagePlus className="w-4 h-4 text-blue-600" />;
      case 'prescription':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Pending</Badge>;
      case 'Paid':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Paid</Badge>;
      case 'Dispensed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Dispensed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle quick actions
  const handleQuickAction = (action: string) => {
    if (action === 'New Sale') {
      navigate('/emr/pharmacy-staff/add-sales');
      return;
    }

    toast.info(`${action} Action`, {
      description: 'This feature will be available in the next update.',
    });

    addNotification({
      id: Date.now(),
      title: `${action} Initiated`,
      message: `You initiated ${action.toLowerCase()} action`,
      type: 'info',
      status: 'Unread',
      timestamp: new Date().toISOString(),
      priority: 'Medium',
    });
  };

  // Handle card clicks
  const handleLowStockClick = () => {
    toast.info('Low Stock Items', {
      description: 'Navigating to low stock inventory...',
    });
  };

  const handleExpiredClick = () => {
    toast.info('Expired Drugs', {
      description: 'Navigating to expired drugs list...',
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Pharmacy Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Pharmacist - Manage inventory, prescriptions, and drug sales</p>
      </div>

      {/* KPI Section 1 - Inventory Overview */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Inventory Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Total Drugs" 
            value={totalDrugs} 
            icon={Pill} 
            trend="up"
            trendValue="+12 new drugs this month"
            color="primary"
            tooltip="Total number of drugs in inventory"
          />
          <KPICard 
            title="Low Stock" 
            value={lowStockCount} 
            icon={AlertTriangle} 
            trend="down"
            trendValue="Requires immediate attention"
            color="destructive"
            tooltip="Drugs below reorder level"
            clickable
            onClick={handleLowStockClick}
          />
          <KPICard 
            title="Expired Items" 
            value={expiredCount} 
            icon={PackageSearch} 
            trend="neutral"
            trendValue="Remove from stock"
            color="destructive"
            tooltip="Drugs past expiry date"
            clickable
            onClick={handleExpiredClick}
          />
          <KPICard 
            title="Total Inventory Value" 
            value={totalInventoryValue} 
            icon={DollarSign} 
            trend="up"
            trendValue="+8% from last month"
            color="secondary"
            tooltip="Total value of all drugs in stock"
            prefix="₦"
          />
        </div>
      </div>

      {/* KPI Section 2 - Prescription & Sales */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Prescription & Sales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Pending Prescriptions" 
            value={pendingPrescriptions} 
            icon={Clock} 
            trend="up"
            trendValue="+3 new today"
            color="warning"
            tooltip="Prescriptions awaiting payment"
          />
          <KPICard 
            title="Paid Prescriptions" 
            value={paidPrescriptions} 
            icon={CheckCircle} 
            trend="up"
            trendValue="+15% from yesterday"
            color="secondary"
            tooltip="Prescriptions paid and dispensed"
          />
          <KPICard 
            title="Total Income" 
            value={totalIncome} 
            icon={DollarSign} 
            trend="up"
            trendValue="+22% from last week"
            color="primary"
            tooltip="Revenue from paid prescriptions"
            prefix="₦"
          />
          <KPICard 
            title="Avg. Prescription Value" 
            value={paidPrescriptions > 0 ? Math.floor(totalIncome / paidPrescriptions) : 0} 
            icon={TrendingUp} 
            trend="up"
            trendValue="+5% improvement"
            color="secondary"
            tooltip="Average revenue per prescription"
            prefix="₦"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Low Stock Alerts
                  </CardTitle>
                  <CardDescription>Drugs requiring immediate restock</CardDescription>
                </div>
                <Badge variant="destructive" className="h-6">
                  {lowStockCount} Items
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {lowStockItems.map((drug, index) => (
                    <motion.div
                      key={drug.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{drug.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Category: {drug.category} • Reorder Level: {drug.reorderLevel}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-destructive">{drug.quantity}</p>
                          <p className="text-xs text-muted-foreground">units left</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            drug.quantity === 0 
                              ? 'bg-red-50 text-red-700 border-red-200' 
                              : drug.quantity < drug.reorderLevel / 2
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }
                        >
                          {drug.quantity === 0 ? 'Out of Stock' : 'Low'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {lowStockItems.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">All drugs are adequately stocked</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>Frequently used operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary"
                  onClick={() => handleQuickAction('New Sale')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">New Sale</p>
                      <p className="text-xs text-muted-foreground">Record drug dispensing</p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary"
                  onClick={() => handleQuickAction('Restock Inventory')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <PackagePlus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Restock Inventory</p>
                      <p className="text-xs text-muted-foreground">Update drug quantities</p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary"
                  onClick={() => handleQuickAction('Process Prescription')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Process Prescription</p>
                      <p className="text-xs text-muted-foreground">Dispense medications</p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary"
                  onClick={() => handleQuickAction('Add New Drug')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100">
                      <Pill className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Add New Drug</p>
                      <p className="text-xs text-muted-foreground">Register new medication</p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary"
                  onClick={() => handleQuickAction('Generate Report')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <ClipboardList className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Generate Report</p>
                      <p className="text-xs text-muted-foreground">Sales and inventory reports</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity & Pending Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest pharmacy operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.timestamp).toLocaleString('en-GB', { 
                            day: '2-digit', 
                            month: 'short', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-600">₦{activity.amount.toLocaleString()}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Prescriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Pending Prescriptions
                  </CardTitle>
                  <CardDescription>Awaiting payment and dispensing</CardDescription>
                </div>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 h-6">
                  {pendingPrescriptions} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {prescriptions.filter(p => p.status === 'Pending').slice(0, 5).map((prescription, index) => (
                    <motion.div
                      key={prescription.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{prescription.prescriptionId}</p>
                        <p className="text-sm text-muted-foreground">{prescription.patientName}</p>
                        <p className="text-xs text-muted-foreground mt-1">{prescription.drugs.join(', ')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">₦{prescription.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{new Date(prescription.date).toLocaleDateString('en-GB')}</p>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Details</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {prescriptions.filter(p => p.status === 'Pending').length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">No pending prescriptions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}