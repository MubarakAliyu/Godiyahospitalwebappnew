import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Lock, Activity, Save, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Separator } from '@/app/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { toast } from 'sonner';
import { getCurrentUser } from '@/app/emr/utils/auth';

export function NurseSettings() {
  const authData = getCurrentUser();
  const [formData, setFormData] = useState({
    name: authData?.name || '',
    email: authData?.email || '',
    phone: '',
    licenseNumber: '',
    department: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    newAppointment: true,
    doctorRequest: true,
    admissionRequest: true,
    emergencyAlert: true,
  });

  const [preferences, setPreferences] = useState({
    vitalsFrequency: '4',
    autoSaveVitals: true,
    showCriticalFirst: true,
    soundAlerts: true,
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
        <p className="text-muted-foreground">Manage your nurse profile and patient care preferences</p>
      </div>

      {/* Profile Information */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Profile Information</CardTitle>
            </div>
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
                <Label htmlFor="license">Nursing License Number</Label>
                <Input id="license" value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g., General Ward" />
              </div>
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
                <p className="text-sm text-muted-foreground">Get notified of new patient appointments</p>
              </div>
              <Switch checked={notifications.newAppointment} onCheckedChange={(checked) => setNotifications({ ...notifications, newAppointment: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Doctor Request</p>
                <p className="text-sm text-muted-foreground">Receive alerts for doctor requests and orders</p>
              </div>
              <Switch checked={notifications.doctorRequest} onCheckedChange={(checked) => setNotifications({ ...notifications, doctorRequest: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Admission Request</p>
                <p className="text-sm text-muted-foreground">Get notified about new admission requests</p>
              </div>
              <Switch checked={notifications.admissionRequest} onCheckedChange={(checked) => setNotifications({ ...notifications, admissionRequest: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Emergency Admission</p>
                <p className="text-sm text-muted-foreground">Urgent alerts for emergency cases</p>
              </div>
              <Switch checked={notifications.emergencyAlert} onCheckedChange={(checked) => setNotifications({ ...notifications, emergencyAlert: checked })} />
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Notification preferences saved!')}><Save className="w-4 h-4 mr-2" />Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Patient Care Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <CardTitle>Patient Care Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Default Vitals Check Frequency (hours)</Label>
              <Select value={preferences.vitalsFrequency} onValueChange={(value) => setPreferences({ ...preferences, vitalsFrequency: value })}>
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Every 2 hours</SelectItem>
                  <SelectItem value="4">Every 4 hours</SelectItem>
                  <SelectItem value="6">Every 6 hours</SelectItem>
                  <SelectItem value="8">Every 8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Save Vitals</p>
                <p className="text-sm text-muted-foreground">Automatically save vitals as you enter them</p>
              </div>
              <Switch checked={preferences.autoSaveVitals} onCheckedChange={(checked) => setPreferences({ ...preferences, autoSaveVitals: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Critical Patients First</p>
                <p className="text-sm text-muted-foreground">Prioritize critical patients in patient list</p>
              </div>
              <Switch checked={preferences.showCriticalFirst} onCheckedChange={(checked) => setPreferences({ ...preferences, showCriticalFirst: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sound Alerts</p>
                <p className="text-sm text-muted-foreground">Play sound for abnormal vitals and emergencies</p>
              </div>
              <Switch checked={preferences.soundAlerts} onCheckedChange={(checked) => setPreferences({ ...preferences, soundAlerts: checked })} />
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Care preferences saved!')}><Save className="w-4 h-4 mr-2" />Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
