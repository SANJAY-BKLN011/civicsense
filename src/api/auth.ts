import { apiFetch, setToken, removeToken } from './client';

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'officer' | 'admin';
  phone?: string;
  ward?: string;
  designation?: string;
  department?: string;
  badgeId?: string;
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

  // Fallback endpoint if register is under /auth/citizen/register
  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<AuthResponseData>('/auth/citizen/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (fallback.success && fallback.data) {
      const token = fallback.data.token || fallback.data.accessToken;
      if (token) setToken(token);
      return fallback;
    }
  }

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
  const result = await apiFetch<{ user: AuthUserResponse } | AuthUserResponse>('/auth/me', {
    method: 'GET',
  });

  return result;
}

export async function logoutApi() {
  await apiFetch('/auth/logout', {
    method: 'POST',
  }).catch(() => {});

  removeToken();
}
