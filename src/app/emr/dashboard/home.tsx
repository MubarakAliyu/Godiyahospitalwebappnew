import { motion } from 'motion/react';
import { Users, Calendar, FlaskConical, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Skeleton } from '@/app/components/ui/skeleton';

const kpiCards = [
  {
    title: 'Total Patients',
    value: '1,234',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Today Appointments',
    value: '48',
    change: '+5.2%',
    trend: 'up',
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Pending Lab Results',
    value: '23',
    change: '-3.1%',
    trend: 'down',
    icon: FlaskConical,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Revenue Today',
    value: '₦245,000',
    change: '+18.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
];

const recentActivities = [
  { activity: 'New patient registration', module: 'Patient Management', user: 'Dr. Ibrahim', time: '5 mins ago', status: 'completed' },
  { activity: 'Lab test requested', module: 'Laboratory', user: 'Nurse Aisha', time: '12 mins ago', status: 'pending' },
  { activity: 'Invoice payment received', module: 'Billing', user: 'Admin', time: '23 mins ago', status: 'completed' },
  { activity: 'Appointment scheduled', module: 'Appointments', user: 'Receptionist', time: '35 mins ago', status: 'completed' },
  { activity: 'Prescription dispensed', module: 'Pharmacy', user: 'Pharmacist Musa', time: '1 hour ago', status: 'completed' },
];

const systemAlerts = [
  { message: '2 unpaid invoices pending', severity: 'warning' },
  { message: '1 critical lab result pending review', severity: 'error' },
  { message: '3 new patient registrations today', severity: 'info' },
];

export function DashboardHome() {
  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                      <h3 className="text-2xl font-semibold mb-2">{kpi.value}</h3>
                      <div className="flex items-center gap-1">
                        <TrendingUp className={`w-4 h-4 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'} ${kpi.trend === 'down' ? 'rotate-180' : ''}`} />
                        <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {kpi.change}
                        </span>
                        <span className="text-sm text-muted-foreground">from last week</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                      <Icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Area (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Visits Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <Skeleton className="h-32 w-full" />
                </div>
                <p className="text-sm text-muted-foreground">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <Skeleton className="h-32 w-full" />
                </div>
                <p className="text-sm text-muted-foreground">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Activity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Module</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">{activity.activity}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{activity.module}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{activity.user}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{activity.time}</td>
                      <td className="py-3 px-4">
                        <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border flex items-start gap-3 ${
                  alert.severity === 'error' ? 'bg-red-50 border-red-200' :
                  alert.severity === 'warning' ? 'bg-orange-50 border-orange-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <AlertCircle className={`w-5 h-5 mt-0.5 shrink-0 ${
                  alert.severity === 'error' ? 'text-red-600' :
                  alert.severity === 'warning' ? 'text-orange-600' :
                  'text-blue-600'
                }`} />
                <p className="text-sm">{alert.message}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
