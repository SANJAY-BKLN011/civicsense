import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  ChevronRight,
  Inbox,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  X,
  Sparkles,
} from 'lucide-react';
import { useNotifications, type NotificationItem } from '../../context/NotificationContext';

interface NotificationPanelProps {
  role: 'citizen' | 'officer';
  align?: 'left' | 'right';
}

export function NotificationPanel({ role, align = 'right' }: NotificationPanelProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    citizenNotifications,
    officerNotifications,
    citizenUnreadCount,
    officerUnreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const notifications = role === 'citizen' ? citizenNotifications : officerNotifications;
  const unreadCount = role === 'citizen' ? citizenUnreadCount : officerUnreadCount;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (item: NotificationItem) => {
    markAsRead(item.id);
    setIsOpen(false);

    if (item.complaintId) {
      const targetRoute =
        role === 'citizen'
          ? `/citizen/complaints/${item.complaintId}`
          : `/officer/complaints/${item.complaintId}`;
      navigate(targetRoute);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'submitted':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'assigned':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'in_progress':
        return <Sparkles className="w-4 h-4 text-sky-600" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'high_priority':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
        aria-label={`Notifications panel (${unreadCount} unread)`}
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white shadow-2xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150`}
        >
          {/* Panel Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <h4 className="font-bold text-sm">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-blue-600 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} NEW
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead(role)}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">No notifications yet</p>
                <p className="text-[11px] text-slate-400">Updates regarding reported issues will appear here.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-slate-50 group ${
                    !item.isRead ? 'bg-blue-50/50' : 'bg-white'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleNotificationClick(item);
                  }}
                >
                  <div className="p-2 rounded-lg bg-slate-100 shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 space-y-1 text-left">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className={`text-xs font-bold ${!item.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {item.title}
                      </h5>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.message}</p>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                      <span className="text-[11px] font-mono text-slate-700 font-semibold bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                        {item.complaintId}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 hover:underline"
            >
              <span>View All Notification History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
