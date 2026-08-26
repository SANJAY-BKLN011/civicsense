import { apiFetch } from './client';

export interface BackendNotificationItem {
  id: string;
  recipientId?: string;
  role?: 'citizen' | 'officer' | 'admin';
  title: string;
  message: string;
  isRead: boolean;
  complaintId?: string;
  type?: 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'update' | 'high_priority';
  createdAt?: string;
  timestamp?: string;
}

export async function getNotificationsApi() {
  const result = await apiFetch<BackendNotificationItem[]>('/notifications', {
    method: 'GET',
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<BackendNotificationItem[]>('/notifications/my', {
      method: 'GET',
    });
    if (!fallback.success && fallback.error?.includes('404')) {
      const userFallback = await apiFetch<BackendNotificationItem[]>('/user/notifications', {
        method: 'GET',
      });
      return userFallback;
    }
    return fallback;
  }

  return result;
}

export async function getUnreadCountApi() {
  const result = await apiFetch<{ count: number }>('/notifications/unread-count', {
    method: 'GET',
  });

  return result;
}

export async function markNotificationReadApi(id: string) {
  const result = await apiFetch<{ success: boolean }>(`/notifications/${id}/read`, {
    method: 'PATCH',
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
    if (!fallback.success && fallback.error?.includes('404')) {
      const postFallback = await apiFetch<{ success: boolean }>(`/notifications/${id}/read`, {
        method: 'POST',
      });
      return postFallback;
    }
    return fallback;
  }

  return result;
}

export async function markAllNotificationsReadApi() {
  const result = await apiFetch<{ success: boolean }>('/notifications/read-all', {
    method: 'PATCH',
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<{ success: boolean }>('/notifications/read-all', {
      method: 'PUT',
    });
    if (!fallback.success && fallback.error?.includes('404')) {
      const postFallback = await apiFetch<{ success: boolean }>('/notifications/read-all', {
        method: 'POST',
      });
      return postFallback;
    }
    return fallback;
  }

  return result;
}
