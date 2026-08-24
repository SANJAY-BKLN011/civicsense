import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Filter, ChevronRight, Building, RotateCcw, ClipboardList } from 'lucide-react';
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
  type BadgeVariant,
} from '../../components/ui';
import { useAdminComplaints } from '../../context/AdminComplaintsContext';
import { useDepartments } from '../../context/DepartmentContext';

type StatusFilter = 'ALL' | 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
type PriorityFilter = 'ALL' | 'Low' | 'Medium' | 'High' | 'Critical';

export function AdminComplaints() {
  const navigate = useNavigate();
  const { complaints, resetToMockData } = useAdminComplaints();
  const { departments, isLoading: isDepartmentsLoading, error: departmentsError, refetchDepartments } = useDepartments();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [uiState, setUiState] = useState<'normal' | 'loading' | 'empty'>('normal');

  const filtered = complaints.filter((c) => {
    if (uiState === 'empty') return false;
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchDept = departmentFilter === 'ALL' || c.department === departmentFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q || c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.citizenName.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.department.toLowerCase().includes(q);
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <PageHeader title="Master Complaint Management" description="Filter, inspect, reassign, or reclassify all civic complaints system-wide." breadcrumbs={[{ label: 'Admin Portal', href: '/admin' }, { label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Master Complaints' }]} actions={<Button variant="outline" size="sm" onClick={resetToMockData} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>Reset Mock Data</Button>} />

      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap"><span className="text-xs font-semibold uppercase text-slate-500 mr-1">Preview State:</span>{(['normal', 'loading', 'empty'] as const).map((s) => <Button key={s} size="sm" variant={uiState === s ? 'secondary' : 'outline'} onClick={() => setUiState(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</Button>)}</div>
        <span className="text-xs text-slate-500 font-mono">{complaints.length} Total Master Complaints</span>
      </div>

      {uiState === 'loading' && <LoadingState title="Loading master complaint registry..." />}

      {uiState === 'empty' ? <EmptyState icon={<ClipboardList className="w-8 h-8 text-slate-400" />} title="No Master Complaints Registered" description="There are currently no civic complaints logged in the system database." /> : (
        <div className="space-y-4">
          <Card className="bg-slate-50/80 shadow-2xs">
            <CardContent className="p-4 space-y-4">
              {departmentsError && <div className="flex items-center justify-between gap-3 rounded-md bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800"><span>{departmentsError}</span><Button type="button" variant="outline" size="sm" onClick={() => void refetchDepartments()}>Retry</Button></div>}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2"><Input placeholder="Search by ID, title, citizen, location, or department..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} leftIcon={<Search className="w-4 h-4" />} rightIcon={searchTerm ? <button type="button" onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button> : undefined} /></div>
                <div>{isDepartmentsLoading ? <div className="h-10 rounded-md border border-slate-200 bg-white px-3 flex items-center text-xs text-slate-500">Loading departments...</div> : departmentsError ? <div className="h-10 rounded-md border border-rose-200 bg-rose-50 px-3 flex items-center text-xs text-rose-700">Unable to load departments</div> : departments.length === 0 ? <div className="h-10 rounded-md border border-amber-200 bg-amber-50 px-3 flex items-center text-xs text-amber-800">No departments available.</div> : <Select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} options={departmentOptions} />}</div>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-200/70">
                <div className="flex items-center gap-1.5 flex-wrap"><span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1"><Filter className="w-3.5 h-3.5" />Status:</span>{(['ALL', 'NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => <button key={st} type="button" onClick={() => setStatusFilter(st)} className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${statusFilter === st ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>{st === 'ALL' ? 'All Statuses' : st}</button>)}</div>
                <div className="flex items-center gap-1.5 flex-wrap"><span className="text-xs font-semibold text-slate-500 mr-1">Priority:</span>{(['ALL', 'Critical', 'High', 'Medium', 'Low'] as const).map((pr) => <button key={pr} type="button" onClick={() => setPriorityFilter(pr)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${priorityFilter === pr ? 'bg-blue-700 text-white font-bold' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>{pr}</button>)}</div>
              </div>
            </CardContent>
          </Card>

          <div className="text-xs text-slate-500 flex items-center justify-between px-1"><span>Showing <strong className="text-slate-900 font-bold">{filtered.length}</strong> complaints</span></div>

          {filtered.length === 0 ? <div className="p-12 text-center bg-white rounded-lg border border-dashed border-slate-300 space-y-3"><Search className="w-8 h-8 text-slate-400 mx-auto" /><p className="text-sm font-semibold text-slate-700">No complaints match your filters</p><Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setPriorityFilter('ALL'); setDepartmentFilter('ALL'); }}>Clear Filters</Button></div> : (
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-2xs"><table className="w-full text-xs text-left"><thead className="bg-slate-900 text-white font-semibold text-[11px] uppercase tracking-wider"><tr><th className="p-3.5">ID</th><th className="p-3.5">Issue Title</th><th className="p-3.5">Department</th><th className="p-3.5">Citizen</th><th className="p-3.5">Assigned Officer</th><th className="p-3.5">Priority</th><th className="p-3.5">Status</th><th className="p-3.5 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-200">{filtered.map((c) => <tr key={c.id} onClick={() => navigate(`/admin/complaints/${c.id}`)} className="hover:bg-slate-50 transition-colors cursor-pointer group"><td className="p-3.5 font-mono font-bold text-slate-800">{c.id}</td><td className="p-3.5 font-bold text-slate-900 group-hover:text-blue-700 max-w-xs truncate">{c.title}</td><td className="p-3.5 text-slate-600 font-medium"><span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />{c.department}</span></td><td className="p-3.5 text-slate-700">{c.citizenName}</td><td className="p-3.5 font-semibold text-slate-900">{c.assignedOfficer}</td><td className="p-3.5"><span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${getPriorityStyle(c.priority)}`}>{c.priority}</span></td><td className="p-3.5"><Badge variant={c.status as BadgeVariant} size="sm" dot /></td><td className="p-3.5 text-right"><ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 inline-block" /></td></tr>)}</tbody></table></div>
          )}
        </div>
      )}
    </div>
  );
}
