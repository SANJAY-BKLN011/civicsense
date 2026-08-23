import React, { createContext, useContext, useState, useEffect } from 'react';

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
  // Citizen Notifications
  {
    id: 'notif-c1',
    role: 'citizen',
    title: 'Complaint Submitted',
    message: 'Your complaint CIV-1024 was successfully submitted to the municipal triage system.',
    timestamp: 'Aug 20, 2026 at 10:30 AM',
    isRead: true,
    complaintId: 'CIV-1024',
    type: 'submitted',
  },
  {
    id: 'notif-c2',
    role: 'citizen',
    title: 'Complaint Assigned',
    message: 'Your complaint CIV-1024 has been assigned to the Municipality / Sanitation Department.',
    timestamp: 'Aug 20, 2026 at 11:15 AM',
    isRead: true,
    complaintId: 'CIV-1024',
    type: 'assigned',
  },
  {
    id: 'notif-c3',
    role: 'citizen',
    title: 'Complaint In Progress',
    message: 'Work has started on complaint CIV-1024 by Field Officer Sanjay Kumar.',
    timestamp: 'Aug 21, 2026 at 09:00 AM',
    isRead: false,
    complaintId: 'CIV-1024',
    type: 'in_progress',
  },
  {
    id: 'notif-c4',
    role: 'citizen',
    title: 'Complaint Resolved',
    message: 'Your complaint CIV-1009 has been marked as resolved by Municipality Sanitation.',
    timestamp: 'Aug 17, 2026 at 03:45 PM',
    isRead: false,
    complaintId: 'CIV-1009',
    type: 'resolved',
  },

  // Officer Notifications
  {
    id: 'notif-o1',
    role: 'officer',
    title: 'High Priority Complaint',
    message: 'Complaint CIV-1031 (Stagnant Water Logging) requires immediate attention in Ward 12.',
    timestamp: 'Aug 21, 2026 at 08:00 AM',
    isRead: false,
    complaintId: 'CIV-1031',
    type: 'high_priority',
  },
  {
    id: 'notif-o2',
    role: 'officer',
    title: 'New Complaint Assigned',
    message: 'Complaint CIV-2026-085 (Broken Footpath Slab) has been assigned to your department queue.',
    timestamp: 'Aug 21, 2026 at 08:45 AM',
    isRead: false,
    complaintId: 'CIV-2026-085',
    type: 'assigned',
  },
  {
    id: 'notif-o3',
    role: 'officer',
    title: 'Complaint Update',
    message: 'Citizen Rahul Mehra added a location note to complaint CIV-1024.',
    timestamp: 'Aug 21, 2026 at 02:30 PM',
    isRead: true,
    complaintId: 'CIV-1024',
    type: 'update',
  },
];

interface NotificationContextType {
  notifications: NotificationItem[];
  citizenNotifications: NotificationItem[];
  officerNotifications: NotificationItem[];
  citizenUnreadCount: number;
  officerUnreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: (role?: 'citizen' | 'officer') => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
  resetNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return initialNotifications;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications to localStorage', e);
    }
  }, [notifications]);

  const citizenNotifications = notifications.filter((n) => n.role === 'citizen');
  const officerNotifications = notifications.filter((n) => n.role === 'officer');

  const citizenUnreadCount = citizenNotifications.filter((n) => !n.isRead).length;
  const officerUnreadCount = officerNotifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = (role?: 'citizen' | 'officer') => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (!role || n.role === role) {
          return { ...n, isRead: true };
        }
        return n;
      })
    );
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp,
      isRead: false,
    };

    setNotifications((prev) => [newItem, ...prev]);
  };

  const resetNotifications = () => {
    setNotifications(initialNotifications);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        citizenNotifications,
        officerNotifications,
        citizenUnreadCount,
        officerUnreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        resetNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
