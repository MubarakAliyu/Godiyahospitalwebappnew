import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Save, 
  Check,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Switch } from '@/app/components/ui/switch';
import { Separator } from '@/app/components/ui/separator';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';

export function NurseSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'account';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);

  // Account Settings State
  const [accountData, setAccountData] = useState({
    fullName: 'Aisha Mohammed',
    email: 'aisha.nurse@godiyahospital.ng',
    phone: '+234 803 456 7890',
    address: '12 Hospital Road, Birnin Kebbi',
    department: 'General Ward',
    employeeId: 'GH-N-2024-001',
    dateJoined: '2024-01-15',
    qualification: 'RN, BSN',
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    admissionAlerts: true,
    appointmentReminders: true,
    labResultAlerts: true,
    emergencyAlerts: true,
    systemUpdates: false,
    weeklyReports: true,
    dailyDigest: false,
  });

  // Theme Settings State
  const [themeSettings, setThemeSettings] = useState({
    theme: 'light',
    accentColor: 'blue',
    fontSize: 'medium',
    compactMode: false,
    animationsEnabled: true,
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginNotifications: true,
    deviceManagement: true,
  });

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const handleAccountSave = () => {
    setShowSaveDialog(true);
  };

  const confirmSave = () => {
    toast.success('Settings Saved', {
      description: 'Your account settings have been updated successfully.',
    });
    setPendingChanges(false);
    setShowSaveDialog(false);
  };

  const handleNotificationSave = () => {
    toast.success('Notification Settings Updated', {
      description: 'Your notification preferences have been saved.',
    });
  };

  const handleThemeSave = () => {
    toast.success('Theme Settings Updated', {
      description: 'Your theme preferences have been applied.',
    });
  };

  const handleSecuritySave = () => {
    toast.success('Security Settings Updated', {
      description: 'Your security preferences have been saved.',
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and system settings
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Theme</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal and professional details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          value={accountData.fullName}
                          onChange={(e) => {
                            setAccountData({ ...accountData, fullName: e.target.value });
                            setPendingChanges(true);
                          }}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={accountData.email}
                          onChange={(e) => {
                            setAccountData({ ...accountData, email: e.target.value });
                            setPendingChanges(true);
                          }}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={accountData.phone}
                          onChange={(e) => {
                            setAccountData({ ...accountData, phone: e.target.value });
                            setPendingChanges(true);
                          }}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="address"
                          value={accountData.address}
                          onChange={(e) => {
                            setAccountData({ ...accountData, address: e.target.value });
                            setPendingChanges(true);
                          }}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="employeeId"
                          value={accountData.employeeId}
                          disabled
                          className="pl-10 bg-muted"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select value={accountData.department} onValueChange={(value) => {
                        setAccountData({ ...accountData, department: value });
                        setPendingChanges(true);
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Ward">General Ward</SelectItem>
                          <SelectItem value="ICU">ICU</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Maternity">Maternity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qualification">Qualification</Label>
                      <div className="relative">
                        <Input
                          id="qualification"
                          value={accountData.qualification}
                          onChange={(e) => {
                            setAccountData({ ...accountData, qualification: e.target.value });
                            setPendingChanges(true);
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateJoined">Date Joined</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="dateJoined"
                          value={accountData.dateJoined}
                          disabled
                          className="pl-10 bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button 
                    onClick={handleAccountSave} 
                    className="bg-primary hover:bg-primary/90"
                    disabled={!pendingChanges}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about system events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notification Channels */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts via SMS
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive browser push notifications
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notification Types */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Admission Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          New admission requests and updates
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.admissionAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, admissionAlerts: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Appointment Reminders</p>
                        <p className="text-sm text-muted-foreground">
                          Upcoming appointments and schedules
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.appointmentReminders}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, appointmentReminders: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Lab Result Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          New laboratory results available
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.labResultAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, labResultAlerts: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50/50">
                      <div className="flex-1">
                        <p className="font-medium text-red-900">Emergency Alerts</p>
                        <p className="text-sm text-red-700">
                          Critical alerts and emergency notifications
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.emergencyAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, emergencyAlerts: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">System Updates</p>
                        <p className="text-sm text-muted-foreground">
                          System maintenance and updates
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, systemUpdates: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">
                          Weekly summary of activities
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Daily Digest</p>
                        <p className="text-sm text-muted-foreground">
                          Daily summary email at end of day
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyDigest}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, dailyDigest: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Reset to Default</Button>
                  <Button 
                    onClick={handleNotificationSave} 
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Theme & Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Mode */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Theme Mode</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setThemeSettings({ ...themeSettings, theme: 'light' })}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        themeSettings.theme === 'light' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Sun className="w-6 h-6" />
                      <span className="font-medium">Light</span>
                      {themeSettings.theme === 'light' && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>

                    <button
                      onClick={() => setThemeSettings({ ...themeSettings, theme: 'dark' })}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        themeSettings.theme === 'dark' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Moon className="w-6 h-6" />
                      <span className="font-medium">Dark</span>
                      {themeSettings.theme === 'dark' && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>

                    <button
                      onClick={() => setThemeSettings({ ...themeSettings, theme: 'system' })}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        themeSettings.theme === 'system' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Monitor className="w-6 h-6" />
                      <span className="font-medium">System</span>
                      {themeSettings.theme === 'system' && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  </div>
                </div>

                <Separator />

                {/* Accent Color */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Accent Color</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {['blue', 'green', 'purple', 'orange'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setThemeSettings({ ...themeSettings, accentColor: color })}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                          themeSettings.accentColor === color 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div 
                          className={`w-8 h-8 rounded-full bg-${color}-500`}
                          style={{
                            backgroundColor: 
                              color === 'blue' ? '#1e40af' :
                              color === 'green' ? '#059669' :
                              color === 'purple' ? '#9333ea' :
                              '#f97316'
                          }}
                        />
                        <span className="font-medium capitalize">{color}</span>
                        {themeSettings.accentColor === color && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Display Options */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Display Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Compact Mode</p>
                        <p className="text-sm text-muted-foreground">
                          Reduce spacing for more content
                        </p>
                      </div>
                      <Switch
                        checked={themeSettings.compactMode}
                        onCheckedChange={(checked) =>
                          setThemeSettings({ ...themeSettings, compactMode: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Animations</p>
                        <p className="text-sm text-muted-foreground">
                          Enable smooth transitions and animations
                        </p>
                      </div>
                      <Switch
                        checked={themeSettings.animationsEnabled}
                        onCheckedChange={(checked) =>
                          setThemeSettings({ ...themeSettings, animationsEnabled: checked })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select 
                        value={themeSettings.fontSize} 
                        onValueChange={(value) =>
                          setThemeSettings({ ...themeSettings, fontSize: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Reset to Default</Button>
                  <Button 
                    onClick={handleThemeSave} 
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Apply Theme
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Two-Factor Authentication */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">Enable 2FA</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorEnabled}
                        onCheckedChange={(checked) => {
                          setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked });
                          if (checked) {
                            toast.info('Two-Factor Authentication', {
                              description: 'You will receive a setup code via email.',
                            });
                          }
                        }}
                      />
                    </div>
                    {securitySettings.twoFactorEnabled && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div className="text-sm text-blue-900">
                            <p className="font-semibold">2FA is enabled</p>
                            <p className="mt-1">
                              You'll need to enter a verification code when logging in.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Session Management */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Session Management</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout</Label>
                      <Select 
                        value={securitySettings.sessionTimeout}
                        onValueChange={(value) =>
                          setSecuritySettings({ ...securitySettings, sessionTimeout: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Auto-logout after period of inactivity
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Login Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified of new login attempts
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.loginNotifications}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({ ...securitySettings, loginNotifications: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Device Management</p>
                        <p className="text-sm text-muted-foreground">
                          View and manage logged in devices
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage Devices
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Password */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Password</h3>
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">
                          Last changed 30 days ago
                        </p>
                      </div>
                      <Button variant="outline">
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <div className="text-sm text-orange-900">
                          <p className="font-semibold">Security Recommendation</p>
                          <p className="mt-1">
                            Consider changing your password regularly for better security.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Reset to Default</Button>
                  <Button 
                    onClick={handleSecuritySave} 
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these changes to your account settings?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave} className="bg-primary hover:bg-primary/90">
              <Check className="w-4 h-4 mr-2" />
              Confirm & Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
