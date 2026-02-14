// Role definitions
export type UserRole = 
  | 'Super Admin' 
  | 'Reception' 
  | 'Cashier' 
  | 'Doctor' 
  | 'Laboratory' 
  | 'Pharmacy' 
  | 'Nurse';

// User credentials database
export interface UserCredential {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  staffId?: string; // Map to staff ID for attendance tracking
}

export const USER_CREDENTIALS: UserCredential[] = [
  {
    email: 'ghaliyu@gmail.com',
    password: 'godiya@2025',
    role: 'Super Admin',
    name: 'Aliyu',
    staffId: 'GH-ST-008', // Aliyu Sani - Accountant
  },
  {
    email: 'reception@godiyahospital.ng',
    password: '12345678',
    role: 'Reception',
    name: 'Reception Desk',
    staffId: 'GH-ST-005', // Zainab Garba - Receptionist
  },
  {
    email: 'cashier@godiyahospital.ng',
    password: '12345678',
    role: 'Cashier',
    name: 'Cashier',
    staffId: 'GH-ST-008', // Aliyu Sani - Accountant (Finance)
  },
  {
    email: 'doctor@godiyahospital.ng',
    password: '12345678',
    role: 'Doctor',
    name: 'Dr. Ibrahim',
    staffId: 'GH-ST-006', // Dr. Ibrahim Yusuf
  },
  {
    email: 'lab@godiyahospital.ng',
    password: '12345678',
    role: 'Laboratory',
    name: 'Lab Technician',
    staffId: 'GH-ST-004', // Musa Abdullahi - Lab Technician
  },
  {
    email: 'pharmacy@godiyahospital.ng',
    password: '12345678',
    role: 'Pharmacy',
    name: 'Pharmacist',
    staffId: 'GH-ST-003', // Fatima Dauda - Pharmacist
  },
  {
    email: 'nurse@godiyahospital.ng',
    password: '12345678',
    role: 'Nurse',
    name: 'Nurse Station',
    staffId: 'GH-ST-002', // Aisha Bello - Nurse
  },
];

// Authenticate user
export function authenticateUser(email: string, password: string): UserCredential | null {
  const user = USER_CREDENTIALS.find(
    (u) => u.email === email && u.password === password
  );
  return user || null;
}

// Store auth data
export function storeAuthData(user: UserCredential) {
  localStorage.setItem('emr_auth', JSON.stringify({
    email: user.email,
    role: user.role,
    name: user.name,
    staffId: user.staffId, // Include staffId for attendance tracking
    timestamp: new Date().toISOString(),
  }));
}

// Get current user
export function getCurrentUser() {
  const authData = localStorage.getItem('emr_auth');
  if (!authData) return null;
  return JSON.parse(authData);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('emr_auth');
}

// Logout user
export function logout() {
  localStorage.removeItem('emr_auth');
}

// Get role-specific dashboard path
export function getDashboardPath(role: UserRole): string {
  const pathMap: Record<UserRole, string> = {
    'Super Admin': '/emr/dashboard',
    'Reception': '/emr/reception/dashboard',
    'Cashier': '/emr/cashier/dashboard',
    'Doctor': '/emr/doctor/dashboard',
    'Laboratory': '/emr/laboratory-staff/dashboard',
    'Pharmacy': '/emr/pharmacy-staff/dashboard',
    'Nurse': '/emr/nurse/dashboard',
  };
  return pathMap[role] || '/emr/dashboard';
}