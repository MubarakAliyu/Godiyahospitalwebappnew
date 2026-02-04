import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Stethoscope, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useEMRStore } from '@/app/emr/store/emr-store';
import { toast } from 'sonner';
import type { AppointmentType, AppointmentPriority } from '@/app/emr/store/types';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAppointmentModal({ isOpen, onClose }: CreateAppointmentModalProps) {
  const { patients, departments, addAppointment } = useEMRStore();
  
  const [activeTab, setActiveTab] = useState<'basic' | 'scheduling' | 'payment'>('basic');
  
  // Form state
  const [selectedPatient, setSelectedPatient] = useState('');
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('Consultation');
  const [date, setDate] = useState('');
  const [shift, setShift] = useState('');
  const [priority, setPriority] = useState<AppointmentPriority>('Normal');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setSelectedPatient('');
    setDepartment('');
    setDoctor('');
    setAppointmentType('Consultation');
    setDate('');
    setShift('');
    setPriority('Normal');
    setNotes('');
    setActiveTab('basic');
  };

  const handleSubmit = () => {
    if (!selectedPatient || !department || !doctor || !date || !shift) {
      toast.error('Please fill all required fields');
      return;
    }

    const patient = patients.find((p) => p.id === selectedPatient);
    if (!patient) {
      toast.error('Patient not found');
      return;
    }

    addAppointment({
      id: `GH-AP-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      patientId: patient.id,
      patientName: patient.fullName,
      appointmentType,
      department,
      doctorName: doctor,
      date,
      time: shift,
      priority,
      status: 'Scheduled',
      notes,
    });

    toast.success('Appointment created successfully');
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const patient = patients.find((p) => p.id === selectedPatient);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold">Create Appointment</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Schedule a new patient appointment
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border px-6">
              <button
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'basic'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('scheduling')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'scheduling'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Scheduling
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'payment'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Payment
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">
                      Patient <span className="text-red-500">*</span>
                    </Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Search and select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.fullName} ({p.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {patient && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Patient Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-blue-700">File No:</span>{' '}
                          <span className="font-medium text-blue-900">{patient.id}</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Phone:</span>{' '}
                          <span className="font-medium text-blue-900">{patient.phoneNumber}</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Age:</span>{' '}
                          <span className="font-medium text-blue-900">{patient.age} years</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Gender:</span>{' '}
                          <span className="font-medium text-blue-900">{patient.gender}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">
                        Department <span className="text-red-500">*</span>
                      </Label>
                      <Select value={department} onValueChange={setDepartment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.name}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doctor">
                        Doctor <span className="text-red-500">*</span>
                      </Label>
                      <Select value={doctor} onValueChange={setDoctor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dr. Aisha Mohammed">Dr. Aisha Mohammed</SelectItem>
                          <SelectItem value="Dr. Ibrahim Yusuf">Dr. Ibrahim Yusuf</SelectItem>
                          <SelectItem value="Dr. Fatima Hassan">Dr. Fatima Hassan</SelectItem>
                          <SelectItem value="Dr. Usman Abdullahi">Dr. Usman Abdullahi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Appointment Type</Label>
                    <Select
                      value={appointmentType}
                      onValueChange={(value) => setAppointmentType(value as AppointmentType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="ANC">ANC</SelectItem>
                        <SelectItem value="Immunization">Immunization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Scheduling Tab */}
              {activeTab === 'scheduling' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shift">
                        Shift <span className="text-red-500">*</span>
                      </Label>
                      <Select value={shift} onValueChange={setShift}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning">Morning (8:00 AM - 12:00 PM)</SelectItem>
                          <SelectItem value="Afternoon">Afternoon (12:00 PM - 4:00 PM)</SelectItem>
                          <SelectItem value="Evening">Evening (4:00 PM - 8:00 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={priority}
                      onValueChange={(value) => setPriority(value as AppointmentPriority)}
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

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full min-h-[100px] px-3 py-2 border border-border rounded-md"
                      placeholder="Add any additional notes..."
                    />
                  </div>
                </div>
              )}

              {/* Payment Tab */}
              {activeTab === 'payment' && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-900 mb-1">
                        Invoice Auto-Link
                      </h4>
                      <p className="text-sm text-yellow-700">
                        An invoice will be automatically generated and linked to this appointment
                        upon creation. Payment status will be tracked in the Finance module.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3">Payment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Consultation Fee:</span>
                        <span className="font-medium">₦5,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          Unpaid
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Create Appointment</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
