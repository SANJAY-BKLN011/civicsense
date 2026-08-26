import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  MapPin,
  Calendar,
  Building,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOfficerComplaints } from '../../context/OfficerComplaintsContext';
import {
  PageHeader,
  Card,
  CardContent,
  Button,
  Badge,
  LoadingState,
  ErrorMessage,
  type BadgeVariant,
} from '../../components/ui';
import { getOfficerComplaintsApi, type ComplaintResponseData } from '../../api/complaints';
import { USE_MOCK_DATA } from '../../api/client';

export function OfficerDashboard() {
  const navigate = useNavigate();
  const { officerUser, logoutOfficer } = useAuth();
  const { complaints: storeComplaints } = useOfficerComplaints();

  const [apiComplaints, setApiComplaints] = useState<ComplaintResponseData[]>([]);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
  const [apiError, setApiError] = useState<string | null>(null);

  const [dashboardState, setDashboardState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');

  const officerName = officerUser?.name || 'Sanjay Kumar';
  const officerDesignation = officerUser?.designation || 'Field Officer';
  const officerDepartment = officerUser?.department || 'Municipality / Sanitation';
  const officerBadge = officerUser?.badgeId || 'OFF-SAN-402';
  const officerWard = officerUser?.ward || 'Ward 12 - Central District';

  const handleLogout = () => {
    logoutOfficer();
    navigate('/officer/login', { replace: true });
  };

  const fetchRealOfficerComplaints = async () => {
    setIsLoading(true);
    setApiError(null);

    const res = await getOfficerComplaintsApi();
    if (res.success && res.data) {
      const list = Array.isArray(res.data) ? res.data : (res.data as any).complaints || [];
      setApiComplaints(list);
    } else {
      setApiError(res.error || 'Unable to load assigned officer complaints from server.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      fetchRealOfficerComplaints();
    }
  }, []);

  const activeComplaints = !USE_MOCK_DATA
    ? apiComplaints.map((c) => ({
        id: c.id,
        title: c.title,
        department: c.department || officerDepartment,
        location: c.location,
        submittedDate: c.submittedDate || (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Aug 20, 2026'),
        status: (c.status || 'NEW') as BadgeVariant,
        priority: c.priority || 'Medium',
        thumbnailIcon: c.thumbnailIcon || '📌',
        description: c.description,
      }))
    : storeComplaints;

  const newCount = activeComplaints.filter((c) => c.status === 'NEW').length;
  const assignedCount = activeComplaints.filter((c) => c.status === 'ASSIGNED').length;
  const inProgressCount = activeComplaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolvedCount = activeComplaints.filter((c) => c.status === 'RESOLVED').length;
  const highPriorityCount = activeComplaints.filter((c) => c.priority === 'Critical' || c.priority === 'High').length;

  const stats = [
    {
      title: 'New Complaints',
      value: `${newCount}`,
      description: 'In department queue',
      icon: <AlertCircle className="w-5 h-5 text-sky-700" />,
      bg: 'bg-sky-50',
      border: 'border-sky-100',
    },
    {
      title: 'Assigned Complaints',
      value: `${assignedCount}`,
      description: 'Active assigned cases',
      icon: <Shield className="w-5 h-5 text-blue-700" />,
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      title: 'In Progress',
      value: `${inProgressCount}`,
      description: 'On-site field work',
      icon: <Clock className="w-5 h-5 text-amber-700" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      title: 'Resolved',
      value: `${resolvedCount}`,
      description: 'Closed cases',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      title: 'High Priority',
      value: `${highPriorityCount}`,
      description: 'Critical / High cases',
      icon: <AlertCircle className="w-5 h-5 text-rose-700" />,
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
  ];

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const displayComplaints =
    dashboardState === 'empty' ? [] : activeComplaints.slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Officer Welcome Header */}
      <PageHeader
        title={`Welcome, Officer ${officerName.split(' ')[0]}`}
        description="Review your assigned complaints, track field progress, and manage ward resolutions."
        breadcrumbs={[
          { label: 'Officer Portal', href: '/officer' },
          { label: 'Dashboard' },
        ]}
        badge={
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs bg-slate-800 text-slate-100 px-2.5 py-1 rounded-full font-semibold border border-slate-700">
              {officerBadge}
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {officerDesignation}
            </span>
          </div>
        }
        actions={
          <Button variant="danger" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        }
      />

      {/* Officer Identity Context Card */}
      <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
            {officerName.charAt(0)}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
              Municipal Officer — {officerDesignation}
            </div>
            <div className="text-base font-bold text-white">{officerName}</div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>{officerDepartment}</span>
              <span className="text-slate-600">•</span>
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{officerWard}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Link to="/officer/complaints">
            <Button size="sm" variant="primary" rightIcon={<ChevronRight className="w-4 h-4" />}>
              Manage Assigned Cases ({activeComplaints.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* UI State Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase text-slate-500 mr-1">
            Preview UI State:
          </span>
          {(['normal', 'loading', 'empty', 'error'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={dashboardState === s ? 'secondary' : 'outline'}
              onClick={() => setDashboardState(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">
          {!USE_MOCK_DATA ? 'LIVE BACKEND CONNECTION' : 'DEMO MODE'}
        </span>
      </div>

      {/* LOADING STATE */}
      {(dashboardState === 'loading' || (isLoading && !USE_MOCK_DATA)) && (
        <LoadingState
          title="Loading officer dashboard..."
          description="Retrieving assigned complaints and department statistics."
        />
      )}

      {/* ERROR STATE */}
      {(dashboardState === 'error' || (apiError && !USE_MOCK_DATA)) && (
        <div className="space-y-4">
          <ErrorMessage
            severity="error"
            title="Unable to load officer complaints"
            message={apiError || 'Failed to retrieve your assigned complaints from the municipal server.'}
          />
          {!USE_MOCK_DATA && (
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRealOfficerComplaints}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Retry Loading Dashboard
              </Button>
            </div>
          )}
        </div>
      )}

      {/* NORMAL & EMPTY CONTENT */}
      {dashboardState !== 'loading' && dashboardState !== 'error' && (!isLoading || USE_MOCK_DATA) && !apiError && (
        <>
          {/* Complaint Statistics */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Department Complaint Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.map((stat, i) => (
                <Card key={i} className={`border ${stat.border} shadow-2xs`}>
                  <CardContent className="flex items-start justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {stat.title}
                      </p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {dashboardState === 'empty' ? '0' : stat.value}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`p-2.5 rounded-lg ${stat.bg} shrink-0`}>
                      {stat.icon}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Assigned Complaints Preview List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Assigned Case Queue
              </h3>
              <Link to="/officer/complaints" className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                View All Complaints ({activeComplaints.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {displayComplaints.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-lg border border-dashed border-slate-300">
                <p className="text-sm font-semibold text-slate-700">No complaints assigned to you.</p>
                <p className="text-xs text-slate-500 mt-1">Check back later when new citizen issues are dispatched.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayComplaints.map((c) => (
                  <Card key={c.id} className="hover:border-slate-400 transition-all shadow-2xs text-left">
                    <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                            {c.id}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityStyle(c.priority)}`}>
                            {c.priority} Priority
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{c.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {c.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {c.submittedDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant={c.status} size="md" dot />
                        <Link to={`/officer/complaints/${c.id}`}>
                          <Button size="sm" variant="outline" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
