import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, User, Calendar, Phone, MapPin, Activity,
  Stethoscope, Pill, FlaskConical, DollarSign, FileText,
  Heart, TrendingUp, Users, AlertTriangle, Edit3, Save,
  Droplets, Clock, CheckCircle2, Eye, ClipboardList, Bed,
  TestTube, Syringe, Scissors, UserPlus, Lock, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Separator } from '@/app/components/ui/separator';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { useEMRStore } from '@/app/emr/store/emr-store';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Appointment, Invoice } from '@/app/emr/store/types';

export function NursePatientFilePage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { patients, appointments, invoices } = useEMRStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Find patient by ID
  const patient = patients.find(p => p.id === patientId);

  // Editable vitals state
  const [vitalsData, setVitalsData] = useState({
    bp: '120/80',
    temp: '36.5',
    pulse: '72',
    weight: '65',
    height: '165',
    oxygenSat: '98',
    respRate: '16',
    bloodSugar: '95',
  });

  // Editable notes state
  const [nurseNotes, setNurseNotes] = useState('Patient is stable and comfortable. No complaints at this time.');
  const [medicationNotes, setMedicationNotes] = useState('All medications administered as prescribed.');
  const [observations, setObservations] = useState('Patient responsive and alert. Vital signs within normal limits.');

  // Get patient appointments
  const patientAppointments = patient 
    ? appointments.filter(a => a.patientId === patient.id)
    : [];

  // Get patient invoices
  const patientInvoices = patient
    ? invoices.filter(i => i.patientId === patient.id)
    : [];

  // Handle save changes
  const handleSaveChanges = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast.success('Patient Records Updated', {
        description: 'All changes have been saved successfully',
      });
    }, 1000);
  };

  // Get family members
  const getFamilyMembers = () => {
    if (!patient) return null;
    
    if (patient.fileType === 'Family') {
      return patients.filter(p => p.parentFileId === patient.id);
    }
    
    if (patient.parentFileId) {
      const familyFile = patients.find(p => p.id === patient.parentFileId);
      const siblings = patients.filter(p => p.parentFileId === patient.parentFileId && p.id !== patient.id);
      return { familyFile, siblings };
    }
    
    return null;
  };

  const familyData = getFamilyMembers();

  // Mock historical vitals data captured by nurses over time
  const vitalsHistory = [
    {
      id: '1',
      date: '2/16/2026',
      time: '08:30 AM',
      bp: '120/80',
      temp: '36.5',
      pulse: '72',
      respRate: '18',
      oxygenSat: '98',
      weight: '65',
      height: '165',
      bmi: '23.9',
      recordedBy: 'Nurse Halima Usman',
    },
    {
      id: '2',
      date: '2/15/2026',
      time: '02:15 PM',
      bp: '118/78',
      temp: '36.7',
      pulse: '74',
      respRate: '17',
      oxygenSat: '99',
      weight: '65',
      height: '165',
      bmi: '23.9',
      recordedBy: 'Nurse Aisha Mohammed',
    },
    {
      id: '3',
      date: '2/15/2026',
      time: '08:45 AM',
      bp: '122/82',
      temp: '36.6',
      pulse: '70',
      respRate: '18',
      oxygenSat: '98',
      weight: '64',
      height: '165',
      bmi: '23.5',
      recordedBy: 'Nurse Halima Usman',
    },
    {
      id: '4',
      date: '2/14/2026',
      time: '02:30 PM',
      bp: '119/79',
      temp: '36.8',
      pulse: '71',
      respRate: '17',
      oxygenSat: '99',
      weight: '64',
      height: '165',
      bmi: '23.5',
      recordedBy: 'Nurse Amina Bello',
    },
    {
      id: '5',
      date: '2/14/2026',
      time: '08:15 AM',
      bp: '121/80',
      temp: '36.5',
      pulse: '73',
      respRate: '18',
      oxygenSat: '98',
      weight: '64',
      height: '165',
      bmi: '23.5',
      recordedBy: 'Nurse Halima Usman',
    },
  ];

  // Mock drug chart data - prescribed drugs administered over time
  const drugChartHistory = [
    {
      id: '1',
      date: '2/16/2026',
      time: '08:00 AM',
      drugName: 'Paracetamol',
      dosage: '500mg',
      route: 'Oral',
      frequency: 'TID',
      prescribedBy: 'Dr. Muhammad Bello',
      administeredBy: 'Nurse Halima Usman',
      status: 'Administered',
    },
    {
      id: '2',
      date: '2/15/2026',
      time: '08:00 PM',
      drugName: 'Paracetamol',
      dosage: '500mg',
      route: 'Oral',
      frequency: 'TID',
      prescribedBy: 'Dr. Muhammad Bello',
      administeredBy: 'Nurse Aisha Mohammed',
      status: 'Administered',
    },
    {
      id: '3',
      date: '2/15/2026',
      time: '02:00 PM',
      drugName: 'Paracetamol',
      dosage: '500mg',
      route: 'Oral',
      frequency: 'TID',
      prescribedBy: 'Dr. Muhammad Bello',
      administeredBy: 'Nurse Halima Usman',
      status: 'Administered',
    },
    {
      id: '4',
      date: '2/15/2026',
      time: '08:00 AM',
      drugName: 'Lisinopril',
      dosage: '10mg',
      route: 'Oral',
      frequency: 'OD',
      prescribedBy: 'Dr. Ibrahim Aliyu',
      administeredBy: 'Nurse Halima Usman',
      status: 'Administered',
    },
    {
      id: '5',
      date: '2/14/2026',
      time: '08:00 PM',
      drugName: 'Metformin',
      dosage: '500mg',
      route: 'Oral',
      frequency: 'BD',
      prescribedBy: 'Dr. Ibrahim Aliyu',
      administeredBy: 'Nurse Amina Bello',
      status: 'Administered',
    },
    {
      id: '6',
      date: '2/14/2026',
      time: '08:00 AM',
      drugName: 'Metformin',
      dosage: '500mg',
      route: 'Oral',
      frequency: 'BD',
      prescribedBy: 'Dr. Ibrahim Aliyu',
      administeredBy: 'Nurse Halima Usman',
      status: 'Administered',
    },
  ];

  if (!patient) {
    return (
      <div className="min-h-screen bg-muted/30 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Button variant="ghost" onClick={() => navigate('/emr/nurse/patients')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Patients
          </Button>
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Patient File Not Found</h2>
              <p className="text-muted-foreground">
                The patient file with ID {patientId} could not be found in the system.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/emr/nurse/patients')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Patients
          </Button>

          <div className="flex gap-2">
            <Button 
              onClick={() => navigate(`/emr/nurse/patients/${patientId}/full-file`)}
              className="bg-primary hover:bg-primary/90"
            >
              <Eye className="w-4 h-4 mr-2" />
              Full Patient File
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Records
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="bg-secondary hover:bg-secondary/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Patient Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{patient.fullName}</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                      File Number: <span className="font-mono font-semibold">{patient.id}</span>
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{patient.age} years • {patient.gender}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{patient.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{patient.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge 
                    variant={patient.status === 'Active' ? 'default' : 'secondary'}
                    className={patient.status === 'Active' ? 'bg-secondary' : ''}
                  >
                    {patient.status}
                  </Badge>
                  {patient.fileType === 'Family' && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 block">
                      <Users className="w-3 h-3 mr-1 inline" />
                      Family File
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Info */}
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-semibold">{format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Patient Type</p>
                  <p className="font-semibold">{patient.patientType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Registration Date</p>
                  <p className="font-semibold">{format(new Date(patient.dateRegistered), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Emergency Contact</p>
                  <p className="font-semibold">{patient.emergencyContactName}</p>
                  <p className="text-xs text-muted-foreground">{patient.emergencyContactPhone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next of Kin</p>
                  <p className="font-semibold">{patient.nextOfKin}</p>
                </div>
                {patient.isNHIS && (
                  <div>
                    <p className="text-muted-foreground">NHIS Provider</p>
                    <p className="font-semibold">{patient.nhisProvider}</p>
                    <p className="text-xs text-muted-foreground">{patient.nhisNumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Family Members Section */}
        {familyData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Family Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.fileType === 'Family' && Array.isArray(familyData) && (
                  <div className="space-y-3">
                    {familyData.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No family members added yet
                      </p>
                    ) : (
                      familyData.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{member.fullName}</p>
                              <p className="text-sm text-muted-foreground">
                                {member.age} years, {member.gender} • {member.id}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/emr/nurse/patients/${member.id}/file`)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View File
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {patient.parentFileId && typeof familyData === 'object' && !Array.isArray(familyData) && (
                  <div className="space-y-4">
                    {familyData.familyFile && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Parent Family File</h4>
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-purple-50/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">{familyData.familyFile.fullName}</p>
                              <p className="text-sm text-muted-foreground">Family File • {familyData.familyFile.id}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/emr/nurse/patients/${familyData.familyFile!.id}/file`)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View File
                          </Button>
                        </div>
                      </div>
                    )}

                    {familyData.siblings && familyData.siblings.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Siblings</h4>
                        <div className="space-y-2">
                          {familyData.siblings.map((sibling) => (
                            <div key={sibling.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{sibling.fullName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {sibling.age} years, {sibling.gender} • {sibling.id}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/emr/nurse/patients/${sibling.id}/file`)}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                View File
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Medical Records Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="vitals" className="w-full">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">Medical Records</h2>
                  <TabsList className="inline-flex h-auto flex-wrap gap-2 bg-transparent p-0">
                    <TabsTrigger 
                      value="vitals"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Vital Signs
                    </TabsTrigger>
                    <TabsTrigger 
                      value="nurse-notes"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Nurse Notes
                    </TabsTrigger>
                    <TabsTrigger 
                      value="doctor-notes"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Doctor Notes
                    </TabsTrigger>
                    <TabsTrigger 
                      value="medications"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <Pill className="w-4 h-4 mr-2" />
                      Medications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="drug-chart"
                      className="data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <Syringe className="w-4 h-4 mr-2" />
                      Drug Charts
                    </TabsTrigger>
                    <TabsTrigger 
                      value="vitals-history"
                      className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Vitals History
                    </TabsTrigger>
                    <TabsTrigger 
                      value="appointments"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Appointments
                    </TabsTrigger>
                    <TabsTrigger 
                      value="billing"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Billing
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Vital Signs Tab */}
                <TabsContent value="vitals" className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <Label className="text-sm font-medium">Blood Pressure</Label>
                        </div>
                        {isEditing ? (
                          <Input
                            value={vitalsData.bp}
                            onChange={(e) => setVitalsData({ ...vitalsData, bp: e.target.value })}
                            placeholder="120/80"
                          />
                        ) : (
                          <p className="text-lg font-semibold">{vitalsData.bp} mmHg</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-blue-500" />
                          <Label className="text-sm font-medium">Temperature</Label>
                        </div>
                        {isEditing ? (
                          <Input
                            value={vitalsData.temp}
                            onChange={(e) => setVitalsData({ ...vitalsData, temp: e.target.value })}
                            placeholder="36.5"
                          />
                        ) : (
                          <p className="text-lg font-semibold">{vitalsData.temp}°C</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-pink-500" />
                          <Label className="text-sm font-medium">Pulse Rate</Label>
                        </div>
                        {isEditing ? (
                          <Input
                            value={vitalsData.pulse}
                            onChange={(e) => setVitalsData({ ...vitalsData, pulse: e.target.value })}
                            placeholder="72"
                          />
                        ) : (
                          <p className="text-lg font-semibold">{vitalsData.pulse} bpm</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-cyan-500" />
                          <Label className="text-sm font-medium">Oxygen Saturation</Label>
                        </div>
                        {isEditing ? (
                          <Input
                            value={vitalsData.oxygenSat}
                            onChange={(e) => setVitalsData({ ...vitalsData, oxygenSat: e.target.value })}
                            placeholder="98"
                          />
                        ) : (
                          <p className="text-lg font-semibold">{vitalsData.oxygenSat}%</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <Label className="text-sm font-medium">Weight</Label>
                        </div>
                        {isEditing ? (
                          <Input
                            value={vitalsData.weight}
                            onChange={(e) => setVitalsData({ ...vitalsData, weight: e.target.value })}
                            placeholder="65"
                          />
                        ) : (
                          <p className="text-lg font-semibold">{vitalsData.weight} kg</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-purple-500" />
                          <Label className="text-sm font-medium">Height</Label>
                        </div>
                        {isEditing ? (
                          <Input
                            value={vitalsData.height}
                            onChange={(e) => setVitalsData({ ...vitalsData, height: e.target.value })}
                            placeholder="165"
                          />
                        ) : (
                          <p className="text-lg font-semibold">{vitalsData.height} cm</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-orange-500" />
                          <Label className="text-sm font-medium">Respiratory Rate</Label>
                        </div>
                        {isEditing ? (
                          <Input
                            value={vitalsData.respRate}
                            onChange={(e) => setVitalsData({ ...vitalsData, respRate: e.target.value })}
                            placeholder="16"
                          />
                        ) : (
                          <p className="text-lg font-semibold">{vitalsData.respRate} /min</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplets className="w-4 h-4 text-indigo-500" />
                          <Label className="text-sm font-medium">Blood Sugar</Label>
                        </div>
                        {isEditing ? (
                          <Input
                            value={vitalsData.bloodSugar}
                            onChange={(e) => setVitalsData({ ...vitalsData, bloodSugar: e.target.value })}
                            placeholder="95"
                          />
                        ) : (
                          <p className="text-lg font-semibold">{vitalsData.bloodSugar} mg/dL</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Nurse Notes Tab */}
                <TabsContent value="nurse-notes" className="mt-6 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Nursing Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          value={nurseNotes}
                          onChange={(e) => setNurseNotes(e.target.value)}
                          rows={6}
                          placeholder="Enter nursing notes..."
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{nurseNotes}</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Patient Observations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          value={observations}
                          onChange={(e) => setObservations(e.target.value)}
                          rows={4}
                          placeholder="Enter observations..."
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{observations}</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Doctor Notes Tab - VIEW ONLY */}
                <TabsContent value="doctor-notes" className="mt-6 space-y-4">
                  <Card className="border-amber-200 bg-amber-50/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-600" />
                          Doctor's Consultation Notes
                        </CardTitle>
                        <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                          View Only
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Latest Consultation */}
                      <div className="p-4 bg-white rounded-lg border">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-sm">Dr. Ibrahim Aliyu - General Medicine</p>
                            <p className="text-xs text-muted-foreground">January 30, 2025 • 10:30 AM</p>
                          </div>
                          <Badge variant="secondary">Latest</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="font-medium text-muted-foreground">Chief Complaints:</p>
                            <p>Persistent headaches, fatigue, occasional dizziness</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Diagnosis:</p>
                            <p>Hypertension (Stage 2), Type 2 Diabetes Mellitus - Controlled</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Doctor's Observations:</p>
                            <p>BP elevated at 150/95 mmHg. Patient shows good compliance with diabetic medication. Blood sugar levels within acceptable range. Recommend adjustment of antihypertensive medication and lifestyle modifications.</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Treatment Plan:</p>
                            <p>Increased Lisinopril to 20mg daily. Continue Metformin 500mg twice daily. Advised low-salt diet, regular exercise. Follow-up in 2 weeks.</p>
                          </div>
                        </div>
                      </div>

                      {/* Previous Consultation */}
                      <div className="p-4 bg-white rounded-lg border">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-sm">Dr. Fatima Musa - Internal Medicine</p>
                            <p className="text-xs text-muted-foreground">January 20, 2025 • 2:15 PM</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="font-medium text-muted-foreground">Chief Complaints:</p>
                            <p>Cough, sore throat, mild fever</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Diagnosis:</p>
                            <p>Upper Respiratory Tract Infection (Common Cold)</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Doctor's Observations:</p>
                            <p>Temperature 37.8°C. Throat examination shows mild inflammation. No signs of bacterial infection. Patient advised to rest and maintain hydration.</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Treatment Plan:</p>
                            <p>Paracetamol 500mg TDS for 3 days. Vitamin C supplement. Plenty of fluids and rest. Return if symptoms worsen or persist beyond 5 days.</p>
                          </div>
                        </div>
                      </div>

                      {/* Info Message */}
                      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-900">Nurse Access Level</p>
                          <p className="text-blue-700">You can view doctor consultation notes but cannot edit them. For any updates or clarifications, please contact the attending physician.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Medications Tab */}
                <TabsContent value="medications" className="mt-6 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Medication Administration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          value={medicationNotes}
                          onChange={(e) => setMedicationNotes(e.target.value)}
                          rows={6}
                          placeholder="Enter medication notes..."
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{medicationNotes}</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Drug Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Drug Name</TableHead>
                            <TableHead>Dosage</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Prescribed By</TableHead>
                            <TableHead>Administered By</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {drugChartHistory.map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell>{entry.date}</TableCell>
                              <TableCell>{entry.time}</TableCell>
                              <TableCell>{entry.drugName}</TableCell>
                              <TableCell>{entry.dosage}</TableCell>
                              <TableCell>{entry.route}</TableCell>
                              <TableCell>{entry.frequency}</TableCell>
                              <TableCell>{entry.prescribedBy}</TableCell>
                              <TableCell>{entry.administeredBy}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    entry.status === 'Administered' ? 'default' :
                                    entry.status === 'Pending' ? 'secondary' :
                                    'outline'
                                  }
                                >
                                  {entry.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Drug Chart Tab - TABLE FORMAT */}
                <TabsContent value="drug-chart" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Syringe className="w-5 h-5 text-orange-600" />
                        Drug Administration Chart
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Historical medication administration records - prescribed drugs administered over time
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-orange-50">
                              <TableHead>Date</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Drug Name</TableHead>
                              <TableHead>Dosage</TableHead>
                              <TableHead>Route</TableHead>
                              <TableHead>Frequency</TableHead>
                              <TableHead>Prescribed By</TableHead>
                              <TableHead>Administered By</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {drugChartHistory.map((record) => (
                              <TableRow key={record.id}>
                                <TableCell className="font-medium">{record.date}</TableCell>
                                <TableCell>{record.time}</TableCell>
                                <TableCell className="font-semibold text-orange-700">{record.drugName}</TableCell>
                                <TableCell>{record.dosage}</TableCell>
                                <TableCell>{record.route}</TableCell>
                                <TableCell>{record.frequency}</TableCell>
                                <TableCell className="text-sm">{record.prescribedBy}</TableCell>
                                <TableCell className="text-sm">{record.administeredBy}</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-700 border-green-200">
                                    {record.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Total administrations: {drugChartHistory.length}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Vitals History Tab - TABLE FORMAT */}
                <TabsContent value="vitals-history" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-600" />
                        Vital Signs Monitoring
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Historical vital signs captured by nurses over time
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-red-50">
                              <TableHead>Date</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>BP (mmHg)</TableHead>
                              <TableHead>Temp (°C)</TableHead>
                              <TableHead>Pulse (bpm)</TableHead>
                              <TableHead>Resp Rate</TableHead>
                              <TableHead>O₂ Sat (%)</TableHead>
                              <TableHead>Weight (kg)</TableHead>
                              <TableHead>Height (cm)</TableHead>
                              <TableHead>BMI</TableHead>
                              <TableHead>Recorded By</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {vitalsHistory.map((vital) => (
                              <TableRow key={vital.id}>
                                <TableCell className="font-medium">{vital.date}</TableCell>
                                <TableCell>{vital.time}</TableCell>
                                <TableCell className="font-semibold">{vital.bp}</TableCell>
                                <TableCell className="font-semibold">{vital.temp}</TableCell>
                                <TableCell className="font-semibold">{vital.pulse}</TableCell>
                                <TableCell>{vital.respRate}</TableCell>
                                <TableCell>{vital.oxygenSat}</TableCell>
                                <TableCell>{vital.weight}</TableCell>
                                <TableCell>{vital.height}</TableCell>
                                <TableCell>{vital.bmi}</TableCell>
                                <TableCell className="text-sm">{vital.recordedBy}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Total vital sign records: {vitalsHistory.length}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Appointments Tab */}
                <TabsContent value="appointments" className="mt-6 space-y-4">
                  {patientAppointments.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No appointments scheduled</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {patientAppointments.map((appointment) => (
                        <Card key={appointment.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Calendar className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold">{appointment.appointmentType}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(appointment.date), 'MMM dd, yyyy')} at {appointment.time}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Dr. {appointment.doctorName} • {appointment.department}
                                  </p>
                                </div>
                              </div>
                              <Badge 
                                variant={
                                  appointment.status === 'Completed' ? 'default' : 
                                  appointment.status === 'In Progress' ? 'secondary' : 
                                  'outline'
                                }
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing" className="mt-6 space-y-4">
                  {patientInvoices.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <DollarSign className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No billing records available</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {patientInvoices.map((invoice) => (
                        <Card key={invoice.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                  <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-semibold">{invoice.invoiceType}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Receipt: {invoice.receiptId}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(invoice.dateCreated), 'MMM dd, yyyy')}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">₦{invoice.amount.toLocaleString()}</p>
                                <Badge 
                                  variant={
                                    invoice.paymentStatus === 'Paid' ? 'default' : 
                                    invoice.paymentStatus === 'Partial' ? 'secondary' : 
                                    'destructive'
                                  }
                                >
                                  {invoice.paymentStatus}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}