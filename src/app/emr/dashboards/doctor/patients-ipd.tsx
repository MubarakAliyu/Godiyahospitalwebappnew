import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Users, Search, Filter, RotateCcw, Eye, FileText,
  ChevronLeft, ChevronRight, Bed, Activity,
  Calendar, Stethoscope, ClipboardList, AlertCircle, Heart
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
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
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

// IPD Patient Interface
interface IPDPatient {
  id: string;
  fileNo: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  admissionDate: string;
  ward: string;
  bedNo: string;
  bedCategory: 'General' | 'Private' | 'ICU' | 'Maternity';
  diagnosis: string;
  condition: 'Critical' | 'Stable' | 'Improving' | 'Recovering';
  admissionStatus: 'Admitted' | 'Under Observation' | 'Ready for Discharge';
  daysAdmitted: number;
  vitalSigns?: {
    bp: string;
    temp: string;
    pulse: string;
    spo2: string;
  };
  lastCheckup?: string;
}

// View Patient Modal
function ViewPatientModal({
  isOpen,
  onClose,
  patient
}: {
  isOpen: boolean;
  onClose: () => void;
  patient: IPDPatient | null;
}) {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Bed className="w-6 h-6 text-primary" />
            IPD Patient Details
          </DialogTitle>
          <DialogDescription>
            File Number: {patient.fileNo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Patient Info */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Patient Name</p>
                <p className="font-semibold">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">File Number</p>
                <p className="font-mono text-sm">{patient.fileNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{patient.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Condition</p>
                <Badge 
                  variant={
                    patient.condition === 'Critical' ? 'destructive' :
                    patient.condition === 'Stable' ? 'default' :
                    patient.condition === 'Improving' ? 'secondary' :
                    'outline'
                  }
                  className={
                    patient.condition === 'Stable' ? 'bg-blue-500/10 text-blue-700' :
                    patient.condition === 'Improving' ? 'bg-secondary' :
                    patient.condition === 'Recovering' ? 'bg-green-500/10 text-green-700' :
                    ''
                  }
                >
                  {patient.condition}
                </Badge>
              </div>
            </div>
          </div>

          {/* Admission Details */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Bed className="w-4 h-4" />
              Admission Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Ward</p>
                <p className="font-semibold">{patient.ward}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bed Number</p>
                <p className="font-semibold">{patient.bedNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admission Date</p>
                <p className="font-medium">{new Date(patient.admissionDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days Admitted</p>
                <p className="font-medium">{patient.daysAdmitted} days</p>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          {patient.vitalSigns && (
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Latest Vital Signs
                {patient.lastCheckup && (
                  <span className="text-xs text-muted-foreground font-normal ml-auto">
                    Last updated: {new Date(patient.lastCheckup).toLocaleString()}
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Blood Pressure</p>
                  <p className="font-semibold">{patient.vitalSigns.bp} mmHg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="font-semibold">{patient.vitalSigns.temp} °C</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pulse</p>
                  <p className="font-semibold">{patient.vitalSigns.pulse} bpm</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SpO2</p>
                  <p className="font-semibold">{patient.vitalSigns.spo2}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Diagnosis */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h3 className="font-semibold mb-2">Current Diagnosis</h3>
            <p className="text-sm">{patient.diagnosis}</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            View Full File
          </Button>
          <Button>
            <ClipboardList className="w-4 h-4 mr-2" />
            Update Treatment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// KPI Card Component
function KPICard({
  icon: Icon,
  label,
  value,
  color,
  delay = 0,
}: {
  icon: any;
  label: string;
  value: number | string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}

export function DoctorIPDPatientsPage() {
  const navigate = useNavigate();

  // Mock IPD patients data
  const [patients] = useState<IPDPatient[]>([
    {
      id: '1',
      fileNo: 'GH-PT-00011',
      name: 'Hauwa Bello',
      age: 52,
      gender: 'Female',
      phone: '08011223344',
      admissionDate: new Date(Date.now() - 3 * 86400000).toISOString(),
      ward: 'General Ward A',
      bedNo: 'A-12',
      bedCategory: 'General',
      diagnosis: 'Pneumonia with respiratory complications',
      condition: 'Improving',
      admissionStatus: 'Admitted',
      daysAdmitted: 3,
      vitalSigns: {
        bp: '138/85',
        temp: '37.4',
        pulse: '88',
        spo2: '94'
      },
      lastCheckup: new Date(Date.now() - 2 * 3600000).toISOString()
    },
    {
      id: '2',
      fileNo: 'GH-PT-00012',
      name: 'Abdullahi Musa',
      age: 68,
      gender: 'Male',
      phone: '08022334455',
      admissionDate: new Date(Date.now() - 7 * 86400000).toISOString(),
      ward: 'ICU',
      bedNo: 'ICU-3',
      bedCategory: 'ICU',
      diagnosis: 'Acute Myocardial Infarction',
      condition: 'Critical',
      admissionStatus: 'Under Observation',
      daysAdmitted: 7,
      vitalSigns: {
        bp: '165/102',
        temp: '36.8',
        pulse: '102',
        spo2: '89'
      },
      lastCheckup: new Date(Date.now() - 1 * 3600000).toISOString()
    },
    {
      id: '3',
      fileNo: 'GH-PT-00013',
      name: 'Khadija Ibrahim',
      age: 35,
      gender: 'Female',
      phone: '08033445566',
      admissionDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      ward: 'Maternity Ward',
      bedNo: 'M-8',
      bedCategory: 'Maternity',
      diagnosis: 'Post-operative care - Caesarean Section',
      condition: 'Stable',
      admissionStatus: 'Admitted',
      daysAdmitted: 2,
      vitalSigns: {
        bp: '120/78',
        temp: '36.9',
        pulse: '76',
        spo2: '98'
      },
      lastCheckup: new Date(Date.now() - 4 * 3600000).toISOString()
    },
    {
      id: '4',
      fileNo: 'GH-PT-00014',
      name: 'Umar Faruk',
      age: 29,
      gender: 'Male',
      phone: '08044556677',
      admissionDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      ward: 'General Ward B',
      bedNo: 'B-5',
      bedCategory: 'General',
      diagnosis: 'Appendicitis - Post appendectomy',
      condition: 'Recovering',
      admissionStatus: 'Ready for Discharge',
      daysAdmitted: 5,
      vitalSigns: {
        bp: '118/74',
        temp: '36.6',
        pulse: '72',
        spo2: '99'
      },
      lastCheckup: new Date(Date.now() - 6 * 3600000).toISOString()
    },
    {
      id: '5',
      fileNo: 'GH-PT-00015',
      name: 'Maryam Sani',
      age: 44,
      gender: 'Female',
      phone: '08055667788',
      admissionDate: new Date(Date.now() - 4 * 86400000).toISOString(),
      ward: 'Private Ward',
      bedNo: 'PVT-2',
      bedCategory: 'Private',
      diagnosis: 'Severe Malaria with complications',
      condition: 'Improving',
      admissionStatus: 'Admitted',
      daysAdmitted: 4,
      vitalSigns: {
        bp: '125/80',
        temp: '37.8',
        pulse: '84',
        spo2: '96'
      },
      lastCheckup: new Date(Date.now() - 3 * 3600000).toISOString()
    },
  ]);

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<IPDPatient | null>(null);

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');
  const [bedCategoryFilter, setBedCategoryFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique wards
  const wards = useMemo(() => {
    return Array.from(new Set(patients.map(p => p.ward)));
  }, [patients]);

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        searchTerm === '' ||
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.fileNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCondition = conditionFilter === 'all' || patient.condition === conditionFilter;
      const matchesWard = wardFilter === 'all' || patient.ward === wardFilter;
      const matchesBedCategory = bedCategoryFilter === 'all' || patient.bedCategory === bedCategoryFilter;

      return matchesSearch && matchesCondition && matchesWard && matchesBedCategory;
    });
  }, [patients, searchTerm, conditionFilter, wardFilter, bedCategoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate KPIs
  const kpis = useMemo(() => {
    return {
      total: patients.length,
      critical: patients.filter(p => p.condition === 'Critical').length,
      stable: patients.filter(p => p.condition === 'Stable').length,
      improving: patients.filter(p => p.condition === 'Improving' || p.condition === 'Recovering').length,
    };
  }, [patients]);

  // Handlers
  const handleViewPatient = (patient: IPDPatient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleViewFullFile = (patient: IPDPatient) => {
    navigate(`/emr/doctor/patients/${patient.id}/ipd-file`);
  };

  const handleUpdateTreatment = (patient: IPDPatient) => {
    toast.success('Opening Treatment Update', {
      description: `Updating treatment plan for ${patient.name}`,
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setConditionFilter('all');
    setWardFilter('all');
    setBedCategoryFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">IPD Patients</h1>
          <p className="text-muted-foreground">
            Manage and view your inpatient department patients
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          icon={Bed}
          label="Total IPD Patients"
          value={kpis.total}
          color="bg-blue-100 text-blue-600"
          delay={0.1}
        />
        <KPICard
          icon={AlertCircle}
          label="Critical"
          value={kpis.critical}
          color="bg-red-100 text-red-600"
          delay={0.2}
        />
        <KPICard
          icon={Heart}
          label="Stable"
          value={kpis.stable}
          color="bg-blue-100 text-blue-600"
          delay={0.3}
        />
        <KPICard
          icon={Activity}
          label="Improving/Recovering"
          value={kpis.improving}
          color="bg-green-100 text-green-600"
          delay={0.4}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filters
          </CardTitle>
          <CardDescription>Search and filter IPD patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, file no, diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Stable">Stable</SelectItem>
                <SelectItem value="Improving">Improving</SelectItem>
                <SelectItem value="Recovering">Recovering</SelectItem>
              </SelectContent>
            </Select>

            <Select value={wardFilter} onValueChange={setWardFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Wards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {wards.map(ward => (
                  <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={bedCategoryFilter} onValueChange={setBedCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Bed Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="ICU">ICU</SelectItem>
                <SelectItem value="Maternity">Maternity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || conditionFilter !== 'all' || wardFilter !== 'all' || bedCategoryFilter !== 'all') && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>IPD Patients List</CardTitle>
          <CardDescription>
            Showing {paginatedPatients.length} of {filteredPatients.length} patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File No</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Ward & Bed</TableHead>
                  <TableHead>Admission</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Vital Signs</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No IPD patients found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="font-mono font-semibold">{patient.fileNo}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {patient.age}y, {patient.gender}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{patient.ward}</div>
                        <div className="text-xs text-muted-foreground">Bed {patient.bedNo}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{new Date(patient.admissionDate).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">{patient.daysAdmitted} days</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-xs truncate">{patient.diagnosis}</div>
                      </TableCell>
                      <TableCell>
                        {patient.vitalSigns ? (
                          <div className="text-xs space-y-0.5">
                            <div>BP: {patient.vitalSigns.bp}</div>
                            <div>SpO2: {patient.vitalSigns.spo2}%</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            patient.condition === 'Critical' ? 'destructive' :
                            patient.condition === 'Stable' ? 'default' :
                            patient.condition === 'Improving' ? 'secondary' :
                            'outline'
                          }
                          className={
                            patient.condition === 'Stable' ? 'bg-blue-500/10 text-blue-700' :
                            patient.condition === 'Improving' ? 'bg-secondary' :
                            patient.condition === 'Recovering' ? 'bg-green-500/10 text-green-700' :
                            ''
                          }
                        >
                          {patient.condition}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewFullFile(patient)}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            File
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateTreatment(patient)}
                          >
                            <ClipboardList className="w-4 h-4 mr-1" />
                            Update
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Patient Modal */}
      <ViewPatientModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        patient={selectedPatient}
      />
    </div>
  );
}