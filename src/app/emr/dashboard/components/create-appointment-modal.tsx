import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { toast } from 'sonner';
import { useEMRStore } from '../../store/emr-store';
import { AppointmentType, AppointmentPriority } from '../../store/types';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
}

export function CreateAppointmentModal({ isOpen, onClose, preselectedPatientId }: CreateAppointmentModalProps) {
  const { patients, doctors, addAppointment } = useEMRStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    patientId: preselectedPatientId || '',
    appointmentType: '' as AppointmentType,
    department: '',
    doctorName: '',
    date: '',
    time: '',
    priority: 'Normal' as AppointmentPriority,
    status: 'Scheduled' as any,
    notes: '',
  });

  const filteredPatients = searchTerm
    ? patients.filter(p => 
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : patients;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) newErrors.patientId = 'Please select a patient';
    if (!formData.appointmentType) newErrors.appointmentType = 'Appointment type is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.doctorName) newErrors.doctorName = 'Please assign a doctor';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const patient = patients.find(p => p.id === formData.patientId);
      if (!patient) throw new Error('Patient not found');

      const appointment = addAppointment({
        ...formData,
        patientName: patient.fullName,
      });

      toast.success(`Appointment created successfully - ${appointment.id}`);
      onClose();
      resetForm();
    } catch (error) {
      toast.error('Failed to create appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      appointmentType: '' as AppointmentType,
      department: '',
      doctorName: '',
      date: '',
      time: '',
      priority: 'Normal',
      status: 'Scheduled',
      notes: '',
    });
    setSearchTerm('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-2xl font-semibold">Create Appointment</h2>
                  <p className="text-sm text-muted-foreground mt-1">Schedule a new appointment</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {/* Patient Selection */}
                  <div className="space-y-2">
                    <Label>Select Patient *</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select
                      value={formData.patientId}
                      onValueChange={(value) => {
                        setFormData(prev => ({ ...prev, patientId: value }));
                        setErrors(prev => ({ ...prev, patientId: '' }));
                      }}
                    >
                      <SelectTrigger className={errors.patientId ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredPatients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.fullName} - {patient.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.patientId && <p className="text-sm text-destructive">{errors.patientId}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Appointment Type */}
                    <div className="space-y-2">
                      <Label>Appointment Type *</Label>
                      <Select
                        value={formData.appointmentType}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, appointmentType: value as AppointmentType }));
                          setErrors(prev => ({ ...prev, appointmentType: '' }));
                        }}
                      >
                        <SelectTrigger className={errors.appointmentType ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Consultation">Consultation</SelectItem>
                          <SelectItem value="Follow-up">Follow-up</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="ANC">ANC</SelectItem>
                          <SelectItem value="Immunization">Immunization</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.appointmentType && <p className="text-sm text-destructive">{errors.appointmentType}</p>}
                    </div>

                    {/* Department */}
                    <div className="space-y-2">
                      <Label>Department *</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, department: value }));
                          setErrors(prev => ({ ...prev, department: '' }));
                        }}
                      >
                        <SelectTrigger className={errors.department ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Medicine">General Medicine</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Surgery">Surgery</SelectItem>
                          <SelectItem value="Obstetrics & Gynecology">Obstetrics & Gynecology</SelectItem>
                          <SelectItem value="Radiology">Radiology</SelectItem>
                          <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
                    </div>

                    {/* Doctor */}
                    <div className="space-y-2">
                      <Label>Assign Doctor *</Label>
                      <Select
                        value={formData.doctorName}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, doctorName: value }));
                          setErrors(prev => ({ ...prev, doctorName: '' }));
                        }}
                      >
                        <SelectTrigger className={errors.doctorName ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.name}>
                              {doctor.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.doctorName && <p className="text-sm text-destructive">{errors.doctorName}</p>}
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as AppointmentPriority }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, date: e.target.value }));
                          setErrors(prev => ({ ...prev, date: '' }));
                        }}
                        className={errors.date ? 'border-destructive' : ''}
                      />
                      {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, time: e.target.value }));
                          setErrors(prev => ({ ...prev, time: '' }));
                        }}
                        className={errors.time ? 'border-destructive' : ''}
                      />
                      {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                  <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      'Create Appointment'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}