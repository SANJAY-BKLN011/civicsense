import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  registerCitizenApi,
  loginApi,
  getCurrentUserApi,
  logoutApi,
  type AuthUserResponse,
} from '../api/auth';
import { getToken, USE_MOCK_DATA } from '../api/client';

export interface CitizenUser { id: string; name: string; email: string; phone?: string | null; ward?: string; role: 'citizen'; }
export interface OfficerUser { id: string; name: string; email: string; designation: string; department: string; departmentId?: string; badgeId: string; ward: string; role: 'officer'; }
export interface AdminUser { id: string; name: string; email: string; designation: string; role: 'admin'; }
interface LoginCredentials { email: string; password: string; rememberMe?: boolean; }
interface RegisterData { name: string; email: string; phone: string; password: string; ward?: string; }
interface AuthContextType {
  user: CitizenUser | null; isAuthenticated: boolean;
  loginCitizen: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  registerCitizen: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  officerUser: OfficerUser | null; isOfficerAuthenticated: boolean;
  loginOfficer: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logoutOfficer: () => void;
  adminUser: AdminUser | null; isAdminAuthenticated: boolean;
  loginAdmin: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const CITIZEN_STORAGE_KEY = 'civicsense_citizen_session';
const OFFICER_STORAGE_KEY = 'civicsense_officer_session';
const ADMIN_STORAGE_KEY = 'civicsense_admin_session';

function mapOfficerUser(authUser: AuthUserResponse): OfficerUser {
  const profile = authUser.officer_profile;
  const departmentName = profile?.department?.name || authUser.department || 'Department unavailable';
  return {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    designation: profile?.designation || authUser.designation || 'Field Officer',
    department: departmentName,
    departmentId: profile?.department_id || authUser.department_id,
    badgeId: authUser.badgeId || `OFF-${authUser.id}`,
    ward: authUser.ward || 'Ward 12 - Central District',
    role: 'officer',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CitizenUser | null>(null);
  const [officerUser, setOfficerUser] = useState<OfficerUser | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);
      const token = getToken();
      if (token && !USE_MOCK_DATA) {
        const result = await getCurrentUserApi();
        if (result.success && result.data) {
          const authUser: AuthUserResponse = (result.data as any).user || result.data;
          if (authUser.role === 'CITIZEN') setUser({ id: authUser.id, name: authUser.name, email: authUser.email, phone: authUser.phone, ward: authUser.ward || 'Ward 12 - Central District', role: 'citizen' });
          else if (authUser.role === 'OFFICER') setOfficerUser(mapOfficerUser(authUser));
          else if (authUser.role === 'ADMIN') setAdminUser({ id: authUser.id, name: authUser.name, email: authUser.email, designation: authUser.designation || 'Chief Administrator', role: 'admin' });
          setIsLoading(false);
          return;
        }
      }
      try {
        const savedCitizen = localStorage.getItem(CITIZEN_STORAGE_KEY); if (savedCitizen) setUser(JSON.parse(savedCitizen));
        const savedOfficer = localStorage.getItem(OFFICER_STORAGE_KEY); if (savedOfficer) setOfficerUser(JSON.parse(savedOfficer));
        const savedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY); if (savedAdmin) setAdminUser(JSON.parse(savedAdmin));
      } catch (e) { console.error('Failed to restore sessions from localStorage', e); }
      finally { setIsLoading(false); }
    }
    initAuth();
  }, []);

  const loginCitizen = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    if (!USE_MOCK_DATA) {
      const res = await loginApi({ email: credentials.email, password: credentials.password });
      if (res.success && res.data) {
        const authUser: AuthUserResponse = res.data.user || (res.data as any);
        if (authUser.role !== 'CITIZEN') { setIsLoading(false); return { success: false, error: `Access denied. This account has role "${authUser.role}", not "CITIZEN".` }; }
        const citizenData: CitizenUser = { id: authUser.id, name: authUser.name, email: authUser.email, phone: authUser.phone, ward: authUser.ward || 'Ward 12 - Central District', role: 'citizen' };
        setUser(citizenData); if (credentials.rememberMe) localStorage.setItem(CITIZEN_STORAGE_KEY, JSON.stringify(citizenData)); setIsLoading(false); return { success: true };
      }
      setIsLoading(false); return { success: false, error: res.error || 'Invalid citizen email address or password.' };
    }
    await new Promise((res) => setTimeout(res, 400));
    if (credentials.email.includes('fail')) { setIsLoading(false); return { success: false, error: 'Invalid citizen email address or password.' }; }
    const mockUser: CitizenUser = { id: 'CIT-8842', name: credentials.email.split('@')[0].replace('.', ' ').toUpperCase() || 'Sanjay Patel', email: credentials.email, phone: '+91 98765 43210', ward: 'Ward 12 - Central District', role: 'citizen' };
    setUser(mockUser); if (credentials.rememberMe) localStorage.setItem(CITIZEN_STORAGE_KEY, JSON.stringify(mockUser)); setIsLoading(false); return { success: true };
  };

  const registerCitizen = async (data: RegisterData) => {
    setIsLoading(true);
    if (!USE_MOCK_DATA) {
      const res = await registerCitizenApi(data);
      if (res.success && res.data) {
        const authUser: AuthUserResponse = res.data.user || (res.data as any);
        const newUser: CitizenUser = { id: authUser.id, name: authUser.name, email: authUser.email, phone: authUser.phone, ward: authUser.ward || data.ward || 'Ward 12 - Central District', role: 'citizen' };
        setUser(newUser); localStorage.setItem(CITIZEN_STORAGE_KEY, JSON.stringify(newUser)); setIsLoading(false); return { success: true };
      }
      setIsLoading(false); return { success: false, error: res.error || 'Registration failed. An account with this email may already exist.' };
    }
    await new Promise((res) => setTimeout(res, 500));
    if (data.email.includes('exists')) { setIsLoading(false); return { success: false, error: 'An account with this email address already exists.' }; }
    const newUser: CitizenUser = { id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`, name: data.name, email: data.email, phone: data.phone, ward: data.ward || 'Ward 12 - Central District', role: 'citizen' };
    setUser(newUser); localStorage.setItem(CITIZEN_STORAGE_KEY, JSON.stringify(newUser)); setIsLoading(false); return { success: true };
  };

  const logout = async () => { setUser(null); localStorage.removeItem(CITIZEN_STORAGE_KEY); await logoutApi(); };
  const requestPasswordReset = async (email: string) => { await new Promise((res) => setTimeout(res, 400)); if (email.includes('notfound')) return { success: false, error: 'No citizen account found with this email address.' }; return { success: true }; };

  const loginOfficer = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    if (!USE_MOCK_DATA) {
      const res = await loginApi({ email: credentials.email, password: credentials.password });
      if (res.success && res.data) {
        const authUser: AuthUserResponse = res.data.user || (res.data as any);
        if (authUser.role !== 'OFFICER') { setIsLoading(false); return { success: false, error: `Access denied. This account has role "${authUser.role}", not "OFFICER".` }; }
        const officerData = mapOfficerUser(authUser); setOfficerUser(officerData); if (credentials.rememberMe) localStorage.setItem(OFFICER_STORAGE_KEY, JSON.stringify(officerData)); setIsLoading(false); return { success: true };
      }
      setIsLoading(false); return { success: false, error: res.error || 'Invalid officer credentials or unverified badge ID.' };
    }
    await new Promise((res) => setTimeout(res, 400));
    if (credentials.email.includes('fail')) { setIsLoading(false); return { success: false, error: 'Invalid officer credentials or unverified badge ID.' }; }
    const mockOfficer: OfficerUser = { id: 'OFF-SAN-402', name: 'Sanjay Kumar', email: credentials.email, designation: 'Field Officer', department: 'Municipality / Sanitation', departmentId: 'dept-001', badgeId: 'OFF-SAN-402', ward: 'Ward 12 - Central District', role: 'officer' };
    setOfficerUser(mockOfficer); if (credentials.rememberMe) localStorage.setItem(OFFICER_STORAGE_KEY, JSON.stringify(mockOfficer)); setIsLoading(false); return { success: true };
  };
  const logoutOfficer = async () => { setOfficerUser(null); localStorage.removeItem(OFFICER_STORAGE_KEY); await logoutApi(); };

  const loginAdmin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    if (!USE_MOCK_DATA) {
      const res = await loginApi({ email: credentials.email, password: credentials.password });
      if (res.success && res.data) {
        const authUser: AuthUserResponse = res.data.user || (res.data as any);
        if (authUser.role !== 'ADMIN') { setIsLoading(false); return { success: false, error: `Access denied. This account has role "${authUser.role}", not "ADMIN".` }; }
        const adminData: AdminUser = { id: authUser.id, name: authUser.name, email: authUser.email, designation: authUser.designation || 'Chief Municipal Administrator', role: 'admin' };
        setAdminUser(adminData); if (credentials.rememberMe) localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData)); setIsLoading(false); return { success: true };
      }
      setIsLoading(false); return { success: false, error: res.error || 'Invalid administrator credentials.' };
    }
    await new Promise((res) => setTimeout(res, 400));
    if (credentials.email.includes('fail')) { setIsLoading(false); return { success: false, error: 'Invalid administrator credentials.' }; }
    const mockAdmin: AdminUser = { id: 'ADM-SYS-001', name: 'Vikramaditya Rao', email: credentials.email, designation: 'Chief Municipal Administrator', role: 'admin' };
    setAdminUser(mockAdmin); if (credentials.rememberMe) localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(mockAdmin)); setIsLoading(false); return { success: true };
  };
  const logoutAdmin = async () => { setAdminUser(null); localStorage.removeItem(ADMIN_STORAGE_KEY); await logoutApi(); };

  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, loginCitizen, registerCitizen, logout, requestPasswordReset, officerUser, isOfficerAuthenticated: !!officerUser, loginOfficer, logoutOfficer, adminUser, isAdminAuthenticated: !!adminUser, loginAdmin, logoutAdmin, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context; }
