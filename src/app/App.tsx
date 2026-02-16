import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';

// Store
import { EMRStoreProvider } from './emr/store/emr-store';

// Public Website Pages
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { HomePage } from './pages/home';
import { AboutPage } from './pages/about';
import { ServicesPage } from './pages/services';
import { DoctorsPage } from './pages/doctors';
import { ContactPage } from './pages/contact';
import { EmrLoginPage } from './pages/emr-login';

// EMR Authentication Pages
import { EMRLoginPage } from './emr/auth/login';
import { ForgotPasswordPage } from './emr/auth/forgot-password';

// Super Admin Dashboard
import { DashboardLayout } from './emr/dashboard/layout';
import { DashboardHome } from './emr/dashboard/home';
import { AllPatientsPage } from './emr/modules/patients/all-patients';
import { InpatientPage } from './emr/modules/patients/inpatient';
import { OutpatientPage } from './emr/modules/patients/outpatient';
import { ERPatientsPage } from './emr/modules/patients/er';
import { ICUPatientsPage } from './emr/modules/patients/icu';
import { COPDPatientsPage } from './emr/modules/patients/copd';
import { PatientFilePage } from './emr/modules/patients/patient-file';
import { BillingPage } from './emr/modules/billing';
import { FinancePage } from './emr/modules/finance';
import { AppointmentsPage } from './emr/modules/appointments';
import { LaboratoryPage } from './emr/modules/laboratory';
import { PharmacyPage } from './emr/modules/pharmacy';
import { ReportsPage } from './emr/modules/reports';
import { UserManagementPage } from './emr/modules/admin/users';
import { RolesPermissionsPage } from './emr/modules/admin/roles';
import { AuditLogsPage } from './emr/modules/admin/audit';
import { NotificationsPage } from './emr/modules/notifications';
import { SettingsPage } from './emr/modules/settings';
import { StaffsPage } from './emr/modules/staffs';
import { DepartmentsPage } from './emr/modules/departments';
import { AttendancePage } from './emr/modules/attendance';
import { RoomsPage } from './emr/modules/rooms/index';

// Reception Dashboard
import { RoleDashboardLayout } from './emr/layouts/role-dashboard-layout';
import { ReceptionDashboardHome } from './emr/dashboards/reception/home';
import { ReceptionSettings } from './emr/dashboards/reception/settings';
import { ReceptionAllPatientsPage } from './emr/dashboards/reception/all-patients';
import { ReceptionIPDPatientsPage } from './emr/dashboards/reception/ipd-patients';
import { ReceptionOPDPatientsPage } from './emr/dashboards/reception/opd-patients';
import { ReceptionPatientFilePage } from './emr/dashboards/reception/patient-file';
import { ReceptionAppointmentsPage } from './emr/dashboards/reception/appointments';

// Cashier Dashboard
import { CashierDashboardHome } from './emr/dashboards/cashier/home';
import { CashierSettings } from './emr/dashboards/cashier/settings';
import { CashierFilePaymentsPage } from './emr/dashboards/cashier/file-payments';
import { CashierConsultationsPage } from './emr/dashboards/cashier/consultations';
import { CashierLaboratoryPage } from './emr/dashboards/cashier/laboratory';
import { CashierPharmacyPage } from './emr/dashboards/cashier/pharmacy';
import { CashierBedAdmissionPage } from './emr/dashboards/cashier/bed-admission';
import { CashierAdmissionChargesPage } from './emr/dashboards/cashier/admission-charges';
import { CashierReportsPage } from './emr/dashboards/cashier/reports';

// Doctor Dashboard
import { DoctorAppointmentsPage } from './emr/dashboards/doctor/appointments';
import { DoctorOPDPatientsPage } from './emr/dashboards/doctor/patients-opd';
import { DoctorIPDPatientsPage } from './emr/dashboards/doctor/patients-ipd';
import { DoctorPatientFilePage } from './emr/dashboards/doctor/patient-file';
import { DoctorIPDPatientFilePage } from './emr/dashboards/doctor/ipd-patient-file';
import { DoctorConsultationPage } from './emr/dashboards/doctor/consultation';
import { DoctorPatientFullFilePage } from './emr/dashboards/doctor/patient-full-file';
import { DoctorDashboardHome } from './emr/dashboards/doctor/home';
import { DoctorSettings } from './emr/dashboards/doctor/settings';

// Laboratory Dashboard
import { LaboratoryDashboardHome } from './emr/dashboards/laboratory/home';
import { LaboratorySettings } from './emr/dashboards/laboratory/settings';
import { AllLabTests } from './emr/dashboards/laboratory/all-lab-tests';
import { PendingLabTests } from './emr/dashboards/laboratory/pending-lab-tests';
import { PaidLabTests } from './emr/dashboards/laboratory/paid-lab-tests';
import { AddInvoice } from './emr/dashboards/laboratory/add-invoice';
import { InvoiceRecords } from './emr/dashboards/laboratory/invoice-records';
import { FinanceReport } from './emr/dashboards/laboratory/finance-report';

// Pharmacy Dashboard
import { PharmacyDashboardHome } from './emr/dashboards/pharmacy/home';
import { PharmacySettings } from './emr/dashboards/pharmacy/settings';
import { AddSales } from './emr/dashboards/pharmacy/add-sales';
import { DrugsPanel } from './emr/dashboards/pharmacy/drugs';
import { PendingPrescriptionsPanel } from './emr/dashboards/pharmacy/pending-prescriptions';
import { PaidPrescriptionsPanel } from './emr/dashboards/pharmacy/paid-prescriptions';
import { LowStocksPanel } from './emr/dashboards/pharmacy/low-stocks';
import { ExpiredDrugsPanel } from './emr/dashboards/pharmacy/expired-drugs';
import { SalesReportPanel } from './emr/dashboards/pharmacy/sales-report';
import { InvoiceReportPanel } from './emr/dashboards/pharmacy/invoice-report';

// Nurse Dashboard
import { NurseDashboardHome } from './emr/dashboards/nurse/home';
import { NurseSettings } from './emr/dashboards/nurse/settings';
import { NurseAppointmentsPage } from './emr/dashboards/nurse/appointments';
import { NursePatients } from './emr/dashboards/nurse/patients';
import { NurseIPDPatients } from './emr/dashboards/nurse/patients-ipd';
import { NurseOPDPatients } from './emr/dashboards/nurse/patients-opd';
import { NurseAdmissions } from './emr/dashboards/nurse/admissions';
import { NurseReferrals } from './emr/dashboards/nurse/referrals';
import { NurseSurgeries } from './emr/dashboards/nurse/surgeries';
import { NursePatientFilePage } from './emr/dashboards/nurse/patient-file';
import { NursePatientFullFilePage } from './emr/dashboards/nurse/patient-full-file';

// Shared Notifications Page
import { NotificationsPage as RoleNotificationsPage } from './emr/pages/notifications-page';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <EMRStoreProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Routes>
            {/* Public Hospital Website Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <HomePage />
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navbar />
                <AboutPage />
                <Footer />
              </>
            } />
            <Route path="/services" element={
              <>
                <Navbar />
                <ServicesPage />
                <Footer />
              </>
            } />
            <Route path="/doctors" element={
              <>
                <Navbar />
                <DoctorsPage />
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <ContactPage />
                <Footer />
              </>
            } />
            <Route path="/emr-login" element={
              <>
                <Navbar />
                <EmrLoginPage />
                <Footer />
              </>
            } />

            {/* EMR Authentication Routes */}
            <Route path="/login" element={<Navigate to="/emr/login" replace />} />
            <Route path="/emr/login" element={<EMRLoginPage />} />
            <Route path="/emr/forgot-password" element={<ForgotPasswordPage />} />

            {/* Super Admin Dashboard Routes */}
            <Route path="/emr/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              
              {/* Patient Management */}
              <Route path="patients" element={<AllPatientsPage />} />
              <Route path="patients/all" element={<AllPatientsPage />} />
              <Route path="patients/inpatient" element={<InpatientPage />} />
              <Route path="patients/outpatient" element={<OutpatientPage />} />
              <Route path="patients/er" element={<ERPatientsPage />} />
              <Route path="patients/icu" element={<ICUPatientsPage />} />
              <Route path="patients/copd" element={<COPDPatientsPage />} />
              <Route path="patients/:patientId" element={<PatientFilePage />} />
              <Route path="patients/:patientId/file" element={<PatientFilePage />} />

              {/* Other Modules */}
              <Route path="billing" element={<BillingPage />} />
              <Route path="finance" element={<FinancePage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              
              {/* Laboratory */}
              <Route path="laboratory" element={<LaboratoryPage />} />
              
              {/* Pharmacy */}
              <Route path="pharmacy" element={<PharmacyPage />} />
              
              {/* Reports */}
              <Route path="reports" element={<ReportsPage />} />
              
              {/* Administration */}
              <Route path="administration" element={<UserManagementPage />} />
              <Route path="administration/roles" element={<RolesPermissionsPage />} />
              <Route path="administration/audit-logs" element={<AuditLogsPage />} />
              
              {/* Notifications */}
              <Route path="notifications" element={<NotificationsPage />} />
              
              {/* Settings */}
              <Route path="settings" element={<SettingsPage />} />
              
              {/* Staff Management */}
              <Route path="staffs" element={<StaffsPage />} />
              
              {/* Department Management */}
              <Route path="departments" element={<DepartmentsPage />} />
              
              {/* Attendance / Staff Attendance (CMS) */}
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="cms" element={<AttendancePage />} />
              
              {/* Rooms */}
              <Route path="rooms" element={<RoomsPage />} />
            </Route>

            {/* Reception Dashboard Routes */}
            <Route path="/emr/reception" element={<RoleDashboardLayout role="reception" />}>
              <Route index element={<ReceptionDashboardHome />} />
              <Route path="dashboard" element={<ReceptionDashboardHome />} />
              <Route path="patients" element={<ReceptionAllPatientsPage />} />
              <Route path="patients/all" element={<ReceptionAllPatientsPage />} />
              <Route path="patients/ipd" element={<ReceptionIPDPatientsPage />} />
              <Route path="patients/opd" element={<ReceptionOPDPatientsPage />} />
              <Route path="patients/:patientId" element={<ReceptionPatientFilePage />} />
              <Route path="patients/:patientId/file" element={<ReceptionPatientFilePage />} />
              <Route path="appointments" element={<ReceptionAppointmentsPage />} />
              <Route path="notifications" element={<RoleNotificationsPage />} />
              <Route path="settings" element={<ReceptionSettings />} />
            </Route>

            {/* Cashier Dashboard Routes */}
            <Route path="/emr/cashier" element={<RoleDashboardLayout role="cashier" />}>
              <Route index element={<CashierDashboardHome />} />
              <Route path="dashboard" element={<CashierDashboardHome />} />
              <Route path="settings" element={<CashierSettings />} />
              <Route path="payments" element={<CashierFilePaymentsPage />} />
              <Route path="consultations" element={<CashierConsultationsPage />} />
              <Route path="laboratory" element={<CashierLaboratoryPage />} />
              <Route path="pharmacy" element={<CashierPharmacyPage />} />
              <Route path="bed-admission" element={<CashierBedAdmissionPage />} />
              <Route path="admission-charges" element={<CashierAdmissionChargesPage />} />
              <Route path="reports" element={<CashierReportsPage />} />
              <Route path="notifications" element={<RoleNotificationsPage />} />
            </Route>

            {/* Doctor Dashboard Routes */}
            <Route path="/emr/doctor" element={<RoleDashboardLayout role="doctor" />}>
              <Route index element={<DoctorDashboardHome />} />
              <Route path="dashboard" element={<DoctorDashboardHome />} />
              <Route path="settings" element={<DoctorSettings />} />
              <Route path="appointments" element={<DoctorAppointmentsPage />} />
              <Route path="patients" element={<Navigate to="/emr/doctor/patients/opd" replace />} />
              <Route path="patients/opd" element={<DoctorOPDPatientsPage />} />
              <Route path="patients/ipd" element={<DoctorIPDPatientsPage />} />
              <Route path="patients/:patientId" element={<DoctorPatientFilePage />} />
              <Route path="patients/:patientId/file" element={<DoctorPatientFilePage />} />
              <Route path="patients/:patientId/consultation" element={<DoctorConsultationPage />} />
              <Route path="patients/:patientId/ipd-file" element={<DoctorIPDPatientFilePage />} />
              <Route path="patients/:patientId/full-file" element={<DoctorPatientFullFilePage />} />
              <Route path="notifications" element={<RoleNotificationsPage />} />
            </Route>

            {/* Laboratory Dashboard Routes */}
            <Route path="/emr/laboratory-staff" element={<RoleDashboardLayout role="laboratory" />}>
              <Route index element={<LaboratoryDashboardHome />} />
              <Route path="dashboard" element={<LaboratoryDashboardHome />} />
              <Route path="settings" element={<LaboratorySettings />} />
              <Route path="notifications" element={<RoleNotificationsPage />} />
              <Route path="all-lab-tests" element={<AllLabTests />} />
              <Route path="pending-tests" element={<PendingLabTests />} />
              <Route path="paid-tests" element={<PaidLabTests />} />
              <Route path="add-invoice" element={<AddInvoice />} />
              <Route path="invoice-records" element={<InvoiceRecords />} />
              <Route path="finance-report" element={<FinanceReport />} />
            </Route>

            {/* Pharmacy Dashboard Routes */}
            <Route path="/emr/pharmacy-staff" element={<RoleDashboardLayout role="pharmacy" />}>
              <Route index element={<PharmacyDashboardHome />} />
              <Route path="dashboard" element={<PharmacyDashboardHome />} />
              <Route path="settings" element={<PharmacySettings />} />
              <Route path="notifications" element={<RoleNotificationsPage />} />
              <Route path="add-sales" element={<AddSales />} />
              <Route path="drugs" element={<DrugsPanel />} />
              <Route path="pending-prescriptions" element={<PendingPrescriptionsPanel />} />
              <Route path="paid-prescriptions" element={<PaidPrescriptionsPanel />} />
              <Route path="low-stocks" element={<LowStocksPanel />} />
              <Route path="expired-drugs" element={<ExpiredDrugsPanel />} />
              <Route path="sales-report" element={<SalesReportPanel />} />
              <Route path="invoice-report" element={<InvoiceReportPanel />} />
            </Route>

            {/* Nurse Dashboard Routes */}
            <Route path="/emr/nurse" element={<RoleDashboardLayout role="nurse" />}>
              <Route index element={<NurseDashboardHome />} />
              <Route path="dashboard" element={<NurseDashboardHome />} />
              <Route path="settings" element={<NurseSettings />} />
              <Route path="appointments" element={<NurseAppointmentsPage />} />
              <Route path="patients" element={<NursePatients />} />
              <Route path="patients/ipd" element={<NurseIPDPatients />} />
              <Route path="patients/opd" element={<NurseOPDPatients />} />
              <Route path="admissions" element={<NurseAdmissions />} />
              <Route path="referrals" element={<NurseReferrals />} />
              <Route path="surgeries" element={<NurseSurgeries />} />
              <Route path="patients/:patientId" element={<NursePatientFilePage />} />
              <Route path="patients/:patientId/file" element={<NursePatientFilePage />} />
              <Route path="patients/:patientId/full-file" element={<NursePatientFullFilePage />} />
              <Route path="notifications" element={<RoleNotificationsPage />} />
            </Route>

            {/* Catch-all route for unmatched paths */}
            <Route path="*" element={<Navigate to="/emr/login" replace />} />
          </Routes>
        </BrowserRouter>
      </EMRStoreProvider>
    </ErrorBoundary>
  );
}