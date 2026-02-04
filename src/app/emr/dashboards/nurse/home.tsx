import { motion } from 'motion/react';
import { Activity, Users, Bed, Syringe, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

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

export function NurseDashboardHome() {
  const admissionRequests = [
    { id: 1, patient: 'Fatima Ahmed', reason: 'Post-Surgery Care', priority: 'High', time: '08:30 AM' },
    { id: 2, patient: 'Musa Usman', reason: 'Observation', priority: 'Normal', time: '10:00 AM' },
    { id: 3, patient: 'Hauwa Bello', reason: 'IV Treatment', priority: 'Normal', time: '11:30 AM' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Nurse Dashboard</h1>
        <p className="text-muted-foreground">Monitor vitals, admissions, and patient care activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Pending Vitals" value="14" icon={Activity} color="primary" />
        <KPICard title="Completed Vitals" value="32" icon={CheckCircle2} color="secondary" />
        <KPICard title="Admission Requests" value="5" icon={Bed} color="primary" />
        <KPICard title="Today's Patients" value="47" icon={Users} color="secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Bed className="w-5 h-5 text-primary" />
                Admission Requests
              </CardTitle>
              <Badge variant="secondary">5 Pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {admissionRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-foreground">{request.patient}</p>
                        <Badge variant={request.priority === 'High' ? 'destructive' : 'outline'}>
                          {request.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.reason} • {request.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">Review</Button>
                      <Button size="sm">Admit</Button>
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
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-all">
                  <Activity className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-center">Record Vitals</p>
                </button>
                <button className="p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-all">
                  <Bed className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-center">Admit Patient</p>
                </button>
                <button className="p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-all">
                  <Syringe className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-center">Surgery Request</p>
                </button>
                <button className="p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-all">
                  <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-center">View Patients</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
