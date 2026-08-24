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

/**
 * Load active departments from the real backend.
 * GET /api/v1/departments is public and returns { success, message, data }.
 */
export async function getDepartments() {
  return apiFetch<Department[]>('/departments', {
    method: 'GET',
  });
}
