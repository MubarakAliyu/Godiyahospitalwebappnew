import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Lock, Monitor, Save, Receipt } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Separator } from '@/app/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { toast } from 'sonner';
import { getCurrentUser } from '@/app/emr/utils/auth';

export function CashierSettings() {
  const authData = getCurrentUser();
  const [formData, setFormData] = useState({
    name: authData?.name || '',
    email: authData?.email || '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    newInvoice: true,
    paymentConfirmed: true,
    refundAlerts: true,
    dailySummary: false,
  });

  const [preferences, setPreferences] = useState({
    defaultPaymentMethod: 'cash',
    autoGenerateReceipt: true,
    soundNotifications: true,
    showDailyTotal: true,
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
  const handleSaveNotifications = () => toast.success('Notification preferences saved!');
  const handleSavePreferences = () => toast.success('Payment preferences saved!');

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your cashier account settings and payment preferences</p>
      </div>

      {/* Profile Information */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>Update your personal information and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter your phone number" />
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
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
                <Input id="currentPassword" type="password" value={formData.currentPassword} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Confirm new password" />
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            <CardDescription>Choose which notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Invoice Generated</p>
                  <p className="text-sm text-muted-foreground">Get notified when new invoices are created</p>
                </div>
                <Switch checked={notifications.newInvoice} onCheckedChange={(checked) => setNotifications({ ...notifications, newInvoice: checked })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Confirmed</p>
                  <p className="text-sm text-muted-foreground">Receive alerts when payments are processed</p>
                </div>
                <Switch checked={notifications.paymentConfirmed} onCheckedChange={(checked) => setNotifications({ ...notifications, paymentConfirmed: checked })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Refund Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified about refund requests and processing</p>
                </div>
                <Switch checked={notifications.refundAlerts} onCheckedChange={(checked) => setNotifications({ ...notifications, refundAlerts: checked })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Summary Report</p>
                  <p className="text-sm text-muted-foreground">Receive end-of-day transaction summary</p>
                </div>
                <Switch checked={notifications.dailySummary} onCheckedChange={(checked) => setNotifications({ ...notifications, dailySummary: checked })} />
              </div>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications}><Save className="w-4 h-4 mr-2" />Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <CardTitle>Payment Preferences</CardTitle>
            </div>
            <CardDescription>Configure your payment processing settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultPayment">Default Payment Method</Label>
                <Select value={preferences.defaultPaymentMethod} onValueChange={(value) => setPreferences({ ...preferences, defaultPaymentMethod: value })}>
                  <SelectTrigger id="defaultPayment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Generate Receipt</p>
                  <p className="text-sm text-muted-foreground">Automatically print receipt after payment</p>
                </div>
                <Switch checked={preferences.autoGenerateReceipt} onCheckedChange={(checked) => setPreferences({ ...preferences, autoGenerateReceipt: checked })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sound Notifications</p>
                  <p className="text-sm text-muted-foreground">Play sound when payment is received</p>
                </div>
                <Switch checked={preferences.soundNotifications} onCheckedChange={(checked) => setPreferences({ ...preferences, soundNotifications: checked })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Daily Total</p>
                  <p className="text-sm text-muted-foreground">Display running total in dashboard</p>
                </div>
                <Switch checked={preferences.showDailyTotal} onCheckedChange={(checked) => setPreferences({ ...preferences, showDailyTotal: checked })} />
              </div>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button onClick={handleSavePreferences}><Save className="w-4 h-4 mr-2" />Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
