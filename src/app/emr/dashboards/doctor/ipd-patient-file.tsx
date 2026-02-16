import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, User, FileText, Pill, TestTube, Activity,
  Stethoscope, FileCheck, Droplets, Syringe, DollarSign,
  Save, Edit3, Calendar, Phone, MapPin, Bed, AlertTriangle,
  Shield, UserCheck, Building, Clock, Eye
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

export function DoctorIPDPatientFilePage() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock patient data
  const patientData = {
    id: patientId || '1',
    fileNo: 'GH-PT-00011',
    name: 'Hauwa Bello',
    age: 52,
    gender: 'Female',
    dob: '1971-03-20',
    phone: '08011223344',
    address: 'No. 23, Sokoto Road, Birnin Kebbi',
    bloodType: 'A+',
    allergies: 'Sulfa drugs, Aspirin',
    chronicConditions: 'Hypertension, Diabetes Type 2',
    ward: 'General Ward A',
    bedNo: 'A-12',
    bedCategory: 'General',
    admissionDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    admissionStatus: 'Admitted',
    condition: 'Improving',
    diagnosis: 'Pneumonia with respiratory complications',
    attendingDoctor: 'Dr. Muhammad Bello',
    attendingDoctorPhone: '08099887766',
    nextOfKin: 'Ibrahim Bello (Son)',
    nextOfKinPhone: '08033445566',
    insurance: {
      provider: 'NHIS',
      policyNumber: 'NHIS-2024-00123',
      coverage: 'Full Coverage',
      expiryDate: '2025-12-31',
    },
  };

  // State for editable data
  const [editableData, setEditableData] = useState({
    doctorNotes: 'Patient admitted with severe pneumonia. Currently on IV antibiotics. Showing signs of improvement.',
    prescription: 'Ceftriaxone 2g IV BD, Azithromycin 500mg OD, Paracetamol 1g PRN for fever',
    labInvestigation: 'Blood Culture - Pending\nChest X-ray - Shows bilateral infiltrates\nCBC - WBC elevated at 15,000',
    nurseNotes: 'Patient vitals stable. Tolerating oral fluids. No respiratory distress noted.',
    drugChart: 'Ceftriaxone administered at 08:00 AM and 08:00 PM\nAzithromycin given at 08:00 AM',
    vitals: {
      bp: '138/85',
      temp: '37.4',
      pulse: '88',
      weight: '72',
      height: '162',
      oxygenSat: '94',
    },
    operations: 'No surgical procedures performed',
    charges: '₦45,000 - Admission fee\n₦12,000 - Medication (daily)\n₦8,000 - Laboratory tests',
  });

  // Mock historical vitals data captured by nurses over time
  const vitalsHistory = [
    {
      id: '1',
      date: '2/16/2026',
      time: '08:00 AM',
      bp: '138/85',
      temp: '37.4',
      pulse: '88',
      respRate: '20',
      oxygenSat: '94',
      weight: '72',
      height: '162',
      bmi: '27.4',
      recordedBy: 'Nurse Halima Usman',
    },
    {
      id: '2',
      date: '2/15/2026',
      time: '08:00 PM',
      bp: '140/88',
      temp: '37.8',
      pulse: '92',
      respRate: '22',
      oxygenSat: '92',
      weight: '72',
      height: '162',
      bmi: '27.4',
      recordedBy: 'Nurse Fatima Ibrahim',
    },
    {
      id: '3',
      date: '2/15/2026',
      time: '08:00 AM',
      bp: '142/90',
      temp: '38.1',
      pulse: '94',
      respRate: '24',
      oxygenSat: '91',
      weight: '72',
      height: '162',
      bmi: '27.4',
      recordedBy: 'Nurse Halima Usman',
    },
    {
      id: '4',
      date: '2/14/2026',
      time: '08:00 PM',
      bp: '145/92',
      temp: '38.5',
      pulse: '98',
      respRate: '26',
      oxygenSat: '89',
      weight: '72',
      height: '162',
      bmi: '27.4',
      recordedBy: 'Nurse Amina Bello',
    },
    {
      id: '5',
      date: '2/14/2026',
      time: '08:00 AM',
      bp: '148/95',
      temp: '38.9',
      pulse: '102',
      respRate: '28',
      oxygenSat: '88',
      weight: '72',
      height: '162',
      bmi: '27.4',
      recordedBy: 'Nurse Halima Usman',
    },
  ];

  // Mock drug chart data - prescribed drugs administered over time
  const drugChartHistory = [
    {
      id: '1',
      date: '2/16/2026',
      time: '08:00 AM',
      drugName: 'Ceftriaxone',
      dosage: '2g',
      route: 'IV',
      frequency: 'BD',
      prescribedBy: 'Dr. Muhammad Bello',
      administeredBy: 'Nurse Halima Usman',
      status: 'Administered',
    },
    {
      id: '2',
      date: '2/15/2026',
      time: '08:00 PM',
      drugName: 'Ceftriaxone',
      dosage: '2g',
      route: 'IV',
      frequency: 'BD',
      prescribedBy: 'Dr. Muhammad Bello',
      administeredBy: 'Nurse Fatima Ibrahim',
      status: 'Administered',
    },
    {
      id: '3',
      date: '2/15/2026',
      time: '08:00 AM',
      drugName: 'Azithromycin',
      dosage: '500mg',
      route: 'Oral',
      frequency: 'OD',
      prescribedBy: 'Dr. Muhammad Bello',
      administeredBy: 'Nurse Halima Usman',
      status: 'Administered',
    },
    {
      id: '4',
      date: '2/15/2026',
      time: '02:00 PM',
      drugName: 'Paracetamol',
      dosage: '1g',
      route: 'Oral',
      frequency: 'PRN',
      prescribedBy: 'Dr. Muhammad Bello',
      administeredBy: 'Nurse Halima Usman',
      status: 'Administered',
    },
    {
      id: '5',
      date: '2/14/2026',
      time: '08:00 PM',
      drugName: 'Ceftriaxone',
      dosage: '2g',
      route: 'IV',
      frequency: 'BD',
      prescribedBy: 'Dr. Muhammad Bello',
      administeredBy: 'Nurse Amina Bello',
      status: 'Administered',
    },
    {
      id: '6',
      date: '2/14/2026',
      time: '08:00 AM',
      drugName: 'Ceftriaxone',
      dosage: '2g',
      route: 'IV',
      frequency: 'BD',
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
      toast.success('Admission Details Updated', {
        description: 'All changes have been saved successfully',
      });
    }, 1000);
  };

  const handleVitalsSave = () => {
    toast.success('Vitals Saved', {
      description: 'Patient vitals updated successfully',
    });
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
            Back to IPD Patients
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
                        <Bed className="w-4 h-4 text-muted-foreground" />
                        <span>{patientData.ward} - Bed {patientData.bedNo}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge className={
                    patientData.condition === 'Critical' ? 'bg-red-600' :
                    patientData.condition === 'Stable' ? 'bg-blue-600' :
                    patientData.condition === 'Improving' ? 'bg-secondary' :
                    'bg-green-600'
                  }>
                    {patientData.condition}
                  </Badge>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Blood Type</p>
                    <p className="font-semibold text-red-600">{patientData.bloodType}</p>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Allergies
                  </p>
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
                <div>
                  <p className="text-muted-foreground">Admission Date</p>
                  <p className="font-semibold">{new Date(patientData.admissionDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admission Summary & Attending Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Admission Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                  <Bed className="w-5 h-5" />
                  Admission Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge className="bg-blue-600">{patientData.admissionStatus}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ward:</span>
                  <span className="font-semibold">{patientData.ward}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bed Number:</span>
                  <span className="font-semibold">{patientData.bedNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bed Category:</span>
                  <Badge variant="outline">{patientData.bedCategory}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Days Admitted:</span>
                  <span className="font-semibold">
                    {Math.floor((Date.now() - new Date(patientData.admissionDate).getTime()) / 86400000)} days
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Attending Doctor Card */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-900">
                  <UserCheck className="w-5 h-5" />
                  Attending Doctor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Doctor Name</p>
                  <p className="font-semibold text-lg">{patientData.attendingDoctor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{patientData.attendingDoctorPhone}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Next of Kin</p>
                  <p className="font-semibold">{patientData.nextOfKin}</p>
                  <p className="text-sm text-muted-foreground mt-1">{patientData.nextOfKinPhone}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Insurance Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-purple-900">
                <Shield className="w-5 h-5" />
                Insurance Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="font-semibold">{patientData.insurance.provider}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Policy Number</p>
                  <p className="font-mono text-sm font-semibold">{patientData.insurance.policyNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Coverage</p>
                  <Badge className="bg-green-600">{patientData.insurance.coverage}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">{patientData.insurance.expiryDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for Different Sections */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
                            <Label className="text-xs text-muted-foreground">SpO2</Label>
                            <p className="font-semibold">{editableData.vitals.oxygenSat}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Allergy Section */}
                  <Card className="border-red-200 bg-red-50/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-red-900">
                        <AlertTriangle className="w-5 h-5" />
                        Allergy Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Known Allergies:</p>
                        <p className="font-semibold text-red-700">{patientData.allergies}</p>
                        <Separator className="my-2" />
                        <p className="text-sm text-muted-foreground">Chronic Conditions:</p>
                        <p className="font-semibold">{patientData.chronicConditions}</p>
                      </div>
                    </CardContent>
                  </Card>
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
                          onChange={(e) => {
                            setEditableData({...editableData, doctorNotes: e.target.value});
                            toast.info('Note updated', { description: 'Changes will be saved when you click Save Changes' });
                          }}
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
                        <>
                          <Textarea
                            rows={8}
                            value={editableData.labInvestigation}
                            onChange={(e) => setEditableData({...editableData, labInvestigation: e.target.value})}
                            placeholder="Enter lab investigation details..."
                          />
                          <Button 
                            className="mt-3" 
                            variant="outline"
                            onClick={() => toast.success('Lab Request Submitted', { description: 'Laboratory investigation request has been submitted' })}
                          >
                            Submit Lab Request
                          </Button>
                        </>
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