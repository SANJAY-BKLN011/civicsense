import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  type BackendNotificationItem,
} from '../api/notifications';
import { getToken, USE_MOCK_DATA } from '../api/client';
import { useAuth } from './AuthContext';

export interface NotificationItem {
  id: string;
  role: 'citizen' | 'officer';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  complaintId: string;
  type: 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'update' | 'high_priority';
}

const STORAGE_KEY = 'civicsense_notifications_v1';

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-c1', role: 'citizen', title: 'Complaint Submitted',
    message: 'Your complaint CIV-1024 was successfully submitted to the municipal triage system.',
    timestamp: 'Aug 20, 2026 at 10:30 AM', isRead: true, complaintId: 'CIV-1024', type: 'submitted',
  },
  {
    id: 'notif-c2', role: 'citizen', title: 'Complaint Assigned',
    message: 'Your complaint CIV-1024 has been assigned to the Municipality / Sanitation Department.',
    timestamp: 'Aug 20, 2026 at 11:15 AM', isRead: true, complaintId: 'CIV-1024', type: 'assigned',
  },
  {
    id: 'notif-c3', role: 'citizen', title: 'Complaint In Progress',
    message: 'Work has started on complaint CIV-1024 by Field Officer Sanjay Kumar.',
    timestamp: 'Aug 21, 2026 at 09:00 AM', isRead: false, complaintId: 'CIV-1024', type: 'in_progress',
  },
  {
    id: 'notif-c4', role: 'citizen', title: 'Complaint Resolved',
    message: 'Your complaint CIV-1009 has been marked as resolved by Municipality Sanitation.',
    timestamp: 'Aug 17, 2026 at 03:45 PM', isRead: false, complaintId: 'CIV-1009', type: 'resolved',
  },
  {
    id: 'notif-o1', role: 'officer', title: 'High Priority Complaint',
    message: 'Complaint CIV-1031 (Stagnant Water Logging) requires immediate attention in Ward 12.',
    timestamp: 'Aug 21, 2026 at 08:00 AM', isRead: false, complaintId: 'CIV-1031', type: 'high_priority',
  },
  {
    id: 'notif-o2', role: 'officer', title: 'New Complaint Assigned',
    message: 'Complaint CIV-2026-085 (Broken Footpath Slab) has been assigned to your department queue.',
    timestamp: 'Aug 21, 2026 at 08:45 AM', isRead: false, complaintId: 'CIV-2026-085', type: 'assigned',
  },
  {
    id: 'notif-o3', role: 'officer', title: 'Complaint Update',
    message: 'Citizen Rahul Mehra added a location note to complaint CIV-1024.',
    timestamp: 'Aug 21, 2026 at 02:30 PM', isRead: true, complaintId: 'CIV-1024', type: 'update',
  },
];

interface NotificationContextType {
  notifications: NotificationItem[];
  citizenNotifications: NotificationItem[];
  officerNotifications: NotificationItem[];
  citizenUnreadCount: number;
  officerUnreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: (role?: 'citizen' | 'officer') => Promise<void>;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
  resetNotifications: () => void;
  refetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function mapBackendType(type: string): NotificationItem['type'] {
  switch (type) {
    case 'COMPLAINT_SUBMITTED': return 'submitted';
    case 'COMPLAINT_ASSIGNED': return 'assigned';
    case 'STATUS_CHANGED': return 'in_progress';
    case 'COMPLAINT_RESOLVED': return 'resolved';
    default: return 'update';
  }
}

function mapBackendNotification(b: BackendNotificationItem, role: 'citizen' | 'officer'): NotificationItem {
  return {
    id: b.id,
    role,
    title: b.title,
    message: b.message,
    timestamp: new Date(b.created_at).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    }),
    isRead: b.is_read,
    complaintId: b.complaint_id || '',
    type: mapBackendType(b.type),
  };
}

function dedupeNotifications(items: NotificationItem[]): NotificationItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, officerUser, adminUser, isLoading: authLoading } = useAuth();
  const activeUserId = user?.id || officerUser?.id || adminUser?.id || null;
  const activeRole: 'citizen' | 'officer' = officerUser ? 'officer' : 'citizen';

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fall through to defaults.
    }
    return initialNotifications;
  });
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);
  const fetchedSessionKeyRef = useRef<string | null>(null);

  const fetchRealNotifications = useCallback(async (force = false) => {
    if (USE_MOCK_DATA) return;
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    const sessionKey = `${token}_${activeUserId || ''}`;
    if (isFetchingRef.current) return;
    if (!force && fetchedSessionKeyRef.current === sessionKey) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const res = await getNotificationsApi({ limit: 50 });
      if (res.success && res.data) {
        const payload = res.data as any;
        const list = Array.isArray(payload) ? payload : payload.notifications || [];
        setNotifications(
          dedupeNotifications((list as BackendNotificationItem[]).map((item) => mapBackendNotification(item, activeRole))),
        );
        fetchedSessionKeyRef.current = sessionKey;
      } else {
        setError(res.error || 'Unable to load notifications from server.');
      }
    } catch {
      setError('Unable to load notifications from server.');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [activeRole, activeUserId]);

  // Real mode: fetch once for the authenticated session/user. Do not depend on
  // notification state, otherwise every state update can retrigger the effect.
  useEffect(() => {
    if (USE_MOCK_DATA || authLoading) return;

    const token = getToken();
    if (token) {
      void fetchRealNotifications();
    } else {
      fetchedSessionKeyRef.current = null;
      setIsLoading(false);
    }
  }, [authLoading, activeUserId, activeRole, fetchRealNotifications]);

  // Mock mode only: persist local demo notifications. Real mode never writes
  // backend notifications into localStorage, so mock and real data cannot mix.
  useEffect(() => {
    if (!USE_MOCK_DATA) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications to localStorage', e);
    }
  }, [notifications]);

  const citizenNotifications = useMemo(() => notifications.filter((n) => n.role === 'citizen'), [notifications]);
  const officerNotifications = useMemo(() => notifications.filter((n) => n.role === 'officer'), [notifications]);
  const citizenUnreadCount = useMemo(() => citizenNotifications.filter((n) => !n.isRead).length, [citizenNotifications]);
  const officerUnreadCount = useMemo(() => officerNotifications.filter((n) => !n.isRead).length, [officerNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    if (!USE_MOCK_DATA) await markNotificationReadApi(id);
  }, []);

  const markAllAsRead = useCallback(async (role?: 'citizen' | 'officer') => {
    setNotifications((prev) => prev.map((n) => !role || n.role === role ? { ...n, isRead: true } : n));
    if (!USE_MOCK_DATA) await markAllNotificationsReadApi();
  }, []);

  const addNotification = useCallback((item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
    const now = new Date();
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      isRead: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
  }, []);

  const resetNotifications = useCallback(() => {
    setNotifications(initialNotifications);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleRefetch = useCallback(() => fetchRealNotifications(true), [fetchRealNotifications]);

  const contextValue = useMemo(() => ({
    notifications,
    citizenNotifications,
    officerNotifications,
    citizenUnreadCount,
    officerUnreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    addNotification,
    resetNotifications,
    refetchNotifications: handleRefetch,
  }), [
    notifications,
    citizenNotifications,
    officerNotifications,
    citizenUnreadCount,
    officerUnreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    addNotification,
    resetNotifications,
    handleRefetch,
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
