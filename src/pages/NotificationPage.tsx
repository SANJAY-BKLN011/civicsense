import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Inbox,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  RotateCcw,
  User,
  Shield,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  CardContent,
  Button,
  EmptyState,
  LoadingState,
} from '../components/ui';
import { useNotifications, type NotificationItem } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

type StatusFilter = 'ALL' | 'UNREAD' | 'READ';
type RoleFilter = 'ALL' | 'CITIZEN' | 'OFFICER';

export function NotificationPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isOfficerAuthenticated } = useAuth();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    resetNotifications,
  } = useNotifications();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(
    isOfficerAuthenticated ? 'OFFICER' : isAuthenticated ? 'CITIZEN' : 'ALL'
  );
  const [uiState, setUiState] = useState<'normal' | 'loading' | 'empty'>('normal');

  const filteredNotifications = (): NotificationItem[] => {
    if (uiState === 'empty') return [];

    return notifications.filter((item) => {
      const matchRole =
        roleFilter === 'ALL' ||
        (roleFilter === 'CITIZEN' && item.role === 'citizen') ||
        (roleFilter === 'OFFICER' && item.role === 'officer');

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'UNREAD' && !item.isRead) ||
        (statusFilter === 'READ' && item.isRead);

      return matchRole && matchStatus;
    });
  };

  const displayList = filteredNotifications();
  const unreadTotal = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (item: NotificationItem) => {
    markAsRead(item.id);
    if (item.complaintId) {
      const target =
        item.role === 'citizen'
          ? `/citizen/complaints/${item.complaintId}`
          : `/officer/complaints/${item.complaintId}`;
      navigate(target);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'submitted':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'assigned':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'in_progress':
        return <Sparkles className="w-5 h-5 text-sky-600" />;
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'high_priority':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Notification Center"
        description="View complete notification history and track civic updates across Citizen and Officer portals."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Notifications' }]}
        actions={
          <div className="flex items-center gap-2">
            {unreadTotal > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsRead()}
                leftIcon={<CheckCheck className="w-3.5 h-3.5 text-blue-600" />}
              >
                Mark All as Read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetNotifications}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Data
            </Button>
          </div>
        }
      />

      {/* Preview Switcher */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase text-slate-500 mr-1">Preview State:</span>
          {(['normal', 'loading', 'empty'] as const).map((st) => (
            <Button
              key={st}
              size="sm"
              variant={uiState === st ? 'secondary' : 'outline'}
              onClick={() => setUiState(st)}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </Button>
          ))}
        </div>
        <span className="text-xs text-slate-500 font-mono">{unreadTotal} Total Unread</span>
      </div>

      {uiState === 'loading' && <LoadingState title="Loading notification history..." />}

      {uiState === 'empty' ? (
        <EmptyState
          icon={<Inbox className="w-8 h-8 text-slate-400" />}
          title="No notifications yet."
          description="You have no notifications or updates logged in your CivicSense account history."
        />
      ) : (
        <div className="space-y-4">
          {/* Filter Bar */}
          <Card className="bg-slate-50/80 shadow-2xs">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Role Filter Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Portal:
                </span>
                {[
                  { id: 'ALL', label: 'All Portals' },
                  { id: 'CITIZEN', label: 'Citizen', icon: <User className="w-3 h-3" /> },
                  { id: 'OFFICER', label: 'Officer', icon: <Shield className="w-3 h-3" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRoleFilter(tab.id as RoleFilter)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      roleFilter === tab.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Read / Unread Status Filter */}
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'UNREAD', label: 'Unread' },
                  { id: 'READ', label: 'Read' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id as StatusFilter)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      statusFilter === st.id
                        ? 'bg-blue-100 text-blue-800 font-bold border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* List View */}
          {displayList.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-lg border border-dashed border-slate-300 space-y-2">
              <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-slate-700">No notifications match your current filters.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRoleFilter('ALL');
                  setStatusFilter('ALL');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {displayList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-4 sm:p-5 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
                    !item.isRead
                      ? 'bg-blue-50/60 border-blue-200 hover:border-blue-400 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleNotificationClick(item);
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      {getIcon(item.type)}
                    </div>

                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                            item.role === 'citizen'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-slate-800 text-slate-100 border-slate-700'
                          }`}
                        >
                          {item.role} portal
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item.complaintId}
                        </span>
                        {!item.isRead && (
                          <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">
                            UNREAD
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-900 group-hover:text-slate-700">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>

                      <span className="text-[11px] text-slate-400 font-mono block pt-1">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
