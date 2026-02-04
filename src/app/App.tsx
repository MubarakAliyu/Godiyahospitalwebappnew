import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/app/components/ui/sonner';
import { Navbar } from '@/app/components/navbar';
import { Footer } from '@/app/components/footer';
import { HomePage } from '@/app/pages/home';
import { AboutPage } from '@/app/pages/about';
import { ServicesPage } from '@/app/pages/services';
import { DoctorsPage } from '@/app/pages/doctors';
import { ContactPage } from '@/app/pages/contact';
import { EmrLoginPage } from '@/app/pages/emr-login';
import { ErrorBoundary } from '@/app/error-boundary';

// EMR Application Imports
import { EMRLoginPage } from '@/app/emr/auth/login';
import { ForgotPasswordPage } from '@/app/emr/auth/forgot-password';
import { DashboardLayout } from '@/app/emr/dashboard/layout';
import { DashboardHomeV2 as DashboardHome } from '@/app/emr/dashboard/home-v2';
import { EMRStoreProvider } from '@/app/emr/store/emr-store';
import { PatientRedirect } from '@/app/emr/components/patient-redirect';

// Role-Based Dashboards
import { RoleDashboardLayout } from '@/app/emr/layouts/role-dashboard-layout';
import { ReceptionDashboardHome } from '@/app/emr/dashboards/reception/home';
import { ReceptionSettings } from '@/app/emr/dashboards/reception/settings';
import { CashierDashboardHome } from '@/app/emr/dashboards/cashier/home';
import { CashierSettings } from '@/app/emr/dashboards/cashier/settings';
import { DoctorDashboardHome } from '@/app/emr/dashboards/doctor/home';
import { DoctorSettings } from '@/app/emr/dashboards/doctor/settings';
import { LaboratoryDashboardHome } from '@/app/emr/dashboards/laboratory/home';
import { LaboratorySettings } from '@/app/emr/dashboards/laboratory/settings';
import { PharmacyDashboardHome } from '@/app/emr/dashboards/pharmacy/home';
import { PharmacySettings } from '@/app/emr/dashboards/pharmacy/settings';
import { NurseDashboardHome } from '@/app/emr/dashboards/nurse/home';
import { NurseSettings } from '@/app/emr/dashboards/nurse/settings';
import { ComingSoon } from '@/app/emr/components/coming-soon';

// Patient Management Modules
import AllPatientsPage from '@/app/emr/modules/patients';
import { InpatientPage } from '@/app/emr/modules/patients/inpatient';
import { OutpatientPage } from '@/app/emr/modules/patients/outpatient';
import { ERPatientsPage } from '@/app/emr/modules/patients/er';
import { ICUPatientsPage } from '@/app/emr/modules/patients/icu';
import { COPDPatientsPage } from '@/app/emr/modules/patients/copd';
import { PatientFilePage } from '@/app/emr/modules/patients/patient-file';

// Core Modules
import { StaffsPage } from '@/app/emr/modules/staffs';
import { DepartmentsPage } from '@/app/emr/modules/departments';
import { FinancePage } from '@/app/emr/modules/finance';
import { CMSPage } from '@/app/emr/modules/cms';
import AppointmentsPage from '@/app/emr/modules/appointments';
import { DoctorsPage as DoctorsManagementPage } from '@/app/emr/modules/doctors';
import { NurseDeskPage } from '@/app/emr/modules/nurse-desk';
import { RoomsPage } from '@/app/emr/modules/rooms';
import { BillingPage } from '@/app/emr/modules/billing';
import { PharmacyPage } from '@/app/emr/modules/pharmacy';
import { LaboratoryPage } from '@/app/emr/modules/laboratory';
import { ReportsPage } from '@/app/emr/modules/reports';

// Administration Modules
import { RolesPermissionsPage } from '@/app/emr/modules/admin/roles';
import { UserManagementPage } from '@/app/emr/modules/admin/users';
import { AuditLogsPage } from '@/app/emr/modules/admin/audit';

// Settings & Notifications
import { SettingsPage } from '@/app/emr/modules/settings';
import { NotificationsPage } from '@/app/emr/modules/notifications';

import { Users, Bed, Stethoscope, Calendar, Receipt, FlaskConical, Pill, DollarSign, FileText, Clock, CheckCircle2, UserPlus, Folder, AlertTriangle, CalendarClock, Activity, Syringe } from 'lucide-react';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Hospital Website Routes */}
          <Route path="/" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <HomePage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/about" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <AboutPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/services" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <ServicesPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/doctors" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <DoctorsPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/contact" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <ContactPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/emr-login" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <EmrLoginPage />
              </main>
              <Footer />
            </div>
          } />

          {/* EMR Application Routes */}
          <Route path="/emr/login" element={<EMRLoginPage />} />
          <Route path="/emr/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Redirect old patient routes to new structure */}
          <Route path="/emr/patients/:fileNo" element={<PatientRedirect />} />
          <Route path="/emr/patients/file/:fileNo" element={<PatientRedirect />} />
          
          {/* EMR Dashboard Routes - Wrapped with Store Provider */}
          <Route path="/emr/dashboard" element={
            <EMRStoreProvider>
              <DashboardLayout />
            </EMRStoreProvider>
          }>
            <Route index element={<DashboardHome />} />
            
            {/* Core Modules */}
            <Route path="staffs" element={<StaffsPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="cms" element={<CMSPage />} />
            
            {/* Patient Management */}
            <Route path="patients" element={<AllPatientsPage />} />
            <Route path="patients/inpatient" element={<InpatientPage />} />
            <Route path="patients/outpatient" element={<OutpatientPage />} />
            <Route path="patients/er" element={<ERPatientsPage />} />
            <Route path="patients/icu" element={<ICUPatientsPage />} />
            <Route path="patients/copd" element={<COPDPatientsPage />} />
            <Route path="patients/:fileNo" element={<PatientFilePage />} />
            
            {/* Other Modules */}
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="doctors" element={<DoctorsManagementPage />} />
            <Route path="nurse-desk" element={<NurseDeskPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="pharmacy" element={<PharmacyPage />} />
            <Route path="laboratory" element={<LaboratoryPage />} />
            <Route path="reports" element={<ReportsPage />} />
            
            {/* Administration */}
            <Route path="admin/roles" element={<RolesPermissionsPage />} />
            <Route path="admin/users" element={<UserManagementPage />} />
            <Route path="admin/audit" element={<AuditLogsPage />} />
            
            {/* Settings & Notifications */}
            <Route path="settings" element={<SettingsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Role-Based Dashboard Routes */}
          
          {/* Reception Dashboard */}
          <Route path="/emr/reception" element={
            <EMRStoreProvider>
              <RoleDashboardLayout />
            </EMRStoreProvider>
          }>
            <Route path="dashboard" element={<ReceptionDashboardHome />} />
            <Route path="settings" element={<ReceptionSettings />} />
            <Route path="patients" element={<ComingSoon icon={Users} title="All Patients" />} />
            <Route path="patients/ipd" element={<ComingSoon icon={Bed} title="IPD Patients" />} />
            <Route path="patients/opd" element={<ComingSoon icon={Stethoscope} title="OPD Patients" />} />
            <Route path="appointments" element={<AppointmentsPage />} />
          </Route>

          {/* Cashier Dashboard */}
          <Route path="/emr/cashier" element={
            <EMRStoreProvider>
              <RoleDashboardLayout />
            </EMRStoreProvider>
          }>
            <Route path="dashboard" element={<CashierDashboardHome />} />
            <Route path="settings" element={<CashierSettings />} />
            <Route path="payments" element={<ComingSoon icon={Receipt} title="File Payments" />} />
            <Route path="consultations" element={<ComingSoon icon={Stethoscope} title="Consultations" />} />
            <Route path="laboratory" element={<ComingSoon icon={FlaskConical} title="Laboratory" />} />
            <Route path="pharmacy" element={<ComingSoon icon={Pill} title="Pharmacy" />} />
            <Route path="bed-admission" element={<ComingSoon icon={Bed} title="Bed Admission" />} />
            <Route path="admission-charges" element={<ComingSoon icon={DollarSign} title="Admission Charges" />} />
            <Route path="reports" element={<ComingSoon icon={FileText} title="Reports" />} />
          </Route>

          {/* Doctor Dashboard */}
          <Route path="/emr/doctor" element={
            <EMRStoreProvider>
              <RoleDashboardLayout />
            </EMRStoreProvider>
          }>
            <Route path="dashboard" element={<DoctorDashboardHome />} />
            <Route path="settings" element={<DoctorSettings />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="patients/opd" element={<ComingSoon icon={Stethoscope} title="OPD Patients" />} />
            <Route path="patients/ipd" element={<ComingSoon icon={Bed} title="IPD Patients" />} />
          </Route>

          {/* Laboratory Dashboard */}
          <Route path="/emr/laboratory" element={
            <EMRStoreProvider>
              <RoleDashboardLayout />
            </EMRStoreProvider>
          }>
            <Route path="dashboard" element={<LaboratoryDashboardHome />} />
            <Route path="settings" element={<LaboratorySettings />} />
            <Route path="tests" element={<ComingSoon icon={FlaskConical} title="All Lab Tests" />} />
            <Route path="tests/pending" element={<ComingSoon icon={Clock} title="Pending Tests" />} />
            <Route path="tests/paid" element={<ComingSoon icon={CheckCircle2} title="Paid Tests" />} />
            <Route path="invoice/add" element={<ComingSoon icon={UserPlus} title="Add Invoice" />} />
            <Route path="invoices" element={<ComingSoon icon={Folder} title="Invoice Records" />} />
            <Route path="reports" element={<ComingSoon icon={FileText} title="Finance Report" />} />
          </Route>

          {/* Pharmacy Dashboard */}
          <Route path="/emr/pharmacy" element={
            <EMRStoreProvider>
              <RoleDashboardLayout />
            </EMRStoreProvider>
          }>
            <Route path="dashboard" element={<PharmacyDashboardHome />} />
            <Route path="settings" element={<PharmacySettings />} />
            <Route path="sales/add" element={<ComingSoon icon={DollarSign} title="Add Sales" />} />
            <Route path="drugs" element={<ComingSoon icon={Pill} title="Drugs" />} />
            <Route path="prescriptions/pending" element={<ComingSoon icon={Clock} title="Pending Prescriptions" />} />
            <Route path="prescriptions/paid" element={<ComingSoon icon={CheckCircle2} title="Paid Prescriptions" />} />
            <Route path="stocks/low" element={<ComingSoon icon={AlertTriangle} title="Low Stocks" />} />
            <Route path="drugs/expired" element={<ComingSoon icon={CalendarClock} title="Expired Drugs" />} />
            <Route path="reports/sales" element={<ComingSoon icon={FileText} title="Sales Report" />} />
            <Route path="reports/invoices" element={<ComingSoon icon={Receipt} title="Invoice Report" />} />
          </Route>

          {/* Nurse Dashboard */}
          <Route path="/emr/nurse" element={
            <EMRStoreProvider>
              <RoleDashboardLayout />
            </EMRStoreProvider>
          }>
            <Route path="dashboard" element={<NurseDashboardHome />} />
            <Route path="settings" element={<NurseSettings />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="patients" element={<ComingSoon icon={Users} title="All Patients" />} />
            <Route path="patients/ipd" element={<ComingSoon icon={Bed} title="IPD Patients" />} />
            <Route path="patients/opd" element={<ComingSoon icon={Stethoscope} title="OPD Patients" />} />
            <Route path="admissions" element={<ComingSoon icon={UserPlus} title="Admission Requests" />} />
            <Route path="referrals" element={<ComingSoon icon={Activity} title="Refer Requests" />} />
            <Route path="surgeries" element={<ComingSoon icon={Syringe} title="Surgery Requests" />} />
          </Route>
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;