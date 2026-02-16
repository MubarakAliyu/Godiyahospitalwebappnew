import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, User, FileText, Pill, TestTube, Activity,
  Stethoscope, FileCheck, Droplets, Syringe, DollarSign,
  Save, Edit3, CheckCircle2, Calendar, Phone, MapPin, Eye
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Separator } from '@/app/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { toast } from 'sonner';

export function DoctorPatientFilePage() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock patient data
  const patientData = {
    id: patientId || '1',
    fileNo: 'GH-PT-00001',
    name: 'Aisha Mohammed',
    age: 28,
    gender: 'Female',
    dob: '1995-05-15',
    phone: '08012345678',
    address: 'No. 45, Emir Haruna Road, Birnin Kebbi',
    bloodType: 'O+',
    allergies: 'Penicillin',
    chronicConditions: 'None',
  };

  // State for editable data
  const [editableData, setEditableData] = useState({
    doctorNotes: 'Patient presents with recurring headaches...',
    prescription: 'Paracetamol 500mg - twice daily for 5 days',
    labInvestigation: 'Blood test, CBC completed on 2/8/2026',
    nurseNotes: 'Vital signs stable, patient comfortable',
    drugChart: 'Paracetamol administered at 2:00 PM',
    vitals: {
      bp: '120/80',
      temp: '36.5',
      pulse: '72',
      weight: '65',
      height: '165',
      oxygenSat: '98',
    },
    operations: 'No surgical history',
    charges: '₦15,000 - Consultation fee',
  });

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
      pulse: '70',
      respRate: '16',
      oxygenSat: '99',
      weight: '65',
      height: '165',
      bmi: '23.9',
      recordedBy: 'Nurse Fatima Ibrahim',
    },
    {
      id: '3',
      date: '2/15/2026',
      time: '08:00 AM',
      bp: '122/82',
      temp: '36.4',
      pulse: '74',
      respRate: '18',
      oxygenSat: '97',
      weight: '65',
      height: '165',
      bmi: '23.9',
      recordedBy: 'Nurse Halima Usman',
    },
    {
      id: '4',
      date: '2/14/2026',
      time: '02:30 PM',
      bp: '119/79',
      temp: '36.6',
      pulse: '71',
      respRate: '17',
      oxygenSat: '98',
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
      administeredBy: 'Nurse Fatima Ibrahim',
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
      drugName: 'Amoxicillin',
      dosage: '250mg',
      route: 'Oral',
      frequency: 'BID',
      prescribedBy: 'Dr. Muhammad Bello',
      administeredBy: 'Nurse Halima Usman',
      status: 'Administered',
    },
    {
      id: '5',
      date: '2/14/2026',
      time: '08:00 PM',
      drugName: 'Amoxicillin',
      dosage: '250mg',
      route: 'Oral',
      frequency: 'BID',
      prescribedBy: 'Dr. Muhammad Bello',
      administeredBy: 'Nurse Amina Bello',
      status: 'Administered',
    },
    {
      id: '6',
      date: '2/14/2026',
      time: '08:00 AM',
      drugName: 'Amoxicillin',
      dosage: '250mg',
      route: 'Oral',
      frequency: 'BID',
      prescribedBy: 'Dr. Muhammad Bello',
      administeredBy: 'Nurse Halima Usman',
      status: 'Administered',
    },
  ];

  const handleSaveChanges = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast.success('Patient Record Updated', {
        description: 'All changes have been saved successfully',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Bar with Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Patients
          </Button>

          <div className="flex gap-2">
            <Button 
              onClick={() => navigate(`/emr/doctor/patients/${patientId}/full-file`)}
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
                    <h1 className="text-2xl font-bold text-foreground">{patientData.name}</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                      File Number: <span className="font-mono font-semibold">{patientData.fileNo}</span>
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{patientData.age} years • {patientData.gender}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{patientData.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{patientData.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge className="bg-secondary">Active Patient</Badge>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Blood Type</p>
                    <p className="font-semibold text-red-600">{patientData.bloodType}</p>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Allergies</p>
                  <p className="font-semibold text-red-600">{patientData.allergies}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Chronic Conditions</p>
                  <p className="font-semibold">{patientData.chronicConditions}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-semibold">{patientData.dob}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for Different Sections */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="overview" className="w-full">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">Medical Records</h2>
                  <TabsList className="inline-flex h-auto flex-wrap gap-2 bg-transparent p-0">
                    <TabsTrigger 
                      value="overview"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="doctor-notes"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Doctor Notes
                    </TabsTrigger>
                    <TabsTrigger 
                      value="prescription"
                      className="data-[state=active]:bg-secondary data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <Pill className="w-4 h-4 mr-2" />
                      Prescription
                    </TabsTrigger>
                    <TabsTrigger 
                      value="lab"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Lab Investigation
                    </TabsTrigger>
                    <TabsTrigger 
                      value="nurse-notes"
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <FileCheck className="w-4 h-4 mr-2" />
                      Nurse Notes
                    </TabsTrigger>
                    <TabsTrigger 
                      value="drug-chart"
                      className="data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <Syringe className="w-4 h-4 mr-2" />
                      Drug Chart
                    </TabsTrigger>
                    <TabsTrigger 
                      value="vitals"
                      className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Vitals
                    </TabsTrigger>
                    <TabsTrigger 
                      value="operations"
                      className="data-[state=active]:bg-red-700 data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <Droplets className="w-4 h-4 mr-2" />
                      Operations
                    </TabsTrigger>
                    <TabsTrigger 
                      value="charges"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 font-medium transition-all hover:bg-muted"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Charges
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="w-5 h-5 text-primary" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Full Name</Label>
                          <p className="font-semibold">{patientData.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Age</Label>
                            <p className="font-medium">{patientData.age} years</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Gender</Label>
                            <p className="font-medium">{patientData.gender}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Phone</Label>
                          <p className="font-medium">{patientData.phone}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Address</Label>
                          <p className="font-medium">{patientData.address}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Activity className="w-5 h-5 text-secondary" />
                          Current Vitals
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Blood Pressure</Label>
                            <p className="font-semibold">{editableData.vitals.bp} mmHg</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Temperature</Label>
                            <p className="font-semibold">{editableData.vitals.temp} °C</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Pulse</Label>
                            <p className="font-semibold">{editableData.vitals.pulse} bpm</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Weight</Label>
                            <p className="font-semibold">{editableData.vitals.weight} kg</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Doctor Notes Tab */}
                <TabsContent value="doctor-notes" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-primary" />
                        Doctor's Clinical Notes
                      </CardTitle>
                      <CardDescription>
                        Clinical observations and treatment plans
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          rows={10}
                          value={editableData.doctorNotes}
                          onChange={(e) => setEditableData({...editableData, doctorNotes: e.target.value})}
                          placeholder="Enter clinical notes..."
                        />
                      ) : (
                        <div className="bg-muted/30 rounded-lg p-4 border border-border">
                          <p className="whitespace-pre-wrap">{editableData.doctorNotes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Prescription Tab */}
                <TabsContent value="prescription" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="w-5 h-5 text-secondary" />
                        Prescription Details
                      </CardTitle>
                      <CardDescription>
                        Medications prescribed to the patient
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          rows={8}
                          value={editableData.prescription}
                          onChange={(e) => setEditableData({...editableData, prescription: e.target.value})}
                          placeholder="Enter prescription details..."
                        />
                      ) : (
                        <div className="bg-muted/30 rounded-lg p-4 border border-border">
                          <p className="whitespace-pre-wrap">{editableData.prescription}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Lab Investigation Tab */}
                <TabsContent value="lab" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TestTube className="w-5 h-5 text-blue-600" />
                        Laboratory Investigations
                      </CardTitle>
                      <CardDescription>
                        Lab tests and results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          rows={8}
                          value={editableData.labInvestigation}
                          onChange={(e) => setEditableData({...editableData, labInvestigation: e.target.value})}
                          placeholder="Enter lab investigation details..."
                        />
                      ) : (
                        <div className="bg-muted/30 rounded-lg p-4 border border-border">
                          <p className="whitespace-pre-wrap">{editableData.labInvestigation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Nurse Notes Tab */}
                <TabsContent value="nurse-notes" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-purple-600" />
                        Nursing Notes
                      </CardTitle>
                      <CardDescription>
                        Nursing observations and care plans
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          rows={8}
                          value={editableData.nurseNotes}
                          onChange={(e) => setEditableData({...editableData, nurseNotes: e.target.value})}
                          placeholder="Enter nurse notes..."
                        />
                      ) : (
                        <div className="bg-muted/30 rounded-lg p-4 border border-border">
                          <p className="whitespace-pre-wrap">{editableData.nurseNotes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Drug Chart Tab */}
                <TabsContent value="drug-chart" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Syringe className="w-5 h-5 text-orange-600" />
                        Drug Administration Chart
                      </CardTitle>
                      <CardDescription>
                        Historical medication administration records - prescribed drugs administered over time
                      </CardDescription>
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

                {/* Vitals Tab */}
                <TabsContent value="vitals" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-600" />
                        Vital Signs Monitoring
                      </CardTitle>
                      <CardDescription>
                        Historical vital signs captured by nurses over time
                      </CardDescription>
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

                {/* Operations Tab */}
                <TabsContent value="operations" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-red-600" />
                        Surgical Operations
                      </CardTitle>
                      <CardDescription>
                        Surgical history and procedures
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          rows={8}
                          value={editableData.operations}
                          onChange={(e) => setEditableData({...editableData, operations: e.target.value})}
                          placeholder="Enter surgical history..."
                        />
                      ) : (
                        <div className="bg-muted/30 rounded-lg p-4 border border-border">
                          <p className="whitespace-pre-wrap">{editableData.operations}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Charges Tab */}
                <TabsContent value="charges" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Financial Charges
                      </CardTitle>
                      <CardDescription>
                        Treatment costs and billing information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          rows={8}
                          value={editableData.charges}
                          onChange={(e) => setEditableData({...editableData, charges: e.target.value})}
                          placeholder="Enter charges..."
                        />
                      ) : (
                        <div className="bg-muted/30 rounded-lg p-4 border border-border">
                          <p className="whitespace-pre-wrap">{editableData.charges}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}