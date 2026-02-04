import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Lock, FlaskConical, Save, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Separator } from '@/app/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { toast } from 'sonner';
import { getCurrentUser } from '@/app/emr/utils/auth';

export function LaboratorySettings() {
  const authData = getCurrentUser();
  const [formData, setFormData] = useState({
    name: authData?.name || '',
    email: authData?.email || '',
    phone: '',
    certification: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    newTestRequest: true,
    paymentConfirmed: true,
    urgentTests: true,
    qualityControl: false,
  });

  const [preferences, setPreferences] = useState({
    defaultTestPriority: 'normal',
    autoGenerateReport: true,
    showPendingFirst: true,
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
        <p className="text-muted-foreground">Manage your laboratory settings and test processing preferences</p>
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
                <Label htmlFor="cert">Certification Number</Label>
                <Input id="cert" value={formData.certification} onChange={(e) => setFormData({ ...formData, certification: e.target.value })} />
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
                <p className="font-medium">New Lab Test Requests</p>
                <p className="text-sm text-muted-foreground">Get notified when new tests are requested</p>
              </div>
              <Switch checked={notifications.newTestRequest} onCheckedChange={(checked) => setNotifications({ ...notifications, newTestRequest: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Confirmed</p>
                <p className="text-sm text-muted-foreground">Alerts when test payments are received</p>
              </div>
              <Switch checked={notifications.paymentConfirmed} onCheckedChange={(checked) => setNotifications({ ...notifications, paymentConfirmed: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Urgent Test Flag</p>
                <p className="text-sm text-muted-foreground">Priority alerts for urgent/stat tests</p>
              </div>
              <Switch checked={notifications.urgentTests} onCheckedChange={(checked) => setNotifications({ ...notifications, urgentTests: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Quality Control Alerts</p>
                <p className="text-sm text-muted-foreground">Receive QC and calibration reminders</p>
              </div>
              <Switch checked={notifications.qualityControl} onCheckedChange={(checked) => setNotifications({ ...notifications, qualityControl: checked })} />
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Notification preferences saved!')}><Save className="w-4 h-4 mr-2" />Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Test Processing Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" />
              <CardTitle>Test Processing Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Default Test Priority</Label>
              <Select value={preferences.defaultTestPriority} onValueChange={(value) => setPreferences({ ...preferences, defaultTestPriority: value })}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="stat">STAT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Generate PDF Reports</p>
                <p className="text-sm text-muted-foreground">Automatically create PDF when results are entered</p>
              </div>
              <Switch checked={preferences.autoGenerateReport} onCheckedChange={(checked) => setPreferences({ ...preferences, autoGenerateReport: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Pending Tests First</p>
                <p className="text-sm text-muted-foreground">Prioritize pending tests in test list</p>
              </div>
              <Switch checked={preferences.showPendingFirst} onCheckedChange={(checked) => setPreferences({ ...preferences, showPendingFirst: checked })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sound Alerts</p>
                <p className="text-sm text-muted-foreground">Play sound for urgent test notifications</p>
              </div>
              <Switch checked={preferences.soundAlerts} onCheckedChange={(checked) => setPreferences({ ...preferences, soundAlerts: checked })} />
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Processing preferences saved!')}><Save className="w-4 h-4 mr-2" />Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
