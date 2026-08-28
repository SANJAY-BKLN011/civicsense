import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  AlertCircle,
  Clock,
  CheckCircle2,
  Users,
  ShieldCheck,
  Search,
  Building,
  ChevronRight,
  Filter,
  X,
  RotateCcw,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  LoadingState,
  ErrorMessage,
  type BadgeVariant,
} from '../../components/ui';
import { useAdminComplaints } from '../../context/AdminComplaintsContext';
import { useDepartments } from '../../context/DepartmentContext';
import { getAdminStatsApi, getAdminComplaintsApi, type AdminStatsData } from '../../api/admin';
import type { ComplaintResponseData } from '../../api/complaints';
import { USE_MOCK_DATA } from '../../api/client';

type StatusFilter = 'ALL' | 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
type PriorityFilter = 'ALL' | 'Low' | 'Medium' | 'High' | 'Critical';

export function AdminDashboard() {
  const { complaints: mockComplaints, officers: mockOfficers, resetToMockData } = useAdminComplaints();
  const { departments } = useDepartments();

  const [apiStats, setApiStats] = useState<AdminStatsData | null>(null);
  const [apiComplaints, setApiComplaints] = useState<ComplaintResponseData[]>([]);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
  const [apiError, setApiError] = useState<string | null>(null);

  const [dashboardState, setDashboardState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  const fetchRealAdminData = async () => {
    setIsLoading(true);
    setApiError(null);

    const [statsRes, complaintsRes] = await Promise.all([
      getAdminStatsApi(),
      getAdminComplaintsApi({
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
        department: departmentFilter,
      }),
    ]);

    if (statsRes.success && statsRes.data) {
      setApiStats(statsRes.data);
    }

    if (complaintsRes.success && complaintsRes.data) {
      const list = Array.isArray(complaintsRes.data) ? complaintsRes.data : (complaintsRes.data as any).complaints || [];
      setApiComplaints(list);
    } else {
      setApiError(
        complaintsRes.error?.includes('403')
          ? 'You are not authorized to access the admin portal.'
          : complaintsRes.error || 'Unable to load admin dashboard data from server.'
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      fetchRealAdminData();

      const handleFocus = () => {
        fetchRealAdminData();
      };
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [searchTerm, statusFilter, priorityFilter, departmentFilter]);

  const complaintsList = !USE_MOCK_DATA
    ? apiComplaints.map((c) => ({
        id: String(c.id || ''),
        title: typeof c.title === 'string' ? c.title : (c.title as any)?.name || 'Untitled',
        department: typeof c.department === 'string' ? c.department : (c.department as any)?.name || 'Municipality / Sanitation',
        location: typeof c.location === 'string' ? c.location : (c.location as any)?.address || 'Address not provided',
        submittedDate: String(c.submittedDate || (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Aug 20, 2026')),
        status: (typeof c.status === 'string' ? c.status : (c.status as any)?.name || 'NEW') as BadgeVariant,
        priority: typeof c.priority === 'string' ? c.priority : (c.priority as any)?.name || 'Medium',
        citizenName: typeof c.citizenName === 'string' ? c.citizenName : (c as any).citizen?.name || 'Sanjay Patel',
        assignedOfficer: typeof c.assignedOfficer === 'string' ? c.assignedOfficer : (c as any).officer?.name || 'Unassigned',
        assignedOfficerId: String(c.assignedOfficerId || (c as any).officer?.id || ''),
      }))
    : mockComplaints;

  const totalCount = apiStats?.totalComplaints ?? complaintsList.length;
  const newCount = apiStats?.newComplaints ?? complaintsList.filter((c) => c.status === 'NEW').length;
  const inProgressCount = apiStats?.inProgressComplaints ?? complaintsList.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolvedCount = apiStats?.resolvedComplaints ?? complaintsList.filter((c) => c.status === 'RESOLVED').length;
  const totalCitizens = apiStats?.totalCitizens ?? 1420;
  const totalOfficers = apiStats?.totalOfficers ?? mockOfficers.length;

  const stats = [
    { title: 'Total Complaints', value: `${totalCount}`, desc: 'System-wide ward reports', icon: <Layers className="w-5 h-5 text-blue-700" />, bg: 'bg-blue-50' },
    { title: 'New Complaints', value: `${newCount}`, desc: 'Awaiting triage', icon: <AlertCircle className="w-5 h-5 text-sky-700" />, bg: 'bg-sky-50' },
    { title: 'In Progress', value: `${inProgressCount}`, desc: 'Active field cases', icon: <Clock className="w-5 h-5 text-amber-700" />, bg: 'bg-amber-50' },
    { title: 'Resolved', value: `${resolvedCount}`, desc: 'Closed cases', icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />, bg: 'bg-emerald-50' },
    { title: 'Total Citizens', value: `${totalCitizens}`, desc: 'Registered accounts', icon: <Users className="w-5 h-5 text-purple-700" />, bg: 'bg-purple-50' },
    { title: 'Total Officers', value: `${totalOfficers}`, desc: 'Active municipal staff', icon: <ShieldCheck className="w-5 h-5 text-indigo-700" />, bg: 'bg-indigo-50' },
  ];

  const filteredComplaints = complaintsList.filter((c) => {
    if (dashboardState === 'empty') return false;
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchDept = departmentFilter === 'ALL' || c.department === departmentFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.citizenName.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q);
    return matchStatus && matchPriority && matchDept && matchSearch;
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="System Administration Dashboard"
        description="System-wide civic complaint monitoring, department performance analytics, and officer management."
        breadcrumbs={[{ label: 'Admin Portal', href: '/admin' }, { label: 'Dashboard' }]}
        actions={
          USE_MOCK_DATA ? (
            <Button variant="outline" size="sm" onClick={resetToMockData} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>Reset Mock Data</Button>
          ) : undefined
        }
      />

      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase text-slate-500 mr-1">Preview State:</span>
          {(['normal', 'loading', 'empty', 'error'] as const).map((s) => (
            <Button key={s} size="sm" variant={dashboardState === s ? 'secondary' : 'outline'} onClick={() => setDashboardState(s)}>
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
        <LoadingState title="Loading dashboard..." description="Retrieving system statistics, departments, and complaints." />
      )}

      {/* ERROR STATE */}
      {(dashboardState === 'error' || (apiError && !USE_MOCK_DATA)) && (
        <div className="space-y-4">
          <ErrorMessage
            severity="error"
            title="Unable to load admin dashboard"
            message={apiError || 'Failed to retrieve administrative data from server.'}
          />
          {!USE_MOCK_DATA && (
            <div className="text-center">
              <Button variant="outline" size="sm" onClick={fetchRealAdminData} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                Retry Loading Dashboard
              </Button>
            </div>
          )}
        </div>
      )}

      {/* NORMAL & EMPTY CONTENT */}
      {dashboardState !== 'loading' && dashboardState !== 'error' && (!isLoading || USE_MOCK_DATA) && !apiError && (
        <>
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {stats.map((st, i) => (
              <Card key={i} className="shadow-2xs text-left">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{st.title}</span>
                    <div className={`p-2 rounded-lg ${st.bg}`}>{st.icon}</div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{st.value}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{st.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Controls & Complaints List */}
          <div className="space-y-4">
            <Card className="shadow-2xs">
              <CardContent className="p-4 sm:p-5 space-y-4 text-left">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search by Complaint ID, Title, Citizen, or Department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                      rightIcon={
                        searchTerm ? (
                          <button type="button" onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full">
                            <X className="w-4 h-4" />
                          </button>
                        ) : undefined
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-800 text-xs focus:outline-none"
                      >
                        <option value="ALL">All Departments</option>
                        {departments.map((d) => {
                          const dId = typeof d === 'object' ? String(d.id || '') : String(d);
                          const dName = typeof d === 'object' ? String(d.name || d.id || '') : String(d);
                          return (
                            <option key={dId} value={dName}>{dName}</option>
                          );
                        })}
                      </select>
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                      className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-800 text-xs focus:outline-none"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="NEW">New</option>
                      <option value="ASSIGNED">Assigned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>

                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
                      className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-800 text-xs focus:outline-none"
                    >
                      <option value="ALL">All Priorities</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complaints List */}
            {filteredComplaints.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-lg border border-dashed border-slate-300">
                <p className="text-sm font-semibold text-slate-700">No complaints found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredComplaints.map((c) => (
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
                            <Building className="w-3.5 h-3.5 text-slate-400" /> {c.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" /> Citizen: {c.citizenName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant={c.status} size="md" dot />
                        <Link to={`/admin/complaints/${c.id}`}>
                          <Button size="sm" variant="outline" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                            View Case
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
