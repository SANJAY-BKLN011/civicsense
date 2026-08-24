import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Select,
  EmptyState,
  LoadingState,
  ErrorMessage,
  type BadgeVariant,
} from '../../components/ui';
import { useAdminComplaints } from '../../context/AdminComplaintsContext';
import { useDepartments } from '../../context/DepartmentContext';
import { mockDepartmentPerformance } from '../../data/mockAdminData';

type StatusFilter = 'ALL' | 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
type PriorityFilter = 'ALL' | 'Low' | 'Medium' | 'High' | 'Critical';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { complaints, officers, resetToMockData } = useAdminComplaints();
  const { departments, isLoading: isDepartmentsLoading, error: departmentsError, refetchDepartments } = useDepartments();

  const [dashboardState, setDashboardState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  const stats = [
    { title: 'Total Complaints', value: '48', desc: 'All time ward reports', icon: <Layers className="w-5 h-5 text-blue-700" />, bg: 'bg-blue-50' },
    { title: 'New Complaints', value: '12', desc: 'Awaiting triage', icon: <AlertCircle className="w-5 h-5 text-sky-700" />, bg: 'bg-sky-50' },
    { title: 'In Progress', value: '18', desc: 'Active field cases', icon: <Clock className="w-5 h-5 text-amber-700" />, bg: 'bg-amber-50' },
    { title: 'Resolved', value: '18', desc: 'Closed cases', icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />, bg: 'bg-emerald-50' },
    { title: 'Total Citizens', value: '1,420', desc: 'Registered accounts', icon: <Users className="w-5 h-5 text-purple-700" />, bg: 'bg-purple-50' },
    { title: 'Total Officers', value: `${officers.length}`, desc: 'Active municipal staff', icon: <ShieldCheck className="w-5 h-5 text-indigo-700" />, bg: 'bg-indigo-50' },
  ];

  const filteredComplaints = complaints.filter((c) => {
    if (dashboardState === 'empty') return false;
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchDept = departmentFilter === 'ALL' || c.department === departmentFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q || c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.citizenName.toLowerCase().includes(q) || c.department.toLowerCase().includes(q);
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

  const departmentOptions = [
    { value: 'ALL', label: 'All Departments' },
    ...departments.map((department) => ({ value: department.name, label: department.name })),
  ];

  const displayDepartments = departments.map((department) => {
    const match = mockDepartmentPerformance.find((item) => item.department.toLowerCase() === department.name.toLowerCase());
    const totalComplaints = department.totalComplaints || match?.totalComplaints || 0;
    const resolved = department.resolved || match?.resolved || 0;
    const inProgress = department.inProgress || match?.inProgress || 0;
    const pending = department.pending || match?.pending || 0;
    const completionRate = department.completionRate ?? match?.completionRate ?? (totalComplaints ? Math.round((resolved / totalComplaints) * 100) : 0);
    return { ...department, totalComplaints, resolved, inProgress, pending, completionRate };
  });

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="System Administration Dashboard"
        description="System-wide civic complaint monitoring, department performance analytics, and officer management."
        breadcrumbs={[{ label: 'Admin Portal', href: '/admin' }, { label: 'Dashboard' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetToMockData} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>Reset Mock Data</Button>
            <Link to="/admin/reports"><Button variant="secondary" size="sm" rightIcon={<ChevronRight className="w-3 h-3" />}>View Reports</Button></Link>
          </div>
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
        <span className="text-xs text-slate-500 font-mono">F9 Admin Command Dashboard</span>
      </div>

      {dashboardState === 'loading' && <LoadingState title="Loading system dashboard data..." />}
      {dashboardState === 'error' && <ErrorMessage severity="error" title="Error Loading Admin Dashboard" message="Failed to retrieve system overview statistics from municipal service database." />}

      {(dashboardState === 'normal' || dashboardState === 'empty') && (
        <>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">System Overview Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {stats.map((st, i) => (
                <Card key={i} className="shadow-2xs border border-slate-200">
                  <CardContent className="py-4 space-y-2">
                    <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{st.title}</p><div className={`p-2 rounded-lg ${st.bg}`}>{st.icon}</div></div>
                    <p className="text-2xl font-extrabold text-slate-900">{dashboardState === 'empty' ? '0' : st.value}</p>
                    <p className="text-[11px] text-slate-500">{st.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div><h3 className="text-lg font-bold text-slate-900">Complaint Overview</h3><p className="text-xs text-slate-500">Monitor and manage complaints across all municipal departments</p></div>
              <Link to="/admin/complaints"><Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>View Full Master List</Button></Link>
            </div>

            <Card className="bg-slate-50/80 shadow-2xs">
              <CardContent className="p-4 space-y-4">
                {departmentsError && (
                  <div className="flex items-center justify-between gap-3 rounded-md bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                    <span>{departmentsError}</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => void refetchDepartments()}>Retry</Button>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2"><Input placeholder="Search by Complaint ID, title, citizen, or department..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} leftIcon={<Search className="w-4 h-4" />} rightIcon={searchTerm ? <button type="button" onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button> : undefined} /></div>
                  <div>
                    {isDepartmentsLoading ? <div className="h-10 rounded-md border border-slate-200 bg-white px-3 flex items-center text-xs text-slate-500">Loading departments...</div> : departmentsError ? <div className="h-10 rounded-md border border-rose-200 bg-rose-50 px-3 flex items-center text-xs text-rose-700">Unable to load departments</div> : departments.length === 0 ? <div className="h-10 rounded-md border border-amber-200 bg-amber-50 px-3 flex items-center text-xs text-amber-800">No departments available.</div> : <Select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} options={departmentOptions} />}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-200/70">
                  <div className="flex items-center gap-1.5 flex-wrap"><span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1"><Filter className="w-3.5 h-3.5" />Status:</span>{(['ALL', 'NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => <button key={st} type="button" onClick={() => setStatusFilter(st)} className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${statusFilter === st ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>{st === 'ALL' ? 'All Statuses' : st}</button>)}</div>
                  <div className="flex items-center gap-1.5 flex-wrap"><span className="text-xs font-semibold text-slate-500 mr-1">Priority:</span>{(['ALL', 'Critical', 'High', 'Medium', 'Low'] as const).map((pr) => <button key={pr} type="button" onClick={() => setPriorityFilter(pr)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${priorityFilter === pr ? 'bg-blue-700 text-white font-bold' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>{pr}</button>)}</div>
                </div>
              </CardContent>
            </Card>

            {filteredComplaints.length === 0 ? <EmptyState icon={<Search className="w-8 h-8 text-slate-400" />} title="No Matching Complaints Found" description="Try adjusting your search criteria, status tab, priority, or department filter." action={<Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setPriorityFilter('ALL'); setDepartmentFilter('ALL'); }}>Reset Filters</Button>} /> : (
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-2xs"><table className="w-full text-xs text-left"><thead className="bg-slate-900 text-white font-semibold text-[11px] uppercase tracking-wider"><tr><th className="p-3.5">ID</th><th className="p-3.5">Issue Title</th><th className="p-3.5">Department</th><th className="p-3.5">Citizen</th><th className="p-3.5">Assigned Officer</th><th className="p-3.5">Priority</th><th className="p-3.5">Status</th><th className="p-3.5 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-200">{filteredComplaints.map((c) => <tr key={c.id} onClick={() => navigate(`/admin/complaints/${c.id}`)} className="hover:bg-slate-50 transition-colors cursor-pointer group"><td className="p-3.5 font-mono font-bold text-slate-800">{c.id}</td><td className="p-3.5 font-bold text-slate-900 group-hover:text-blue-700 max-w-xs truncate">{c.title}</td><td className="p-3.5 text-slate-600 font-medium"><span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />{c.department}</span></td><td className="p-3.5 text-slate-700">{c.citizenName}</td><td className="p-3.5 font-semibold text-slate-900">{c.assignedOfficer}</td><td className="p-3.5"><span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${getPriorityStyle(c.priority)}`}>{c.priority}</span></td><td className="p-3.5"><Badge variant={c.status as BadgeVariant} size="sm" dot /></td><td className="p-3.5 text-right"><ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 inline-block" /></td></tr>)}</tbody></table></div>
            )}
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap"><div><h3 className="text-lg font-bold text-slate-900">Department Performance</h3><p className="text-xs text-slate-500">Case clearance rates and active workloads per department</p></div><Link to="/admin/departments"><Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>View All Departments</Button></Link></div>
            {isDepartmentsLoading ? <LoadingState title="Loading departments..." description="Retrieving department records from the server." /> : departmentsError ? <div className="space-y-3"><ErrorMessage severity="error" title="Unable to load departments" message={departmentsError} /><div className="text-center"><Button variant="outline" size="sm" onClick={() => void refetchDepartments()}>Retry Loading Departments</Button></div></div> : displayDepartments.length === 0 ? <div className="p-8 text-center bg-white rounded-lg border border-dashed border-slate-300"><p className="text-sm font-semibold text-slate-600">No departments available.</p></div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{displayDepartments.map((dept) => <Card key={dept.id} className="shadow-2xs"><CardContent className="p-5 space-y-3"><div className="flex items-center justify-between gap-2"><div className="space-y-0.5"><h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5"><Building className="w-4 h-4 text-blue-600 shrink-0" />{dept.name}</h4><p className="text-xs text-slate-500">{dept.totalComplaints} Total Complaints Filed</p></div><span className="font-mono text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full border border-blue-200">{dept.completionRate}% Cleared</span></div><div className="space-y-1"><div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden flex"><div className="bg-emerald-600 h-full" style={{ width: `${dept.totalComplaints ? (dept.resolved / dept.totalComplaints) * 100 : 0}%` }} /><div className="bg-amber-500 h-full" style={{ width: `${dept.totalComplaints ? (dept.inProgress / dept.totalComplaints) * 100 : 0}%` }} /><div className="bg-sky-400 h-full" style={{ width: `${dept.totalComplaints ? (dept.pending / dept.totalComplaints) * 100 : 0}%` }} /></div></div><div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs"><div className="p-2 rounded bg-slate-50 border border-slate-200"><span className="text-[10px] text-slate-500 uppercase block font-semibold">Pending</span><span className="font-bold text-sky-700">{dept.pending}</span></div><div className="p-2 rounded bg-slate-50 border border-slate-200"><span className="text-[10px] text-slate-500 uppercase block font-semibold">In Progress</span><span className="font-bold text-amber-700">{dept.inProgress}</span></div><div className="p-2 rounded bg-slate-50 border border-slate-200"><span className="text-[10px] text-slate-500 uppercase block font-semibold">Resolved</span><span className="font-bold text-emerald-700">{dept.resolved}</span></div></div></CardContent></Card>)}</div>
            )}
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap"><div><h3 className="text-lg font-bold text-slate-900">Officer Overview</h3><p className="text-xs text-slate-500">Active municipal field officers and individual case loads</p></div><Link to="/admin/officers"><Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>Manage Roster</Button></Link></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{officers.map((off) => <Card key={off.id} className="shadow-2xs hover:border-slate-300 transition-all"><CardContent className="p-4 space-y-3 text-xs"><div className="flex items-start justify-between gap-2"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">{off.name.charAt(0)}</div><div><h4 className="font-bold text-slate-900 text-sm">{off.name}</h4><p className="text-slate-500">{off.designation}</p></div></div><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${off.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{off.status}</span></div><div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1"><div className="flex justify-between text-slate-600"><span>Department:</span><strong className="text-slate-900">{off.department}</strong></div><div className="flex justify-between text-slate-600"><span>Assigned Ward:</span><span className="font-mono text-slate-700">{off.ward}</span></div></div><div className="grid grid-cols-2 gap-2 text-center pt-1"><div className="p-2 rounded bg-blue-50/70 border border-blue-100"><span className="text-[10px] text-blue-700 font-semibold block">Active Cases</span><span className="text-base font-bold text-blue-900">{off.assignedComplaints}</span></div><div className="p-2 rounded bg-emerald-50/70 border border-emerald-100"><span className="text-[10px] text-emerald-700 font-semibold block">Resolved</span><span className="text-base font-bold text-emerald-900">{off.resolvedComplaints}</span></div></div></CardContent></Card>)}</div>
          </div>
        </>
      )}
    </div>
  );
}
