import { apiFetch } from './client';

/**
 * Department shape returned by GET /api/v1/departments.
 * The backend returns the UUID in `id` and the display name in `name`.
 */
export interface Department {
  id: string;
  name: string;
  description: string | null;
  active?: boolean;
  officeCount?: number;
  officerCount?: number;
  createdAt?: string;

  // Optional demo-only metrics used by existing mock/admin UI.
  totalComplaints?: number;
  resolved?: number;
  inProgress?: number;
  pending?: number;
  completionRate?: number;
}

function asName(value: any, fallback = 'Department'): string {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    if (typeof value.name === 'string' && value.name) return value.name;
    if (typeof value.title === 'string' && value.title) return value.title;
    if (typeof value.label === 'string' && value.label) return value.label;
    if (typeof value.value === 'string' && value.value) return value.value;
    return fallback;
  }
  return fallback;
}

function asId(value: any, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    return value.id ? String(value.id) : fallback;
  }
  return fallback;
}

function normalizeDepartment(raw: any): Department {
  if (typeof raw === 'string') return { id: raw, name: raw, description: null };
  const id = asId(raw.id || raw.department_id || raw.departmentId);
  const name = asName(raw.name ?? raw.department ?? raw.title);
  return {
    id: id || `dept-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name,
    description: typeof raw.description === 'string' ? raw.description : null,
    active: Boolean(raw.active ?? true),
    officeCount: typeof raw.officeCount === 'number' ? raw.officeCount : (Array.isArray(raw.offices) ? raw.offices.length : undefined),
    officerCount: typeof raw.officerCount === 'number' ? raw.officerCount : (Array.isArray(raw.officers) ? raw.officers.length : undefined),
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : (typeof raw.created_at === 'string' ? raw.created_at : undefined),
    totalComplaints: typeof raw.totalComplaints === 'number' ? raw.totalComplaints : undefined,
    resolved: typeof raw.resolved === 'number' ? raw.resolved : undefined,
    inProgress: typeof raw.inProgress === 'number' ? raw.inProgress : undefined,
    pending: typeof raw.pending === 'number' ? raw.pending : undefined,
    completionRate: typeof raw.completionRate === 'number' ? raw.completionRate : undefined,
  };
}

/**
 * Load active departments from the real backend.
 * GET /api/v1/departments is public and returns { success, message, data }.
 */
export async function getDepartments() {
  const result = await apiFetch<Department[]>('/departments', {
    method: 'GET',
  });
  if (!result.success || !result.data) return result;
  const rawList = Array.isArray(result.data) ? result.data : (result.data as any).departments || [];
  return { ...result, data: rawList.map(normalizeDepartment) };
}
