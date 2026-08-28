import { apiFetch, API_BASE_URL } from './client';

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
  user_is_blocked?: boolean;
  is_user_blocked?: boolean;
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

function asName(value: any, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    if (typeof value.name === 'string' && value.name) return value.name;
    if (typeof value.full_name === 'string' && value.full_name) return value.full_name;
    if (typeof value.fullName === 'string' && value.fullName) return value.fullName;
    if (typeof value.title === 'string' && value.title) return value.title;
    if (typeof value.email === 'string' && value.email) return value.email;
    if (typeof value.value === 'string' && value.value) return value.value;
    if (typeof value.label === 'string' && value.label) return value.label;
    if (typeof value.address === 'string' && value.address) return value.address;
    return fallback;
  }
  return fallback;
}

function asId(value: any): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    return value.id ? String(value.id) : undefined;
  }
  return undefined;
}

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

function normalizeMediaUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  if (typeof value !== 'string') return undefined;
  if (value.startsWith('data:image/')) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return `${API_ORIGIN}${value}`;
  return `${API_ORIGIN}/${value}`;
}

export async function getAdminStatsApi() {
  const result = await apiFetch<AdminSummaryResponse>('/admin/complaints/summary', { method: 'GET' });
  if (!result.success || !result.data) return result as typeof result & { data?: AdminStatsData };
  const summary = result.data;
  return {
    ...result,
    data: {
      totalComplaints: Number(summary.total_complaints || 0),
      newComplaints: Number(summary.by_status?.new || 0),
      inProgressComplaints: Number(summary.by_status?.in_progress || 0),
      resolvedComplaints: Number(summary.by_status?.resolved || 0),
      totalCitizens: null,
      totalOfficers: null,
      totalDepartments: Array.isArray(summary.by_department) ? summary.by_department.length : 0,
      byDepartment: (Array.isArray(summary.by_department) ? summary.by_department : []).map((d) => ({
        departmentId: String(d.department_id || ''),
        departmentName: asName(d.department_name, 'Department'),
        count: Number(d.count || 0),
      })),
    } satisfies AdminStatsData,
  };
}

export interface AdminComplaint {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category?: string;
  photo_url?: string | null;
  photoUrl?: string;
  location: string;
  ward?: string;
  latitude?: number | null;
  longitude?: number | null;
  coordinates?: { lat: number; lng: number } | null;
  department: string;
  departmentId?: string;
  citizenName: string;
  citizenEmail?: string;
  assignedOfficer: string;
  assignedOfficerId?: string;
  submittedDate?: string;
  submittedTime?: string;
  createdAt?: string;
  created_at: string;
  updated_at: string;
  timeline?: any[];
  resolution?: any;
}

function normalizeAdminComplaint(raw: any): AdminComplaint {
  const createdAt = raw.created_at || raw.createdAt;
  const rawLocation = typeof raw.location === 'string' ? raw.location.trim() : raw.location;
  const location =
    (typeof rawLocation === 'string' && rawLocation) ||
    raw.location_description ||
    raw.address ||
    raw.formatted_address ||
    (typeof raw.location === 'object' ? raw.location?.address || raw.location?.formatted_address || raw.location?.name : undefined) ||
    'Address not provided';

  const latitude = raw.latitude ?? raw.coordinates?.lat ?? raw.location?.latitude ?? null;
  const longitude = raw.longitude ?? raw.coordinates?.lng ?? raw.location?.longitude ?? null;

  const departmentName = asName(raw.department, 'Municipality / Sanitation');
  const departmentId = asId(raw.departmentId) || asId(raw.department_id) || asId(raw.department);

  const citizenName = asName(raw.citizenName ?? raw.citizen ?? raw.citizen_name, 'Not provided');
  const citizenEmail = typeof raw.citizen === 'object' && raw.citizen ? raw.citizen.email : (raw.citizenEmail || '');

  const officerValue = raw.assignedOfficer ?? raw.assigned_officer ?? raw.assigned_officer_name ?? raw.officer ?? raw.officer_name ?? raw.assignee;
  const assignedOfficer = asName(officerValue, 'Unassigned');
  const assignedOfficerId = asId(raw.assignedOfficerId) || asId(raw.assigned_officer_id) || asId(officerValue);

  const category = asName(raw.category, 'Municipal Services');
  const status = asName(raw.status, 'NEW');
  const priority = asName(raw.priority, 'Medium');

  const photoUrl = normalizeMediaUrl(
    raw.photo_url || raw.photoUrl || raw.photo || raw.photo_path || raw.image_url || raw.imageUrl || raw.evidence?.photo_url || raw.evidence?.url || raw.attachment?.url
  );

  return {
    id: String(raw.id ?? ''),
    title: asName(raw.title, 'Untitled complaint'),
    description: asName(raw.description, ''),
    status,
    priority,
    category,
    photo_url: photoUrl,
    photoUrl,
    location: String(location),
    ward: asName(raw.ward, 'Not provided'),
    latitude,
    longitude,
    coordinates: latitude != null && longitude != null ? { lat: Number(latitude), lng: Number(longitude) } : null,
    department: departmentName,
    departmentId,
    citizenName,
    citizenEmail,
    assignedOfficer,
    assignedOfficerId,
    submittedDate: raw.submittedDate,
    submittedTime: raw.submittedTime,
    createdAt: String(createdAt || ''),
    created_at: String(createdAt || ''),
    updated_at: String(raw.updated_at || raw.updatedAt || ''),
    timeline: raw.timeline || raw.status_history,
    resolution: raw.resolution,
  };
}

export async function getAdminComplaintsApi(params?: { search?: string; status?: string; priority?: string; department?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  if (params?.priority) query.set('priority', params.priority);
  if (params?.department) query.set('department', params.department);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  const result = await apiFetch<AdminComplaint[]>(`/admin/complaints${suffix}`, { method: 'GET' });
  if (!result.success || !result.data) return result;

  const complaints = Array.isArray(result.data)
    ? result.data.map(normalizeAdminComplaint)
    : ((result.data as any).complaints || []).map(normalizeAdminComplaint);

  return { ...result, data: complaints };
}

function normalizeAdminOfficer(raw: any): AdminOfficerData {
  const deptName = asName(raw.department, 'Department unavailable');
  const deptId = asId(raw.departmentId) || asId(raw.department_id) || asId(raw.department) || '';

  return {
    id: String(raw.id || ''),
    user_id: String(raw.user_id || raw.userId || raw.user?.id || raw.id || ''),
    name: asName(raw.name ?? raw.user, 'Field Officer'),
    email: typeof raw.email === 'string' ? raw.email : (raw.user?.email || ''),
    phone: raw.phone || raw.user?.phone || null,
    designation: asName(raw.designation, 'Field Officer'),
    department: {
      id: deptId,
      name: deptName,
      description: raw.department?.description || null,
      active: Boolean(raw.department?.active ?? true),
    },
    verification_status: raw.verification_status || raw.status || 'PENDING',
    rejection_reason: raw.rejection_reason || null,
    is_blocked: Boolean(raw.is_blocked),
    user_is_blocked: Boolean(raw.user_is_blocked ?? raw.is_user_blocked ?? raw.user?.is_blocked ?? raw.is_blocked),
    is_user_blocked: Boolean(raw.is_user_blocked ?? raw.user_is_blocked ?? raw.user?.is_blocked ?? raw.is_blocked),
    created_at: String(raw.created_at || raw.createdAt || ''),
    updated_at: String(raw.updated_at || raw.updatedAt || ''),
  };
}

export async function getAdminOfficersApi(params?: { page?: number; limit?: number; verification_status?: string; department_id?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.verification_status) query.set('verification_status', params.verification_status);
  if (params?.department_id) query.set('department_id', params.department_id);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  const result = await apiFetch<AdminOfficersResponse>(`/admin/officers${suffix}`, { method: 'GET' });
  if (!result.success || !result.data) return result;

  const payload = result.data as any;
  const rawOfficers = Array.isArray(payload) ? payload : payload.officers || [];
  const officers = rawOfficers.map(normalizeAdminOfficer);

  return { ...result, data: { officers, pagination: payload.pagination || { page: 1, limit: 50, total: officers.length, total_pages: 1 } } };
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
