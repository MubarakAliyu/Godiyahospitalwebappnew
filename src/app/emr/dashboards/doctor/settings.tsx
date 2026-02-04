import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Lock, Stethoscope, Save, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Separator } from '@/app/components/ui/separator';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { toast } from 'sonner';
import { getCurrentUser } from '@/app/emr/utils/auth';

export function DoctorSettings() {
  const authData = getCurrentUser();
  const [formData, setFormData] = useState({
    name: authData?.name || '',
    email: authData?.email || '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    signature: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    newAppointment: true,
    labResults: true,
    patientVitals: true,
    emergencies: true,
  });

  const [preferences, setPreferences] = useState({
    consultationDuration: '30',
    autoSaveNotes: true,
    showPatientHistory: true,
    soundNotifications: true,
  });

  const handleSaveProfile = () => toast.success('Profile updated successfully!');
  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    toast.success('Password changed successfully!');
    setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your doctor profile and consultation preferences</p>
      </div>

      {/* Profile Information */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Professional Profile</CardTitle>
            </div>
            <CardDescription>Update your professional information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input id="specialization" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} placeholder="e.g., General Medicine" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input id="license" value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} placeholder="Enter your license number" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signature">Digital Signature</Label>
              <Textarea id="signature" value={formData.signature} onChange={(e) => setFormData({ ...formData, signature: e.target.value })} placeholder="Enter your digital signature text" rows={3} />
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={formData.currentPassword} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
              </div>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button onClick={handleChangePassword}><Lock className="w-4 h-4 mr-2" />Update Password</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Appointment</p>
                <p className="text-sm text-muted-foreground">Get notified of new appointment bookings</p>
              </div>
              <Switch checked={notifications.newAppointment} onCheckedChange={(checked) => setNotifications({ ...notifications, newAppointment: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lab Results Ready</p>
                <p className="text-sm text-muted-foreground">Alerts when patient lab results are available</p>
              </div>
              <Switch checked={notifications.labResults} onCheckedChange={(checked) => setNotifications({ ...notifications, labResults: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Patient Vitals Recorded</p>
                <p className="text-sm text-muted-foreground">Notification when vitals are recorded by nurses</p>
              </div>
              <Switch checked={notifications.patientVitals} onCheckedChange={(checked) => setNotifications({ ...notifications, patientVitals: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Emergency Cases</p>
                <p className="text-sm text-muted-foreground">Urgent alerts for emergency situations</p>
              </div>
              <Switch checked={notifications.emergencies} onCheckedChange={(checked) => setNotifications({ ...notifications, emergencies: checked })} />
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Notification preferences saved!')}><Save className="w-4 h-4 mr-2" />Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Consultation Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              <CardTitle>Consultation Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Default Consultation Duration</Label>
              <Select value={preferences.consultationDuration} onValueChange={(value) => setPreferences({ ...preferences, consultationDuration: value })}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Save Consultation Notes</p>
                <p className="text-sm text-muted-foreground">Automatically save notes every 30 seconds</p>
              </div>
              <Switch checked={preferences.autoSaveNotes} onCheckedChange={(checked) => setPreferences({ ...preferences, autoSaveNotes: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Patient History</p>
                <p className="text-sm text-muted-foreground">Display patient history during consultation</p>
              </div>
              <Switch checked={preferences.showPatientHistory} onCheckedChange={(checked) => setPreferences({ ...preferences, showPatientHistory: checked })} />
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Consultation preferences saved!')}><Save className="w-4 h-4 mr-2" />Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
