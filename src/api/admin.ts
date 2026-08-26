import { apiFetch } from './client';
import type { ComplaintResponseData } from './complaints';

export interface AdminStatsData {
  totalComplaints: number;
  newComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  totalCitizens: number;
  totalOfficers: number;
  totalDepartments: number;
}

export interface AdminOfficerData {
  id: string;
  name: string;
  badgeId: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  assignedWard: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  activeCasesCount: number;
  resolvedCasesCount: number;
}

export async function getAdminStatsApi() {
  const result = await apiFetch<AdminStatsData>('/admin/stats', {
    method: 'GET',
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<AdminStatsData>('/admin/dashboard', {
      method: 'GET',
    });
    if (!fallback.success && fallback.error?.includes('404')) {
      const statsFallback = await apiFetch<AdminStatsData>('/stats', {
        method: 'GET',
      });
      return statsFallback;
    }
    return fallback;
  }

  return result;
}

export async function getAdminComplaintsApi(params?: { search?: string; status?: string; priority?: string; department?: string }) {
  const queryParts: string[] = [];
  if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
  if (params?.status && params.status !== 'ALL') queryParts.push(`status=${encodeURIComponent(params.status)}`);
  if (params?.priority && params.priority !== 'ALL') queryParts.push(`priority=${encodeURIComponent(params.priority)}`);
  if (params?.department && params.department !== 'ALL') queryParts.push(`department=${encodeURIComponent(params.department)}`);
  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  const result = await apiFetch<ComplaintResponseData[]>(`/admin/complaints${queryString}`, {
    method: 'GET',
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<ComplaintResponseData[]>(`/complaints${queryString}`, {
      method: 'GET',
    });
    return fallback;
  }

  return result;
}

export async function getAdminOfficersApi() {
  const result = await apiFetch<AdminOfficerData[]>('/admin/officers', {
    method: 'GET',
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<AdminOfficerData[]>('/officers', {
      method: 'GET',
    });
    return fallback;
  }

  return result;
}
