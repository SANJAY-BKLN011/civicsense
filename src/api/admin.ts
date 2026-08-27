import { apiFetch } from './client';

export interface AdminStatsData {
  totalComplaints: number;
  newComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  totalCitizens: number | null;
  totalOfficers: number | null;
  totalDepartments: number | null;
  byDepartment: Array<{
    departmentId: string;
    departmentName: string;
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

interface AdminSummaryResponse {
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

export async function getAdminStatsApi() {
  const result = await apiFetch<AdminSummaryResponse>('/admin/complaints/summary', {
    method: 'GET',
  });

  if (!result.success || !result.data) return result as typeof result & { data?: AdminStatsData };

  const summary = result.data;
  return {
    ...result,
    data: {
      totalComplaints: summary.total_complaints,
      newComplaints: summary.by_status.new,
      inProgressComplaints: summary.by_status.in_progress,
      resolvedComplaints: summary.by_status.resolved,
      totalCitizens: null,
      totalOfficers: null,
      totalDepartments: summary.by_department.length,
      byDepartment: summary.by_department.map((d) => ({
        departmentId: d.department_id,
        departmentName: d.department_name,
        count: d.count,
      })),
    } satisfies AdminStatsData,
  };
}

export async function getAdminComplaintsApi(_params?: {
  search?: string;
  status?: string;
  priority?: string;
  department?: string;
}): Promise<{
  success: false;
  data: never[];
  error: string;
}> {
  return {
    success: false,
    data: [],
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

export async function approveOfficerApi(officerId: string) {
  return apiFetch<AdminOfficerData>(`/admin/officers/${officerId}/approve`, {
    method: 'PATCH',
  });
}

export async function rejectOfficerApi(officerId: string, reason?: string) {
  return apiFetch<AdminOfficerData>(`/admin/officers/${officerId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason: reason || 'Officer registration rejected by administrator.' }),
  });
}

export async function blockUserApi(_userId: string) {
  return {
    success: false,
    error: 'User block functionality is not supported by the backend API.',
  };
}

export async function unblockUserApi(_userId: string) {
  return {
    success: false,
    error: 'User unblock functionality is not supported by the backend API.',
  };
}
