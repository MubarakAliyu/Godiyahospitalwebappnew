import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Eye, 
  Activity,
  CheckCircle, 
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Stethoscope,
  Clock,
  MapPin,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Label } from '@/app/components/ui/label';
import { useEMRStore } from '@/app/emr/store/emr-store';
import { toast } from 'sonner';
import { Appointment, AppointmentStatus, AppointmentPriority } from '@/app/emr/store/types';

// Vitals interface with all required fields
interface VitalsForm {
  temperature: string;
  bloodPressure: string;
  heartRate: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  weight: string;
  height: string;
  rbs: string;
  bmi: string;
  notes: string;
}

export function NurseAppointmentsPage() {
  const { appointments, patients, updateAppointment, addNotification, addActivityLog } = useEMRStore();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Vitals form state with all fields
  const [vitals, setVitals] = useState<VitalsForm>({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    rbs: '',
    bmi: '',
    notes: ''
  });

  // Auto-calculate BMI when weight or height changes
  useEffect(() => {
    const weight = parseFloat(vitals.weight);
    const height = parseFloat(vitals.height) / 100; // Convert cm to m
    
    if (weight > 0 && height > 0) {
      const calculatedBMI = (weight / (height * height)).toFixed(1);
      if (calculatedBMI !== vitals.bmi) {
        setVitals(prev => ({ ...prev, bmi: calculatedBMI }));
      }
    } else if (vitals.bmi !== '') {
      setVitals(prev => ({ ...prev, bmi: '' }));
    }
  }, [vitals.weight, vitals.height]);

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = 
        searchQuery === '' ||
        appointment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriority = priorityFilter === 'all' || appointment.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [appointments, searchQuery, priorityFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / pageSize);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handleClearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
    toast.success('Filters cleared');
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
  };

  // Open vitals modal directly
  const handleRecordVitals = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setVitalsModalOpen(true);
  };

  // Check-in flow
  const handleCheckIn = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCheckInModalOpen(true);
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    updateAppointment(appointment.id, { status: 'Cancelled' as AppointmentStatus });
    
    // Add notification
    addNotification({
      id: `notif-cancel-${Date.now()}`,
      type: 'info',
      category: 'appointment',
      icon: 'XCircle',
      title: 'Appointment Cancelled',
      description: `${appointment.patientName}'s appointment has been cancelled`,
      message: `Appointment ${appointment.id} for ${appointment.date} at ${appointment.time}`,
      module: 'Appointments',
      timestamp: new Date().toISOString(),
      unread: true,
    });

    // Add activity log
    addActivityLog({
      id: `log-cancel-${Date.now()}`,
      action: `Cancelled appointment ${appointment.id} for ${appointment.patientName}`,
      module: 'Appointments',
      user: 'Nurse Hauwa Bello',
      timestamp: new Date().toISOString(),
      icon: 'XCircle',
    });
    
    toast.info('Appointment Cancelled', {
      description: `${appointment.patientName}'s appointment has been cancelled`,
    });
  };

  // Confirm check-in and auto-open vitals modal
  const handleConfirmCheckIn = () => {
    if (!selectedAppointment) return;
    
    // Update appointment status
    updateAppointment(selectedAppointment.id, { status: 'In Progress' as AppointmentStatus });
    
    // Add notification
    addNotification({
      id: `notif-checkin-${Date.now()}`,
      type: 'success',
      category: 'appointment',
      icon: 'CheckCircle',
      title: 'Patient Checked In',
      description: `${selectedAppointment.patientName} has been checked in`,
      message: `Appointment ${selectedAppointment.id} - ${selectedAppointment.date} at ${selectedAppointment.time}`,
      module: 'Appointments',
      timestamp: new Date().toISOString(),
      unread: true,
    });

    // Add activity log
    addActivityLog({
      id: `log-checkin-${Date.now()}`,
      action: `Checked in ${selectedAppointment.patientName} for appointment ${selectedAppointment.id}`,
      module: 'Appointments',
      user: 'Nurse Hauwa Bello',
      timestamp: new Date().toISOString(),
      icon: 'CheckCircle',
    });
    
    toast.success('Patient checked in', {
      description: `${selectedAppointment.patientName} has been marked as checked in`,
    });
    
    // Close check-in modal
    setCheckInModalOpen(false);
    
    // Auto-open vitals modal after brief delay
    setTimeout(() => {
      setVitalsModalOpen(true);
    }, 300);
  };

  // Save vitals with full integration
  const handleSaveVitals = () => {
    if (!selectedAppointment) return;
    
    // Validate required fields
    if (!vitals.temperature || !vitals.bloodPressure || !vitals.heartRate) {
      toast.error('Required Fields Missing', {
        description: 'Please fill in Temperature, Blood Pressure, and Heart Rate',
      });
      return;
    }

    // Get patient data
    const patient = patients.find(p => p.id === selectedAppointment.patientId);
    const patientName = patient?.fullName || selectedAppointment.patientName;
    
    // Create vitals summary for notifications
    const vitalsSummary = `Temp: ${vitals.temperature}°C, BP: ${vitals.bloodPressure}, HR: ${vitals.heartRate} bpm${vitals.oxygenSaturation ? `, SPO2: ${vitals.oxygenSaturation}%` : ''}${vitals.weight ? `, Weight: ${vitals.weight}kg` : ''}${vitals.bmi ? `, BMI: ${vitals.bmi}` : ''}${vitals.rbs ? `, RBS: ${vitals.rbs} mg/dL` : ''}`;
    
    // Add notification
    addNotification({
      id: `notif-vitals-${Date.now()}`,
      type: 'success',
      category: 'clinical',
      icon: 'Activity',
      title: 'Vitals Recorded Successfully',
      description: `Vital signs recorded for ${patientName}`,
      message: vitalsSummary,
      module: 'Patients',
      timestamp: new Date().toISOString(),
      unread: true,
    });

    // Add activity log
    addActivityLog({
      id: `log-vitals-${Date.now()}`,
      action: `Recorded vital signs for ${patientName} (${selectedAppointment.patientId}) - Appointment ${selectedAppointment.id}`,
      module: 'Patients',
      user: 'Nurse Hauwa Bello',
      timestamp: new Date().toISOString(),
      icon: 'Activity',
    });
    
    toast.success('Vitals saved successfully', {
      description: `Vital signs recorded for ${patientName}`,
    });
    
    // Close modal and reset form
    setVitalsModalOpen(false);
    setVitals({
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      rbs: '',
      bmi: '',
      notes: ''
    });
    setSelectedAppointment(null);
  };

  const getPriorityBadge = (priority: AppointmentPriority) => {
    const variants: Record<AppointmentPriority, any> = {
      'Critical': 'destructive',
      'High': 'default',
      'Normal': 'secondary'
    };
    
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const colors: Record<AppointmentStatus, string> = {
      'Scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    
    return <Badge className={colors[status]} variant="outline">{status}</Badge>;
  };

  const getPatientData = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Appointment Management</h1>
        <p className="text-muted-foreground">View and manage patient appointments</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by File ID, Patient Name, or Doctor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || priorityFilter !== 'all' || statusFilter !== 'all') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedAppointments.length} of {filteredAppointments.length} appointments
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appt #</TableHead>
                  <TableHead>File ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {paginatedAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Calendar className="w-12 h-12 mb-2 opacity-50" />
                          <p className="font-medium">No appointments found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAppointments.map((appointment, index) => (
                      <motion.tr
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">{appointment.id}</TableCell>
                        <TableCell className="font-mono text-sm">{appointment.patientId}</TableCell>
                        <TableCell className="font-medium">{appointment.patientName}</TableCell>
                        <TableCell>{appointment.department}</TableCell>
                        <TableCell>{appointment.doctorName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{appointment.date}</span>
                            <span className="text-xs text-muted-foreground">{appointment.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(appointment.priority)}</TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View Button */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(appointment)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            {/* Vitals Button - Now in row actions */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRecordVitals(appointment)}
                              className="border-secondary text-secondary hover:bg-secondary/10"
                            >
                              <Activity className="w-4 h-4 mr-1" />
                              Vitals
                            </Button>
                            
                            {/* Check In Button - Only for Scheduled appointments */}
                            {appointment.status === 'Scheduled' && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleCheckIn(appointment)}
                                className="bg-primary hover:bg-primary/90"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Check In
                              </Button>
                            )}

                            {/* Cancel Button - Only for Scheduled appointments */}
                            {appointment.status === 'Scheduled' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCancelAppointment(appointment)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Complete information for this appointment
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Appointment #</p>
                  <p className="font-medium">{selectedAppointment.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
                </div>
              </div>

              {/* Timing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </p>
                  <p className="font-medium">{selectedAppointment.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time
                  </p>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
              </div>

              {/* Patient & Doctor Info */}
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg mb-2">Patient & Doctor</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">File ID</p>
                    <p className="font-medium font-mono">{selectedAppointment.patientId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Patient Name</p>
                    <p className="font-medium">{selectedAppointment.patientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Doctor</p>
                    <p className="font-medium flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      {selectedAppointment.doctorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Department</p>
                    <p className="font-medium">{selectedAppointment.department}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedAppointment.notes && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Vitals Modal - Enhanced with all fields */}
      <Dialog open={vitalsModalOpen} onOpenChange={setVitalsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Record Vital Signs
            </DialogTitle>
            <DialogDescription>
              Record vital signs for {selectedAppointment?.patientName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
            {/* Auto-populated info */}
            {selectedAppointment && (
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Patient Name:</span>{' '}
                    <span className="font-semibold">{selectedAppointment.patientName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">File Number:</span>{' '}
                    <span className="font-mono font-semibold">{selectedAppointment.patientId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Appointment ID:</span>{' '}
                    <span className="font-semibold">{selectedAppointment.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date/Time:</span>{' '}
                    <span className="font-semibold">{selectedAppointment.date} {selectedAppointment.time}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Vitals Form */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Temperature */}
              <div className="space-y-2">
                <Label htmlFor="temperature">
                  Temperature (°C) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="temperature"
                  placeholder="36.5"
                  type="number"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                />
              </div>

              {/* Blood Pressure */}
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">
                  Blood Pressure <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bloodPressure"
                  placeholder="120/80"
                  value={vitals.bloodPressure}
                  onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                />
              </div>

              {/* Heart Rate */}
              <div className="space-y-2">
                <Label htmlFor="heartRate">
                  Heart Rate (bpm) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="heartRate"
                  placeholder="72"
                  type="number"
                  value={vitals.heartRate}
                  onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                />
              </div>

              {/* Respiratory Rate */}
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">
                  Respiratory Rate (/min)
                </Label>
                <Input
                  id="respiratoryRate"
                  placeholder="16"
                  type="number"
                  value={vitals.respiratoryRate}
                  onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                />
              </div>

              {/* Oxygen Saturation */}
              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">
                  Oxygen Saturation (%)
                </Label>
                <Input
                  id="oxygenSaturation"
                  placeholder="98"
                  type="number"
                  value={vitals.oxygenSaturation}
                  onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  placeholder="70"
                  type="number"
                  step="0.1"
                  value={vitals.weight}
                  onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  placeholder="170"
                  type="number"
                  value={vitals.height}
                  onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                />
              </div>

              {/* RBS */}
              <div className="space-y-2">
                <Label htmlFor="rbs">
                  RBS (mg/dL)
                </Label>
                <Input
                  id="rbs"
                  placeholder="95"
                  type="number"
                  value={vitals.rbs}
                  onChange={(e) => setVitals({ ...vitals, rbs: e.target.value })}
                />
              </div>

              {/* BMI - Auto-calculated */}
              <div className="space-y-2">
                <Label>
                  BMI (Auto-calculated)
                </Label>
                <div className="flex items-center h-10 px-3 rounded-md border bg-muted">
                  <span className="font-semibold text-primary">
                    {vitals.bmi || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                placeholder="Any additional observations or remarks..."
                value={vitals.notes}
                onChange={(e) => setVitals({ ...vitals, notes: e.target.value })}
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setVitalsModalOpen(false);
                setVitals({
                  temperature: '',
                  bloodPressure: '',
                  heartRate: '',
                  respiratoryRate: '',
                  oxygenSaturation: '',
                  weight: '',
                  height: '',
                  rbs: '',
                  bmi: '',
                  notes: ''
                });
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveVitals} 
              className="bg-primary hover:bg-primary/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Vitals
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check-In Confirmation Modal */}
      <Dialog open={checkInModalOpen} onOpenChange={setCheckInModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Confirm Check-In
            </DialogTitle>
            <DialogDescription>
              Mark this patient as checked in. Vitals recording will open automatically.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Patient:</span>{' '}
                <span className="font-medium">{selectedAppointment.patientName}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">File ID:</span>{' '}
                <span className="font-medium font-mono">{selectedAppointment.patientId}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Appointment:</span>{' '}
                <span className="font-medium">{selectedAppointment.date} at {selectedAppointment.time}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Doctor:</span>{' '}
                <span className="font-medium">{selectedAppointment.doctorName}</span>
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-xs text-blue-900">
              After confirming check-in, the vitals recording modal will open automatically to capture patient vitals.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCheckInModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCheckIn} className="bg-primary hover:bg-primary/90">
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Check-In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
