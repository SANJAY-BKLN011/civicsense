import { apiFetch } from './client';

export interface Department {
  id: string;
  name: string;
  code?: string;
  description?: string;
  totalComplaints?: number;
  resolved?: number;
  inProgress?: number;
  pending?: number;
  completionRate?: number;
}

export async function getDepartmentsApi() {
  const result = await apiFetch<Department[]>('/departments', {
    method: 'GET',
  });

  // Fallback endpoint if departments are under /department
  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<Department[]>('/department', {
      method: 'GET',
    });
    return fallback;
  }

  return result;
}
