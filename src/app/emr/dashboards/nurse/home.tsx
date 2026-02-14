import { motion, AnimatePresence } from 'motion/react';
import { Activity, Users, Bed, Syringe, CheckCircle2, Clock, Calendar, Stethoscope, UserPlus, ArrowRight, AlertTriangle, TrendingUp, TrendingDown, Minus, X, Eye, FileText, Phone, MapPin, Mail, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { useEMRStore } from '@/app/emr/store/emr-store';
import { useState, useEffect } from 'react';
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
import { Separator } from '@/app/components/ui/separator';
import { Label } from '@/app/components/ui/label';

interface KPICardProps {
  title: string;
  value: number;
  icon: any;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  tooltip?: string;
}

function KPICard({ title, value, icon: Icon, color = 'primary', trend, trendValue, tooltip }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate number transition
  useEffect(() => {
    let startValue = 0;
    const duration = 1000; // 1 second
    const increment = value / (duration / 16); // 60fps
    
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
            whileHover={{ y: -4 }}
          >
            <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4" style={{ borderLeftColor: color === 'primary' ? '#1e40af' : '#059669' }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{title}</p>
                    <div className="flex items-end gap-2">
                      <h3 className="text-3xl font-bold text-foreground">{displayValue}</h3>
                      {trend && trendValue && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor()} mb-1`}>
                          {getTrendIcon()}
                          <span>{trendValue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: color === 'primary' ? '#1e40af15' : '#05966915' }}>
                    <Icon className="w-6 h-6" style={{ color: color === 'primary' ? '#1e40af' : '#059669' }} />
                  </div>
                </div>
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

interface RequestCardProps {
  title: string;
  count: number;
  icon: any;
  onClick: () => void;
  highlight?: boolean;
}

function RequestCard({ title, count, icon: Icon, onClick, highlight }: RequestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${highlight && count > 0 ? 'border-orange-500 border-2 bg-orange-50/50' : ''}`}
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${highlight && count > 0 ? 'bg-orange-500/10' : 'bg-primary/10'}`}>
                <Icon className={`w-6 h-6 ${highlight && count > 0 ? 'text-orange-600' : 'text-primary'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className={`text-2xl font-bold ${highlight && count > 0 ? 'text-orange-600' : 'text-foreground'}`}>
                    {count}
                  </h3>
                  {count > 0 && (
                    <Badge variant={highlight ? "destructive" : "secondary"}>
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Type definitions for requests
interface AdmissionRequest {
  id: number;
  fileId: string;
  patient: string;
  age: number;
  gender: string;
  phone: string;
  reason: string;
  diagnosis: string;
  priority: 'High' | 'Normal' | 'Critical';
  time: string;
  date: string;
  doctor: string;
  department: string;
  wardType: string;
  notes: string;
}

interface ReferralRequest {
  id: number;
  fileId: string;
  patient: string;
  age: number;
  gender: string;
  phone: string;
  referFrom: string;
  referTo: string;
  department: string;
  specialist: string;
  reason: string;
  diagnosis: string;
  priority: 'High' | 'Normal' | 'Critical';
  time: string;
  date: string;
  doctor: string;
  notes: string;
}

interface SurgeryRequest {
  id: number;
  fileId: string;
  patient: string;
  age: number;
  gender: string;
  phone: string;
  surgeryType: string;
  department: string;
  surgeon: string;
  anesthetist: string;
  priority: 'High' | 'Normal' | 'Critical';
  scheduledDate: string;
  scheduledTime: string;
  duration: string;
  diagnosis: string;
  preOpInstructions: string;
  time: string;
  date: string;
  doctor: string;
  notes: string;
}

export function NurseDashboardHome() {
  const { appointments, patients } = useEMRStore();
  const navigate = useNavigate();
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  // Modal states
  const [selectedAdmissionRequest, setSelectedAdmissionRequest] = useState<AdmissionRequest | null>(null);
  const [selectedReferralRequest, setSelectedReferralRequest] = useState<ReferralRequest | null>(null);
  const [selectedSurgeryRequest, setSelectedSurgeryRequest] = useState<SurgeryRequest | null>(null);

  // Calculate KPIs from real data
  const pendingAppointments = appointments.filter(a => a.status === 'Scheduled').length;
  const confirmedAppointments = appointments.filter(a => a.status === 'In Progress').length;
  const completedAppointments = appointments.filter(a => a.status === 'Completed').length;
  const ipdPatients = patients.filter(p => p.patientType === 'Inpatient' && p.status === 'Admitted').length;

  // Mock request data (in real app, these would come from store)
  const admissionRequests: AdmissionRequest[] = [
    { 
      id: 1, 
      fileId: 'GH-F-1234', 
      patient: 'Fatima Ahmed', 
      age: 34, 
      gender: 'Female', 
      phone: '08012345678',
      reason: 'Post-Surgery Care', 
      diagnosis: 'Appendicitis - Post Appendectomy',
      priority: 'High', 
      time: '08:30 AM', 
      date: 'Feb 11, 2026',
      doctor: 'Dr. Musa Ibrahim',
      department: 'General Surgery',
      wardType: 'Female Ward - Bed 12',
      notes: 'Patient requires close monitoring post-surgery. Antibiotics and pain management protocol initiated.'
    },
    { 
      id: 2, 
      fileId: 'GH-F-1235', 
      patient: 'Musa Usman', 
      age: 45, 
      gender: 'Male', 
      phone: '08098765432',
      reason: 'Observation', 
      diagnosis: 'Chest Pain - Suspected Angina',
      priority: 'Normal', 
      time: '10:00 AM', 
      date: 'Feb 11, 2026',
      doctor: 'Dr. Aisha Bello',
      department: 'Cardiology',
      wardType: 'Male Ward - Bed 8',
      notes: 'Admit for cardiac monitoring. ECG and troponin levels to be monitored regularly.'
    },
    { 
      id: 3, 
      fileId: 'GH-F-1236', 
      patient: 'Hauwa Bello', 
      age: 28, 
      gender: 'Female', 
      phone: '08087654321',
      reason: 'IV Treatment', 
      diagnosis: 'Severe Dehydration - Gastroenteritis',
      priority: 'Normal', 
      time: '11:30 AM', 
      date: 'Feb 11, 2026',
      doctor: 'Dr. Yusuf Mohammed',
      department: 'Internal Medicine',
      wardType: 'Female Ward - Bed 15',
      notes: 'Requires IV fluid replacement and electrolyte monitoring. NPO until stable.'
    },
  ];

  const referralRequests: ReferralRequest[] = [
    {
      id: 1,
      fileId: 'GH-F-2234',
      patient: 'Ibrahim Sani',
      age: 52,
      gender: 'Male',
      phone: '08023456789',
      referFrom: 'General Medicine',
      referTo: 'Cardiology',
      department: 'Cardiology',
      specialist: 'Dr. Aminu Kano',
      reason: 'Suspected Heart Disease',
      diagnosis: 'Persistent chest pain with elevated blood pressure',
      priority: 'High',
      time: '09:15 AM',
      date: 'Feb 11, 2026',
      doctor: 'Dr. Fatima Suleiman',
      notes: 'Patient has history of hypertension. Needs urgent cardiology assessment and possible angiography.'
    },
    {
      id: 2,
      fileId: 'GH-F-2235',
      patient: 'Zainab Lawal',
      age: 38,
      gender: 'Female',
      phone: '08034567890',
      referFrom: 'General Medicine',
      referTo: 'Orthopedics',
      department: 'Orthopedics',
      specialist: 'Dr. Hassan Danjuma',
      reason: 'Chronic Joint Pain',
      diagnosis: 'Suspected Rheumatoid Arthritis',
      priority: 'Normal',
      time: '02:30 PM',
      date: 'Feb 11, 2026',
      doctor: 'Dr. Aisha Bello',
      notes: 'Patient experiencing severe joint pain in hands and knees. Requires specialist evaluation and treatment plan.'
    }
  ];

  const surgeryRequests: SurgeryRequest[] = [
    {
      id: 1,
      fileId: 'GH-F-3234',
      patient: 'Abubakar Mohammed',
      age: 48,
      gender: 'Male',
      phone: '08045678901',
      surgeryType: 'Hernia Repair',
      department: 'General Surgery',
      surgeon: 'Dr. Musa Ibrahim',
      anesthetist: 'Dr. Khadija Umar',
      priority: 'Normal',
      scheduledDate: 'Feb 13, 2026',
      scheduledTime: '10:00 AM',
      duration: '2 hours',
      diagnosis: 'Inguinal Hernia',
      preOpInstructions: 'NPO after midnight. Pre-operative antibiotics to be administered 1 hour before surgery.',
      time: '03:45 PM',
      date: 'Feb 11, 2026',
      doctor: 'Dr. Musa Ibrahim',
      notes: 'Elective hernia repair. Patient has been cleared by anesthesia. No known drug allergies.'
    }
  ];

  const admissionRequestsCount = admissionRequests.length;
  const referRequestsCount = referralRequests.length;
  const surgeryRequestsCount = surgeryRequests.length;

  const totalRequests = admissionRequestsCount + referRequestsCount + surgeryRequestsCount;

  // Toast notifications for new requests
  useEffect(() => {
    if (totalRequests > lastNotificationCount && lastNotificationCount > 0) {
      toast.info('New Request Received', {
        description: 'You have new pending requests that require attention.',
      });
    }
    setLastNotificationCount(totalRequests);
  }, [totalRequests]);

  // Handle actions
  const handleAdmitPatient = (request: AdmissionRequest) => {
    toast.success('Patient Admitted', {
      description: `${request.patient} has been successfully admitted to ${request.wardType}`,
    });
    setSelectedAdmissionRequest(null);
  };

  const handleApproveReferral = (request: ReferralRequest) => {
    toast.success('Referral Approved', {
      description: `${request.patient} has been referred to ${request.department}`,
    });
    setSelectedReferralRequest(null);
  };

  const handleApproveSurgery = (request: SurgeryRequest) => {
    toast.success('Surgery Scheduled', {
      description: `${request.surgeryType} for ${request.patient} scheduled for ${request.scheduledDate}`,
    });
    setSelectedSurgeryRequest(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Nurse Dashboard</h1>
        <p className="text-muted-foreground">Monitor vitals, admissions, and patient care activities</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Pending Appointments" 
          value={pendingAppointments} 
          icon={Clock} 
          color="primary"
          trend="up"
          trendValue="+3"
          tooltip="Total appointments scheduled and waiting"
        />
        <KPICard 
          title="Confirmed Appointments" 
          value={confirmedAppointments} 
          icon={Calendar} 
          color="secondary"
          trend="neutral"
          trendValue="0"
          tooltip="Appointments currently in progress"
        />
        <KPICard 
          title="Completed Appointments" 
          value={completedAppointments} 
          icon={CheckCircle2} 
          color="secondary"
          trend="up"
          trendValue="+12"
          tooltip="Appointments completed today"
        />
        <KPICard 
          title="Total IPD Patients" 
          value={ipdPatients} 
          icon={Users} 
          color="primary"
          trend="down"
          trendValue="-2"
          tooltip="Currently admitted inpatients"
        />
      </div>

      {/* Requests Summary */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Requests Summary</h2>
          {totalRequests > 0 && (
            <Badge variant="destructive" className="text-sm">
              {totalRequests} Pending
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RequestCard
            title="Admission Requests"
            count={admissionRequestsCount}
            icon={Bed}
            onClick={() => toast.info('Navigating to admission requests...')}
            highlight={true}
          />
          <RequestCard
            title="Refer Requests"
            count={referRequestsCount}
            icon={UserPlus}
            onClick={() => toast.info('Navigating to refer requests...')}
            highlight={true}
          />
          <RequestCard
            title="Surgery Requests"
            count={surgeryRequestsCount}
            icon={Syringe}
            onClick={() => toast.info('Navigating to surgery requests...')}
            highlight={true}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admission Requests Detail */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Bed className="w-5 h-5 text-primary" />
                Recent Admission Requests
              </CardTitle>
              <Badge variant="secondary">{admissionRequestsCount} Pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {admissionRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-foreground">{request.patient}</p>
                          <Badge variant={request.priority === 'High' ? 'destructive' : 'outline'} className="text-xs">
                            {request.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          File: {request.fileId} • {request.doctor} • {request.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('View button clicked for admission:', request);
                            setSelectedAdmissionRequest(request);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdmitPatient(request);
                          }}
                        >
                          Admit
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <Button variant="ghost" className="w-full mt-4" onClick={() => toast.info('View all admission requests...')}>
                View All Admission Requests
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className="p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-all group"
                  onClick={() => navigate('/emr/nurse/appointments')}
                >
                  <Activity className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-center">View Appointments</p>
                </button>
                <button 
                  className="p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-all group"
                  onClick={() => navigate('/emr/nurse/patients')}
                >
                  <Users className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-center">Patient Management</p>
                </button>
                <button 
                  className="p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-all group"
                  onClick={() => toast.info('Admit Patient feature coming soon...')}
                >
                  <Bed className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-center">Admit Patient</p>
                </button>
                <button 
                  className="p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-all group"
                  onClick={() => toast.info('Surgery Request feature coming soon...')}
                >
                  <Syringe className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-center">Surgery Request</p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Alert Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            {totalRequests > 0 && (
              <Card className="border-orange-500/50 bg-orange-50/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-900">Pending Requests</p>
                      <p className="text-sm text-orange-700 mt-1">
                        You have {totalRequests} pending request{totalRequests > 1 ? 's' : ''} that require immediate attention.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Additional Request Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Requests */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-secondary" />
                Recent Referral Requests
              </CardTitle>
              <Badge variant="secondary">{referRequestsCount} Pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {referralRequests.map((request, index) => (
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
                        <Badge variant={request.priority === 'High' ? 'destructive' : 'outline'} className="text-xs">
                          {request.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {request.referFrom} → {request.referTo} • {request.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('View button clicked for referral:', request);
                          setSelectedReferralRequest(request);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-secondary hover:bg-secondary/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveReferral(request);
                        }}
                      >
                        Approve
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Surgery Requests */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Syringe className="w-5 h-5 text-primary" />
                Recent Surgery Requests
              </CardTitle>
              <Badge variant="secondary">{surgeryRequestsCount} Pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {surgeryRequests.map((request, index) => (
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
                        <Badge variant={request.priority === 'High' ? 'destructive' : 'outline'} className="text-xs">
                          {request.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.surgeryType}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {request.surgeon} • {request.scheduledDate} at {request.scheduledTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('View button clicked for surgery:', request);
                          setSelectedSurgeryRequest(request);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveSurgery(request);
                        }}
                      >
                        Schedule
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Admission Request Modal */}
      <Dialog 
        open={selectedAdmissionRequest !== null} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedAdmissionRequest(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bed className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Admission Request Details</DialogTitle>
                <DialogDescription>
                  Review patient information and admission request
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedAdmissionRequest && (
            <div className="space-y-6 py-4">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label className="text-xs text-muted-foreground">Full Name</Label>
                    <p className="font-semibold">{selectedAdmissionRequest.patient}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">File Number</Label>
                    <p className="font-mono font-semibold">{selectedAdmissionRequest.fileId}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Age / Gender</Label>
                    <p className="font-semibold">{selectedAdmissionRequest.age} years • {selectedAdmissionRequest.gender}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <p className="font-semibold">{selectedAdmissionRequest.phone}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Admission Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Admission Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Request Date & Time</Label>
                      <p className="font-semibold">{selectedAdmissionRequest.date} at {selectedAdmissionRequest.time}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Priority</Label>
                      <div className="mt-1">
                        <Badge variant={selectedAdmissionRequest.priority === 'High' ? 'destructive' : 'outline'}>
                          {selectedAdmissionRequest.priority}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Requesting Doctor</Label>
                      <p className="font-semibold">{selectedAdmissionRequest.doctor}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Department</Label>
                      <p className="font-semibold">{selectedAdmissionRequest.department}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Reason for Admission</Label>
                    <p className="font-semibold mt-1">{selectedAdmissionRequest.reason}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Diagnosis</Label>
                    <p className="font-semibold mt-1">{selectedAdmissionRequest.diagnosis}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Proposed Ward / Bed</Label>
                    <p className="font-semibold mt-1">{selectedAdmissionRequest.wardType}</p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Label className="text-xs text-blue-900 font-semibold">Clinical Notes</Label>
                    <p className="text-sm text-blue-900 mt-2">{selectedAdmissionRequest.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAdmissionRequest(null)}>
              Close
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => selectedAdmissionRequest && handleAdmitPatient(selectedAdmissionRequest)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Admit Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Referral Request Modal */}
      <Dialog 
        open={selectedReferralRequest !== null} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedReferralRequest(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <UserPlus className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Referral Request Details</DialogTitle>
                <DialogDescription>
                  Review patient referral information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedReferralRequest && (
            <div className="space-y-6 py-4">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-secondary" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label className="text-xs text-muted-foreground">Full Name</Label>
                    <p className="font-semibold">{selectedReferralRequest.patient}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">File Number</Label>
                    <p className="font-mono font-semibold">{selectedReferralRequest.fileId}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Age / Gender</Label>
                    <p className="font-semibold">{selectedReferralRequest.age} years • {selectedReferralRequest.gender}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <p className="font-semibold">{selectedReferralRequest.phone}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Referral Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  Referral Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Refer From</Label>
                      <p className="font-semibold">{selectedReferralRequest.referFrom}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Refer To</Label>
                      <p className="font-semibold text-secondary">{selectedReferralRequest.referTo}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Specialist</Label>
                      <p className="font-semibold">{selectedReferralRequest.specialist}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Priority</Label>
                      <div className="mt-1">
                        <Badge variant={selectedReferralRequest.priority === 'High' ? 'destructive' : 'outline'}>
                          {selectedReferralRequest.priority}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Referring Doctor</Label>
                      <p className="font-semibold">{selectedReferralRequest.doctor}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Request Date & Time</Label>
                      <p className="font-semibold">{selectedReferralRequest.date} at {selectedReferralRequest.time}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Reason for Referral</Label>
                    <p className="font-semibold mt-1">{selectedReferralRequest.reason}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Clinical Diagnosis</Label>
                    <p className="font-semibold mt-1">{selectedReferralRequest.diagnosis}</p>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Label className="text-xs text-green-900 font-semibold">Clinical Notes</Label>
                    <p className="text-sm text-green-900 mt-2">{selectedReferralRequest.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReferralRequest(null)}>
              Close
            </Button>
            <Button 
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => selectedReferralRequest && handleApproveReferral(selectedReferralRequest)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Referral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Surgery Request Modal */}
      <Dialog 
        open={selectedSurgeryRequest !== null} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedSurgeryRequest(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Syringe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Surgery Request Details</DialogTitle>
                <DialogDescription>
                  Review surgical procedure information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedSurgeryRequest && (
            <div className="space-y-6 py-4">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label className="text-xs text-muted-foreground">Full Name</Label>
                    <p className="font-semibold">{selectedSurgeryRequest.patient}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">File Number</Label>
                    <p className="font-mono font-semibold">{selectedSurgeryRequest.fileId}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Age / Gender</Label>
                    <p className="font-semibold">{selectedSurgeryRequest.age} years • {selectedSurgeryRequest.gender}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <p className="font-semibold">{selectedSurgeryRequest.phone}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Surgery Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Surgery Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Surgery Type</Label>
                      <p className="font-semibold">{selectedSurgeryRequest.surgeryType}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Department</Label>
                      <p className="font-semibold">{selectedSurgeryRequest.department}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Surgeon</Label>
                      <p className="font-semibold">{selectedSurgeryRequest.surgeon}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Anesthetist</Label>
                      <p className="font-semibold">{selectedSurgeryRequest.anesthetist}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Scheduled Date</Label>
                      <p className="font-semibold">{selectedSurgeryRequest.scheduledDate}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Scheduled Time</Label>
                      <p className="font-semibold">{selectedSurgeryRequest.scheduledTime}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Duration</Label>
                      <p className="font-semibold">{selectedSurgeryRequest.duration}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Priority</Label>
                      <div className="mt-1">
                        <Badge variant={selectedSurgeryRequest.priority === 'High' ? 'destructive' : 'outline'}>
                          {selectedSurgeryRequest.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Diagnosis</Label>
                    <p className="font-semibold mt-1">{selectedSurgeryRequest.diagnosis}</p>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <Label className="text-xs text-purple-900 font-semibold">Pre-Operative Instructions</Label>
                    <p className="text-sm text-purple-900 mt-2">{selectedSurgeryRequest.preOpInstructions}</p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Label className="text-xs text-blue-900 font-semibold">Additional Notes</Label>
                    <p className="text-sm text-blue-900 mt-2">{selectedSurgeryRequest.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSurgeryRequest(null)}>
              Close
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => selectedSurgeryRequest && handleApproveSurgery(selectedSurgeryRequest)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm Surgery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}