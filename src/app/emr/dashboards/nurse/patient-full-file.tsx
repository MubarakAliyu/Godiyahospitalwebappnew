import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, User, Calendar, Phone, MapPin, Heart, Activity,
  Stethoscope, Pill, FlaskConical, DollarSign, Bed, FileText,
  ClipboardList, TrendingUp, Users, Syringe, Scissors, UserPlus,
  AlertTriangle, CheckCircle, XCircle, Clock, Eye, Download,
  Edit, Trash2, Plus, X, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useEMRStore } from '@/app/emr/store/emr-store';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Appointment, Invoice } from '@/app/emr/store/types';
import {
  vipPatientId,
  vipPatientKPIs,
  vipVitalsData,
  vipConsultations,
  vipMedicalHistory,
  vipAdmissionsData,
  vipPrescriptionsData,
  vipNurseNotes,
  vipLabTests,
  vipFindings,
} from '@/app/emr/modules/patients/vip-patient-data';

// KPI Mini Card Component
function KPIMiniCard({ title, value, icon: Icon, color, bgColor }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{title}</p>
              <h3 className="text-2xl font-semibold">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg ${bgColor}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// View Appointment Details Modal
function ViewAppointmentModal({ isOpen, onClose, appointment }: { isOpen: boolean; onClose: () => void; appointment: Appointment | null }) {
  if (!appointment) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-blue-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Appointment Details</h2>
                    <p className="text-sm text-muted-foreground">ID: {appointment.id}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
                    <p className="font-medium">{appointment.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Patient ID</p>
                    <p className="font-medium">{appointment.patientId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Appointment Type</p>
                    <Badge variant="outline">{appointment.appointmentType}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge>{appointment.status}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Department</p>
                    <p className="font-medium">{appointment.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Doctor</p>
                    <p className="font-medium">{appointment.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="font-medium">{format(new Date(appointment.date), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Time</p>
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Priority</p>
                    <Badge variant={appointment.priority === 'Critical' ? 'destructive' : 'default'}>
                      {appointment.priority}
                    </Badge>
                  </div>
                  {appointment.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="font-medium">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/30">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// View Invoice Modal with PDF Download
function ViewInvoiceModal({ isOpen, onClose, invoice }: { isOpen: boolean; onClose: () => void; invoice: Invoice | null }) {
  if (!invoice) return null;

  const handleDownloadPDF = () => {
    // Create PDF content
    const pdfContent = `
GODIYA HOSPITAL
Birnin Kebbi, Kebbi State, Nigeria
-----------------------------------
OFFICIAL INVOICE

Invoice ID: ${invoice.id}
Receipt ID: ${invoice.receiptId}
Date: ${format(new Date(invoice.dateCreated), 'MMM dd, yyyy hh:mm a')}

-----------------------------------
PATIENT INFORMATION
-----------------------------------
Patient Name: ${invoice.patientName}
Patient ID: ${invoice.patientId}

-----------------------------------
INVOICE DETAILS
-----------------------------------
Invoice Type: ${invoice.invoiceType}
Amount: ₦${invoice.amount.toLocaleString()}
Payment Status: ${invoice.paymentStatus}
Amount Paid: ₦${invoice.amountPaid?.toLocaleString() || 0}
Balance: ₦${(invoice.amount - (invoice.amountPaid || 0)).toLocaleString()}

-----------------------------------
PAYMENT INFORMATION
-----------------------------------
Payment Method: ${invoice.paymentMethod || 'N/A'}
Payment Date: ${invoice.paymentDate ? format(new Date(invoice.paymentDate), 'MMM dd, yyyy') : 'N/A'}

-----------------------------------
Thank you for choosing Godiya Hospital
For inquiries, contact us at info@godiyahospital.ng
-----------------------------------
    `;

    // Create a Blob from the PDF content
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoice.receiptId}_${format(new Date(), 'yyyyMMdd')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Invoice Downloaded', {
      description: `Receipt ${invoice.receiptId} has been downloaded successfully.`,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Invoice Details</h2>
                    <p className="text-sm text-muted-foreground">Receipt: {invoice.receiptId}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
                    <p className="font-medium">{invoice.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Patient ID</p>
                    <p className="font-medium">{invoice.patientId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Invoice Type</p>
                    <Badge variant="outline">{invoice.invoiceType}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
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
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date Created</p>
                    <p className="font-medium">{format(new Date(invoice.dateCreated), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-lg font-bold text-green-600">₦{invoice.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                    <p className="font-medium">₦{(invoice.amountPaid || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Balance</p>
                    <p className="font-medium text-orange-600">₦{(invoice.amount - (invoice.amountPaid || 0)).toLocaleString()}</p>
                  </div>
                  {invoice.paymentMethod && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                      <p className="font-medium">{invoice.paymentMethod}</p>
                    </div>
                  )}
                  {invoice.paymentDate && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                      <p className="font-medium">{format(new Date(invoice.paymentDate), 'MMM dd, yyyy')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/30">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={handleDownloadPDF} className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Main Component
export function NursePatientFullFilePage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { patients, appointments, invoices, markPatientAsDeceased } = useEMRStore();
  
  // Determine the role from the current path to support both nurse and doctor dashboards
  const currentPath = window.location.pathname;
  const isDoctor = currentPath.includes('/doctor/');
  const roleBasePath = isDoctor ? '/emr/doctor' : '/emr/nurse';
  
  // Modal states
  const [isDeceasedModalOpen, setIsDeceasedModalOpen] = useState(false);
  const [dateOfDeath, setDateOfDeath] = useState('');
  const [causeOfDeath, setCauseOfDeath] = useState('');
  const [deathRemarks, setDeathRemarks] = useState('');

  // View modals
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedLabTest, setSelectedLabTest] = useState<any>(null);
  const [selectedFinding, setSelectedFinding] = useState<any>(null);

  // Find patient by ID
  const patient = patients.find(p => p.id === patientId);

  // Get family members
  const getFamilyMembers = () => {
    if (!patient) return null;
    
    // If this is a Family file, get all individual members
    if (patient.fileType === 'Family') {
      return patients.filter(p => p.parentFileId === patient.id);
    }
    
    // If this is an Individual with a parent file, get siblings and parent
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
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(`${roleBasePath}/patients`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Patients
          </Button>
        </div>
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
    );
  }

  // Calculate patient KPIs
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const patientInvoices = invoices.filter(i => i.patientId === patient.id);
  const paidInvoices = patientInvoices.filter(i => i.paymentStatus === 'Paid');
  const totalPayments = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  // Mock data - will be replaced with real data from modules
  const mockPrescriptions = patient.id === 'GH-PT-00001' ? 8 : patient.id === vipPatientId ? vipPatientKPIs.prescriptions : 0;
  const mockAdmissions = patient.id === 'GH-PT-00001' ? 2 : patient.id === vipPatientId ? vipPatientKPIs.admissions : 0;
  const mockLabTestsCount = patient.id === 'GH-PT-00001' ? 12 : patient.id === vipPatientId ? vipPatientKPIs.labTestsCount : 0;
  const mockFindingsCount = patient.id === 'GH-PT-00001' ? 5 : patient.id === vipPatientId ? vipPatientKPIs.findingsCount : 0;
  const mockMedications = patient.id === 'GH-PT-00001' ? 15 : patient.id === vipPatientId ? vipPatientKPIs.medications : 0;
  const mockOperations = patient.id === 'GH-PT-00001' ? 1 : patient.id === vipPatientId ? vipPatientKPIs.operations : 0;
  const mockReferrals = patient.id === 'GH-PT-00001' ? 0 : patient.id === vipPatientId ? vipPatientKPIs.referrals : 0;
  const mockSurgeryRequests = patient.id === 'GH-PT-00001' ? 1 : patient.id === vipPatientId ? vipPatientKPIs.surgeryRequests : 0;

  // Mock data for tabs
  const mockVitalsData = patient.id === 'GH-PT-00001' ? [
    { date: '2025-01-15', temperature: 36.8, bp: '120/80', pulse: 72, weight: 68, height: 172, rbs: 95 },
    { date: '2025-01-20', temperature: 37.0, bp: '118/78', pulse: 75, weight: 68, height: 172, rbs: 92 },
    { date: '2025-01-25', temperature: 36.9, bp: '122/82', pulse: 70, weight: 67, height: 172, rbs: 98 },
    { date: '2025-01-30', temperature: 36.7, bp: '119/79', pulse: 73, weight: 67, height: 172, rbs: 94 },
  ] : patient.id === vipPatientId ? vipVitalsData : [];

  const mockConsultations = patient.id === 'GH-PT-00001' ? [
    {
      id: 1,
      date: '2025-01-30',
      doctor: 'Dr. Ibrahim Aliyu',
      department: 'General Medicine',
      diagnosis: 'Hypertension, Type 2 Diabetes',
      complaints: 'Persistent headaches, fatigue',
      observations: 'BP elevated, blood sugar within control',
    },
    {
      id: 2,
      date: '2025-01-20',
      doctor: 'Dr. Fatima Musa',
      department: 'Internal Medicine',
      diagnosis: 'Common Cold',
      complaints: 'Cough, sore throat',
      observations: 'Mild fever, no complications',
    },
  ] : patient.id === vipPatientId ? vipConsultations : [];

  const mockMedicalHistory = patient.id === 'GH-PT-00001' ? [
    { type: 'Chronic Disease', condition: 'Hypertension', diagnosedDate: '2020-05-12', status: 'Active' },
    { type: 'Chronic Disease', condition: 'Type 2 Diabetes', diagnosedDate: '2021-08-20', status: 'Active' },
    { type: 'Allergy', condition: 'Penicillin', severity: 'Severe', notes: 'Avoid all penicillin-based antibiotics' },
    { type: 'Surgery', condition: 'Appendectomy', date: '2015-03-10', hospital: 'Godiya Hospital' },
  ] : patient.id === vipPatientId ? vipMedicalHistory : [];

  const mockAdmissionsData = patient.id === 'GH-PT-00001' ? [
    {
      id: 1,
      ward: 'General Ward A',
      bed: 'A-12',
      dateAdmitted: '2024-12-15',
      dateDischarged: '2024-12-22',
      reason: 'Diabetic Ketoacidosis',
      status: 'Discharged',
    },
    {
      id: 2,
      ward: 'General Ward B',
      bed: 'B-08',
      dateAdmitted: '2023-06-10',
      dateDischarged: '2023-06-15',
      reason: 'Severe Hypertensive Crisis',
      status: 'Discharged',
    },
  ] : patient.id === vipPatientId ? vipAdmissionsData : [];

  const mockPrescriptionsData = patient.id === 'GH-PT-00001' ? [
    {
      id: 1,
      drug: 'Lisinopril 10mg',
      dosage: '1 tablet daily',
      duration: '30 days',
      doctor: 'Dr. Ibrahim Aliyu',
      date: '2025-01-30',
      status: 'Fulfilled',
    },
    {
      id: 2,
      drug: 'Metformin 500mg',
      dosage: '1 tablet twice daily',
      duration: '30 days',
      doctor: 'Dr. Ibrahim Aliyu',
      date: '2025-01-30',
      status: 'Fulfilled',
    },
  ] : patient.id === vipPatientId ? vipPrescriptionsData : [];

  const mockNurseNotesData = patient.id === 'GH-PT-00001' ? [
    {
      id: 1,
      date: '2025-01-30',
      time: '08:00 AM',
      nurse: 'Nurse Aisha Mohammed',
      notes: 'Patient is stable and comfortable. Vitals checked and recorded. No complaints.',
    },
    {
      id: 2,
      date: '2025-01-29',
      time: '08:00 AM',
      nurse: 'Nurse Fatima Bello',
      notes: 'Administered morning medications. Patient reports feeling better.',
    },
  ] : patient.id === vipPatientId ? vipNurseNotes : [];

  const mockLabTestsData = patient.id === 'GH-PT-00001' ? [
    {
      id: 1,
      test: 'Fasting Blood Sugar',
      date: '2025-01-28',
      result: '95 mg/dL',
      status: 'Normal',
      range: '70-100 mg/dL',
      lab: 'Godiya Lab',
    },
    {
      id: 2,
      test: 'Complete Blood Count',
      date: '2025-01-20',
      result: 'All parameters normal',
      status: 'Normal',
      range: 'Within normal limits',
      lab: 'Godiya Lab',
    },
  ] : patient.id === vipPatientId ? vipLabTests : [];

  const mockFindingsData = patient.id === 'GH-PT-00001' ? [
    {
      id: 1,
      date: '2025-01-25',
      finding: 'Blood Pressure Monitoring',
      description: 'Elevated blood pressure readings over the past week. Recommend medication adjustment.',
      doctor: 'Dr. Ibrahim Aliyu',
      severity: 'Moderate',
    },
  ] : patient.id === vipPatientId ? vipFindings : [];

  // Handle mark as deceased
  const handleMarkAsDeceased = () => {
    if (!dateOfDeath || !causeOfDeath) {
      toast.error('Missing Information', {
        description: 'Please provide date of death and cause of death.',
      });
      return;
    }

    markPatientAsDeceased(patient.id, dateOfDeath, causeOfDeath, deathRemarks);
    setIsDeceasedModalOpen(false);
    setDateOfDeath('');
    setCauseOfDeath('');
    setDeathRemarks('');
    
    toast.success('Patient Marked as Deceased', {
      description: `${patient.fullName}'s status has been updated.`,
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(`${roleBasePath}/patients/${patientId}/file`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to File
        </Button>
      </div>

      {/* Patient Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              {/* Left Section - Patient Info */}
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24 border-4 border-primary/10">
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {patient.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{patient.fullName}</h1>
                  <p className="text-muted-foreground text-sm mb-3">
                    File Number: <span className="font-mono font-semibold text-foreground">{patient.id}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {patient.age} years
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {patient.phoneNumber}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge className={patient.patientType === 'Inpatient' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'bg-green-100 text-green-700 hover:bg-green-100'}>
                      {patient.patientType === 'Inpatient' ? 'IPD' : 'OPD'}
                    </Badge>
                    <Badge className={patient.fileType === 'Family' ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1' : 'bg-slate-100 text-slate-700 hover:bg-slate-100 flex items-center gap-1'}>
                      {patient.fileType === 'Family' ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {patient.fileType} File
                    </Badge>
                    {patient.status === 'Admitted' && (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Admitted</Badge>
                    )}
                    {patient.status === 'Discharged' && (
                      <Badge variant="secondary">Discharged</Badge>
                    )}
                    {patient.isNHIS && (
                      <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        NHIS
                      </Badge>
                    )}
                    {patient.isDead ? (
                      <Badge variant="destructive" className="bg-black text-white hover:bg-black cursor-pointer" onClick={() => toast.info('Patient is deceased')}>
                        Deceased ✗
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 cursor-pointer" onClick={() => toast.info('Patient is alive')}>
                        Alive ✓
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section - Registration & Actions */}
              <div className="flex flex-col items-start lg:items-end gap-3">
                <div className="text-left lg:text-right text-sm">
                  <p className="text-muted-foreground">Registration Date</p>
                  <p className="font-medium">{format(new Date(patient.dateRegistered), 'MMM dd, yyyy')}</p>
                  <p className="font-medium">{format(new Date(patient.dateRegistered), 'hh:mm a')}</p>
                </div>
                {!patient.isDead && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDeceasedModalOpen(true)}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Mark as Deceased
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* KPI Mini Cards - Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPIMiniCard
          title="Appointments"
          value={patientAppointments.length}
          icon={Calendar}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <KPIMiniCard
          title="Prescriptions"
          value={mockPrescriptions}
          icon={Pill}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <KPIMiniCard
          title="Payments"
          value={`₦${totalPayments.toLocaleString()}`}
          icon={DollarSign}
          color="text-emerald-600"
          bgColor="bg-emerald-100"
        />
        <KPIMiniCard
          title="Admissions"
          value={mockAdmissions}
          icon={Bed}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <KPIMiniCard
          title="Lab Tests"
          value={mockLabTestsCount}
          icon={FlaskConical}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
      </div>

      {/* KPI Mini Cards - Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPIMiniCard
          title="Findings"
          value={mockFindingsCount}
          icon={FileText}
          color="text-indigo-600"
          bgColor="bg-indigo-100"
        />
        <KPIMiniCard
          title="Medications"
          value={mockMedications}
          icon={Syringe}
          color="text-pink-600"
          bgColor="bg-pink-100"
        />
        <KPIMiniCard
          title="Operations"
          value={mockOperations}
          icon={Scissors}
          color="text-red-600"
          bgColor="bg-red-100"
        />
        <KPIMiniCard
          title="Refer Requests"
          value={mockReferrals}
          icon={UserPlus}
          color="text-teal-600"
          bgColor="bg-teal-100"
        />
        <KPIMiniCard
          title="Surgery Requests"
          value={mockSurgeryRequests}
          icon={Activity}
          color="text-cyan-600"
          bgColor="bg-cyan-100"
        />
      </div>

      {/* Tabs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex flex-nowrap w-full md:w-auto h-auto p-1 gap-1">
              <TabsTrigger value="overview" className="whitespace-nowrap px-4 py-2">Overview</TabsTrigger>
              <TabsTrigger value="appointments" className="whitespace-nowrap px-4 py-2">Appointments</TabsTrigger>
              <TabsTrigger value="consultations" className="whitespace-nowrap px-4 py-2">Consultations</TabsTrigger>
              <TabsTrigger value="history" className="whitespace-nowrap px-4 py-2">Medical History</TabsTrigger>
              <TabsTrigger value="admissions" className="whitespace-nowrap px-4 py-2">Admissions</TabsTrigger>
              <TabsTrigger value="vitals" className="whitespace-nowrap px-4 py-2">Vitals</TabsTrigger>
              <TabsTrigger value="prescriptions" className="whitespace-nowrap px-4 py-2">Prescriptions</TabsTrigger>
              <TabsTrigger value="invoices" className="whitespace-nowrap px-4 py-2">Invoices</TabsTrigger>
              <TabsTrigger value="nurse-notes" className="whitespace-nowrap px-4 py-2">Nurse Notes</TabsTrigger>
              <TabsTrigger value="lab-tests" className="whitespace-nowrap px-4 py-2">Lab Tests</TabsTrigger>
              <TabsTrigger value="findings" className="whitespace-nowrap px-4 py-2">Findings</TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Full Name</p>
                      <p className="font-medium">{patient.fullName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p className="font-medium">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Age</p>
                      <p className="font-medium">{patient.age} years</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium">{patient.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{patient.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Emergency Contact</p>
                      <p className="font-medium">{patient.emergencyContactName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Emergency Phone</p>
                      <p className="font-medium">{patient.emergencyContactPhone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Next of Kin</p>
                      <p className="font-medium">{patient.nextOfKin}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* File Information */}
              <Card>
                <CardHeader>
                  <CardTitle>File Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">File Type</p>
                      <p className="font-medium">{patient.fileType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Patient Type</p>
                      <p className="font-medium">{patient.patientType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium">{patient.status}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date Registered</p>
                      <p className="font-medium">{format(new Date(patient.dateRegistered), 'MMM dd, yyyy')}</p>
                    </div>
                    {patient.isNHIS && (
                      <>
                        <div>
                          <p className="text-muted-foreground">NHIS Provider</p>
                          <p className="font-medium">{patient.nhisProvider}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">NHIS Number</p>
                          <p className="font-medium">{patient.nhisNumber}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Family Members */}
              {familyData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Family Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.fileType === 'Family' && Array.isArray(familyData) && (
                      <div className="space-y-2">
                        {familyData.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No family members added yet
                          </p>
                        ) : (
                          familyData.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                <div>
                                  <p className="text-sm font-medium">{member.fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {member.age} years, {member.gender} • {member.id}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigate(`${roleBasePath}/patients/${member.id}/full-file`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {patient.parentFileId && typeof familyData === 'object' && !Array.isArray(familyData) && (
                      <div className="space-y-3">
                        {familyData.familyFile && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Parent Family File</p>
                            <div className="flex items-center justify-between p-2 border rounded-lg bg-purple-50/50">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-purple-600" />
                                <div>
                                  <p className="text-sm font-medium">{familyData.familyFile.fullName}</p>
                                  <p className="text-xs text-muted-foreground">Family File • {familyData.familyFile.id}</p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigate(`${roleBasePath}/patients/${familyData.familyFile!.id}/full-file`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {familyData.siblings && familyData.siblings.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Siblings</p>
                            <div className="space-y-1">
                              {familyData.siblings.map((sibling) => (
                                <div key={sibling.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    <div>
                                      <p className="text-sm font-medium">{sibling.fullName}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {sibling.age} years, {sibling.gender} • {sibling.id}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => navigate(`${roleBasePath}/patients/${sibling.id}/full-file`)}
                                  >
                                    <Eye className="w-4 h-4" />
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
              )}
            </div>
          </TabsContent>

          {/* Tab 2: Appointments */}
          <TabsContent value="appointments">
            <div className="space-y-3">
              {patientAppointments.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Appointments</h3>
                    <p className="text-muted-foreground">This patient has no scheduled appointments.</p>
                  </CardContent>
                </Card>
              ) : (
                patientAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedAppointment(appointment)}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{appointment.appointmentType}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(appointment.date), 'EEEE, MMM dd, yyyy')} at {appointment.time}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Dr. {appointment.doctorName} • {appointment.department}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant={
                              appointment.status === 'Completed' ? 'default' :
                              appointment.status === 'In Progress' ? 'secondary' :
                              'outline'
                            }
                          >
                            {appointment.status}
                          </Badge>
                          <Badge
                            variant={
                              appointment.priority === 'Critical' ? 'destructive' :
                              appointment.priority === 'High' ? 'secondary' :
                              'outline'
                            }
                          >
                            {appointment.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Tab 3: Consultations */}
          <TabsContent value="consultations">
            <div className="space-y-4">
              {mockConsultations.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Stethoscope className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Consultations</h3>
                    <p className="text-muted-foreground">No consultation records found for this patient.</p>
                  </CardContent>
                </Card>
              ) : (
                mockConsultations.map((consultation: any) => (
                  <Card key={consultation.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{consultation.doctor}</CardTitle>
                          <CardDescription>{consultation.department}</CardDescription>
                        </div>
                        <Badge variant="outline">{format(new Date(consultation.date), 'MMM dd, yyyy')}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Chief Complaints</p>
                        <p className="text-sm">{consultation.complaints}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Diagnosis</p>
                        <p className="text-sm font-semibold">{consultation.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Observations</p>
                        <p className="text-sm">{consultation.observations}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Tab 4: Medical History */}
          <TabsContent value="history">
            <div className="space-y-4">
              {mockMedicalHistory.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ClipboardList className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Medical History</h3>
                    <p className="text-muted-foreground">No medical history records available.</p>
                  </CardContent>
                </Card>
              ) : (
                mockMedicalHistory.map((item: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{item.type}</Badge>
                            {item.status && (
                              <Badge variant={item.status === 'Active' ? 'destructive' : 'secondary'}>
                                {item.status}
                              </Badge>
                            )}
                            {item.severity && (
                              <Badge variant={item.severity === 'Severe' ? 'destructive' : 'secondary'}>
                                {item.severity}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg">{item.condition}</h3>
                          {item.diagnosedDate && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Diagnosed: {format(new Date(item.diagnosedDate), 'MMM dd, yyyy')}
                            </p>
                          )}
                          {item.date && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Date: {format(new Date(item.date), 'MMM dd, yyyy')}
                            </p>
                          )}
                          {item.hospital && (
                            <p className="text-sm text-muted-foreground">Hospital: {item.hospital}</p>
                          )}
                          {item.notes && (
                            <p className="text-sm mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                              <strong>Note:</strong> {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Tab 5: Admissions */}
          <TabsContent value="admissions">
            <div className="space-y-3">
              {mockAdmissionsData.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bed className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Admissions</h3>
                    <p className="text-muted-foreground">This patient has no admission history.</p>
                  </CardContent>
                </Card>
              ) : (
                mockAdmissionsData.map((admission: any) => (
                  <Card key={admission.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Bed className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{admission.ward} - Bed {admission.bed}</h3>
                            <p className="text-sm text-muted-foreground">{admission.reason}</p>
                          </div>
                        </div>
                        <Badge variant={admission.status === 'Discharged' ? 'secondary' : 'default'}>
                          {admission.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Date Admitted</p>
                          <p className="font-medium">{format(new Date(admission.dateAdmitted), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date Discharged</p>
                          <p className="font-medium">{format(new Date(admission.dateDischarged), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Tab 6: Vitals */}
          <TabsContent value="vitals">
            <div className="space-y-6">
              {mockVitalsData.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Vitals Data</h3>
                    <p className="text-muted-foreground">No vital signs recorded for this patient.</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Vitals Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Vitals Trend</CardTitle>
                      <CardDescription>Blood Pressure & Blood Sugar Monitoring</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockVitalsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="rbs" stroke="#059669" name="Blood Sugar (mg/dL)" />
                          <Line type="monotone" dataKey="temperature" stroke="#dc2626" name="Temperature (°C)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Vitals Records */}
                  <div className="space-y-3">
                    {mockVitalsData.map((vital: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{format(new Date(vital.date), 'EEEE, MMM dd, yyyy')}</h3>
                            <Badge variant="outline">Recorded</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Blood Pressure</p>
                              <p className="font-semibold">{vital.bp}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Temperature</p>
                              <p className="font-semibold">{vital.temperature}°C</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Pulse</p>
                              <p className="font-semibold">{vital.pulse} bpm</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Weight</p>
                              <p className="font-semibold">{vital.weight} kg</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Height</p>
                              <p className="font-semibold">{vital.height} cm</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Blood Sugar</p>
                              <p className="font-semibold">{vital.rbs} mg/dL</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* Tab 7: Prescriptions */}
          <TabsContent value="prescriptions">
            <div className="space-y-3">
              {mockPrescriptionsData.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Pill className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Prescriptions</h3>
                    <p className="text-muted-foreground">No prescriptions found for this patient.</p>
                  </CardContent>
                </Card>
              ) : (
                mockPrescriptionsData.map((prescription: any) => (
                  <Card key={prescription.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <Pill className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{prescription.drug}</h3>
                            <p className="text-sm text-muted-foreground">{prescription.dosage} for {prescription.duration}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Prescribed by {prescription.doctor} • {format(new Date(prescription.date), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Badge variant={prescription.status === 'Fulfilled' ? 'default' : 'secondary'}>
                          {prescription.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Tab 8: Invoices */}
          <TabsContent value="invoices">
            <div className="space-y-3">
              {patientInvoices.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Invoices</h3>
                    <p className="text-muted-foreground">No billing records found for this patient.</p>
                  </CardContent>
                </Card>
              ) : (
                patientInvoices.map((invoice) => (
                  <Card key={invoice.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedInvoice(invoice)}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{invoice.invoiceType}</h3>
                            <p className="text-sm text-muted-foreground">
                              Receipt: {invoice.receiptId}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(invoice.dateCreated), 'MMM dd, yyyy • hh:mm a')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600">₦{invoice.amount.toLocaleString()}</p>
                          <Badge
                            className="mt-2"
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
                ))
              )}
            </div>
          </TabsContent>

          {/* Tab 9: Nurse Notes */}
          <TabsContent value="nurse-notes">
            <div className="space-y-3">
              {mockNurseNotesData.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Stethoscope className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Nurse Notes</h3>
                    <p className="text-muted-foreground">No nursing notes recorded for this patient.</p>
                  </CardContent>
                </Card>
              ) : (
                mockNurseNotesData.map((note: any) => (
                  <Card key={note.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{note.nurse}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(note.date), 'MMM dd, yyyy')} at {note.time}
                          </p>
                        </div>
                        <Badge variant="outline">Nurse Note</Badge>
                      </div>
                      <p className="text-sm">{note.notes}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Tab 10: Lab Tests */}
          <TabsContent value="lab-tests">
            <div className="space-y-3">
              {mockLabTestsData.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FlaskConical className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Lab Tests</h3>
                    <p className="text-muted-foreground">No laboratory tests found for this patient.</p>
                  </CardContent>
                </Card>
              ) : (
                mockLabTestsData.map((test: any) => (
                  <Card key={test.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedLabTest(test)}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-orange-100 rounded-lg">
                            <FlaskConical className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{test.test}</h3>
                            <p className="text-sm text-muted-foreground">
                              {test.lab} • {format(new Date(test.date), 'MMM dd, yyyy')}
                            </p>
                            <p className="text-sm font-medium mt-1">Result: {test.result}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={test.status === 'Normal' ? 'default' : 'destructive'}>
                            {test.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-2">Range: {test.range}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Tab 11: Findings */}
          <TabsContent value="findings">
            <div className="space-y-3">
              {mockFindingsData.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Findings</h3>
                    <p className="text-muted-foreground">No clinical findings recorded for this patient.</p>
                  </CardContent>
                </Card>
              ) : (
                mockFindingsData.map((finding: any) => (
                  <Card key={finding.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedFinding(finding)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{finding.finding}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {finding.doctor} • {format(new Date(finding.date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <Badge
                          variant={
                            finding.severity === 'Critical' ? 'destructive' :
                            finding.severity === 'Moderate' ? 'secondary' :
                            'default'
                          }
                        >
                          {finding.severity}
                        </Badge>
                      </div>
                      <p className="text-sm">{finding.description}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Mark as Deceased Modal */}
      <Dialog open={isDeceasedModalOpen} onOpenChange={setIsDeceasedModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Mark Patient as Deceased
            </DialogTitle>
            <DialogDescription>
              Please provide the following information to mark {patient?.fullName} as deceased.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfDeath">Date of Death *</Label>
              <Input
                id="dateOfDeath"
                type="date"
                value={dateOfDeath}
                onChange={(e) => setDateOfDeath(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="causeOfDeath">Cause of Death *</Label>
              <Input
                id="causeOfDeath"
                value={causeOfDeath}
                onChange={(e) => setCauseOfDeath(e.target.value)}
                placeholder="e.g., Cardiac Arrest"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deathRemarks">Additional Remarks (Optional)</Label>
              <Textarea
                id="deathRemarks"
                value={deathRemarks}
                onChange={(e) => setDeathRemarks(e.target.value)}
                placeholder="Any additional notes or remarks..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeceasedModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleMarkAsDeceased}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modals */}
      <ViewAppointmentModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
      <ViewInvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
