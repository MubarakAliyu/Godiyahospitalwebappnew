import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, User, Calendar, Phone, MapPin, Activity,
  Stethoscope, Pill, FlaskConical, DollarSign, FileText,
  Heart, TrendingUp, Users, AlertTriangle, Edit3, Save,
  Droplets, Clock, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Separator } from '@/app/components/ui/separator';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
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
                      value="medications"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <Pill className="w-4 h-4 mr-2" />
                      Medications
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
                      <div className="text-center py-8 text-muted-foreground">
                        <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No drug chart entries available</p>
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
