import { motion } from 'motion/react';
import { 
  DollarSign, 
  Receipt, 
  CreditCard, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

// KPI Card Component
function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'primary'
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  trend?: 'up' | 'down'; 
  trendValue?: string;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <h3 className="text-3xl font-bold text-foreground">{value}</h3>
              {trend && trendValue && (
                <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-secondary' : 'text-destructive'}`}>
                  <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-${color}/10`}>
              <Icon className={`w-6 h-6 text-${color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CashierDashboardHome() {
  const recentTransactions = [
    { id: 'INV-001', patient: 'Fatima Ahmed', amount: '₦15,000', type: 'Consultation', status: 'Completed', time: '09:15 AM' },
    { id: 'INV-002', patient: 'Musa Usman', amount: '₦8,500', type: 'Laboratory', status: 'Pending', time: '10:30 AM' },
    { id: 'INV-003', patient: 'Hauwa Bello', amount: '₦12,000', type: 'Pharmacy', status: 'Completed', time: '11:00 AM' },
    { id: 'INV-004', patient: 'Ibrahim Sani', amount: '₦25,000', type: 'Admission', status: 'Completed', time: '01:45 PM' },
  ];

  const paymentMethods = [
    { method: 'Cash', count: 45, percentage: 55 },
    { method: 'Bank Transfer', count: 28, percentage: 35 },
    { method: 'Card', count: 8, percentage: 10 },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Cashier Dashboard</h1>
        <p className="text-muted-foreground">Track payments, invoices, and financial transactions</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue Today"
          value="₦287,500"
          icon={DollarSign}
          trend="up"
          trendValue="+12% from yesterday"
          color="secondary"
        />
        <KPICard
          title="Pending Payments"
          value="12"
          icon={Clock}
          trend="down"
          trendValue="-5 from yesterday"
          color="primary"
        />
        <KPICard
          title="Completed Transactions"
          value="81"
          icon={CheckCircle2}
          trend="up"
          trendValue="+18% this week"
          color="secondary"
        />
        <KPICard
          title="Invoice Volume"
          value="93"
          icon={Receipt}
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-foreground">{transaction.patient}</p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{transaction.id}</span>
                        <span>•</span>
                        <span>{transaction.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-lg text-foreground">{transaction.amount}</p>
                      {transaction.status === 'Completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={method.method}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{method.method}</span>
                        <span className="text-sm text-muted-foreground">{method.count} payments</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${method.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.2 * index }}
                          className="absolute inset-y-0 left-0 bg-primary rounded-full"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{method.percentage}% of total</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
