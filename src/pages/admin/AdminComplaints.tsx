import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Filter, ChevronRight, Building, RotateCcw } from 'lucide-react';
import { PageHeader, Card, CardContent, Button, Badge, Input, LoadingState, ErrorMessage, type BadgeVariant } from '../../components/ui';
import { useAdminComplaints } from '../../context/AdminComplaintsContext';
import { useDepartments } from '../../context/DepartmentContext';
import { getAdminComplaintsApi } from '../../api/admin';
import { USE_MOCK_DATA } from '../../api/client';

type StatusFilter = 'ALL' | 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
type PriorityFilter = 'ALL' | 'Low' | 'Medium' | 'High' | 'Critical';

export function AdminComplaints() {
  const { complaints: mockComplaints, resetToMockData } = useAdminComplaints();
  const { departments } = useDepartments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [apiComplaints, setApiComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
  const [apiError, setApiError] = useState<string | null>(null);
  const [uiState, setUiState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');

  const fetchRealComplaints = async () => {
    setIsLoading(true);
    setApiError(null);
    const res = await getAdminComplaintsApi({ search: searchTerm, status: statusFilter, priority: priorityFilter, department: departmentFilter });
    if (res.success && res.data) {
      const list = Array.isArray(res.data) ? res.data : (res.data as any).complaints || [];
      setApiComplaints(list);
    } else {
      setApiError(res.error?.includes('403') ? 'You are not authorized to access the admin portal.' : res.error || 'Unable to load master complaints list from server.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      fetchRealComplaints();
      const handleFocus = () => fetchRealComplaints();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [searchTerm, statusFilter, priorityFilter, departmentFilter]);

  const activeComplaints = !USE_MOCK_DATA
    ? apiComplaints.map((c) => {
        const departmentName = typeof c.department === 'string' ? c.department : (c.department as any)?.name || 'Department not provided';
        const citizenName = typeof c.citizenName === 'string' ? c.citizenName : (c.citizen as any)?.name || 'Not provided';
        const officerName = typeof c.assignedOfficer === 'string' ? c.assignedOfficer : (c.officer as any)?.name || 'Unassigned';
        return {
          id: String(c.id || ''),
          title: typeof c.title === 'string' ? c.title : (c.title as any)?.name || 'Untitled',
          department: departmentName,
          location: typeof c.location === 'string' ? c.location : (c.location as any)?.address || 'Address not provided',
          submittedDate: String(c.submittedDate || (c.created_at ? new Date(c.created_at).toLocaleDateString() : c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Not provided')),
          status: (typeof c.status === 'string' ? c.status : (c.status as any)?.name || 'NEW') as BadgeVariant,
          priority: typeof c.priority === 'string' ? c.priority : (c.priority as any)?.name || 'Medium',
          citizenName,
          assignedOfficer: officerName,
          assignedOfficerId: String(c.assignedOfficerId || (c.officer as any)?.id || ''),
        };
      })
    : mockComplaints;

  const filtered = activeComplaints.filter((c) => {
    if (uiState === 'empty') return false;
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchDept = departmentFilter === 'ALL' || c.department === departmentFilter;
    const q = searchTerm.toLowerCase().trim();
    const location = String(c.location || '');
    const department = String(c.department || '');
    const citizenName = String(c.citizenName || '');
    const matchSearch = !q || String(c.id).toLowerCase().includes(q) || String(c.title).toLowerCase().includes(q) || citizenName.toLowerCase().includes(q) || location.toLowerCase().includes(q) || department.toLowerCase().includes(q);
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
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <PageHeader title="Master Complaint Management" description="Filter, inspect, reassign, or reclassify all civic complaints system-wide." breadcrumbs={[{ label: 'Admin Portal', href: '/admin' }, { label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Master Complaints' }]} actions={USE_MOCK_DATA ? <Button variant="outline" size="sm" onClick={resetToMockData} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>Reset Mock Data</Button> : undefined} />
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap"><span className="text-xs font-semibold uppercase text-slate-500 mr-1">Preview State:</span>{(['normal', 'loading', 'empty', 'error'] as const).map((s) => <Button key={s} size="sm" variant={uiState === s ? 'secondary' : 'outline'} onClick={() => setUiState(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</Button>)}</div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">{!USE_MOCK_DATA ? 'LIVE BACKEND CONNECTION' : 'DEMO MODE'}</span>
      </div>
      {(uiState === 'loading' || (isLoading && !USE_MOCK_DATA)) && <LoadingState title="Loading master complaints..." description="Retrieving system-wide complaint database." />}
      {(uiState === 'error' || (apiError && !USE_MOCK_DATA)) && <div className="space-y-4"><ErrorMessage severity="error" title="Unable to load master complaints" message={apiError || 'Failed to retrieve master complaints from municipal server.'} />{!USE_MOCK_DATA && <div className="text-center"><Button variant="outline" size="sm" onClick={fetchRealComplaints} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>Retry Loading Complaints</Button></div>}</div>}
      {uiState !== 'loading' && uiState !== 'error' && (!isLoading || USE_MOCK_DATA) && !apiError && <div className="space-y-6">
        <Card className="shadow-2xs text-left"><CardContent className="p-4 sm:p-5 space-y-4"><div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"><div className="relative flex-1"><Input placeholder="Search master database by ID, Title, Citizen, or Location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} leftIcon={<Search className="w-4 h-4 text-slate-400" />} rightIcon={searchTerm ? <button type="button" onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"><X className="w-4 h-4" /></button> : undefined} /></div><div className="flex items-center gap-2 flex-wrap"><div className="flex items-center gap-1.5 text-xs"><Filter className="w-3.5 h-3.5 text-slate-400" /><select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-800 text-xs focus:outline-none"><option value="ALL">All Departments</option>{departments.map((d) => { const dId = typeof d === 'object' ? String(d.id || '') : String(d); const dName = typeof d === 'object' ? String(d.name || d.id || '') : String(d); return <option key={dId} value={dName}>{dName}</option>; })}</select></div><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-800 text-xs focus:outline-none"><option value="ALL">All Statuses</option><option value="NEW">New</option><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In Progress</option><option value="RESOLVED">Resolved</option></select><select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)} className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-800 text-xs focus:outline-none"><option value="ALL">All Priorities</option><option value="Critical">Critical</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div></div></CardContent></Card>
        {filtered.length === 0 ? <div className="p-8 text-center bg-white rounded-lg border border-dashed border-slate-300"><p className="text-sm font-semibold text-slate-700">No master complaints match filter.</p></div> : <div className="space-y-3">{filtered.map((c) => <Card key={c.id} className="hover:border-slate-400 transition-all shadow-2xs text-left"><CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div className="space-y-1.5 flex-1"><div className="flex items-center gap-2 flex-wrap"><span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">{c.id}</span><span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityStyle(c.priority)}`}>{c.priority} Priority</span></div><h4 className="font-bold text-slate-900 text-sm sm:text-base">{c.title}</h4><div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap"><span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-slate-400" /> {c.department}</span><span>Citizen: {c.citizenName}</span><span>Officer: {c.assignedOfficer}</span></div></div><div className="flex items-center gap-3 shrink-0"><Badge variant={c.status} size="md" dot /><Link to={`/admin/complaints/${c.id}`}><Button size="sm" variant="outline" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>View Case</Button></Link></div></CardContent></Card>)}</div>}
      </div>}
    </div>
  );
}
