import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, User, Phone, MapPin, Calendar, Clock, Activity,
  Heart, Thermometer, Droplet, Wind, Scale, Ruler, FileText,
  Stethoscope, PlusCircle, Trash2, Save, CheckCircle, UserPlus,
  Send, AlertTriangle, History, Pill, TestTube, X, ChevronDown,
  ChevronUp, Edit, Lock, Unlock, CheckCircle2, Info
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Separator } from '@/app/components/ui/separator';
import { toast } from 'sonner';

// Interfaces
interface Vitals {
  temperature: string;
  bloodPressure: string;
  heartRate: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  weight: string;
  height: string;
  rbs: string;
  bmi: string;
  recordedBy?: string;
  recordedAt?: string;
}

interface ExaminationNotes {
  complaint: string;
  diagnosis: string;
  observations: string;
}

interface FollowUp {
  date: string;
  type: string;
  instructions: string;
}

interface Prescription {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface LabTest {
  id: string;
  testName: string;
  priority: string;
  notes: string;
}

interface HistoryRecord {
  date: string;
  diagnosis: string;
  prescription: string;
  doctor: string;
}

interface ConsultationAction {
  id: string;
  type: 'admitted' | 'referred' | 'surgery';
  timestamp: Date;
  details: any;
}

interface ConsultationState {
  hasUnsavedChanges: boolean;
  actions: ConsultationAction[];
  vitalsEditable: boolean;
}

// Finish Consultation Modal
function FinishConsultationModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-secondary" />
            Complete Consultation?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to complete this consultation? This action can be edited later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground">
            ✓ All consultation data will be saved<br />
            ✓ Prescription will be generated<br />
            ✓ Patient records will be updated<br />
            ✓ You can edit this consultation later if needed
          </p>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-secondary hover:bg-secondary/90">
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm & Complete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// History Modal
function HistoryModal({
  isOpen,
  onClose,
  records,
}: {
  isOpen: boolean;
  onClose: () => void;
  records: HistoryRecord[];
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <History className="w-6 h-6 text-primary" />
            Patient History
          </DialogTitle>
          <DialogDescription>
            Complete medical history and past consultations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No previous consultation records found</p>
            </div>
          ) : (
            records.map((record, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-muted/30 rounded-lg p-4 border border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{record.diagnosis}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Dr. {record.doctor}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {new Date(record.date).toLocaleDateString()}
                  </Badge>
                </div>
                <Separator className="my-2" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Prescription:</p>
                  <p className="text-sm">{record.prescription}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Admit Patient Modal
function AdmitPatientModal({
  isOpen,
  onClose,
  onConfirm,
  patientData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { ward: string }) => void;
  patientData: any;
}) {
  const [ward, setWard] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" />
            Admit Patient
          </DialogTitle>
          <DialogDescription>
            Admit {patientData.fullName} to a ward
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Label htmlFor="ward">Ward</Label>
          <Select
            value={ward}
            onValueChange={(value) => setWard(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General Ward">General Ward</SelectItem>
              <SelectItem value="ICU">ICU</SelectItem>
              <SelectItem value="Surgical Ward">Surgical Ward</SelectItem>
              <SelectItem value="Isolation Ward">Isolation Ward</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              onConfirm({ ward });
              onClose();
            }}
            className="bg-secondary hover:bg-secondary/90"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Admit Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Refer Patient Modal
function ReferPatientModal({
  isOpen,
  onClose,
  onConfirm,
  patientData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { referTo: string }) => void;
  patientData: any;
}) {
  const [referTo, setReferTo] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Send className="w-6 h-6 text-primary" />
            Refer Patient
          </DialogTitle>
          <DialogDescription>
            Refer {patientData.fullName} to a specialist
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Label htmlFor="referTo">Refer to</Label>
          <Select
            value={referTo}
            onValueChange={(value) => setReferTo(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select specialist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cardiologist">Cardiologist</SelectItem>
              <SelectItem value="Neurologist">Neurologist</SelectItem>
              <SelectItem value="Ophthalmologist">Ophthalmologist</SelectItem>
              <SelectItem value="Dermatologist">Dermatologist</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              onConfirm({ referTo });
              onClose();
            }}
            className="bg-secondary hover:bg-secondary/90"
          >
            <Send className="w-4 h-4 mr-2" />
            Refer Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Surgery Request Modal
function SurgeryRequestModal({
  isOpen,
  onClose,
  onConfirm,
  patientData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { surgeryType: string }) => void;
  patientData: any;
}) {
  const [surgeryType, setSurgeryType] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-primary" />
            Surgery Request
          </DialogTitle>
          <DialogDescription>
            Request surgery for {patientData.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Label htmlFor="surgeryType">Surgery Type</Label>
          <Select
            value={surgeryType}
            onValueChange={(value) => setSurgeryType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select surgery type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Appendectomy">Appendectomy</SelectItem>
              <SelectItem value="Hysterectomy">Hysterectomy</SelectItem>
              <SelectItem value="Gallbladder Removal">Gallbladder Removal</SelectItem>
              <SelectItem value="Hip Replacement">Hip Replacement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              onConfirm({ surgeryType });
              onClose();
            }}
            className="bg-secondary hover:bg-secondary/90"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Request Surgery
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DoctorConsultationPage() {
  const navigate = useNavigate();
  const { patientId } = useParams();

  // Mock data - replace with actual API call
  const patientData = {
    fullName: 'Aisha Mohammed',
    fileNumber: 'GH-PT-00001',
    dob: '1995-03-15',
    gender: 'Female',
    phone: '08012345678',
    address: 'No. 45, Emir Haruna Road, Birnin Kebbi',
  };

  const appointmentData = {
    appointmentNo: 'APT-001',
    date: new Date().toISOString(),
    shift: 'Morning',
    priority: 'Normal',
    status: 'In Progress',
    paymentStatus: 'Paid',
  };

  // State management
  const [vitals, setVitals] = useState<Vitals>({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    rbs: '',
    bmi: '',
  });

  const [examinationNotes, setExaminationNotes] = useState<ExaminationNotes>({
    complaint: '',
    diagnosis: '',
    observations: '',
  });

  const [followUp, setFollowUp] = useState<FollowUp>({
    date: '',
    type: '',
    instructions: '',
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { id: '1', drugName: '', dosage: '', frequency: '', duration: '', instructions: '' },
  ]);

  const [labTests, setLabTests] = useState<LabTest[]>([
    { id: '1', testName: '', priority: 'Normal', notes: '' },
  ]);

  const [historyRecords] = useState<HistoryRecord[]>([
    {
      date: '2024-12-15',
      diagnosis: 'Malaria',
      prescription: 'Artemether-Lumefantrine (Coartem) - 4 tablets twice daily for 3 days',
      doctor: 'Muhammad Bello',
    },
    {
      date: '2024-11-10',
      diagnosis: 'Upper Respiratory Tract Infection',
      prescription: 'Amoxicillin 500mg - 3 times daily for 7 days, Paracetamol 500mg - as needed',
      doctor: 'Fatima Abubakar',
    },
  ]);

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);
  const [isSurgeryModalOpen, setIsSurgeryModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Consultation state tracking
  const [consultationState, setConsultationState] = useState<ConsultationState>({
    hasUnsavedChanges: false,
    actions: [],
    vitalsEditable: false,
  });
  
  // Mock vitals recorded by nurse
  useEffect(() => {
    // Simulate vitals already recorded by nurse
    setVitals({
      temperature: '36.8',
      bloodPressure: '120/80',
      heartRate: '75',
      respiratoryRate: '18',
      oxygenSaturation: '98',
      weight: '68',
      height: '165',
      rbs: '95',
      bmi: '',
      recordedBy: 'Nurse Hauwa Ibrahim',
      recordedAt: new Date().toLocaleTimeString(),
    });
  }, []);

  // Auto-calculate BMI
  useEffect(() => {
    const weight = parseFloat(vitals.weight);
    const height = parseFloat(vitals.height) / 100; // Convert cm to meters

    if (weight > 0 && height > 0) {
      const bmi = (weight / (height * height)).toFixed(2);
      setVitals(prev => ({ ...prev, bmi }));
    } else {
      setVitals(prev => ({ ...prev, bmi: '' }));
    }
  }, [vitals.weight, vitals.height]);

  // Autosave draft every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (examinationNotes.complaint || examinationNotes.diagnosis || examinationNotes.observations) {
        saveDraft();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [examinationNotes]);

  const saveDraft = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
      toast.info('Draft Saved', {
        description: 'Your consultation notes have been saved automatically',
      });
    }, 500);
  };

  // Prescription handlers
  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { id: Date.now().toString(), drugName: '', dosage: '', frequency: '', duration: '', instructions: '' },
    ]);
  };

  const updatePrescription = (id: string, field: keyof Prescription, value: string) => {
    setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deletePrescription = (id: string) => {
    if (prescriptions.length > 1) {
      setPrescriptions(prescriptions.filter(p => p.id !== id));
      toast.success('Prescription Removed', {
        description: 'Prescription row deleted successfully',
      });
    }
  };

  // Lab test handlers
  const addLabTest = () => {
    setLabTests([
      ...labTests,
      { id: Date.now().toString(), testName: '', priority: 'Normal', notes: '' },
    ]);
  };

  const updateLabTest = (id: string, field: keyof LabTest, value: string) => {
    setLabTests(labTests.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const deleteLabTest = (id: string) => {
    if (labTests.length > 1) {
      setLabTests(labTests.filter(t => t.id !== id));
      toast.success('Lab Test Removed', {
        description: 'Lab test removed successfully',
      });
    }
  };

  // Finish consultation
  const handleFinishConsultation = () => {
    // Validation
    if (!examinationNotes.diagnosis) {
      toast.error('Diagnosis Required', {
        description: 'Please enter a diagnosis before completing the consultation',
      });
      return;
    }

    toast.success('Consultation Completed', {
      description: 'Dr. completed consultation with ' + patientData.fullName,
    });

    setIsFinishModalOpen(false);
    
    // Navigate back to appointments
    setTimeout(() => {
      navigate('/emr/doctor/appointments');
    }, 1000);
  };

  // Action buttons
  const handleAdmitPatient = (data: { ward: string }) => {
    const newAction: ConsultationAction = {
      id: Date.now().toString(),
      type: 'admitted',
      timestamp: new Date(),
      details: data,
    };
    
    setConsultationState(prev => ({
      ...prev,
      actions: [...prev.actions, newAction],
      hasUnsavedChanges: true,
    }));
    
    toast.success('Patient Admitted', {
      description: `${patientData.fullName} has been admitted to ${data.ward}`,
    });
  };

  const handleReferPatient = (data: { referTo: string }) => {
    const newAction: ConsultationAction = {
      id: Date.now().toString(),
      type: 'referred',
      timestamp: new Date(),
      details: data,
    };
    
    setConsultationState(prev => ({
      ...prev,
      actions: [...prev.actions, newAction],
      hasUnsavedChanges: true,
    }));
    
    toast.success('Referral Sent', {
      description: `Referral to ${data.referTo} has been sent successfully`,
    });
  };

  const handleSurgeryRequest = (data: { surgeryType: string }) => {
    const newAction: ConsultationAction = {
      id: Date.now().toString(),
      type: 'surgery',
      timestamp: new Date(),
      details: data,
    };
    
    setConsultationState(prev => ({
      ...prev,
      actions: [...prev.actions, newAction],
      hasUnsavedChanges: true,
    }));
    
    toast.success('Surgery Request Submitted', {
      description: `${data.surgeryType} request has been submitted successfully`,
    });
  };
  
  // Manual save changes
  const handleSaveChanges = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
      setConsultationState(prev => ({
        ...prev,
        hasUnsavedChanges: false,
      }));
      toast.success('Changes Saved', {
        description: 'All consultation changes have been saved successfully',
      });
    }, 800);
  };
  
  // Toggle vitals editable state
  const toggleVitalsEdit = () => {
    setConsultationState(prev => ({
      ...prev,
      vitalsEditable: !prev.vitalsEditable,
    }));
    
    if (!consultationState.vitalsEditable) {
      toast.info('Vitals Unlocked', {
        description: 'You can now edit vital signs',
      });
    } else {
      toast.info('Vitals Locked', {
        description: 'Vital signs are now read-only',
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Bar */}
      <div className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/emr/doctor/appointments')}
                className="hover:bg-muted"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Appointments
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <p className="font-semibold text-foreground">Dr. Muhammad Bello</p>
                <p className="text-xs text-muted-foreground">General Practitioner</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono font-semibold text-lg">{appointmentData.appointmentNo}</p>
              <p className="text-xs text-muted-foreground">
                {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Not saved'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-32">
        {/* Action Status Panel */}
        {consultationState.actions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-2">Actions Taken During Consultation</h3>
                    <div className="space-y-2">
                      {consultationState.actions.map((action) => (
                        <motion.div
                          key={action.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-sm"
                        >
                          {action.type === 'admitted' && (
                            <>
                              <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                                <UserPlus className="w-3 h-3 mr-1" />
                                Admitted
                              </Badge>
                              <span className="text-muted-foreground">
                                Patient admitted to <strong>{action.details.ward}</strong> at {action.timestamp.toLocaleTimeString()}
                              </span>
                            </>
                          )}
                          {action.type === 'referred' && (
                            <>
                              <Badge className="bg-purple-500/10 text-purple-700 border-purple-500/20">
                                <Send className="w-3 h-3 mr-1" />
                                Referred
                              </Badge>
                              <span className="text-muted-foreground">
                                Referred to <strong>{action.details.referTo}</strong> at {action.timestamp.toLocaleTimeString()}
                              </span>
                            </>
                          )}
                          {action.type === 'surgery' && (
                            <>
                              <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Surgery Requested
                              </Badge>
                              <span className="text-muted-foreground">
                                <strong>{action.details.surgeryType}</strong> requested at {action.timestamp.toLocaleTimeString()}
                              </span>
                            </>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs defaultValue="all" className="space-y-6">
          {/* Desktop Tabs */}
          <TabsList className="hidden lg:grid lg:grid-cols-7 bg-white p-1">
            <TabsTrigger value="all">All Sections</TabsTrigger>
            <TabsTrigger value="patient">Patient Info</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="examination">Examination</TabsTrigger>
            <TabsTrigger value="prescription">Prescription</TabsTrigger>
            <TabsTrigger value="labs">Lab Tests</TabsTrigger>
            <TabsTrigger value="followup">Follow-up</TabsTrigger>
          </TabsList>

          {/* All Sections View (Mobile uses Accordion) */}
          <TabsContent value="all" className="space-y-4">
            <div className="hidden lg:grid lg:grid-cols-1 gap-4">
              {/* Desktop: Show all sections in cards */}
              <PatientInfoSection data={patientData} appointmentData={appointmentData} />
              <VitalsSection vitals={vitals} setVitals={setVitals} />
              <ExaminationSection notes={examinationNotes} setNotes={setExaminationNotes} />
              <PrescriptionSection
                prescriptions={prescriptions}
                onAdd={addPrescription}
                onUpdate={updatePrescription}
                onDelete={deletePrescription}
              />
              <LabTestSection
                tests={labTests}
                onAdd={addLabTest}
                onUpdate={updateLabTest}
                onDelete={deleteLabTest}
              />
              <FollowUpSection followUp={followUp} setFollowUp={setFollowUp} />
            </div>

            {/* Mobile: Use Accordion */}
            <div className="lg:hidden">
              <Accordion type="multiple" defaultValue={['patient', 'vitals']} className="space-y-2">
                <AccordionItem value="patient" className="bg-white border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Patient Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <PatientInfoSection data={patientData} appointmentData={appointmentData} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="vitals" className="bg-white border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Vital Signs</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <VitalsSection vitals={vitals} setVitals={setVitals} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="examination" className="bg-white border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Examination Notes</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ExaminationSection notes={examinationNotes} setNotes={setExaminationNotes} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="prescription" className="bg-white border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Pill className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Prescription</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <PrescriptionSection
                      prescriptions={prescriptions}
                      onAdd={addPrescription}
                      onUpdate={updatePrescription}
                      onDelete={deletePrescription}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="labs" className="bg-white border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <TestTube className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Lab Test Request</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <LabTestSection
                      tests={labTests}
                      onAdd={addLabTest}
                      onUpdate={updateLabTest}
                      onDelete={deleteLabTest}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="followup" className="bg-white border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Follow-up</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <FollowUpSection followUp={followUp} setFollowUp={setFollowUp} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          {/* Individual Tab Contents (Desktop only) */}
          <TabsContent value="patient">
            <PatientInfoSection data={patientData} appointmentData={appointmentData} />
          </TabsContent>
          <TabsContent value="vitals">
            <VitalsSection vitals={vitals} setVitals={setVitals} />
          </TabsContent>
          <TabsContent value="examination">
            <ExaminationSection notes={examinationNotes} setNotes={setExaminationNotes} />
          </TabsContent>
          <TabsContent value="prescription">
            <PrescriptionSection
              prescriptions={prescriptions}
              onAdd={addPrescription}
              onUpdate={updatePrescription}
              onDelete={deletePrescription}
            />
          </TabsContent>
          <TabsContent value="labs">
            <LabTestSection
              tests={labTests}
              onAdd={addLabTest}
              onUpdate={updateLabTest}
              onDelete={deleteLabTest}
            />
          </TabsContent>
          <TabsContent value="followup">
            <FollowUpSection followUp={followUp} setFollowUp={setFollowUp} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsHistoryModalOpen(true)}
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdmitModalOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Admit Patient
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReferModalOpen(true)}
              >
                <Send className="w-4 h-4 mr-2" />
                Refer Patient
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSurgeryModalOpen(true)}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Surgery Request
              </Button>
            </div>
            <div className="flex gap-2">
              {consultationState.hasUnsavedChanges && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
              <Button
                onClick={() => setIsFinishModalOpen(true)}
                className="bg-secondary hover:bg-secondary/90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Finish Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FinishConsultationModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onConfirm={handleFinishConsultation}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        records={historyRecords}
      />

      <AdmitPatientModal
        isOpen={isAdmitModalOpen}
        onClose={() => setIsAdmitModalOpen(false)}
        onConfirm={handleAdmitPatient}
        patientData={patientData}
      />

      <ReferPatientModal
        isOpen={isReferModalOpen}
        onClose={() => setIsReferModalOpen(false)}
        onConfirm={handleReferPatient}
        patientData={patientData}
      />

      <SurgeryRequestModal
        isOpen={isSurgeryModalOpen}
        onClose={() => setIsSurgeryModalOpen(false)}
        onConfirm={handleSurgeryRequest}
        patientData={patientData}
      />
    </div>
  );
}

// Section Components
function PatientInfoSection({ data, appointmentData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Patient & Appointment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">Patient Details</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <p className="font-semibold">{data.fullName}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">File Number</Label>
                  <p className="font-mono text-sm">{data.fileNumber}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Gender</Label>
                  <p className="text-sm">{data.gender}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                <p className="text-sm">{new Date(data.dob).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p className="text-sm">{data.phone}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Address</Label>
                <p className="text-sm">{data.address}</p>
              </div>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">Appointment Details</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Appointment Number</Label>
                <p className="font-mono font-semibold">{appointmentData.appointmentNo}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Date</Label>
                <p className="text-sm">{new Date(appointmentData.date).toLocaleDateString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Shift</Label>
                  <p className="text-sm">{appointmentData.shift}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Priority</Label>
                  <Badge variant="outline">{appointmentData.priority}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge className="bg-blue-500/10 text-blue-700">{appointmentData.status}</Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Payment Status</Label>
                  <Badge className="bg-secondary">{appointmentData.paymentStatus}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VitalsSection({ vitals, setVitals }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="temperature">Temperature (°C) *</Label>
            <div className="relative">
              <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="36.5"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bp">Blood Pressure *</Label>
            <div className="relative">
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="bp"
                placeholder="120/80"
                value={vitals.bloodPressure}
                onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="heartRate">Heart Rate (bpm) *</Label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="heartRate"
                type="number"
                placeholder="72"
                value={vitals.heartRate}
                onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="respRate">Respiratory Rate *</Label>
            <div className="relative">
              <Wind className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="respRate"
                type="number"
                placeholder="16"
                value={vitals.respiratoryRate}
                onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="oxygen">Oxygen Saturation (%)</Label>
            <div className="relative">
              <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="oxygen"
                type="number"
                placeholder="98"
                value={vitals.oxygenSaturation}
                onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="weight">Weight (kg) *</Label>
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70"
                value={vitals.weight}
                onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="height">Height (cm) *</Label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={vitals.height}
                onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rbs">RBS (mg/dL)</Label>
            <Input
              id="rbs"
              type="number"
              placeholder="100"
              value={vitals.rbs}
              onChange={(e) => setVitals({ ...vitals, rbs: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="bmi">BMI (Auto-calculated)</Label>
            <Input
              id="bmi"
              value={vitals.bmi}
              readOnly
              className="bg-muted/50 font-semibold"
              placeholder="--"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExaminationSection({ notes, setNotes }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary" />
          Examination Notes
          <Badge variant="outline" className="ml-auto text-xs">
            Auto-saves every 5s
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="complaint">Patient Complaint *</Label>
          <Textarea
            id="complaint"
            rows={3}
            placeholder="Enter patient's chief complaint..."
            value={notes.complaint}
            onChange={(e) => setNotes({ ...notes, complaint: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="diagnosis">Diagnosis *</Label>
          <Textarea
            id="diagnosis"
            rows={3}
            placeholder="Enter diagnosis..."
            value={notes.diagnosis}
            onChange={(e) => setNotes({ ...notes, diagnosis: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="observations">Clinical Observations</Label>
          <Textarea
            id="observations"
            rows={4}
            placeholder="Enter detailed clinical observations and examination findings..."
            value={notes.observations}
            onChange={(e) => setNotes({ ...notes, observations: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function PrescriptionSection({ prescriptions, onAdd, onUpdate, onDelete }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-primary" />
          Prescription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {prescriptions.map((prescription: Prescription, index: number) => (
          <motion.div
            key={prescription.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted/30 rounded-lg p-4 border border-border relative"
          >
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(prescription.id)}
                disabled={prescriptions.length === 1}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Label>Drug Name *</Label>
                <Input
                  placeholder="Enter medication name"
                  value={prescription.drugName}
                  onChange={(e) => onUpdate(prescription.id, 'drugName', e.target.value)}
                />
              </div>

              <div>
                <Label>Dosage *</Label>
                <Input
                  placeholder="e.g., 500mg"
                  value={prescription.dosage}
                  onChange={(e) => onUpdate(prescription.id, 'dosage', e.target.value)}
                />
              </div>

              <div>
                <Label>Frequency *</Label>
                <Select
                  value={prescription.frequency}
                  onValueChange={(value) => onUpdate(prescription.id, 'frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                    <SelectItem value="Four times daily">Four times daily</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Duration *</Label>
                <Input
                  placeholder="e.g., 7 days"
                  value={prescription.duration}
                  onChange={(e) => onUpdate(prescription.id, 'duration', e.target.value)}
                />
              </div>

              <div className="lg:col-span-1">
                <Label>Special Instructions</Label>
                <Input
                  placeholder="e.g., After meals"
                  value={prescription.instructions}
                  onChange={(e) => onUpdate(prescription.id, 'instructions', e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        ))}

        <Button variant="outline" onClick={onAdd} className="w-full">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Drug
        </Button>
      </CardContent>
    </Card>
  );
}

function LabTestSection({ tests, onAdd, onUpdate, onDelete }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5 text-primary" />
          Lab Test Request
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tests.map((test: LabTest) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted/30 rounded-lg p-4 border border-border relative"
          >
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(test.id)}
                disabled={tests.length === 1}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label>Test Name *</Label>
                <Input
                  placeholder="Enter lab test name"
                  value={test.testName}
                  onChange={(e) => onUpdate(test.id, 'testName', e.target.value)}
                />
              </div>

              <div>
                <Label>Priority *</Label>
                <Select
                  value={test.priority}
                  onValueChange={(value) => onUpdate(test.id, 'priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="STAT">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-3">
                <Label>Notes</Label>
                <Textarea
                  rows={2}
                  placeholder="Additional notes or instructions..."
                  value={test.notes}
                  onChange={(e) => onUpdate(test.id, 'notes', e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        ))}

        <Button variant="outline" onClick={onAdd} className="w-full">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Test
        </Button>
      </CardContent>
    </Card>
  );
}

function FollowUpSection({ followUp, setFollowUp }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Follow-up Appointment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="followupDate">Follow-up Date</Label>
            <Input
              id="followupDate"
              type="date"
              value={followUp.date}
              onChange={(e) => setFollowUp({ ...followUp, date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="followupType">Type</Label>
            <Select
              value={followUp.type}
              onValueChange={(value) => setFollowUp({ ...followUp, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Routine Check-up">Routine Check-up</SelectItem>
                <SelectItem value="Review Results">Review Results</SelectItem>
                <SelectItem value="Medication Review">Medication Review</SelectItem>
                <SelectItem value="Specialist Referral">Specialist Referral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="followupInstructions">Follow-up Instructions</Label>
            <Textarea
              id="followupInstructions"
              rows={3}
              placeholder="Enter follow-up instructions for the patient..."
              value={followUp.instructions}
              onChange={(e) => setFollowUp({ ...followUp, instructions: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}