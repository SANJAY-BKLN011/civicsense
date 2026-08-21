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

  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CITIZEN_STORAGE_KEY = 'civicsense_citizen_session';
const OFFICER_STORAGE_KEY = 'civicsense_officer_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CitizenUser | null>(null);
  const [officerUser, setOfficerUser] = useState<OfficerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize both sessions from localStorage
  useEffect(() => {
    try {
      // Citizen session
      const storedCitizen = localStorage.getItem(CITIZEN_STORAGE_KEY);
      if (storedCitizen) {
        const parsedCitizen = JSON.parse(storedCitizen);
        if (parsedCitizen && parsedCitizen.role === 'citizen') {
          setUser(parsedCitizen);
        }
      }

      // Officer session
      const storedOfficer = localStorage.getItem(OFFICER_STORAGE_KEY);
      if (storedOfficer) {
        const parsedOfficer = JSON.parse(storedOfficer);
        if (parsedOfficer && parsedOfficer.role === 'officer') {
          setOfficerUser(parsedOfficer);
        }
      }
    } catch {
      localStorage.removeItem(CITIZEN_STORAGE_KEY);
      localStorage.removeItem(OFFICER_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // CITIZEN AUTH METHODS
  const loginCitizen = async ({ email, password, rememberMe = true }: LoginCredentials) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 4) {
      setIsLoading(false);
      return { success: false, error: 'Password is required (at least 4 characters).' };
    }

    const citizenUser: CitizenUser = {
      id: 'CIT-' + Math.floor(1000 + Math.random() * 9000),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Resident Citizen',
      email,
      phone: '9876543210',
      ward: 'Ward 12 - Central District',
      role: 'citizen',
    };

    setUser(citizenUser);
    if (rememberMe) {
      localStorage.setItem(CITIZEN_STORAGE_KEY, JSON.stringify(citizenUser));
    }
    setIsLoading(false);
    return { success: true };
  };

  const registerCitizen = async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!data.name.trim()) {
      setIsLoading(false);
      return { success: false, error: 'Full name is required.' };
    }

    const citizenUser: CitizenUser = {
      id: 'CIT-' + Math.floor(1000 + Math.random() * 9000),
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      ward: data.ward || 'Ward 12 - Central District',
      role: 'citizen',
    };

    setUser(citizenUser);
    localStorage.setItem(CITIZEN_STORAGE_KEY, JSON.stringify(citizenUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CITIZEN_STORAGE_KEY);
  };

  const requestPasswordReset = async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    return { success: true };
  };

  // OFFICER AUTH METHODS
  const loginOfficer = async ({ email, password, rememberMe = true }: LoginCredentials) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid department email address.' };
    }

    if (!password || password.length < 4) {
      setIsLoading(false);
      return { success: false, error: 'Officer authorization password is required (at least 4 characters).' };
    }

    // Default or dynamically configured officer user
    const officer: OfficerUser = {
      id: 'OFF-SAN-402',
      name: 'Sanjay Kumar',
      email: email.trim(),
      designation: 'Field Officer',
      department: 'Municipality / Sanitation',
      badgeId: 'OFF-SAN-402',
      ward: 'Ward 12 - Central District',
      role: 'officer',
    };

    setOfficerUser(officer);
    if (rememberMe) {
      localStorage.setItem(OFFICER_STORAGE_KEY, JSON.stringify(officer));
    }
    setIsLoading(false);
    return { success: true };
  };

  const logoutOfficer = () => {
    setOfficerUser(null);
    localStorage.removeItem(OFFICER_STORAGE_KEY);
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
