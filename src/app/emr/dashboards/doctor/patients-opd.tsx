import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Search, Filter, RotateCcw, Eye, FileText,
  ChevronLeft, ChevronRight, UserCheck, Activity,
  Calendar, Stethoscope, ClipboardList, AlertCircle,
  X, ArrowRight, Building, Clock, AlertTriangle,
  CheckCircle2, TrendingUp, History, FileCheck
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

// OPD Patient Interface
interface OPDPatient {
  id: string;
  fileNo: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  dob: string;
  lastVisit: string;
  diagnosis: string;
  status: 'Active' | 'Follow-up' | 'Discharged';
  nextAppointment?: string;
  admissionStatus?: 'Outpatient' | 'Admitted';
  vitalSigns?: {
    bp: string;
    temp: string;
    pulse: string;
    weight: string;
  };
}

// Visit History Interface
interface VisitHistory {
  id: string;
  date: string;
  department: string;
  doctor: string;
  shift: string;
  priority: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  referral?: string;
  surgery?: string;
}

// Quick History Modal with Enhanced Features
function QuickHistoryModal({
  isOpen,
  onClose,
  onViewFullFile,
  patient,
}: {
  isOpen: boolean;
  onClose: () => void;
  onViewFullFile: () => void;
  patient: OPDPatient | null;
}) {
  if (!patient) return null;

  // Mock visit history data
  const visitHistory: VisitHistory[] = [
    {
      id: '1',
      date: new Date().toISOString(),
      department: 'General Medicine',
      doctor: 'Dr. Muhammad Bello',
      shift: 'Morning',
      priority: 'Normal',
      status: 'Completed',
    },
    {
      id: '2',
      date: new Date(Date.now() - 7 * 86400000).toISOString(),
      department: 'Cardiology',
      doctor: 'Dr. Fatima Abubakar',
      shift: 'Afternoon',
      priority: 'Urgent',
      status: 'Completed',
      referral: 'Cardiologist',
    },
    {
      id: '3',
      date: new Date(Date.now() - 14 * 86400000).toISOString(),
      department: 'Surgery',
      doctor: 'Dr. Ibrahim Hassan',
      shift: 'Morning',
      priority: 'High',
      status: 'Completed',
      surgery: 'Appendectomy',
    },
  ];

  // Mock summary data
  const patientSummary = {
    totalVisits: 15,
    totalAdmissions: 2,
    surgeriesCount: 1,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <History className="w-6 h-6 text-primary" />
                Patient Quick History
              </DialogTitle>
              <DialogDescription>
                Comprehensive overview of {patient.name}'s medical history
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[calc(90vh-200px)] space-y-4 pr-2">
              {/* Patient Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/5 rounded-lg p-4 border border-primary/20"
                >
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                    <Users className="w-4 h-4" />
                    Patient Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="font-semibold">{patient.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">File Number:</span>
                      <span className="font-mono text-sm font-semibold">{patient.fileNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Gender:</span>
                      <span className="font-medium">{patient.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date of Birth:</span>
                      <span className="font-medium">{patient.dob}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Admission Status:</span>
                      <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                        {patient.admissionStatus || 'Outpatient'}
                      </Badge>
                    </div>
                  </div>
                </motion.div>

                {/* Visit Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-secondary/5 rounded-lg p-4 border border-secondary/20"
                >
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-secondary">
                    <TrendingUp className="w-4 h-4" />
                    Visit Summary
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-secondary">{patientSummary.totalVisits}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total Visits</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{patientSummary.totalAdmissions}</p>
                      <p className="text-xs text-muted-foreground mt-1">Admissions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{patientSummary.surgeriesCount}</p>
                      <p className="text-xs text-muted-foreground mt-1">Surgeries</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Visit History Table */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border rounded-lg overflow-hidden"
              >
                <div className="bg-muted/50 px-4 py-3 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileCheck className="w-4 h-4" />
                    Recent Visit History
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Referral</TableHead>
                        <TableHead>Surgery</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visitHistory.map((visit) => (
                        <TableRow key={visit.id}>
                          <TableCell className="font-medium">
                            {new Date(visit.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{visit.department}</TableCell>
                          <TableCell>{visit.doctor}</TableCell>
                          <TableCell>{visit.shift}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                visit.priority === 'High' || visit.priority === 'Urgent'
                                  ? 'border-red-500 text-red-700'
                                  : ''
                              }
                            >
                              {visit.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                visit.status === 'Completed'
                                  ? 'bg-green-500/10 text-green-700 border-green-500/20'
                                  : visit.status === 'In Progress'
                                  ? 'bg-purple-500/10 text-purple-700 border-purple-500/20'
                                  : 'bg-gray-500/10 text-gray-700 border-gray-500/20'
                              }
                            >
                              {visit.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {visit.referral ? (
                              <Badge className="bg-blue-500/10 text-blue-700">{visit.referral}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {visit.surgery ? (
                              <Badge className="bg-orange-500/10 text-orange-700">{visit.surgery}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button onClick={onViewFullFile} className="bg-primary hover:bg-primary/90">
                <FileText className="w-4 h-4 mr-2" />
                View Full File
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
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

export function DoctorOPDPatientsPage() {
  const navigate = useNavigate();

  // Mock OPD patients data
  const [patients] = useState<OPDPatient[]>([
    {
      id: '1',
      fileNo: 'GH-PT-00001',
      name: 'Aisha Mohammed',
      age: 28,
      gender: 'Female',
      phone: '08012345678',
      dob: '1995-05-15',
      lastVisit: new Date().toISOString(),
      diagnosis: 'Acute Migraine',
      status: 'Active',
      nextAppointment: new Date(Date.now() + 7 * 86400000).toISOString(),
      vitalSigns: {
        bp: '120/80',
        temp: '36.5',
        pulse: '72',
        weight: '65'
      }
    },
    {
      id: '2',
      fileNo: 'GH-PT-00002',
      name: 'Ibrahim Suleiman',
      age: 45,
      gender: 'Male',
      phone: '08023456789',
      dob: '1978-08-22',
      lastVisit: new Date(Date.now() - 2 * 86400000).toISOString(),
      diagnosis: 'Hypertension',
      status: 'Follow-up',
      nextAppointment: new Date(Date.now() + 14 * 86400000).toISOString(),
      vitalSigns: {
        bp: '145/95',
        temp: '36.8',
        pulse: '78',
        weight: '82'
      }
    },
    {
      id: '3',
      fileNo: 'GH-PT-00003',
      name: 'Fatima Abdullahi',
      age: 32,
      gender: 'Female',
      phone: '08034567890',
      dob: '1991-03-10',
      lastVisit: new Date(Date.now() - 1 * 86400000).toISOString(),
      diagnosis: 'Upper Respiratory Tract Infection',
      status: 'Active',
      vitalSigns: {
        bp: '118/76',
        temp: '37.2',
        pulse: '82',
        weight: '58'
      }
    },
    {
      id: '4',
      fileNo: 'GH-PT-00004',
      name: 'Musa Garba',
      age: 55,
      gender: 'Male',
      phone: '08045678901',
      dob: '1968-07-05',
      lastVisit: new Date(Date.now() - 5 * 86400000).toISOString(),
      diagnosis: 'Type 2 Diabetes Mellitus',
      status: 'Follow-up',
      nextAppointment: new Date(Date.now() + 30 * 86400000).toISOString(),
      vitalSigns: {
        bp: '135/88',
        temp: '36.6',
        pulse: '75',
        weight: '88'
      }
    },
    {
      id: '5',
      fileNo: 'GH-PT-00005',
      name: 'Zainab Usman',
      age: 38,
      gender: 'Female',
      phone: '08056789012',
      dob: '1985-11-20',
      lastVisit: new Date(Date.now() - 14 * 86400000).toISOString(),
      diagnosis: 'Gastritis',
      status: 'Discharged',
      vitalSigns: {
        bp: '122/78',
        temp: '36.7',
        pulse: '70',
        weight: '62'
      }
    },
    {
      id: '6',
      fileNo: 'GH-PT-00006',
      name: 'Yusuf Ahmad',
      age: 42,
      gender: 'Male',
      phone: '08067890123',
      dob: '1981-04-12',
      lastVisit: new Date().toISOString(),
      diagnosis: 'Chronic Back Pain',
      status: 'Active',
      nextAppointment: new Date(Date.now() + 7 * 86400000).toISOString(),
      vitalSigns: {
        bp: '128/82',
        temp: '36.5',
        pulse: '74',
        weight: '75'
      }
    },
  ]);

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<OPDPatient | null>(null);

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        searchTerm === '' ||
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.fileNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
      const matchesGender = genderFilter === 'all' || patient.gender === genderFilter;

      return matchesSearch && matchesStatus && matchesGender;
    });
  }, [patients, searchTerm, statusFilter, genderFilter]);

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
      active: patients.filter(p => p.status === 'Active').length,
      followUp: patients.filter(p => p.status === 'Follow-up').length,
      discharged: patients.filter(p => p.status === 'Discharged').length,
    };
  }, [patients]);

  // Handlers
  const handleViewPatient = (patient: OPDPatient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleViewFullFile = (patient: OPDPatient) => {
    navigate(`/emr/doctor/patients/${patient.id}/file`);
  };

  const handleStartConsultation = (patient: OPDPatient) => {
    // Navigate to consultation panel for this patient
    navigate(`/emr/doctor/patients/${patient.id}/consultation`);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setGenderFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">OPD Patients</h1>
          <p className="text-muted-foreground">
            Manage and view your outpatient department patients
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          icon={Users}
          label="Total OPD Patients"
          value={kpis.total}
          color="bg-blue-100 text-blue-600"
          delay={0.1}
        />
        <KPICard
          icon={UserCheck}
          label="Active Patients"
          value={kpis.active}
          color="bg-green-100 text-green-600"
          delay={0.2}
        />
        <KPICard
          icon={Calendar}
          label="Follow-up"
          value={kpis.followUp}
          color="bg-orange-100 text-orange-600"
          delay={0.3}
        />
        <KPICard
          icon={AlertCircle}
          label="Discharged"
          value={kpis.discharged}
          color="bg-purple-100 text-purple-600"
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
          <CardDescription>Search and filter OPD patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Discharged">Discharged</SelectItem>
              </SelectContent>
            </Select>

            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gender</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || statusFilter !== 'all' || genderFilter !== 'all') && (
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
          <CardTitle>OPD Patients List</CardTitle>
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
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Vital Signs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No OPD patients found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPatients.map((patient) => (
                    <TableRow 
                      key={patient.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleViewPatient(patient)}
                    >
                      <TableCell>
                        <div className="font-mono font-semibold">{patient.fileNo}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {patient.age}y, {patient.gender} • {patient.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</div>
                        {patient.nextAppointment && (
                          <div className="text-xs text-muted-foreground">
                            Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{patient.diagnosis}</div>
                      </TableCell>
                      <TableCell>
                        {patient.vitalSigns ? (
                          <div className="text-xs space-y-0.5">
                            <div>BP: {patient.vitalSigns.bp}</div>
                            <div>Pulse: {patient.vitalSigns.pulse}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            patient.status === 'Active' 
                              ? 'bg-green-500/10 text-green-700 border-green-500/20' 
                              : patient.status === 'Follow-up' 
                              ? 'bg-purple-500/10 text-purple-700 border-purple-500/20' 
                              : 'bg-gray-500/10 text-gray-700 border-gray-500/20'
                          }
                        >
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
                          {patient.status === 'Active' && (
                            <Button
                              size="sm"
                              onClick={() => handleStartConsultation(patient)}
                            >
                              <Stethoscope className="w-4 h-4 mr-1" />
                              Consult
                            </Button>
                          )}
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
      <QuickHistoryModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onViewFullFile={() => handleViewFullFile(selectedPatient!)}
        patient={selectedPatient}
      />
    </div>
  );
}