import { apiFetch } from './client';

export interface AdminStatsData {
  totalComplaints: number;
  newComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  totalCitizens: number | null;
  totalOfficers: number | null;
  totalDepartments: number | null;
  byDepartment: Array<{ departmentId: string; departmentName: string; count: number }>;
}

export interface AdminOfficerData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  designation: string;
  department: { id: string; name: string; description: string | null; active: boolean };
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason: string | null;
  is_blocked?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminOfficersResponse {
  officers: AdminOfficerData[];
  pagination: { page: number; limit: number; total: number; total_pages: number };
}

interface AdminSummaryResponse {
  total_complaints: number;
  by_status: { new: number; assigned: number; in_progress: number; resolved: number };
  by_department: Array<{ department_id: string; department_name: string; count: number }>;
}

export async function getAdminStatsApi() {
  const result = await apiFetch<AdminSummaryResponse>('/admin/complaints/summary', { method: 'GET' });
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
      byDepartment: summary.by_department.map((d) => ({ departmentId: d.department_id, departmentName: d.department_name, count: d.count })),
    } satisfies AdminStatsData,
  };
}

export interface AdminComplaint {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  photo_url?: string | null;
  location?: { latitude?: number; longitude?: number; address?: string | null } | null;
  department?: { id: string; name: string } | null;
  citizen?: { id: string; name: string; email: string } | null;
  officer?: { id: string; name: string; email: string } | null;
  created_at: string;
  updated_at: string;
  resolution?: unknown;
}

export async function getAdminComplaintsApi(params?: { search?: string; status?: string; priority?: string; department?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  if (params?.priority) query.set('priority', params.priority);
  if (params?.department) query.set('department', params.department);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiFetch<AdminComplaint[]>(`/admin/complaints${suffix}`, { method: 'GET' });
}

export async function getAdminOfficersApi(params?: { page?: number; limit?: number; verification_status?: string; department_id?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.verification_status) query.set('verification_status', params.verification_status);
  if (params?.department_id) query.set('department_id', params.department_id);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiFetch<AdminOfficersResponse>(`/admin/officers${suffix}`, { method: 'GET' });
}

export async function approveOfficerApi(officerId: string) {
  return apiFetch<AdminOfficerData>(`/admin/officers/${officerId}/approve`, { method: 'PATCH' });
}

export async function rejectOfficerApi(officerId: string, reason?: string) {
  return apiFetch<AdminOfficerData>(`/admin/officers/${officerId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason: reason || 'Officer registration rejected by administrator.' }),
  });
}

export async function blockUserApi(userId: string) {
  return apiFetch(`/admin/users/${userId}/block`, { method: 'PATCH' });
}

export async function unblockUserApi(userId: string) {
  return apiFetch(`/admin/users/${userId}/unblock`, { method: 'PATCH' });
}

export async function blockOfficerApi(officerId: string) {
  return apiFetch(`/admin/officers/${officerId}/block`, { method: 'PATCH' });
}

export async function unblockOfficerApi(officerId: string) {
  return apiFetch(`/admin/officers/${officerId}/unblock`, { method: 'PATCH' });
}
