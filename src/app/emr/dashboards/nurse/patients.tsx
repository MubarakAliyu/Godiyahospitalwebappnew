import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Search, Eye, FileText, Activity, AlertCircle, 
  Heart, Thermometer, User, Phone, Calendar, Filter, 
  ChevronDown, RotateCcw, X, Save, Edit, Check,
  AlertTriangle, Stethoscope, ClipboardList, Info
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useEMRStore } from '@/app/emr/store/emr-store';
import { Patient } from '@/app/emr/store/types';
import { ViewSubfilesModal } from '@/app/emr/components/patient-action-modals';

// Vital Signs Interface
interface VitalSigns {
  temperature: string;
  bp: string;
  pulse: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  weight: string;
  height: string;
  bmi?: string;
}

// Quick View Modal Component
function QuickViewModal({
  isOpen,
  onClose,
  patient,
  onEditVitals,
  onViewFullFile,
}: {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onEditVitals: () => void;
  onViewFullFile: (patientId: string) => void;
}) {
  if (!patient) return null;

  // Mock latest vitals (in real app, fetch from store)
  const latestVitals: VitalSigns = {
    temperature: '36.5°C',
    bp: '120/80',
    pulse: '72 bpm',
    respiratoryRate: '16 /min',
    oxygenSaturation: '98%',
    weight: '70 kg',
    height: '170 cm',
    bmi: '24.2',
  };

  // Mock allergies (in real app, fetch from patient data)
  const allergies = ['Penicillin', 'Aspirin'];

  // Mock last visit (in real app, fetch from appointments/visits)
  const lastVisit = {
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    department: 'General Medicine',
    doctor: 'Dr. Musa Ibrahim',
    diagnosis: 'Routine Checkup',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Patient Quick View
          </DialogTitle>
          <DialogDescription>
            Quick overview of {patient.fullName}'s information
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] space-y-4 pr-2">
          {/* Patient Snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File No:</span>
                  <span className="font-semibold">{patient.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium">{patient.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span className="font-medium">{patient.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DOB:</span>
                  <span className="font-medium">{formatDate(patient.dateOfBirth)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{patient.phoneNumber}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  File Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant={patient.fileType === 'Family' ? 'secondary' : 'outline'}>
                    {patient.fileType}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'}>
                    {patient.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient Type:</span>
                  <span className="font-medium">{patient.patientType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registered:</span>
                  <span className="font-medium">{formatDate(patient.dateRegistered)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Latest Vitals */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Latest Vital Signs
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={onEditVitals}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Vitals
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Thermometer className="w-3 h-3" />
                      Temperature
                    </div>
                    <p className="text-lg font-semibold">{latestVitals.temperature}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart className="w-3 h-3" />
                      Blood Pressure
                    </div>
                    <p className="text-lg font-semibold">{latestVitals.bp}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Activity className="w-3 h-3" />
                      Pulse
                    </div>
                    <p className="text-lg font-semibold">{latestVitals.pulse}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Stethoscope className="w-3 h-3" />
                      SPO2
                    </div>
                    <p className="text-lg font-semibold">{latestVitals.oxygenSaturation}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      Weight
                    </div>
                    <p className="text-lg font-semibold">{latestVitals.weight}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      Height
                    </div>
                    <p className="text-lg font-semibold">{latestVitals.height}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ClipboardList className="w-3 h-3" />
                      BMI
                    </div>
                    <p className="text-lg font-semibold">{latestVitals.bmi}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Activity className="w-3 h-3" />
                      Resp. Rate
                    </div>
                    <p className="text-lg font-semibold">{latestVitals.respiratoryRate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Allergies & Last Visit */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Allergies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No known allergies</p>
                )}
              </CardContent>
            </Card>

            {/* Last Visit */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Last Visit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{formatDate(lastVisit.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{lastVisit.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-medium">{lastVisit.doctor}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onViewFullFile(patient.id)} className="bg-primary hover:bg-primary/90">
            <FileText className="w-4 h-4 mr-2" />
            View Full File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Edit Vitals Modal Component
function EditVitalsModal({
  isOpen,
  onClose,
  patient,
}: {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}) {
  const [vitals, setVitals] = useState<VitalSigns>({
    temperature: '36.5',
    bp: '120/80',
    pulse: '72',
    respiratoryRate: '16',
    oxygenSaturation: '98',
    weight: '70',
    height: '170',
  });
  const [isSaving, setIsSaving] = useState(false);
  const { addNotification, addActivityLog } = useEMRStore();

  if (!patient) return null;

  // Calculate BMI
  const calculateBMI = () => {
    const weight = parseFloat(vitals.weight);
    const height = parseFloat(vitals.height) / 100; // Convert cm to m
    if (weight > 0 && height > 0) {
      return (weight / (height * height)).toFixed(1);
    }
    return '';
  };

  const handleSave = () => {
    // Validation
    if (!vitals.temperature || !vitals.bp || !vitals.pulse) {
      toast.error('Required Fields Missing', {
        description: 'Please fill in Temperature, Blood Pressure, and Pulse',
      });
      return;
    }

    setIsSaving(true);

    // Simulate save delay
    setTimeout(() => {
      const bmi = calculateBMI();
      
      // Add notification
      addNotification({
        id: `notif-${Date.now()}`,
        type: 'success',
        category: 'clinical',
        icon: 'Activity',
        title: 'Vital Signs Updated',
        description: `Vital signs recorded for ${patient.fullName}`,
        message: `Temperature: ${vitals.temperature}°C, BP: ${vitals.bp}, Pulse: ${vitals.pulse} bpm, SPO2: ${vitals.oxygenSaturation}%, Weight: ${vitals.weight}kg, Height: ${vitals.height}cm, BMI: ${bmi}`,
        module: 'Patients',
        timestamp: new Date().toISOString(),
        unread: true,
      });

      // Add activity log
      addActivityLog({
        id: `log-${Date.now()}`,
        action: `Recorded vital signs for ${patient.fullName} (${patient.id})`,
        module: 'Patients',
        user: 'Nurse Hauwa Bello',
        timestamp: new Date().toISOString(),
        icon: 'Activity',
      });

      toast.success('Vitals Saved Successfully', {
        description: `Vital signs updated for ${patient.fullName}`,
      });

      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-primary" />
            Edit Vital Signs
          </DialogTitle>
          <DialogDescription>
            Record vital signs for {patient.fullName} ({patient.id})
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] space-y-4 pr-2">
          {/* Vital Signs Form */}
          <div className="grid grid-cols-2 gap-4">
            {/* Temperature */}
            <div className="space-y-2">
              <Label htmlFor="temperature" className="flex items-center gap-1">
                <Thermometer className="w-4 h-4 text-primary" />
                Temperature (°C) *
              </Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="36.5"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
              />
            </div>

            {/* Blood Pressure */}
            <div className="space-y-2">
              <Label htmlFor="bp" className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-primary" />
                Blood Pressure *
              </Label>
              <Input
                id="bp"
                type="text"
                placeholder="120/80"
                value={vitals.bp}
                onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
              />
            </div>

            {/* Pulse */}
            <div className="space-y-2">
              <Label htmlFor="pulse" className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-primary" />
                Pulse (bpm) *
              </Label>
              <Input
                id="pulse"
                type="number"
                placeholder="72"
                value={vitals.pulse}
                onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
              />
            </div>

            {/* Respiratory Rate */}
            <div className="space-y-2">
              <Label htmlFor="respiratoryRate" className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-primary" />
                Resp. Rate (/min)
              </Label>
              <Input
                id="respiratoryRate"
                type="number"
                placeholder="16"
                value={vitals.respiratoryRate}
                onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
              />
            </div>

            {/* Oxygen Saturation */}
            <div className="space-y-2">
              <Label htmlFor="oxygenSaturation" className="flex items-center gap-1">
                <Stethoscope className="w-4 h-4 text-primary" />
                SPO2 (%)
              </Label>
              <Input
                id="oxygenSaturation"
                type="number"
                placeholder="98"
                value={vitals.oxygenSaturation}
                onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-1">
                <User className="w-4 h-4 text-primary" />
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70"
                value={vitals.weight}
                onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
              />
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-1">
                <User className="w-4 h-4 text-primary" />
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={vitals.height}
                onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
              />
            </div>

            {/* BMI (calculated) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <ClipboardList className="w-4 h-4 text-primary" />
                BMI (Calculated)
              </Label>
              <div className="flex items-center h-10 px-3 rounded-md border bg-muted">
                <span className="font-semibold">{calculateBMI() || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <Info className="w-4 h-4 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-900">
              Fields marked with * are required. BMI is automatically calculated from weight and height.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mr-2"
                >
                  <Activity className="w-4 h-4" />
                </motion.div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Vitals
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Nurse Patients Component
export function NursePatients() {
  const navigate = useNavigate();
  const { patients } = useEMRStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFileType, setFilterFileType] = useState<'All' | 'Individual' | 'Family'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Admitted' | 'Discharged'>('All');

  // Modal states
  const [quickViewModalOpen, setQuickViewModalOpen] = useState(false);
  const [editVitalsModalOpen, setEditVitalsModalOpen] = useState(false);
  const [subfilesModalOpen, setSubfilesModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Search filter (by name or file number)
      const matchesSearch =
        patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase());

      // File type filter
      const matchesFileType =
        filterFileType === 'All' || patient.fileType === filterFileType;

      // Status filter
      const matchesStatus =
        filterStatus === 'All' || patient.status === filterStatus;

      return matchesSearch && matchesFileType && matchesStatus;
    });
  }, [patients, searchQuery, filterFileType, filterStatus]);

  // Get subfiles for a family file
  const getSubfiles = (parentFileId: string) => {
    return patients.filter(p => p.parentFileId === parentFileId);
  };

  const handleQuickView = (patient: Patient) => {
    setSelectedPatient(patient);
    setQuickViewModalOpen(true);
  };

  const handleEditVitals = (patient: Patient) => {
    setSelectedPatient(patient);
    setQuickViewModalOpen(false);
    setEditVitalsModalOpen(true);
  };

  const handleViewSubfiles = (patient: Patient) => {
    setSelectedPatient(patient);
    setSubfilesModalOpen(true);
  };

  const handleViewFullFile = (fileNo?: string) => {
    const patientId = fileNo || selectedPatient?.id;
    if (patientId) {
      navigate(`/emr/nurse/patients/${patientId}`);
    } else {
      toast.error('Error', {
        description: 'Patient ID not found. Please try again.',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterFileType('All');
    setFilterStatus('All');
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Patient Management</h1>
          <p className="text-muted-foreground">
            View and manage all patient files, vitals, and records
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {filteredPatients.length} Patient{filteredPatients.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="search">Search Patient</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or file number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* File Type Filter */}
            <div className="space-y-2">
              <Label htmlFor="fileType">File Type</Label>
              <Select value={filterFileType} onValueChange={(value: any) => setFilterFileType(value)}>
                <SelectTrigger id="fileType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Admitted">Admitted</SelectItem>
                  <SelectItem value="Discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Button */}
          {(searchQuery || filterFileType !== 'All' || filterStatus !== 'All') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            All Patients
          </CardTitle>
          <CardDescription>
            {filteredPatients.length === 0
              ? 'No patients found matching your criteria'
              : `Showing ${filteredPatients.length} patient${filteredPatients.length !== 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>DOB</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>File Type</TableHead>
                  <TableHead className="text-center">Subfiles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="w-8 h-8 text-muted-foreground/50" />
                          <p>No patients found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient, index) => {
                      const subfiles = patient.fileType === 'Family' ? getSubfiles(patient.id) : [];
                      
                      return (
                        <motion.tr
                          key={patient.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.03 }}
                          className="group hover:bg-muted/50"
                        >
                          <TableCell className="font-mono font-semibold text-primary">
                            {patient.id}
                          </TableCell>
                          <TableCell className="font-medium">{patient.fullName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{patient.gender}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(patient.dateOfBirth)}
                          </TableCell>
                          <TableCell className="text-sm">{patient.phoneNumber}</TableCell>
                          <TableCell>
                            <Badge variant={patient.fileType === 'Family' ? 'secondary' : 'outline'}>
                              {patient.fileType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {patient.fileType === 'Family' ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewSubfiles(patient)}
                                className="text-primary hover:text-primary/80"
                              >
                                {subfiles.length} subfile{subfiles.length !== 1 ? 's' : ''}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickView(patient)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Quick View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditVitals(patient)}
                              >
                                <Stethoscope className="w-4 h-4 mr-1" />
                                Vitals
                              </Button>
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => handleViewFullFile(patient.id)}
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                View File
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <QuickViewModal
        isOpen={quickViewModalOpen}
        onClose={() => setQuickViewModalOpen(false)}
        patient={selectedPatient}
        onEditVitals={() => handleEditVitals(selectedPatient!)}
        onViewFullFile={handleViewFullFile}
      />

      <EditVitalsModal
        isOpen={editVitalsModalOpen}
        onClose={() => setEditVitalsModalOpen(false)}
        patient={selectedPatient}
      />

      <ViewSubfilesModal
        isOpen={subfilesModalOpen}
        onClose={() => setSubfilesModalOpen(false)}
        familyFile={selectedPatient}
        subfiles={selectedPatient ? getSubfiles(selectedPatient.id) : []}
        onViewFile={handleViewFullFile}
      />
    </div>
  );
}