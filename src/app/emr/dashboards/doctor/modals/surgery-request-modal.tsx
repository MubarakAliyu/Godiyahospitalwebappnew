import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Activity, Scissors, Users, Clock, ClipboardList } from 'lucide-react';
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

interface SurgeryRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    surgeryType: string;
    urgencyLevel: string;
    duration: string;
    requiredStaff: string;
    equipmentNotes: string;
  }) => void;
  patientData: any;
}

export function SurgeryRequestModal({
  isOpen,
  onClose,
  onConfirm,
  patientData,
}: SurgeryRequestModalProps) {
  const [surgeryType, setSurgeryType] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [requiredStaff, setRequiredStaff] = useState('');
  const [equipmentNotes, setEquipmentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!surgeryType || !urgencyLevel || !duration || !requiredStaff) {
      toast.error('Required Fields Missing', {
        description: 'Please fill in all required fields',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm({
        surgeryType,
        urgencyLevel,
        duration,
        requiredStaff,
        equipmentNotes,
      });
      setIsSubmitting(false);
      setSurgeryType('');
      setUrgencyLevel('');
      setDuration('');
      setRequiredStaff('');
      setEquipmentNotes('');
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Scissors className="w-6 h-6 text-primary" />
            Surgery Request
          </DialogTitle>
          <DialogDescription>
            Submit surgery request for {patientData?.fullName || patientData?.patientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
          {/* Surgery Type */}
          <div className="space-y-2">
            <Label htmlFor="surgeryType">
              Surgery Type <span className="text-destructive">*</span>
            </Label>
            <Select value={surgeryType} onValueChange={setSurgeryType}>
              <SelectTrigger id="surgeryType">
                <SelectValue placeholder="Select surgery type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Appendectomy">Appendectomy</SelectItem>
                <SelectItem value="Cesarean Section">Cesarean Section (C-Section)</SelectItem>
                <SelectItem value="Hernia Repair">Hernia Repair</SelectItem>
                <SelectItem value="Gallbladder Removal">
                  Gallbladder Removal (Cholecystectomy)
                </SelectItem>
                <SelectItem value="Hip Replacement">Hip Replacement</SelectItem>
                <SelectItem value="Knee Replacement">Knee Replacement</SelectItem>
                <SelectItem value="Hysterectomy">Hysterectomy</SelectItem>
                <SelectItem value="Cataract Surgery">Cataract Surgery</SelectItem>
                <SelectItem value="Tonsillectomy">Tonsillectomy</SelectItem>
                <SelectItem value="Thyroidectomy">Thyroidectomy</SelectItem>
                <SelectItem value="Mastectomy">Mastectomy</SelectItem>
                <SelectItem value="Prostatectomy">Prostatectomy</SelectItem>
                <SelectItem value="CABG">CABG (Coronary Artery Bypass)</SelectItem>
                <SelectItem value="Craniotomy">Craniotomy</SelectItem>
                <SelectItem value="Spinal Surgery">Spinal Surgery</SelectItem>
                <SelectItem value="Other">Other (Specify in equipment notes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Urgency Level */}
          <div className="space-y-2">
            <Label htmlFor="urgencyLevel">
              Urgency Level <span className="text-destructive">*</span>
            </Label>
            <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
              <SelectTrigger id="urgencyLevel">
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">
                  <div>
                    <p className="font-semibold text-red-600">Critical / Emergency</p>
                    <p className="text-xs text-muted-foreground">Immediate - Within 1 hour</p>
                  </div>
                </SelectItem>
                <SelectItem value="Urgent">
                  <div>
                    <p className="font-semibold text-orange-600">Urgent</p>
                    <p className="text-xs text-muted-foreground">Within 24 hours</p>
                  </div>
                </SelectItem>
                <SelectItem value="Semi-Urgent">
                  <div>
                    <p className="font-semibold text-yellow-600">Semi-Urgent</p>
                    <p className="text-xs text-muted-foreground">Within 1 week</p>
                  </div>
                </SelectItem>
                <SelectItem value="Elective">
                  <div>
                    <p className="font-semibold text-green-600">Elective</p>
                    <p className="text-xs text-muted-foreground">Scheduled/Planned</p>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expected Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">
              Expected Duration <span className="text-destructive">*</span>
            </Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select expected duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="< 1 hour">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Less than 1 hour
                  </div>
                </SelectItem>
                <SelectItem value="1-2 hours">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    1-2 hours
                  </div>
                </SelectItem>
                <SelectItem value="2-3 hours">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    2-3 hours
                  </div>
                </SelectItem>
                <SelectItem value="3-4 hours">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    3-4 hours
                  </div>
                </SelectItem>
                <SelectItem value="4-6 hours">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    4-6 hours
                  </div>
                </SelectItem>
                <SelectItem value="> 6 hours">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    More than 6 hours
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Required Staff */}
          <div className="space-y-2">
            <Label htmlFor="requiredStaff">
              Required Staff & Team <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="requiredStaff"
              placeholder="List required medical staff (e.g., Anesthesiologist, 2 Surgical Nurses, Perfusionist, etc.)"
              rows={3}
              value={requiredStaff}
              onChange={(e) => setRequiredStaff(e.target.value)}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Specify all medical professionals needed for the surgery
            </p>
          </div>

          {/* Equipment Notes */}
          <div className="space-y-2">
            <Label htmlFor="equipmentNotes">Equipment & Special Requirements</Label>
            <Textarea
              id="equipmentNotes"
              placeholder="List required surgical equipment, special instruments, blood products, ICU bed requirements, etc."
              rows={4}
              value={equipmentNotes}
              onChange={(e) => setEquipmentNotes(e.target.value)}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Include any special equipment, instruments, or post-operative requirements
            </p>
          </div>

          {/* Urgency Alert */}
          {urgencyLevel === 'Critical' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-900">
                <strong>Critical/Emergency Surgery!</strong> The surgical team and theatre will be notified immediately for urgent preparation. Patient should be NPO and pre-operative preparations should begin.
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
                <Scissors className="w-4 h-4 mr-2" />
                Submit Surgery Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
