import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  Building,
  ChevronRight,
  RotateCcw,
  X,
  Shield,
  Filter,
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
import { useOfficerComplaints } from '../../context/OfficerComplaintsContext';
import { getOfficerComplaintsApi, type ComplaintResponseData } from '../../api/complaints';
import { USE_MOCK_DATA } from '../../api/client';

type FilterStatus = 'ALL' | 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
type PriorityFilter = 'ALL' | 'Low' | 'Medium' | 'High' | 'Critical';

export function OfficerComplaints() {
  const { complaints: mockStoreComplaints, resetToDefault } = useOfficerComplaints();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL');
  const [uiState, setUiState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');

  const [apiComplaints, setApiComplaints] = useState<ComplaintResponseData[]>([]);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
  const [apiError, setApiError] = useState<string | null>(null);

  const filterTabs: { id: FilterStatus; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'NEW', label: 'New' },
    { id: 'ASSIGNED', label: 'Assigned' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
  ];

  const fetchRealOfficerComplaints = async () => {
    setIsLoading(true);
    setApiError(null);

    const res = await getOfficerComplaintsApi({
      search: searchTerm,
      status: statusFilter,
      priority: priorityFilter,
    });

    if (res.success && res.data) {
      const list = Array.isArray(res.data) ? res.data : (res.data as any).complaints || [];
      setApiComplaints(list);
    } else {
      setApiError(res.error || 'Unable to load assigned complaints from server.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      fetchRealOfficerComplaints();
    }
  }, [searchTerm, statusFilter, priorityFilter]);

  const activeComplaints = !USE_MOCK_DATA
    ? apiComplaints.map((c) => ({
        id: String(c.id || ''),
        title: typeof c.title === 'string' ? c.title : (c.title as any)?.name || 'Untitled',
        department: typeof c.department === 'string' ? c.department : (c.department as any)?.name || 'Municipality / Sanitation',
        location: typeof c.location === 'string' ? c.location : (c.location as any)?.address || 'Address not provided',
        submittedDate: String(c.submittedDate || (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Aug 20, 2026')),
        status: (typeof c.status === 'string' ? c.status : (c.status as any)?.name || 'NEW') as BadgeVariant,
        priority: typeof c.priority === 'string' ? c.priority : (c.priority as any)?.name || 'Medium',
        thumbnailIcon: typeof c.thumbnailIcon === 'string' ? c.thumbnailIcon : '📌',
        description: typeof c.description === 'string' ? c.description : String(c.description || ''),
        photoUrl: c.photoUrl,
      }))
    : mockStoreComplaints;

  const getFiltered = () => {
    if (uiState === 'empty') return [];
    return activeComplaints.filter((item) => {
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);

      return matchStatus && matchPriority && matchSearch;
    });
  };

  const filtered = getFiltered();

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

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Assigned Complaints"
        description="Filter, search, and manage civic complaints assigned to your officer account."
        breadcrumbs={[
          { label: 'Officer Portal', href: '/officer' },
          { label: 'Dashboard', href: '/officer/dashboard' },
          { label: 'Assigned Complaints' },
        ]}
        actions={
          USE_MOCK_DATA ? (
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Mock Data
            </Button>
          ) : undefined
        }
      />

      {/* State Switcher Preview */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase text-slate-500 mr-1">Preview State:</span>
          {(['normal', 'loading', 'empty', 'error'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={uiState === s ? 'secondary' : 'outline'}
              onClick={() => setUiState(s)}
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
      {(uiState === 'loading' || (isLoading && !USE_MOCK_DATA)) && (
        <LoadingState
          title="Loading assigned complaints..."
          description="Retrieving case queue from municipal officer server."
        />
      )}

      {/* ERROR STATE */}
      {(uiState === 'error' || (apiError && !USE_MOCK_DATA)) && (
        <div className="space-y-4">
          <ErrorMessage
            severity="error"
            title="Unable to load assigned complaints"
            message={apiError || 'Failed to retrieve assigned complaints from server. Please check your connection.'}
          />
          {!USE_MOCK_DATA && (
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRealOfficerComplaints}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Retry Loading Complaints
              </Button>
            </div>
          )}
        </div>
      )}

      {/* CONTENT STATE */}
      {uiState !== 'loading' && uiState !== 'error' && (!isLoading || USE_MOCK_DATA) && !apiError && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <Card className="shadow-2xs">
            <CardContent className="p-4 sm:p-5 space-y-4 text-left">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Input
                    placeholder="Search by Complaint ID, Title, or Location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                    rightIcon={
                      searchTerm ? (
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                          title="Clear search"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ) : undefined
                    }
                  />
                </div>

                {/* Priority Filter */}
                <div className="flex items-center gap-2 shrink-0">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Priorities</option>
                    <option value="Critical">Critical Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 flex-wrap">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {filterTabs.map((tab) => {
                    const isActive = statusFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-slate-800 text-white shadow-2xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs text-slate-500 font-medium">
                  Showing {filtered.length} of {activeComplaints.length} assigned complaints
                </span>
              </div>
            </CardContent>
          </Card>

          {/* List Cards */}
          {filtered.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-lg border border-dashed border-slate-300 space-y-3">
              <Shield className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-base font-bold text-slate-900">No complaints found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No assigned cases match your selected filter criteria.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL');
                }}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset Search & Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((c) => (
                <Card
                  key={c.id}
                  className="hover:border-slate-400 transition-all shadow-2xs text-left"
                >
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                          {c.id}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityStyle(c.priority)}`}>
                          {c.priority} Priority
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-base">{c.title}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="line-clamp-1">{c.department}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="line-clamp-1">{c.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Submitted: {c.submittedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <Badge variant={c.status} size="md" dot />
                      <Link to={`/officer/complaints/${c.id}`}>
                        <Button size="sm" variant="primary" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                          Manage Case
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
