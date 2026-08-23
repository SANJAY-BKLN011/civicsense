import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CitizenUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ward?: string;
  role: 'citizen';
}

export interface OfficerUser {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  badgeId: string;
  ward: string;
  role: 'officer';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  designation: string;
  role: 'admin';
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  ward?: string;
}

interface AuthContextType {
  // Citizen Auth State
  user: CitizenUser | null;
  isAuthenticated: boolean;
  loginCitizen: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  registerCitizen: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;

  // Officer Auth State
  officerUser: OfficerUser | null;
  isOfficerAuthenticated: boolean;
  loginOfficer: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logoutOfficer: () => void;

  // Admin Auth State
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;

  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CITIZEN_STORAGE_KEY = 'civicsense_citizen_session';
const OFFICER_STORAGE_KEY = 'civicsense_officer_session';
const ADMIN_STORAGE_KEY = 'civicsense_admin_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CitizenUser | null>(null);
  const [officerUser, setOfficerUser] = useState<OfficerUser | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedCitizen = localStorage.getItem(CITIZEN_STORAGE_KEY);
      if (savedCitizen) {
        setUser(JSON.parse(savedCitizen));
      }

      const savedOfficer = localStorage.getItem(OFFICER_STORAGE_KEY);
      if (savedOfficer) {
        setOfficerUser(JSON.parse(savedOfficer));
      }

      const savedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (savedAdmin) {
        setAdminUser(JSON.parse(savedAdmin));
      }
    } catch (e) {
      console.error('Failed to restore sessions from localStorage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Citizen Login Mock
  const loginCitizen = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    if (credentials.email.includes('fail')) {
      setIsLoading(false);
      return { success: false, error: 'Invalid citizen email address or password.' };
    }

    const mockUser: CitizenUser = {
      id: 'CIT-8842',
      name: credentials.email.split('@')[0].replace('.', ' ').toUpperCase() || 'Sanjay Patel',
      email: credentials.email,
      phone: '+91 98765 43210',
      ward: 'Ward 12 - Central District',
      role: 'citizen',
    };

    setUser(mockUser);
    if (credentials.rememberMe) {
      localStorage.setItem(CITIZEN_STORAGE_KEY, JSON.stringify(mockUser));
    }
    setIsLoading(false);
    return { success: true };
  };

  // Citizen Register Mock
  const registerCitizen = async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    if (data.email.includes('exists')) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: CitizenUser = {
      id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      ward: data.ward || 'Ward 12 - Central District',
      role: 'citizen',
    };

    setUser(newUser);
    localStorage.setItem(CITIZEN_STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  // Citizen Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem(CITIZEN_STORAGE_KEY);
  };

  // Password Reset Mock
  const requestPasswordReset = async (email: string) => {
    await new Promise((res) => setTimeout(res, 500));
    if (email.includes('notfound')) {
      return { success: false, error: 'No citizen account found with this email address.' };
    }
    return { success: true };
  };

  // Officer Login Mock
  const loginOfficer = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    if (credentials.email.includes('fail')) {
      setIsLoading(false);
      return { success: false, error: 'Invalid officer credentials or unverified badge ID.' };
    }

    const mockOfficer: OfficerUser = {
      id: 'OFF-SAN-402',
      name: 'Sanjay Kumar',
      email: credentials.email,
      designation: 'Field Officer',
      department: 'Municipality / Sanitation',
      badgeId: 'OFF-SAN-402',
      ward: 'Ward 12 - Central District',
      role: 'officer',
    };

    setOfficerUser(mockOfficer);
    if (credentials.rememberMe) {
      localStorage.setItem(OFFICER_STORAGE_KEY, JSON.stringify(mockOfficer));
    }
    setIsLoading(false);
    return { success: true };
  };

  // Officer Logout
  const logoutOfficer = () => {
    setOfficerUser(null);
    localStorage.removeItem(OFFICER_STORAGE_KEY);
  };

  // Admin Login Mock
  const loginAdmin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    if (credentials.email.includes('fail')) {
      setIsLoading(false);
      return { success: false, error: 'Invalid administrator credentials.' };
    }

    const mockAdmin: AdminUser = {
      id: 'ADM-SYS-001',
      name: 'Vikramaditya Rao',
      email: credentials.email,
      designation: 'Chief Municipal Administrator',
      role: 'admin',
    };

    setAdminUser(mockAdmin);
    if (credentials.rememberMe) {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(mockAdmin));
    }
    setIsLoading(false);
    return { success: true };
  };

  // Admin Logout
  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginCitizen,
        registerCitizen,
        logout,
        requestPasswordReset,
        officerUser,
        isOfficerAuthenticated: !!officerUser,
        loginOfficer,
        logoutOfficer,
        adminUser,
        isAdminAuthenticated: !!adminUser,
        loginAdmin,
        logoutAdmin,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
