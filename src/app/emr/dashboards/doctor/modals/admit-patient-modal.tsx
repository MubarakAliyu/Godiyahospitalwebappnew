import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Activity, Bed } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { toast } from 'sonner';

interface AdmitPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { 
    ward: string; 
    wardId: string;
    roomNumber: string;
    roomId: string;
    bedCount: number;
    admissionFee: number;
    remarks: string;
  }) => void;
  patientData: any;
}

export function AdmitPatientModal({
  isOpen,
  onClose,
  onConfirm,
  patientData,
}: AdmitPatientModalProps) {
  const [ward, setWard] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ward data with room availability
  const wardData = [
    {
      id: 'general-ward',
      name: 'General Ward',
      rooms: [
        { id: 'GW-01', number: 'Room 01', beds: 4, occupied: 2, fee: 5000 },
        { id: 'GW-02', number: 'Room 02', beds: 4, occupied: 3, fee: 5000 },
        { id: 'GW-03', number: 'Room 03', beds: 6, occupied: 1, fee: 4500 },
        { id: 'GW-04', number: 'Room 04', beds: 4, occupied: 4, fee: 5000 },
      ],
    },
    {
      id: 'male-ward',
      name: 'Male Ward',
      rooms: [
        { id: 'MW-01', number: 'Room 01', beds: 6, occupied: 4, fee: 5500 },
        { id: 'MW-02', number: 'Room 02', beds: 6, occupied: 2, fee: 5500 },
        { id: 'MW-03', number: 'Room 03', beds: 4, occupied: 1, fee: 6000 },
      ],
    },
    {
      id: 'female-ward',
      name: 'Female Ward',
      rooms: [
        { id: 'FW-01', number: 'Room 01', beds: 6, occupied: 3, fee: 5500 },
        { id: 'FW-02', number: 'Room 02', beds: 6, occupied: 5, fee: 5500 },
        { id: 'FW-03', number: 'Room 03', beds: 4, occupied: 0, fee: 6000 },
      ],
    },
    {
      id: 'pediatric-ward',
      name: 'Pediatric Ward',
      rooms: [
        { id: 'PW-01', number: 'Room 01', beds: 4, occupied: 2, fee: 7000 },
        { id: 'PW-02', number: 'Room 02', beds: 4, occupied: 3, fee: 7000 },
      ],
    },
    {
      id: 'maternity-ward',
      name: 'Maternity Ward',
      rooms: [
        { id: 'MAT-01', number: 'Room 01', beds: 2, occupied: 1, fee: 8000 },
        { id: 'MAT-02', number: 'Room 02', beds: 2, occupied: 0, fee: 8000 },
        { id: 'MAT-03', number: 'Room 03', beds: 4, occupied: 2, fee: 7500 },
      ],
    },
  ];

  const selectedWardData = wardData.find((w) => w.name === ward);

  const getRoomOccupancyColor = (occupied: number, total: number) => {
    const percentage = (occupied / total) * 100;
    if (percentage === 0) return 'bg-green-100 border-green-300 text-green-700';
    if (percentage < 50) return 'bg-green-100 border-green-300 text-green-700';
    if (percentage < 80) return 'bg-yellow-100 border-yellow-300 text-yellow-700';
    return 'bg-red-100 border-red-300 text-red-700';
  };

  const handleSubmit = () => {
    if (!ward || !selectedRoom) {
      toast.error('Required Fields Missing', {
        description: 'Please select a ward and a room',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm({
        ward,
        wardId: selectedWardData!.id,
        roomNumber: selectedRoom.number,
        roomId: selectedRoom.id,
        bedCount: selectedRoom.beds,
        admissionFee: selectedRoom.fee,
        remarks,
      });
      setIsSubmitting(false);
      setWard('');
      setSelectedRoom(null);
      setRemarks('');
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" />
            Admit Patient
          </DialogTitle>
          <DialogDescription>
            Submit admission request for {patientData?.fullName || patientData?.patientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
          {/* Ward Selection */}
          <div className="space-y-2">
            <Label htmlFor="ward">
              Ward <span className="text-destructive">*</span>
            </Label>
            <Select value={ward} onValueChange={(value) => {
              setWard(value);
              setSelectedRoom(null); // Reset room when ward changes
            }}>
              <SelectTrigger id="ward">
                <SelectValue placeholder="Select ward" />
              </SelectTrigger>
              <SelectContent>
                {wardData.map((w) => (
                  <SelectItem key={w.id} value={w.name}>
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4" />
                      {w.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room Availability Display */}
          {selectedWardData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Label className="text-sm font-medium">
                Available Rooms in {selectedWardData.name}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {selectedWardData.rooms.map((room) => {
                  const available = room.beds - room.occupied;
                  const isAvailable = available > 0;
                  return (
                    <motion.button
                      key={room.id}
                      type="button"
                      onClick={() => isAvailable && setSelectedRoom(room)}
                      disabled={!isAvailable}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedRoom?.id === room.id
                          ? 'border-primary bg-primary/10 shadow-md'
                          : getRoomOccupancyColor(room.occupied, room.beds)
                      } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}`}
                      whileHover={isAvailable ? { scale: 1.02 } : {}}
                      whileTap={isAvailable ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{room.number}</span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${selectedRoom?.id === room.id ? 'bg-primary text-white' : ''}`}
                        >
                          {available > 0 ? `${available} Available` : 'Full'}
                        </Badge>
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="flex items-center gap-1">
                          <Bed className="w-3 h-3" />
                          {room.occupied}/{room.beds} occupied
                        </p>
                        <p className="font-semibold">₦{room.fee.toLocaleString()}/day</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Selected Room Display */}
          {selectedRoom && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm font-medium text-green-900">
                ✓ Selected: {selectedRoom.number} in {ward} - ₦{selectedRoom.fee.toLocaleString()}/day
              </p>
            </div>
          )}

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Admission Remarks / Clinical Notes</Label>
            <Textarea
              id="remarks"
              placeholder="Enter diagnosis, treatment plan, special requirements, etc."
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Include important information about the patient's condition or special requirements
            </p>
          </div>
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
                <UserPlus className="w-4 h-4 mr-2" />
                Submit Admission Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
