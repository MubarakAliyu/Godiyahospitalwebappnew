import { motion } from 'motion/react';
import { FlaskConical, Clock, CheckCircle2, TrendingUp, Activity } from 'lucide-react';
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

export function LaboratoryDashboardHome() {
  const pendingTests = [
    { id: 'LAB-001', patient: 'Fatima Ahmed', test: 'Full Blood Count', priority: 'High', time: '09:00 AM' },
    { id: 'LAB-002', patient: 'Musa Usman', test: 'Urinalysis', priority: 'Normal', time: '10:30 AM' },
    { id: 'LAB-003', patient: 'Hauwa Bello', test: 'Blood Sugar', priority: 'Urgent', time: '11:00 AM' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Laboratory Dashboard</h1>
        <p className="text-muted-foreground">Manage lab tests, results, and diagnostic services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Tests" value="145" icon={FlaskConical} color="primary" />
        <KPICard title="Pending Tests" value="18" icon={Clock} color="secondary" />
        <KPICard title="Completed Tests" value="127" icon={CheckCircle2} color="secondary" />
        <KPICard title="Tests Today" value="24" icon={Activity} color="primary" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Pending Tests
            </CardTitle>
            <Button size="sm">
              <FlaskConical className="w-4 h-4 mr-2" />
              Add Test
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-foreground">{test.patient}</p>
                      <Badge variant={test.priority === 'Urgent' ? 'destructive' : 'outline'}>
                        {test.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{test.test} • {test.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-medium text-foreground">{test.time}</p>
                    <Button size="sm" variant="outline">Process</Button>
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
