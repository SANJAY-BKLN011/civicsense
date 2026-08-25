import { apiFetch, setToken, removeToken } from './client';

export interface AuthDepartmentProfile {
  id: string;
  name: string;
  description: string | null;
}

export interface AuthOfficerProfile {
  id: string;
  department_id: string;
  designation: string;
  verification_status: string;
  department?: AuthDepartmentProfile;
}

// The backend Prisma Role enum is serialized as uppercase values.
export type BackendRole = 'CITIZEN' | 'OFFICER' | 'ADMIN';

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: BackendRole;
  phone?: string | null;
  ward?: string;
  designation?: string;
  department?: string;
  department_id?: string;
  badgeId?: string;
  officer_profile?: AuthOfficerProfile | null;
}

export interface AuthResponseData {
  user: AuthUserResponse;
  token?: string;
  accessToken?: string;
}

export async function registerCitizenApi(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  ward?: string;
}) {
  const result = await apiFetch<AuthResponseData>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (result.success && result.data) {
    const token = result.data.token || result.data.accessToken;
    if (token) setToken(token);
  }

  return result;
}

export async function loginApi(credentials: { email: string; password: string }) {
  const result = await apiFetch<AuthResponseData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (result.success && result.data) {
    const token = result.data.token || result.data.accessToken;
    if (token) setToken(token);
  }

  return result;
}

export async function getCurrentUserApi() {
  return apiFetch<{ user: AuthUserResponse } | AuthUserResponse>('/auth/me', {
    method: 'GET',
  });
}

export async function logoutApi() {
  await apiFetch('/auth/logout', {
    method: 'POST',
  }).catch(() => {});

  removeToken();
}
