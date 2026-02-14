import { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { RoleBasedSidebar } from '@/app/emr/components/role-based-sidebar';
import { EMRHeader } from '@/app/emr/components/emr-header';
import { getCurrentUser } from '@/app/emr/utils/auth';
import { useEMRStore } from '@/app/emr/store/emr-store';

// Helper to generate breadcrumbs from path
function getBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Dashboard', path: pathname.split('/').slice(0, 4).join('/') }];

  const pathMap: Record<string, string> = {
    'reception': 'Reception',
    'cashier': 'Cashier',
    'doctor': 'Doctor',
    'laboratory': 'Laboratory',
    'pharmacy': 'Pharmacy',
    'nurse': 'Nurse',
    'dashboard': 'Home',
    'patients': 'Patients',
    'appointments': 'Appointments',
    'payments': 'Payments',
    'consultations': 'Consultations',
    'tests': 'Tests',
    'drugs': 'Drugs',
    'prescriptions': 'Prescriptions',
    'admissions': 'Admissions',
    'referrals': 'Referrals',
    'surgeries': 'Surgeries',
    'ipd': 'IPD',
    'opd': 'OPD',
    'settings': 'Settings',
    'notifications': 'Notifications',
  };

  let currentPath = '';
  for (let i = 2; i < paths.length; i++) {
    currentPath += '/' + paths[i];
    const label = pathMap[paths[i]] || paths[i];
    if (i > 2 || paths[i] !== 'dashboard') {
      breadcrumbs.push({
        label,
        path: `/${paths.slice(0, i + 1).join('/')}`,
      });
    }
  }

  return breadcrumbs;
}

export function RoleDashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { recordStaffLogin, recordStaffLogout } = useEMRStore();

  useEffect(() => {
    const auth = getCurrentUser();
    if (!auth) {
      navigate('/emr/login');
      return;
    }

    // Check if we've already recorded login for this session
    const sessionKey = `attendance_logged_${auth.staffId}_${new Date().toISOString().split('T')[0]}`;
    const alreadyLogged = sessionStorage.getItem(sessionKey);

    // Only record login ONCE per browser session
    if (auth.staffId && !alreadyLogged) {
      recordStaffLogin(auth.staffId);
      // Mark as logged for this session
      sessionStorage.setItem(sessionKey, 'true');
    }

    // Record logout only when user closes browser/tab
    const handleBeforeUnload = () => {
      if (auth.staffId) {
        recordStaffLogout(auth.staffId);
        // Clear the session flag so next login will be recorded
        sessionStorage.removeItem(sessionKey);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup - only remove event listener, DON'T record logout on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]); // Only depend on navigate, not the record functions

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <RoleBasedSidebar />
      
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