import { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { EMRSidebar } from '../components/emr-sidebar';
import { EMRHeader } from '../components/emr-header';

// Helper to generate breadcrumbs from path
function getBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Dashboard', path: '/emr/dashboard' }];

  // Map paths to readable labels
  const pathMap: Record<string, string> = {
    'staffs': 'Staffs Management',
    'departments': 'Departments',
    'finance': 'Finance',
    'cms': 'Staff Attendance Analytics',
    'patients': 'Patient Management',
    'inpatient': 'Inpatient',
    'outpatient': 'Outpatient',
    'er': 'ER Patients',
    'icu': 'ICU Patients',
    'copd': 'COPD Patients',
    'appointments': 'Appointments',
    'doctors': 'Doctors Management',
    'nurse-desk': 'Nurse Desk',
    'rooms': 'Hospital Bed',
    'billing': 'Billing & Payments',
    'pharmacy': 'Pharmacy',
    'laboratory': 'Laboratory',
    'reports': 'Reports Center',
    'admin': 'Administration',
    'roles': 'Roles & Permissions',
    'users': 'User Management',
    'audit': 'Audit Logs',
    'settings': 'Settings',
    'notifications': 'Notifications Center',
  };

  // Build breadcrumb trail
  let currentPath = '';
  for (let i = 2; i < paths.length; i++) {
    currentPath += '/' + paths[i];
    const label = pathMap[paths[i]] || paths[i];
    breadcrumbs.push({
      label,
      path: `/emr/dashboard${currentPath}`,
    });
  }

  // If we're at the dashboard root, just show "Home"
  if (pathname === '/emr/dashboard') {
    return [{ label: 'Dashboard', path: '/emr/dashboard' }, { label: 'Home' }];
  }

  return breadcrumbs;
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('emr_auth');
    if (!auth) {
      navigate('/emr/login');
    }
  }, [navigate]);

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <EMRSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <EMRHeader breadcrumbs={breadcrumbs} />
        
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}