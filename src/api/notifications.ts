import { apiFetch } from './client';

export type BackendNotificationType =
  | 'COMPLAINT_SUBMITTED'
  | 'COMPLAINT_ASSIGNED'
  | 'STATUS_CHANGED'
  | 'COMPLAINT_RESOLVED'
  | 'OFFICER_APPROVED'
  | 'OFFICER_REJECTED';

export interface BackendNotificationItem {
  id: string;
  recipient_user_id: string;
  complaint_id: string | null;
  title: string;
  message: string;
  type: BackendNotificationType | string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: BackendNotificationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

/** GET /api/v1/notifications — authenticated user's notifications. */
export async function getNotificationsApi(params?: { page?: number; limit?: number; isRead?: boolean }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(Math.max(1, params.page)));
  if (params?.limit) query.set('limit', String(Math.min(50, Math.max(1, params.limit))));
  if (params?.isRead !== undefined) query.set('is_read', String(params.isRead));

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiFetch<NotificationsResponse>(`/notifications${suffix}`, { method: 'GET' });
}

/** GET /api/v1/notifications/unread-count */
export async function getUnreadCountApi() {
  return apiFetch<{ count: number }>('/notifications/unread-count', { method: 'GET' });
}

/** PATCH /api/v1/notifications/:notificationId/read */
export async function markNotificationReadApi(id: string) {
  return apiFetch<BackendNotificationItem>(`/notifications/${encodeURIComponent(id)}/read`, {
    method: 'PATCH',
  });
}

/** PATCH /api/v1/notifications/read-all */
export async function markAllNotificationsReadApi() {
  return apiFetch<{ updated_count: number }>('/notifications/read-all', {
    method: 'PATCH',
  });
}
