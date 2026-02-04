import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  NotepadText,
  Bed,
  CreditCard,
  Pill,
  FlaskConical,
  FileText,
  Settings,
  Shield,
  UserCog,
  ScrollText,
  Bell,
  Activity,
  Briefcase,
  Building,
  DollarSign,
  Monitor,
  ClipboardList,
  Syringe,
  UserPlus,
  FileSpreadsheet,
  Receipt,
  TestTube,
  Folder,
  PackageCheck,
  AlertTriangle,
  CalendarClock,
  Clock,
} from 'lucide-react';
import { UserRole } from '@/app/emr/utils/auth';

export interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  badge?: string;
  children?: { label: string; path: string; icon?: React.ElementType }[];
}

export interface SidebarConfig {
  sections: {
    title: string;
    items: SidebarItem[];
  }[];
}

// Admin (Super Admin) Sidebar
export const adminSidebarConfig: SidebarConfig = {
  sections: [
    {
      title: 'Core Modules',
      items: [
        { icon: LayoutDashboard, label: 'Home / Overview', path: '/emr/dashboard' },
        { icon: UserCog, label: 'Staffs', path: '/emr/dashboard/staffs' },
        { icon: Building, label: 'Departments', path: '/emr/dashboard/departments' },
        {
          icon: Users,
          label: 'Patients',
          children: [
            { label: 'All Patients', path: '/emr/dashboard/patients', icon: Users },
            { label: 'IPD Patients', path: '/emr/dashboard/patients/inpatient', icon: Bed },
            { label: 'OPD Patients', path: '/emr/dashboard/patients/outpatient', icon: Stethoscope },
          ],
        },
        { icon: DollarSign, label: 'Finance', path: '/emr/dashboard/finance' },
        { icon: Calendar, label: 'Appointments', path: '/emr/dashboard/appointments' },
        { icon: Clock, label: 'Staff Attendance', path: '/emr/dashboard/cms' },
        { icon: Bed, label: 'Hospital Bed', path: '/emr/dashboard/rooms' },
        { icon: FileText, label: 'Reports Center', path: '/emr/dashboard/reports' },
      ],
    },
    {
      title: 'System',
      items: [
        {
          icon: Shield,
          label: 'Administration',
          children: [
            { label: 'Roles & Permissions', path: '/emr/dashboard/admin/roles', icon: Shield },
            { label: 'User Management', path: '/emr/dashboard/admin/users', icon: UserCog },
            { label: 'Audit Logs', path: '/emr/dashboard/admin/audit', icon: ScrollText },
          ],
        },
        { icon: Settings, label: 'Settings', path: '/emr/dashboard/settings' },
        { icon: Bell, label: 'Notification Center', path: '/emr/dashboard/notifications', badge: '12' },
      ],
    },
  ],
};

// Reception Sidebar
export const receptionSidebarConfig: SidebarConfig = {
  sections: [
    {
      title: 'Main Menu',
      items: [
        { icon: LayoutDashboard, label: 'Home', path: '/emr/reception/dashboard' },
        {
          icon: Users,
          label: 'Patients',
          children: [
            { label: 'All Patients', path: '/emr/reception/patients', icon: Users },
            { label: 'IPD Patients', path: '/emr/reception/patients/ipd', icon: Bed },
            { label: 'OPD Patients', path: '/emr/reception/patients/opd', icon: Stethoscope },
          ],
        },
        { icon: Calendar, label: 'Appointments', path: '/emr/reception/appointments' },
      ],
    },
  ],
};

// Cashier Sidebar
export const cashierSidebarConfig: SidebarConfig = {
  sections: [
    {
      title: 'Main Menu',
      items: [
        { icon: LayoutDashboard, label: 'Home', path: '/emr/cashier/dashboard' },
        { icon: Receipt, label: 'File Payments', path: '/emr/cashier/payments' },
        { icon: Stethoscope, label: 'Consultations', path: '/emr/cashier/consultations' },
        { icon: FlaskConical, label: 'Laboratory', path: '/emr/cashier/laboratory' },
        { icon: Pill, label: 'Pharmacy', path: '/emr/cashier/pharmacy' },
        { icon: Bed, label: 'Bed Admission', path: '/emr/cashier/bed-admission' },
        { icon: DollarSign, label: 'Admission Charges', path: '/emr/cashier/admission-charges' },
        { icon: FileText, label: 'Reports', path: '/emr/cashier/reports' },
      ],
    },
  ],
};

// Doctor Sidebar
export const doctorSidebarConfig: SidebarConfig = {
  sections: [
    {
      title: 'Main Menu',
      items: [
        { icon: LayoutDashboard, label: 'Overview', path: '/emr/doctor/dashboard' },
        { icon: Calendar, label: 'Appointments', path: '/emr/doctor/appointments' },
        {
          icon: Users,
          label: 'Patients',
          children: [
            { label: 'OPD Patients', path: '/emr/doctor/patients/opd', icon: Stethoscope },
            { label: 'IPD Patients', path: '/emr/doctor/patients/ipd', icon: Bed },
          ],
        },
      ],
    },
  ],
};

// Laboratory Sidebar
export const laboratorySidebarConfig: SidebarConfig = {
  sections: [
    {
      title: 'Main Menu',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/emr/laboratory/dashboard' },
        { icon: FlaskConical, label: 'All Lab Tests', path: '/emr/laboratory/tests' },
        { icon: ClipboardList, label: 'Pending Tests', path: '/emr/laboratory/tests/pending' },
        { icon: PackageCheck, label: 'Paid Tests', path: '/emr/laboratory/tests/paid' },
        { icon: UserPlus, label: 'Add Invoice', path: '/emr/laboratory/invoice/add' },
        { icon: Folder, label: 'Invoice Records', path: '/emr/laboratory/invoices' },
        { icon: FileSpreadsheet, label: 'Finance Report', path: '/emr/laboratory/reports' },
      ],
    },
  ],
};

// Pharmacy Sidebar
export const pharmacySidebarConfig: SidebarConfig = {
  sections: [
    {
      title: 'Main Menu',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/emr/pharmacy/dashboard' },
        { icon: DollarSign, label: 'Add Sales', path: '/emr/pharmacy/sales/add' },
        { icon: Pill, label: 'Drugs', path: '/emr/pharmacy/drugs' },
        { icon: ClipboardList, label: 'Pending Prescriptions', path: '/emr/pharmacy/prescriptions/pending' },
        { icon: PackageCheck, label: 'Paid Prescriptions', path: '/emr/pharmacy/prescriptions/paid' },
        { icon: AlertTriangle, label: 'Low Stocks', path: '/emr/pharmacy/stocks/low', badge: '8' },
        { icon: CalendarClock, label: 'Expired Drugs', path: '/emr/pharmacy/drugs/expired', badge: '3' },
        { icon: FileSpreadsheet, label: 'Sales Report', path: '/emr/pharmacy/reports/sales' },
        { icon: Receipt, label: 'Invoice Report', path: '/emr/pharmacy/reports/invoices' },
      ],
    },
  ],
};

// Nurse Sidebar
export const nurseSidebarConfig: SidebarConfig = {
  sections: [
    {
      title: 'Main Menu',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/emr/nurse/dashboard' },
        { icon: Calendar, label: 'Appointments', path: '/emr/nurse/appointments' },
        {
          icon: Users,
          label: 'Patients',
          children: [
            { label: 'All Patients', path: '/emr/nurse/patients', icon: Users },
            { label: 'IPD Patients', path: '/emr/nurse/patients/ipd', icon: Bed },
            { label: 'OPD Patients', path: '/emr/nurse/patients/opd', icon: Stethoscope },
          ],
        },
        { icon: UserPlus, label: 'Admission Requests', path: '/emr/nurse/admissions', badge: '5' },
        { icon: Activity, label: 'Refer Requests', path: '/emr/nurse/referrals' },
        { icon: Syringe, label: 'Surgery Requests', path: '/emr/nurse/surgeries' },
      ],
    },
  ],
};

// Get sidebar config based on role
export function getSidebarConfig(role: UserRole): SidebarConfig {
  const configMap: Record<UserRole, SidebarConfig> = {
    'Super Admin': adminSidebarConfig,
    'Reception': receptionSidebarConfig,
    'Cashier': cashierSidebarConfig,
    'Doctor': doctorSidebarConfig,
    'Laboratory': laboratorySidebarConfig,
    'Pharmacy': pharmacySidebarConfig,
    'Nurse': nurseSidebarConfig,
  };
  return configMap[role] || adminSidebarConfig;
}