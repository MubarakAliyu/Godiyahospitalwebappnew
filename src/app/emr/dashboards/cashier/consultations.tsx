import { toast } from 'sonner';
import { generateConsultationReceiptPDF, type ConsultationReceiptData } from '@/app/emr/utils/consultation-receipt-pdf';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Eye,
  FileText,
  Calendar,
  User,
  Building2,
  Stethoscope,
  Download,
  Filter,
  Banknote,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/app/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { useEMRStore } from '@/app/emr/store/emr-store';
import { Appointment } from '@/app/emr/store/types';

// View Appointment Details Modal
function ViewAppointmentModal({
  isOpen,
  onClose,
  appointment
}: {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}) {
  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-primary" />
            Appointment Details
          </DialogTitle>
          <DialogDescription>
            Complete information for appointment {appointment.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Appointment Info Card */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4 border border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Appointment ID</p>
                <p className="font-mono font-semibold">{appointment.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge 
                  variant={
                    appointment.status === 'Completed' ? 'default' :
                    appointment.status === 'In Progress' ? 'secondary' :
                    appointment.status === 'Cancelled' ? 'destructive' :
                    'outline'
                  }
                >
                  {appointment.status}
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
                  <p className="font-semibold">{appointment.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient ID</p>
                  <p className="font-mono text-sm">{appointment.patientId}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Doctor</p>
                  <p className="font-semibold">{appointment.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Department</p>
                  <p className="font-medium">{appointment.department}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time</p>
                  <p className="font-medium">{appointment.time}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Appointment Type</p>
                <Badge variant="outline">{appointment.appointmentType}</Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Priority</p>
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

            {appointment.notes && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Confirm Consultation Payment Modal
function ConfirmConsultationPaymentModal({
  isOpen,
  onClose,
  appointment,
  consultationFee,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  consultationFee: number;
  onConfirm: (pin: string, paymentMethod: string) => void;
}) {
  const [pin, setPin] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [pinError, setPinError] = useState('');

  const handleConfirm = (printReceipt: boolean = false) => {
    // Validate PIN
    if (!pin) {
      setPinError('PIN is required');
      toast.error('PIN Required', {
        description: 'Please enter your 4-digit PIN to confirm payment',
      });
      return;
    }
    if (pin.length !== 4) {
      setPinError('PIN must be 4 digits');
      toast.error('Invalid PIN Length', {
        description: 'PIN must be exactly 4 digits',
      });
      return;
    }
    if (!paymentMethod) {
      toast.error('Payment Method Required', {
        description: 'Please select a payment method',
      });
      return;
    }

    // Simulate PIN verification
    if (pin !== '1234') {
      setPinError('Incorrect PIN');
      toast.error('Invalid PIN', {
        description: 'The PIN you entered is incorrect. Please try again.',
      });
      return;
    }

    // Clear errors
    setPinError('');

    // Confirm payment
    onConfirm(pin, paymentMethod);

    // Show success message
    toast.success('Consultation Paid', {
      description: `Payment of ₦${consultationFee.toLocaleString()} confirmed for ${appointment?.patientName}`,
    });

    // Print receipt if requested
    if (printReceipt) {
      const receiptData: ConsultationReceiptData = {
        receiptId: `GH-CONSULT-${Date.now()}`,
        appointmentId: appointment?.id || '',
        patientName: appointment?.patientName || '',
        patientId: appointment?.patientId || '',
        fileNo: appointment?.patientId || '',
        doctorName: appointment?.doctorName || '',
        department: appointment?.department || '',
        consultationFee: consultationFee,
        paymentMethod: paymentMethod,
        paymentDate: new Date().toLocaleDateString(),
        paymentTime: new Date().toLocaleTimeString(),
        appointmentDate: new Date(appointment?.date || '').toLocaleDateString(),
        appointmentTime: appointment?.time || '',
        cashierName: 'Cashier',
        cashierId: 'GH-STF-001'
      };
      generateConsultationReceiptPDF(receiptData);
      setTimeout(() => {
        toast.success('Receipt Printed', {
          description: `Receipt for ${appointment?.patientName} has been sent to the printer`,
        });
      }, 500);
    }

    // Reset form
    setPin('');
    setPaymentMethod('');
    onClose();
  };

  const handleCancel = () => {
    setPin('');
    setPaymentMethod('');
    setPinError('');
    onClose();
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm Consultation Payment</DialogTitle>
          <DialogDescription>
            Review appointment details and enter your PIN to confirm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Appointment Summary Card */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Appointment ID</span>
              <span className="font-mono font-semibold">{appointment.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Patient Name</span>
              <span className="font-semibold">{appointment.patientName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">File Number</span>
              <span className="font-medium font-mono">{appointment.patientId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Doctor</span>
              <span className="font-medium">{appointment.doctorName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Department</span>
              <Badge variant="outline">{appointment.department}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date & Time</span>
              <span className="font-medium">
                {new Date(appointment.date).toLocaleDateString()} {appointment.time}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Appointment Type</span>
              <Badge variant="secondary">{appointment.appointmentType}</Badge>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Consultation Fee</span>
                <span className="text-3xl font-bold text-primary">
                  ₦{consultationFee.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Select */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    <span>Cash</span>
                  </div>
                </SelectItem>
                <SelectItem value="card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Card Payment</span>
                  </div>
                </SelectItem>
                <SelectItem value="transfer">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Bank Transfer</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4 Digit PIN Input */}
          <div className="space-y-2">
            <Label htmlFor="pin">Enter 4-Digit PIN *</Label>
            <Input
              id="pin"
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setPin(value);
                setPinError('');
              }}
              placeholder="••••"
              className={`text-center text-2xl tracking-[1em] font-bold ${pinError ? 'border-destructive' : ''}`}
            />
            {pinError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {pinError}
              </p>
            )}
            <p className="text-xs text-muted-foreground">Default PIN: 1234</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirm(false)}
              className="flex-1"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm
            </Button>
            <Button
              onClick={() => handleConfirm(true)}
              className="flex-1"
            >
              <Printer className="w-4 h-4 mr-2" />
              Confirm & Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CashierConsultationsPage() {
  const { appointments, patients, updateAppointment, addInvoice, settings } = useEMRStore();

  // Get consultation fee from settings
  const consultationFee = settings?.billing?.consultationFee || 5000;

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Get unique doctors and departments for filters
  const uniqueDoctors = useMemo(() => {
    return Array.from(new Set(appointments.map(a => a.doctorName))).sort();
  }, [appointments]);

  const uniqueDepartments = useMemo(() => {
    return Array.from(new Set(appointments.map(a => a.department))).sort();
  }, [appointments]);

  // Check if appointment has been paid (has a paid consultation invoice)
  const isAppointmentPaid = (appointmentId: string) => {
    // You could check invoices here if you track consultation payments separately
    // For now, we'll use appointment status
    const apt = appointments.find(a => a.id === appointmentId);
    return apt?.status === 'Completed';
  };

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const patient = patients.find(p => p.id === apt.patientId);
      
      const matchesSearch = 
        apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDoctor = doctorFilter === 'all' || apt.doctorName === doctorFilter;
      const matchesDepartment = departmentFilter === 'all' || apt.department === departmentFilter;
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'paid' && apt.status === 'Completed') ||
        (statusFilter === 'pending' && apt.status !== 'Completed');

      let matchesDate = true;
      if (dateFrom && dateTo) {
        const aptDate = new Date(apt.date);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        matchesDate = aptDate >= fromDate && aptDate <= toDate;
      } else if (dateFrom) {
        const aptDate = new Date(apt.date);
        const fromDate = new Date(dateFrom);
        matchesDate = aptDate >= fromDate;
      } else if (dateTo) {
        const aptDate = new Date(apt.date);
        const toDate = new Date(dateTo);
        matchesDate = aptDate <= toDate;
      }

      return matchesSearch && matchesDoctor && matchesDepartment && matchesStatus && matchesDate;
    });
  }, [appointments, patients, searchQuery, doctorFilter, departmentFilter, statusFilter, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status !== 'Completed').length,
    paid: appointments.filter(a => a.status === 'Completed').length,
    today: appointments.filter(a => a.date.startsWith(new Date().toISOString().split('T')[0])).length,
    revenue: appointments.filter(a => a.status === 'Completed').length * consultationFee,
  };

  // Handlers
  const handleConfirmPayment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsPaymentModalOpen(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handlePrintReceipt = (appointment: Appointment) => {
    const receiptData: ConsultationReceiptData = {
      receiptId: `GH-CONSULT-${Date.now()}`,
      appointmentId: appointment.id,
      patientName: appointment.patientName,
      patientId: appointment.patientId,
      fileNo: appointment.patientId,
      doctorName: appointment.doctorName,
      department: appointment.department,
      consultationFee: consultationFee,
      paymentMethod: 'Cash',
      paymentDate: new Date().toLocaleDateString(),
      paymentTime: new Date().toLocaleTimeString(),
      appointmentDate: new Date(appointment.date).toLocaleDateString(),
      appointmentTime: appointment.time,
      cashierName: 'Cashier',
      cashierId: 'GH-STF-001'
    };
    generateConsultationReceiptPDF(receiptData);
    toast.success('Receipt Printed', {
      description: `Receipt for ${appointment.patientName} (${appointment.id}) has been sent to the printer`,
    });
  };

  const handlePaymentConfirm = (pin: string, paymentMethod: string) => {
    if (selectedAppointment) {
      // Update appointment status to Completed
      updateAppointment(selectedAppointment.id, { 
        status: 'Completed'
      });

      // Create invoice for consultation payment
      addInvoice({
        patientId: selectedAppointment.patientId,
        patientName: selectedAppointment.patientName,
        invoiceType: 'Consultation',
        amount: consultationFee,
        paymentStatus: 'Paid'
      });
    }
  };

  const handleExport = () => {
    toast.success('Export Success', {
      description: `Exporting ${filteredAppointments.length} consultation records to CSV`,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDoctorFilter('all');
    setDepartmentFilter('all');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Consultation Payments</h1>
          <p className="text-muted-foreground">
            Manage and confirm consultation fee payments
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payment</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold">{stats.paid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">₦{stats.revenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search by Appointment ID, File No, or Patient Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {uniqueDoctors.map(doctor => (
                    <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="date-from" className="text-sm mb-2 block">From Date</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="date-to" className="text-sm mb-2 block">To Date</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={handleClearFilters}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            Consultation Payments
            <Badge variant="secondary" className="ml-2">
              {filteredAppointments.length} appointments
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedAppointments.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">S/N</TableHead>
                    <TableHead>Appointment ID</TableHead>
                    <TableHead>File No</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAppointments.map((appointment, index) => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    const isPaid = appointment.status === 'Completed';

                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">{appointment.id}</TableCell>
                        <TableCell className="font-mono text-sm">{appointment.patientId}</TableCell>
                        <TableCell className="font-medium">{appointment.patientName}</TableCell>
                        <TableCell>{patient?.gender || 'N/A'}</TableCell>
                        <TableCell>{appointment.doctorName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{appointment.department}</Badge>
                        </TableCell>
                        <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-semibold">₦{consultationFee.toLocaleString()}</TableCell>
                        <TableCell>
                          {isPaid ? (
                            <Badge variant="default" className="bg-secondary">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewAppointment(appointment)}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {!isPaid ? (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleConfirmPayment(appointment)}
                              >
                                <DollarSign className="w-4 h-4 mr-1" />
                                Confirm
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePrintReceipt(appointment)}
                              >
                                <Printer className="w-4 h-4 mr-1" />
                                Print
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Stethoscope className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium text-muted-foreground mb-2">No appointments found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || doctorFilter !== 'all' || departmentFilter !== 'all' || statusFilter !== 'all' || dateFrom || dateTo
                  ? 'Try adjusting your search or filters'
                  : 'Consultation appointments will appear here'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of{' '}
                {filteredAppointments.length} appointments
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => {
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <div key={`ellipsis-${page}`} className="flex items-center">
                            <span className="px-2 text-muted-foreground">...</span>
                            <Button
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-10"
                            >
                              {page}
                            </Button>
                          </div>
                        );
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      );
                    })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ConfirmConsultationPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        consultationFee={consultationFee}
        onConfirm={handlePaymentConfirm}
      />

      <ViewAppointmentModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
      />
    </div>
  );
}