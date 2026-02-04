import { motion } from 'motion/react';
import { 
  UserPlus, 
  Calendar, 
  DollarSign, 
  Users,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

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

export function ReceptionDashboardHome() {
  const upcomingAppointments = [
    { id: 1, patient: 'Fatima Ahmed', time: '09:00 AM', doctor: 'Dr. Ibrahim', status: 'Confirmed' },
    { id: 2, patient: 'Musa Usman', time: '10:30 AM', doctor: 'Dr. Aisha', status: 'Pending' },
    { id: 3, patient: 'Hauwa Bello', time: '11:15 AM', doctor: 'Dr. Yusuf', status: 'Confirmed' },
    { id: 4, patient: 'Ibrahim Sani', time: '02:00 PM', doctor: 'Dr. Halima', status: 'Confirmed' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Reception Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="New Registrations Today"
          value="12"
          icon={UserPlus}
          trend="up"
          trendValue="+8% from yesterday"
          color="primary"
        />
        <KPICard
          title="Pending Payments"
          value="8"
          icon={DollarSign}
          trend="down"
          trendValue="-3 from yesterday"
          color="secondary"
        />
        <KPICard
          title="Upcoming Appointments"
          value="24"
          icon={Calendar}
          trend="up"
          trendValue="+5% this week"
          color="primary"
        />
        <KPICard
          title="Total Patients Today"
          value="45"
          icon={Users}
          color="secondary"
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-auto py-4 flex-col gap-2" variant="outline">
                <UserPlus className="w-5 h-5" />
                <span>Add New Patient</span>
              </Button>
              <Button className="h-auto py-4 flex-col gap-2" variant="outline">
                <Calendar className="w-5 h-5" />
                <span>Create Appointment</span>
              </Button>
              <Button className="h-auto py-4 flex-col gap-2" variant="outline">
                <DollarSign className="w-5 h-5" />
                <span>Record Payment</span>
              </Button>
              <Button className="h-auto py-4 flex-col gap-2" variant="outline">
                <Users className="w-5 h-5" />
                <span>View All Patients</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-foreground">{appointment.time}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {appointment.status === 'Confirmed' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-secondary" />
                            <span className="text-xs text-secondary">Confirmed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span className="text-xs text-yellow-600">Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
