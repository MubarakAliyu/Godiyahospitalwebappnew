import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, Appointment, Invoice, Notification, ActivityLog, Doctor, Staff, Department, StaffAttendance, AttendanceStatus, BedCategory, HospitalSettings, AttendanceSession } from './types';
import { seedPatients, seedAppointments, seedInvoices, seedDoctors, seedStaff, seedDepartments, seedBedCategories } from './seed-data';
import { seedNotifications } from './seed-notifications';

interface EMRStoreContextType {
  // Data
  patients: Patient[];
  appointments: Appointment[];
  invoices: Invoice[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  doctors: Doctor[];
  staff: Staff[];
  departments: Department[];
  staffAttendance: StaffAttendance[];
  bedCategories: BedCategory[];
  settings: HospitalSettings;
  cashierPIN: string | null;

  // Actions
  addPatient: (patient: Omit<Patient, 'id' | 'fullName' | 'age' | 'dateRegistered'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string, reason: string) => void;
  markPatientAsDeceased: (id: string, dateOfDeath: string, causeOfDeath: string, remarks: string) => void;
  
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  
  addInvoice: (invoice: Omit<Invoice, 'id' | 'receiptId' | 'dateCreated'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'unread'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  deleteNotification: (id: string) => void;
  
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  
  // Staff Actions
  addStaff: (staff: Omit<Staff, 'id' | 'fullName'>) => Staff;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Department Actions
  addDepartment: (department: Omit<Department, 'id' | 'dateCreated' | 'lastUpdated'>) => Department;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // Staff Attendance Actions
  addStaffAttendance: (attendance: Omit<StaffAttendance, 'id'>) => StaffAttendance;
  updateStaffAttendance: (id: string, updates: Partial<StaffAttendance>) => void;
  deleteStaffAttendance: (id: string) => void;
  recordStaffLogin: (staffId: string) => void; // New: Record staff login with session tracking
  recordStaffLogout: (staffId: string) => void; // New: Record staff logout with session tracking
  getTodayAttendance: () => StaffAttendance[]; // New: Get today's attendance

  // Bed Management Actions
  addBedCategory: (bedCategory: Omit<BedCategory, 'id' | 'dateCreated' | 'lastUpdated' | 'availableBeds'>) => BedCategory;
  updateBedCategory: (id: string, updates: Partial<BedCategory>) => void;
  deleteBedCategory: (id: string) => void;

  // Settings Actions
  updateSettings: (settings: Partial<HospitalSettings>) => void;
  
  // Cashier PIN Actions
  setCashierPIN: (pin: string) => void;
}

const EMRStoreContext = createContext<EMRStoreContextType | undefined>(undefined);

export function EMRStoreProvider({ children }: { children: ReactNode }) {
  // Initialize state with error handling
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      return seedPatients;
    } catch (error) {
      console.error('Error loading seed patients:', error);
      return [];
    }
  });
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      return seedAppointments;
    } catch (error) {
      console.error('Error loading seed appointments:', error);
      return [];
    }
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      return seedInvoices;
    } catch (error) {
      console.error('Error loading seed invoices:', error);
      return [];
    }
  });
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const doctors = seedDoctors;
  const [staff, setStaff] = useState<Staff[]>(() => {
    try {
      return seedStaff;
    } catch (error) {
      console.error('Error loading seed staff:', error);
      return [];
    }
  });
  const [departments, setDepartments] = useState<Department[]>(() => {
    try {
      return seedDepartments;
    } catch (error) {
      console.error('Error loading seed departments:', error);
      return [];
    }
  });
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>([]);
  const [bedCategories, setBedCategories] = useState<BedCategory[]>(() => {
    try {
      return seedBedCategories;
    } catch (error) {
      console.error('Error loading seed bed categories:', error);
      return [];
    }
  });
  const [settings, setSettings] = useState<HospitalSettings>({
    hospitalName: 'General Hospital',
    hospitalAddress: '123 Hospital Road, City, Country',
    hospitalPhone: '+1234567890',
    hospitalEmail: 'info@hospital.com',
    hospitalLogo: 'https://via.placeholder.com/150',
  });
  const [cashierPIN, setCashierPINState] = useState<string | null>(null);

  // Counters for ID generation to prevent duplicates
  let notificationCounter = 0;
  let activityLogCounter = 0;

  // Helper to calculate age
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Generate ID
  const generatePatientId = () => {
    const lastId = patients.length > 0 
      ? parseInt(patients[patients.length - 1].id.split('-')[2]) 
      : 0;
    return `GH-PT-${String(lastId + 1).padStart(5, '0')}`;
  };

  const generateAppointmentId = () => {
    const lastId = appointments.length > 0 
      ? parseInt(appointments[appointments.length - 1].id.split('-')[2]) 
      : 0;
    return `GH-AP-${String(lastId + 1).padStart(4, '0')}`;
  };

  const generateInvoiceId = () => {
    const lastId = invoices.length > 0 
      ? parseInt(invoices[invoices.length - 1].id.split('-')[1]) 
      : 0;
    return `INV-${String(lastId + 1).padStart(3, '0')}`;
  };

  const generateReceiptId = () => {
    const lastId = invoices.length > 0 
      ? parseInt(invoices[invoices.length - 1].receiptId.split('-')[2]) 
      : 0;
    return `GH-RC-${String(lastId + 1).padStart(4, '0')}`;
  };

  const generateStaffId = () => {
    const lastId = staff.length > 0 
      ? parseInt(staff[staff.length - 1].id.split('-')[2]) 
      : 0;
    return `GH-ST-${String(lastId + 1).padStart(3, '0')}`;
  };

  const generateDepartmentId = () => {
    const lastId = departments.length > 0 
      ? parseInt(departments[departments.length - 1].id.split('-')[2]) 
      : 0;
    return `GH-DEPT-${String(lastId + 1).padStart(3, '0')}`;
  };

  const generateStaffAttendanceId = () => {
    // Use current array length to get next ID
    const nextId = staffAttendance.length + 1;
    return `GH-ATT-${String(nextId).padStart(3, '0')}`;
  };

  const generateBedCategoryId = () => {
    const lastId = bedCategories.length > 0 
      ? parseInt(bedCategories[bedCategories.length - 1].id.split('-')[2]) 
      : 0;
    return `GH-BED-${String(lastId + 1).padStart(3, '0')}`;
  };

  // Patient Actions
  const addPatient = (patientData: Omit<Patient, 'id' | 'fullName' | 'age' | 'dateRegistered'>): Patient => {
    const newPatient: Patient = {
      ...patientData,
      id: generatePatientId(),
      fullName: `${patientData.firstName} ${patientData.lastName}`,
      age: calculateAge(patientData.dateOfBirth),
      dateRegistered: new Date().toISOString(),
    };
    
    setPatients(prev => [...prev, newPatient]);
    
    // Add notification
    addNotification({
      type: 'admin',
      icon: 'UserPlus',
      title: 'New Patient Registered',
      description: `Patient ${newPatient.fullName} (${newPatient.id}) has been registered`,
    });
    
    // Add activity log
    addActivityLog({
      action: `New patient registered: ${newPatient.fullName}`,
      module: 'Patients',
      user: 'Super Admin',
      icon: 'UserPlus',
    });
    
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates };
        if (updates.firstName || updates.lastName) {
          updated.fullName = `${updated.firstName} ${updated.lastName}`;
        }
        if (updates.dateOfBirth) {
          updated.age = calculateAge(updates.dateOfBirth);
        }
        
        // Add activity log for status changes
        if (updates.status && updates.status !== p.status) {
          addActivityLog({
            action: `Patient status updated: ${updated.fullName} - ${updates.status}`,
            module: 'Patients',
            user: 'Super Admin',
            icon: 'UserCheck',
          });
          
          addNotification({
            type: 'clinical',
            icon: 'UserCheck',
            title: 'Patient Status Updated',
            description: `${updated.fullName} status changed to ${updates.status}`,
          });
        }
        
        return updated;
      }
      return p;
    }));
  };

  const deletePatient = (id: string, reason: string) => {
    const patient = patients.find(p => p.id === id);
    if (patient) {
      setPatients(prev => prev.filter(p => p.id !== id));
      addActivityLog({
        action: `Patient removed: ${patient.fullName} - Reason: ${reason}`,
        module: 'Patients',
        user: 'Super Admin',
        icon: 'UserMinus',
      });
    }
  };

  const markPatientAsDeceased = (id: string, dateOfDeath: string, causeOfDeath: string, remarks: string) => {
    const patient = patients.find(p => p.id === id);
    if (patient) {
      setPatients(prev => prev.map(p => {
        if (p.id === id) {
          const updated = { 
            ...p, 
            isDead: true, 
            dateOfDeath, 
            causeOfDeath, 
            deathRemarks: remarks 
          };
          addActivityLog({
            action: `Patient marked as deceased: ${updated.fullName} - Date: ${dateOfDeath}, Cause: ${causeOfDeath}`,
            module: 'Patients',
            user: 'Super Admin',
            icon: 'UserX',
          });
          
          addNotification({
            type: 'clinical',
            icon: 'UserX',
            title: 'Patient Marked as Deceased',
            description: `${updated.fullName} marked as deceased on ${dateOfDeath}`,
          });
          return updated;
        }
        return p;
      }));
    }
  };

  // Appointment Actions
  const addAppointment = (appointmentData: Omit<Appointment, 'id'>): Appointment => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: generateAppointmentId(),
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    
    addNotification({
      type: 'clinical',
      icon: 'Calendar',
      title: 'New Appointment Created',
      description: `Appointment for ${newAppointment.patientName} scheduled with ${newAppointment.doctorName}`,
    });
    
    addActivityLog({
      action: `Appointment created for ${newAppointment.patientName}`,
      module: 'Appointments',
      user: 'Super Admin',
      icon: 'Calendar',
    });
    
    return newAppointment;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updates };
        
        // Add activity log for status changes
        if (updates.status && updates.status !== a.status) {
          addActivityLog({
            action: `Appointment ${updated.id} status: ${updates.status}`,
            module: 'Appointments',
            user: 'Super Admin',
            icon: 'Calendar',
          });
        }
        
        return updated;
      }
      return a;
    }));
  };

  const deleteAppointment = (id: string) => {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
      setAppointments(prev => prev.filter(a => a.id !== id));
      addActivityLog({
        action: `Appointment cancelled: ${appointment.patientName}`,
        module: 'Appointments',
        user: 'Super Admin',
        icon: 'Calendar',
      });
    }
  };

  // Invoice Actions
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'receiptId' | 'dateCreated'>): Invoice => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: generateInvoiceId(),
      receiptId: generateReceiptId(),
      dateCreated: new Date().toISOString(),
    };
    
    setInvoices(prev => [...prev, newInvoice]);
    
    addNotification({
      type: 'billing',
      icon: 'DollarSign',
      title: 'Invoice Generated',
      description: `Invoice ${newInvoice.receiptId} generated for ${newInvoice.patientName} - ₦${newInvoice.amount.toLocaleString()}`,
    });
    
    addActivityLog({
      action: `Invoice generated: ${newInvoice.receiptId} for ${newInvoice.patientName}`,
      module: 'Billing',
      user: 'Super Admin',
      icon: 'DollarSign',
    });
    
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => {
      if (i.id === id) {
        const updated = { ...i, ...updates };
        
        if (updates.paymentStatus && updates.paymentStatus !== i.paymentStatus) {
          addActivityLog({
            action: `Invoice ${updated.receiptId} payment status: ${updates.paymentStatus}`,
            module: 'Billing',
            user: 'Super Admin',
            icon: 'DollarSign',
          });
        }
        
        return updated;
      }
      return i;
    }));
  };

  // Notification Actions
  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'unread'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `NOTIF-${Date.now()}-${notificationCounter++}`,
      timestamp: new Date().toISOString(),
      unread: true,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Activity Log Actions
  const addActivityLog = (logData: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...logData,
      id: `LOG-${Date.now()}-${activityLogCounter++}`,
      timestamp: new Date().toISOString(),
    };
    
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  // Staff Actions
  const addStaff = (staffData: Omit<Staff, 'id' | 'fullName'>): Staff => {
    const fullName = staffData.middleName 
      ? `${staffData.firstName} ${staffData.middleName} ${staffData.lastName}`
      : `${staffData.firstName} ${staffData.lastName}`;
    
    const newStaff: Staff = {
      ...staffData,
      id: generateStaffId(),
      fullName,
    };
    
    setStaff(prev => [...prev, newStaff]);
    
    // Add notification
    addNotification({
      type: 'admin',
      icon: 'UserPlus',
      title: 'New Staff Registered',
      description: `Staff ${newStaff.fullName} (${newStaff.id}) has been registered`,
    });
    
    // Add activity log
    addActivityLog({
      action: `New staff registered: ${newStaff.fullName}`,
      module: 'Staff',
      user: 'Super Admin',
      icon: 'UserPlus',
    });
    
    return newStaff;
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates };
        if (updates.firstName || updates.middleName || updates.lastName) {
          const middleName = updates.middleName !== undefined ? updates.middleName : s.middleName;
          updated.fullName = middleName
            ? `${updated.firstName} ${middleName} ${updated.lastName}`
            : `${updated.firstName} ${updated.lastName}`;
        }
        
        // Add activity log for status changes
        if (updates.status && updates.status !== s.status) {
          addActivityLog({
            action: `Staff status updated: ${updated.fullName} - ${updates.status}`,
            module: 'Staff',
            user: 'Super Admin',
            icon: 'UserCheck',
          });
          
          addNotification({
            type: 'clinical',
            icon: 'UserCheck',
            title: 'Staff Status Updated',
            description: `${updated.fullName} status changed to ${updates.status}`,
          });
        }
        
        return updated;
      }
      return s;
    }));
  };

  const deleteStaff = (id: string) => {
    const staffMember = staff.find(s => s.id === id);
    if (staffMember) {
      setStaff(prev => prev.filter(s => s.id !== id));
      addActivityLog({
        action: `Staff removed: ${staffMember.fullName}`,
        module: 'Staff',
        user: 'Super Admin',
        icon: 'UserMinus',
      });
    }
  };

  // Department Actions
  const addDepartment = (departmentData: Omit<Department, 'id' | 'dateCreated' | 'lastUpdated'>): Department => {
    const newDepartment: Department = {
      ...departmentData,
      id: generateDepartmentId(),
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    
    setDepartments(prev => [...prev, newDepartment]);
    
    // Add notification
    addNotification({
      type: 'admin',
      icon: 'Building',
      title: 'New Department Created',
      description: `Department ${newDepartment.name} (${newDepartment.id}) has been created`,
    });
    
    // Add activity log
    addActivityLog({
      action: `New department created: ${newDepartment.name}`,
      module: 'Departments',
      user: 'Super Admin',
      icon: 'Building',
    });
    
    return newDepartment;
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments(prev => prev.map(d => {
      if (d.id === id) {
        const updated = { ...d, ...updates };
        
        // Add activity log for status changes
        if (updates.status && updates.status !== d.status) {
          addActivityLog({
            action: `Department ${updated.id} status: ${updates.status}`,
            module: 'Departments',
            user: 'Super Admin',
            icon: 'Building',
          });
        }
        
        return updated;
      }
      return d;
    }));
  };

  const deleteDepartment = (id: string) => {
    const department = departments.find(d => d.id === id);
    if (department) {
      setDepartments(prev => prev.filter(d => d.id !== id));
      addActivityLog({
        action: `Department removed: ${department.name}`,
        module: 'Departments',
        user: 'Super Admin',
        icon: 'Building',
      });
    }
  };

  // Staff Attendance Actions
  const addStaffAttendance = (attendanceData: Omit<StaffAttendance, 'id'>): StaffAttendance => {
    const newAttendance: StaffAttendance = {
      ...attendanceData,
      id: generateStaffAttendanceId(),
    };
    
    setStaffAttendance(prev => [...prev, newAttendance]);
    
    addNotification({
      type: 'admin',
      icon: 'Clock',
      title: 'Staff Attendance Recorded',
      description: `Attendance for ${newAttendance.staffName} (${newAttendance.staffId}) recorded`,
    });
    
    addActivityLog({
      action: `Staff attendance recorded: ${newAttendance.staffName}`,
      module: 'Staff Attendance',
      user: 'Super Admin',
      icon: 'Clock',
    });
    
    return newAttendance;
  };

  const updateStaffAttendance = (id: string, updates: Partial<StaffAttendance>) => {
    setStaffAttendance(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updates };
        
        // Add activity log for status changes
        if (updates.status && updates.status !== a.status) {
          addActivityLog({
            action: `Staff attendance ${updated.id} status: ${updates.status}`,
            module: 'Staff Attendance',
            user: 'Super Admin',
            icon: 'Clock',
          });
        }
        
        return updated;
      }
      return a;
    }));
  };

  const deleteStaffAttendance = (id: string) => {
    const attendance = staffAttendance.find(a => a.id === id);
    if (attendance) {
      setStaffAttendance(prev => prev.filter(a => a.id !== id));
      addActivityLog({
        action: `Staff attendance removed: ${attendance.staffName}`,
        module: 'Staff Attendance',
        user: 'Super Admin',
        icon: 'Clock',
      });
    }
  };

  // New: Record staff login with session tracking
  const recordStaffLogin = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const loginTime = now.toISOString();
    
    // Find if there's already an attendance record for today
    const todayAttendance = staffAttendance.find(
      a => a.staffId === staffId && a.date.startsWith(today)
    );

    if (todayAttendance) {
      // Add new session to existing attendance (no notification for additional sessions)
      const newSession: AttendanceSession = {
        loginTime,
        logoutTime: undefined,
        duration: undefined,
      };

      const updatedSessions = [...(todayAttendance.sessions || []), newSession];

      setStaffAttendance(prev => prev.map(a => 
        a.id === todayAttendance.id
          ? { ...a, sessions: updatedSessions }
          : a
      ));
    } else {
      // Create new attendance record for today (first login)
      const checkInTime = loginTime;
      const checkInHour = now.getHours();
      const checkInMinute = now.getMinutes();
      
      // Determine if late (after 8:00 AM)
      const isLate = checkInHour > 8 || (checkInHour === 8 && checkInMinute > 0);
      const lateMinutes = isLate
        ? (checkInHour - 8) * 60 + checkInMinute
        : 0;

      const newAttendance: StaffAttendance = {
        id: generateStaffAttendanceId(),
        staffId,
        staffName: staffMember.fullName,
        department: staffMember.department,
        role: staffMember.role,
        date: loginTime,
        status: isLate ? 'Late' : 'Present',
        checkInTime,
        checkOutTime: undefined,
        lateMinutes: isLate ? lateMinutes : undefined,
        sessions: [{
          loginTime,
          logoutTime: undefined,
          duration: undefined,
        }],
        totalHoursWorked: 0,
      };

      setStaffAttendance(prev => [...prev, newAttendance]);

      // Only notify on FIRST login of the day
      addNotification({
        type: 'info',
        category: 'admin',
        icon: 'Clock',
        title: 'Staff Checked In',
        description: `${staffMember.fullName} checked in at ${now.toLocaleTimeString()}${isLate ? ' (Late)' : ''}`,
        module: 'Staff',
      });
    }
  };

  // New: Record staff logout with session tracking
  const recordStaffLogout = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const logoutTime = now.toISOString();

    // Find today's attendance record
    const todayAttendance = staffAttendance.find(
      a => a.staffId === staffId && a.date.startsWith(today)
    );

    if (todayAttendance && todayAttendance.sessions) {
      // Update the last session's logout time (only if it's not already logged out)
      const lastSession = todayAttendance.sessions[todayAttendance.sessions.length - 1];
      
      // Only update if last session doesn't have a logout time
      if (lastSession && !lastSession.logoutTime) {
        const updatedSessions = todayAttendance.sessions.map((session, index) => {
          if (index === todayAttendance.sessions!.length - 1) {
            const loginDate = new Date(session.loginTime);
            const logoutDate = new Date(logoutTime);
            const duration = Math.floor((logoutDate.getTime() - loginDate.getTime()) / (1000 * 60)); // in minutes

            return {
              ...session,
              logoutTime,
              duration,
            };
          }
          return session;
        });

        // Calculate total hours worked
        const totalMinutes = updatedSessions.reduce(
          (sum, session) => sum + (session.duration || 0),
          0
        );
        const totalHoursWorked = parseFloat((totalMinutes / 60).toFixed(2));

        setStaffAttendance(prev => prev.map(a =>
          a.id === todayAttendance.id
            ? {
                ...a,
                sessions: updatedSessions,
                checkOutTime: logoutTime,
                totalHoursWorked,
              }
            : a
        ));

        // Removed notification to prevent spam
      }
    }
  };

  // New: Get today's attendance
  const getTodayAttendance = (): StaffAttendance[] => {
    const today = new Date().toISOString().split('T')[0];
    return staffAttendance.filter(a => a.date.startsWith(today));
  };

  // Bed Management Actions
  const addBedCategory = (bedCategoryData: Omit<BedCategory, 'id' | 'dateCreated' | 'lastUpdated' | 'availableBeds'>): BedCategory => {
    const availableBeds = bedCategoryData.totalBeds - bedCategoryData.occupiedBeds;
    
    const newBedCategory: BedCategory = {
      ...bedCategoryData,
      id: generateBedCategoryId(),
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      availableBeds,
    };
    
    setBedCategories(prev => [...prev, newBedCategory]);
    
    // Add notification
    addNotification({
      type: 'admin',
      icon: 'Bed',
      title: 'New Bed Category Created',
      description: `Bed Category ${newBedCategory.categoryName} (${newBedCategory.id}) has been created`,
    });
    
    // Add activity log
    addActivityLog({
      action: `New bed category created: ${newBedCategory.categoryName}`,
      module: 'System',
      user: 'Super Admin',
      icon: 'Bed',
    });
    
    return newBedCategory;
  };

  const updateBedCategory = (id: string, updates: Partial<BedCategory>) => {
    setBedCategories(prev => prev.map(b => {
      if (b.id === id) {
        const updated = { ...b, ...updates };
        
        // Recalculate available beds if total or occupied changed
        if (updates.totalBeds !== undefined || updates.occupiedBeds !== undefined) {
          updated.availableBeds = updated.totalBeds - updated.occupiedBeds;
        }
        
        updated.lastUpdated = new Date().toISOString();
        
        // Add activity log
        addActivityLog({
          action: `Bed category updated: ${updated.categoryName}`,
          module: 'System',
          user: 'Super Admin',
          icon: 'Bed',
        });
        
        return updated;
      }
      return b;
    }));
  };

  const deleteBedCategory = (id: string) => {
    const bedCategory = bedCategories.find(b => b.id === id);
    if (bedCategory) {
      setBedCategories(prev => prev.filter(b => b.id !== id));
      addActivityLog({
        action: `Bed category removed: ${bedCategory.categoryName}`,
        module: 'System',
        user: 'Super Admin',
        icon: 'Bed',
      });
    }
  };

  // Settings Actions
  const updateSettings = (settings: Partial<HospitalSettings>) => {
    setSettings(prev => ({ ...prev, ...settings }));
  };

  const setCashierPIN = (pin: string) => {
    setCashierPINState(pin);
  };

  return (
    <EMRStoreContext.Provider
      value={{
        patients,
        appointments,
        invoices,
        notifications,
        activityLogs,
        doctors,
        staff,
        departments,
        staffAttendance,
        bedCategories,
        settings,
        cashierPIN,
        addPatient,
        updatePatient,
        deletePatient,
        markPatientAsDeceased,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addInvoice,
        updateInvoice,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
        deleteNotification,
        addActivityLog,
        addStaff,
        updateStaff,
        deleteStaff,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addStaffAttendance,
        updateStaffAttendance,
        deleteStaffAttendance,
        recordStaffLogin,
        recordStaffLogout,
        getTodayAttendance,
        addBedCategory,
        updateBedCategory,
        deleteBedCategory,
        updateSettings,
        setCashierPIN,
      }}
    >
      {children}
    </EMRStoreContext.Provider>
  );
}

export function useEMRStore() {
  const context = useContext(EMRStoreContext);
  if (!context) {
    throw new Error('useEMRStore must be used within EMRStoreProvider');
  }
  return context;
}