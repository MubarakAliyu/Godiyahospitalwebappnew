import { motion } from 'motion/react';
import { Pill, AlertTriangle, DollarSign, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

function KPICard({ title, value, icon: Icon, trend, trendValue, color = 'primary' }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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

export function PharmacyDashboardHome() {
  const lowStockItems = [
    { drug: 'Paracetamol 500mg', stock: 45, reorderLevel: 100, status: 'Low' },
    { drug: 'Amoxicillin 250mg', stock: 28, reorderLevel: 80, status: 'Critical' },
    { drug: 'Ibuprofen 400mg', stock: 62, reorderLevel: 100, status: 'Low' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Pharmacy Dashboard</h1>
        <p className="text-muted-foreground">Manage inventory, prescriptions, and drug sales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Drugs" value="486" icon={Pill} color="primary" />
        <KPICard title="Low Stock Count" value="8" icon={AlertTriangle} color="destructive" />
        <KPICard title="Expired Items" value="3" icon={Package} color="destructive" />
        <KPICard title="Revenue Today" value="₦124,500" icon={DollarSign} trend="up" trendValue="+15%" color="secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{item.drug}</p>
                      <p className="text-sm text-muted-foreground">Reorder level: {item.reorderLevel}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">{item.stock}</p>
                        <p className="text-xs text-muted-foreground">units left</p>
                      </div>
                      <Badge variant={item.status === 'Critical' ? 'destructive' : 'outline'}>
                        {item.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-all text-left">
                  <div className="flex items-center gap-3">
                    <Pill className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Add New Sale</p>
                      <p className="text-xs text-muted-foreground">Record drug dispensing</p>
                    </div>
                  </div>
                </button>
                <button className="w-full p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-all text-left">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Restock Inventory</p>
                      <p className="text-xs text-muted-foreground">Update drug quantities</p>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
