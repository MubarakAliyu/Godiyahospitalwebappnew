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
}

export const USER_CREDENTIALS: UserCredential[] = [
  {
    email: 'ghaliyu@gmail.com',
    password: 'godiya@2025',
    role: 'Super Admin',
    name: 'Aliyu',
  },
  {
    email: 'reception@godiyahospital.ng',
    password: '12345678',
    role: 'Reception',
    name: 'Reception Desk',
  },
  {
    email: 'cashier@godiyahospital.ng',
    password: '12345678',
    role: 'Cashier',
    name: 'Cashier',
  },
  {
    email: 'doctor@godiyahospital.ng',
    password: '12345678',
    role: 'Doctor',
    name: 'Dr. Ibrahim',
  },
  {
    email: 'lab@godiyahospital.ng',
    password: '12345678',
    role: 'Laboratory',
    name: 'Lab Technician',
  },
  {
    email: 'pharmacy@godiyahospital.ng',
    password: '12345678',
    role: 'Pharmacy',
    name: 'Pharmacist',
  },
  {
    email: 'nurse@godiyahospital.ng',
    password: '12345678',
    role: 'Nurse',
    name: 'Nurse Station',
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
    'Laboratory': '/emr/laboratory/dashboard',
    'Pharmacy': '/emr/pharmacy/dashboard',
    'Nurse': '/emr/nurse/dashboard',
  };
  return pathMap[role] || '/emr/dashboard';
}
