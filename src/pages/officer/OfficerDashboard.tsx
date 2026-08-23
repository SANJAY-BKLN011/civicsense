import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  FilePlus,
  MapPin,
  Calendar,
  Building,
  ChevronRight,
  RotateCcw,
  Inbox,
  Sparkles,
  Users,
  ClipboardList,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOfficerComplaints } from '../../context/OfficerComplaintsContext';
import {
  PageHeader,
  Card,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Badge,
  EmptyState,
  LoadingState,
  ErrorMessage,
  type BadgeVariant,
} from '../../components/ui';
import { mockOfficerComplaints } from '../../data/mockOfficerComplaints';

export function OfficerDashboard() {
  const navigate = useNavigate();
  const { officerUser, logoutOfficer } = useAuth();

  const [dashboardState, setDashboardState] = useState<
    'normal' | 'loading' | 'empty' | 'error'
  >('normal');

  const officerName = officerUser?.name || 'Sanjay Kumar';
  const officerDesignation = officerUser?.designation || 'Field Officer';
  const officerDepartment = officerUser?.department || 'Municipality / Sanitation';
  const officerBadge = officerUser?.badgeId || 'OFF-SAN-402';
  const officerWard = officerUser?.ward || 'Ward 12 - Central District';

  const handleLogout = () => {
    logoutOfficer();
    navigate('/officer/login', { replace: true });
  };

  const { complaints: storeComplaints } = useOfficerComplaints();

  const newCount = storeComplaints.filter((c) => c.status === 'NEW').length;
  const assignedCount = storeComplaints.filter((c) => c.status === 'ASSIGNED').length;
  const inProgressCount = storeComplaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolvedCount = storeComplaints.filter((c) => c.status === 'RESOLVED').length;
  const highPriorityCount = storeComplaints.filter((c) => c.priority === 'Critical' || c.priority === 'High').length;

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
    dashboardState === 'empty' ? [] : mockOfficerComplaints.slice(0, 5);

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
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        }
      />

      {/* Officer Identity & Department Context Card */}
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
            <Button variant="outline" size="sm" className="text-white border-slate-600 hover:bg-slate-800">
              My Complaints
            </Button>
          </Link>
          <Link to="/officer/department">
            <Button variant="outline" size="sm" className="text-white border-slate-600 hover:bg-slate-800">
              Department Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* UI State Preview Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase text-slate-500 mr-1">
            Dashboard State:
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
        <span className="text-xs text-slate-500">F6 Officer Dashboard</span>
      </div>

      {/* LOADING STATE */}
      {dashboardState === 'loading' && (
        <LoadingState
          title="Loading officer dashboard..."
          description="Retrieving assigned complaints and department statistics."
        />
      )}

      {/* ERROR STATE */}
      {dashboardState === 'error' && (
        <div className="space-y-4">
          <ErrorMessage
            severity="error"
            title="Error Loading Dashboard Data"
            message="Unable to retrieve your assigned complaints from the municipal server. Please check your connection or retry."
          />
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDashboardState('normal')}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Retry Loading Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* NORMAL & EMPTY CONTENT */}
      {(dashboardState === 'normal' || dashboardState === 'empty') && (
        <>
          {/* 3. Complaint Statistics */}
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
                      <p className="text-xs text-slate-500 pt-0.5">{stat.description}</p>
                    </div>
                    <div className={`p-2.5 rounded-lg ${stat.bg} shrink-0`}>
                      {stat.icon}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 4. Assigned Complaints Section */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Assigned Complaints</h3>
                <p className="text-xs text-slate-500">
                  Click any complaint to view full case details and take action
                </p>
              </div>
              <Link to="/officer/complaints">
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                  View All
                </Button>
              </Link>
            </div>

            {dashboardState === 'empty' ? (
              <EmptyState
                icon={<Inbox className="w-6 h-6 text-slate-400" />}
                title="No Complaints Assigned"
                description="You have no active complaints assigned in your department queue. Check back later or view the department queue."
                action={
                  <Link to="/officer/department">
                    <Button size="sm" variant="secondary" leftIcon={<ClipboardList className="w-4 h-4" />}>
                      View Department Queue
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {displayComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    onClick={() => navigate(`/officer/complaints/${complaint.id}`)}
                    className="p-4 sm:p-5 rounded-lg bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ')
                        navigate(`/officer/complaints/${complaint.id}`);
                    }}
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                        {complaint.thumbnailIcon}
                      </div>

                      <div className="space-y-1.5 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {complaint.id}
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityStyle(complaint.priority)}`}
                          >
                            {complaint.priority} Priority
                          </span>
                        </div>

                        <CardTitle className="text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                          {complaint.title}
                        </CardTitle>

                        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
                          <span className="flex items-center gap-1 font-medium text-slate-600">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            {complaint.department}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {complaint.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {complaint.submittedDate}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {complaint.citizenName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status Badge & Chevron */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <Badge variant={complaint.status as BadgeVariant} size="md" dot />
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Quick Widget */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-blue-400 border border-slate-700 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Officer Dispatch & Alert Center</h4>
                <p className="text-xs text-slate-400">Receive real-time ward assignment alerts and citizen complaint updates.</p>
              </div>
            </div>
            <Link to="/notifications" className="shrink-0">
              <Button variant="outline" size="sm" className="text-white border-slate-700 hover:bg-slate-800" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                View All Alerts
              </Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/officer/complaints" className="block">
                <Card className="hover:border-slate-300 hover:shadow-xs transition-all h-full flex flex-col justify-between">
                  <CardContent className="py-4 space-y-2">
                    <div className="w-9 h-9 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-sm">Assigned Complaints</CardTitle>
                    <p className="text-xs text-slate-500">View and manage your personally assigned civic cases</p>
                  </CardContent>
                  <CardFooter className="bg-slate-50/70 py-2.5 text-xs text-slate-700 font-semibold flex items-center justify-between">
                    <span>My Cases</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </CardFooter>
                </Card>
              </Link>

              <Link to="/officer/department" className="block">
                <Card className="hover:border-slate-300 hover:shadow-xs transition-all h-full flex flex-col justify-between">
                  <CardContent className="py-4 space-y-2">
                    <div className="w-9 h-9 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-sm">Department Queue</CardTitle>
                    <p className="text-xs text-slate-500">Browse all new complaints in the department incoming queue</p>
                  </CardContent>
                  <CardFooter className="bg-slate-50/70 py-2.5 text-xs text-sky-700 font-semibold flex items-center justify-between">
                    <span>View Queue</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </CardFooter>
                </Card>
              </Link>

              <Link to="/officer/profile" className="block">
                <Card className="hover:border-slate-300 hover:shadow-xs transition-all h-full flex flex-col justify-between">
                  <CardContent className="py-4 space-y-2">
                    <div className="w-9 h-9 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FilePlus className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-sm">Officer Profile</CardTitle>
                    <p className="text-xs text-slate-500">View your official credentials, department, and contact info</p>
                  </CardContent>
                  <CardFooter className="bg-slate-50/70 py-2.5 text-xs text-emerald-700 font-semibold flex items-center justify-between">
                    <span>My Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </CardFooter>
                </Card>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
