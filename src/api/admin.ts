import { apiFetch } from './client';
import type { ComplaintResponseData } from './complaints';

export interface AdminStatsData {
  total_complaints: number;
  by_status: {
    new: number;
    assigned: number;
    in_progress: number;
    resolved: number;
  };
  by_department: Array<{
    department_id: string;
    department_name: string;
    count: number;
  }>;
}

export interface AdminOfficerData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  designation: string;
  department: {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
  };
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminOfficersResponse {
  officers: AdminOfficerData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export async function getAdminStatsApi() {
  const result = await apiFetch<AdminStatsData>('/admin/complaints/summary', {
    method: 'GET',
  });
  return result;
}

/**
 * Admin-wide complaint listing is not currently exposed by the backend.
 * Keep this helper out of the live dashboard until a dedicated endpoint exists.
 */
export async function getAdminComplaintsApi(_params?: {
  search?: string;
  status?: string;
  priority?: string;
  department?: string;
}) {
  return {
    success: false as const,
    error: 'Admin complaint listing endpoint is not available yet.',
  };
}

export async function getAdminOfficersApi(params?: {
  page?: number;
  limit?: number;
  verification_status?: string;
  department_id?: string;
}) {
  const queryParts: string[] = [];
  if (params?.page) queryParts.push(`page=${params.page}`);
  if (params?.limit) queryParts.push(`limit=${params.limit}`);
  if (params?.verification_status) queryParts.push(`verification_status=${encodeURIComponent(params.verification_status)}`);
  if (params?.department_id) queryParts.push(`department_id=${encodeURIComponent(params.department_id)}`);

  const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
  return apiFetch<AdminOfficersResponse>(`/admin/officers${queryString}`, {
    method: 'GET',
  });
}
