import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Bell, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/app/components/ui/breadcrumb';
import { toast } from 'sonner';
import { LogoutConfirmModal } from './logout-confirm-modal';
import { NotificationsDrawer } from './notifications-drawer';
import { CashierProfileDropdown } from './cashier-profile-dropdown';
import { ProfileDropdown } from './profile-dropdown';
import { ChangePasswordModal } from './change-password-modal';
import { useEMRStore } from '../store/emr-store';

interface EMRHeaderProps {
  breadcrumbs: { label: string; path?: string }[];
}

export function EMRHeader({ breadcrumbs }: EMRHeaderProps) {
  const navigate = useNavigate();
  const { notifications } = useEMRStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const authData = JSON.parse(localStorage.getItem('emr_auth') || '{}');

  const getSettingsPath = () => {
    const role = authData.role || 'User';
    
    // Map roles to their correct settings paths
    switch (role) {
      case 'Doctor':
        return '/emr/doctor/settings';
      case 'Nurse':
        return '/emr/nurse/settings';
      case 'Reception':
        return '/emr/reception/settings';
      case 'Cashier':
        return '/emr/cashier/settings';
      case 'Laboratory':
        return '/emr/laboratory-staff/settings';
      case 'Pharmacy':
        return '/emr/pharmacy-staff/settings';
      default:
        return '/emr/dashboard/settings'; // Super Admin
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('emr_auth');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-2 bg-gray-100">
        <div className="flex items-center">
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <BreadcrumbItem key={index}>
                {breadcrumb.path ? (
                  <BreadcrumbLink href={breadcrumb.path}>{breadcrumb.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="relative"
            onClick={() => setIsNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 px-2 py-1 text-xs"
              >
                {notifications.length}
              </Badge>
            )}
          </Button>
          {/* Profile Dropdown */}
          {authData.role === 'Cashier' ? (
            <CashierProfileDropdown
              authData={authData}
              getSettingsPath={getSettingsPath}
              handleLogout={handleLogout}
              setIsLogoutModalOpen={setIsLogoutModalOpen}
            />
          ) : (
            <ProfileDropdown
              authData={authData}
              getSettingsPath={getSettingsPath}
              handleLogout={handleLogout}
              setIsLogoutModalOpen={setIsLogoutModalOpen}
              setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
            />
          )}
        </div>
      </header>

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </>
  );
}