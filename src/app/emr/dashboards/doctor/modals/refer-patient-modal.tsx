import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Activity, Building2, Phone } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { toast } from 'sonner';

interface ReferPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    receivingHospital: string;
    hospitalContact: string;
    reason: string;
    priority: string;
    notes: string;
  }) => void;
  patientData: any;
}

export function ReferPatientModal({
  isOpen,
  onClose,
  onConfirm,
  patientData,
}: ReferPatientModalProps) {
  const [receivingHospital, setReceivingHospital] = useState('');
  const [hospitalContact, setHospitalContact] = useState('');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // External hospitals list with contacts
  const externalHospitals = [
    { name: 'Federal Medical Centre, Sokoto', contact: '+234 803 456 7890' },
    { name: 'Usmanu Danfodiyo University Teaching Hospital', contact: '+234 806 123 4567' },
    { name: 'National Hospital, Abuja', contact: '+234 809 876 5432' },
    { name: 'Aminu Kano Teaching Hospital', contact: '+234 802 345 6789' },
    { name: 'University of Ilorin Teaching Hospital', contact: '+234 805 678 9012' },
    { name: 'Lagos University Teaching Hospital (LUTH)', contact: '+234 807 890 1234' },
    { name: 'Ahmadu Bello University Teaching Hospital', contact: '+234 803 567 8901' },
    { name: 'Other (Specify in notes)', contact: '' },
  ];

  const handleHospitalChange = (value: string) => {
    setReceivingHospital(value);
    const hospital = externalHospitals.find((h) => h.name === value);
    if (hospital && hospital.contact) {
      setHospitalContact(hospital.contact);
    } else {
      setHospitalContact('');
    }
  };

  const handleSubmit = () => {
    if (!receivingHospital || !reason || !priority) {
      toast.error('Required Fields Missing', {
        description: 'Please fill in all required fields',
      });
      return;
    }

    if (!hospitalContact) {
      toast.error('Contact Required', {
        description: 'Please enter the hospital contact number',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm({
        receivingHospital,
        hospitalContact,
        reason,
        priority,
        notes,
      });
      setIsSubmitting(false);
      setReceivingHospital('');
      setHospitalContact('');
      setReason('');
      setPriority('');
      setNotes('');
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Send className="w-6 h-6 text-primary" />
            Refer Patient
          </DialogTitle>
          <DialogDescription>
            Submit external hospital referral for {patientData?.fullName || patientData?.patientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
          {/* Receiving Hospital */}
          <div className="space-y-2">
            <Label htmlFor="receivingHospital">
              Receiving Hospital <span className="text-destructive">*</span>
            </Label>
            <Select value={receivingHospital} onValueChange={handleHospitalChange}>
              <SelectTrigger id="receivingHospital">
                <SelectValue placeholder="Select hospital" />
              </SelectTrigger>
              <SelectContent>
                {externalHospitals.map((hospital, index) => (
                  <SelectItem key={index} value={hospital.name}>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {hospital.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hospital Contact */}
          <div className="space-y-2">
            <Label htmlFor="hospitalContact">
              Hospital Contact Number <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="hospitalContact"
                placeholder="+234 XXX XXX XXXX"
                value={hospitalContact}
                onChange={(e) => setHospitalContact(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Reason for Referral */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Referral <span className="text-destructive">*</span>
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Specialized Treatment Required">
                  Specialized Treatment Required
                </SelectItem>
                <SelectItem value="Advanced Diagnostic Facilities">
                  Advanced Diagnostic Facilities
                </SelectItem>
                <SelectItem value="Specialist Consultation">Specialist Consultation</SelectItem>
                <SelectItem value="Surgical Intervention">
                  Surgical Intervention Beyond Our Capacity
                </SelectItem>
                <SelectItem value="ICU/Critical Care">ICU/Critical Care Required</SelectItem>
                <SelectItem value="Pediatric Specialty Care">
                  Pediatric Specialty Care
                </SelectItem>
                <SelectItem value="Cardiac Emergency">Cardiac Emergency</SelectItem>
                <SelectItem value="Neurosurgical Emergency">
                  Neurosurgical Emergency
                </SelectItem>
                <SelectItem value="Other">Other (Specify in notes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Level */}
          <div className="space-y-2">
            <Label htmlFor="priority">
              Priority Level <span className="text-destructive">*</span>
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">
                  <div>
                    <p className="font-semibold text-red-600">Critical</p>
                    <p className="text-xs text-muted-foreground">
                      Immediate transfer required
                    </p>
                  </div>
                </SelectItem>
                <SelectItem value="High">
                  <div>
                    <p className="font-semibold text-orange-600">High</p>
                    <p className="text-xs text-muted-foreground">Within 24 hours</p>
                  </div>
                </SelectItem>
                <SelectItem value="Medium">
                  <div>
                    <p className="font-semibold text-yellow-600">Medium</p>
                    <p className="text-xs text-muted-foreground">Within 3-5 days</p>
                  </div>
                </SelectItem>
                <SelectItem value="Low">
                  <div>
                    <p className="font-semibold text-green-600">Low</p>
                    <p className="text-xs text-muted-foreground">Elective/Scheduled</p>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clinical Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Clinical Summary & Referral Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter patient's current condition, diagnosis, treatment given, investigations done, and any relevant clinical information..."
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Provide comprehensive clinical information to help the receiving hospital
            </p>
          </div>

          {/* Priority Alert */}
          {priority === 'Critical' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2"
            >
              <Building2 className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-900">
                <strong>Critical Referral!</strong> The receiving hospital will be notified immediately. Please ensure ambulance and necessary equipment are arranged.
              </p>
            </motion.div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-secondary hover:bg-secondary/90"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mr-2"
                >
                  <Activity className="w-4 h-4" />
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Referral Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
