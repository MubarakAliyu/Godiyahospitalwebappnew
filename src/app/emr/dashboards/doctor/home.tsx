import { motion } from 'motion/react';
import { Calendar, Users, CheckCircle2, Clock, Activity, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

function KPICard({ title, value, icon: Icon, color = 'primary' }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <h3 className="text-3xl font-bold text-foreground">{value}</h3>
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

export function DoctorDashboardHome() {
  const todayAppointments = [
    { id: 1, patient: 'Fatima Ahmed', time: '09:00 AM', type: 'Consultation', status: 'Scheduled' },
    { id: 2, patient: 'Musa Usman', time: '10:30 AM', type: 'Follow-up', status: 'Completed' },
    { id: 3, patient: 'Hauwa Bello', time: '11:15 AM', type: 'Consultation', status: 'In Progress' },
    { id: 4, patient: 'Ibrahim Sani', time: '02:00 PM', type: 'Check-up', status: 'Scheduled' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Manage appointments, consultations, and patient care</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Today's Appointments" value="8" icon={Calendar} color="primary" />
        <KPICard title="Pending Consultations" value="3" icon={Clock} color="secondary" />
        <KPICard title="Completed Consultations" value="12" icon={CheckCircle2} color="secondary" />
        <KPICard title="Referral Requests" value="2" icon={FileText} color="primary" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium text-foreground">{appointment.time}</p>
                    <Badge variant={appointment.status === 'Completed' ? 'default' : 'outline'}>
                      {appointment.status}
                    </Badge>
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
