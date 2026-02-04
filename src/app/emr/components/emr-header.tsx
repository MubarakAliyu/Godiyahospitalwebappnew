import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useEMRStore } from '../store/emr-store';

interface EMRHeaderProps {
  breadcrumbs: { label: string; path?: string }[];
}

export function EMRHeader({ breadcrumbs }: EMRHeaderProps) {
  const navigate = useNavigate();
  const { notifications } = useEMRStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const authData = JSON.parse(localStorage.getItem('emr_auth') || '{}');

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    localStorage.removeItem('emr_auth');
    toast.success('Logged out successfully.');
    navigate('/emr/login');
  };

  const getSettingsPath = () => {
    const role = authData.role || 'Super Admin';
    const pathMap: Record<string, string> = {
      'Super Admin': '/emr/dashboard/settings',
      'Reception': '/emr/reception/settings',
      'Cashier': '/emr/cashier/settings',
      'Doctor': '/emr/doctor/settings',
      'Laboratory': '/emr/laboratory/settings',
      'Pharmacy': '/emr/pharmacy/settings',
      'Nurse': '/emr/nurse/settings',
    };
    return pathMap[role] || '/emr/dashboard/settings';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-border h-16 flex items-center px-6 gap-4">
        {/* Breadcrumbs - Always horizontal, no wrapping */}
        <div className="flex-shrink-0 overflow-x-auto scrollbar-hide">
          <Breadcrumb>
            <BreadcrumbList className="flex-nowrap whitespace-nowrap">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center flex-shrink-0">
                  {index > 0 && <BreadcrumbSeparator className="flex-shrink-0" />}
                  <BreadcrumbItem className="flex-shrink-0">
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="font-medium whitespace-nowrap">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={crumb.path || '#'}
                        className="text-muted-foreground hover:text-foreground whitespace-nowrap"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients, invoices, rooms, drugs…"
              className="pl-9 h-10 bg-muted/50 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Notifications */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
        >
          <Bell className="w-5 h-5 text-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-muted px-2 py-1.5 rounded-lg transition-colors flex-shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-white text-sm">
                  {authData.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:block text-sm font-medium">
                {authData.name || 'Aliyu'}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{authData.name || 'Aliyu'}</p>
              <p className="text-xs text-muted-foreground">{authData.email || 'ghaliyu@gmail.com'}</p>
              <Badge className="mt-1 text-xs" variant="secondary">
                {authData.role || 'Super Admin'}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(getSettingsPath())}>
              <SettingsIcon className="w-4 h-4 mr-2" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
    </>
  );
}