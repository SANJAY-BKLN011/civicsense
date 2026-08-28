import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus,
  Search,
  MapPin,
  Calendar,
  Building,
  ChevronRight,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
  LoadingState,
  ErrorMessage,
  type BadgeVariant,
} from '../../components/ui';
import { useOfficerComplaints } from '../../context/OfficerComplaintsContext';
import { getMyComplaintsApi, type ComplaintResponseData } from '../../api/complaints';
import { USE_MOCK_DATA } from '../../api/client';

type FilterStatus = 'ALL' | 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

export function CitizenComplaints() {
  const { complaints: mockStoreComplaints } = useOfficerComplaints();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');

  // Real backend API state
  const [apiComplaints, setApiComplaints] = useState<ComplaintResponseData[]>([]);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
  const [apiError, setApiError] = useState<string | null>(null);

  // Preview state switcher for demo testing
  const [uiState, setUiState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');

  const filterTabs: { id: FilterStatus; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'NEW', label: 'New' },
    { id: 'ASSIGNED', label: 'Assigned' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
  ];

  const fetchRealComplaints = async () => {
    setIsLoading(true);
    setApiError(null);

    const res = await getMyComplaintsApi({ search: searchTerm, status: statusFilter });
    if (res.success && res.data) {
      const list = Array.isArray(res.data) ? res.data : (res.data as any).complaints || [];
      setApiComplaints(list);
    } else {
      setApiError(res.error || 'Unable to load your complaints from the server. Please try again.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      fetchRealComplaints();
    }
  }, [searchTerm, statusFilter]);

  // Unified complaints source
  const sourceComplaints = !USE_MOCK_DATA
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
      }))
    : mockStoreComplaints;

  const getFilteredComplaints = () => {
    if (uiState === 'empty') return [];

    return sourceComplaints.filter((item) => {
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  };

  const filteredList = getFilteredComplaints();

  // Priority color styling helper
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
      {/* 1. Page Header */}
      <PageHeader
        title="My Complaints"
        description="Track the progress of issues you have reported."
        breadcrumbs={[
          { label: 'Citizen Portal', href: '/citizen' },
          { label: 'Dashboard', href: '/citizen/dashboard' },
          { label: 'My Complaints' },
        ]}
        actions={
          <Link to="/citizen/report">
            <Button size="md" variant="primary" leftIcon={<FilePlus className="w-4 h-4" />}>
              Report New Issue
            </Button>
          </Link>
        }
      />

      {/* State Preview Toolbar for UI Testing */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase text-slate-500 mr-1">
            Preview UI State:
          </span>
          <Button
            size="sm"
            variant={uiState === 'normal' ? 'secondary' : 'outline'}
            onClick={() => setUiState('normal')}
          >
            Populated List ({sourceComplaints.length})
          </Button>
          <Button
            size="sm"
            variant={uiState === 'loading' ? 'secondary' : 'outline'}
            onClick={() => setUiState('loading')}
          >
            Loading State
          </Button>
          <Button
            size="sm"
            variant={uiState === 'empty' ? 'secondary' : 'outline'}
            onClick={() => setUiState('empty')}
          >
            Empty List
          </Button>
          <Button
            size="sm"
            variant={uiState === 'error' ? 'secondary' : 'outline'}
            onClick={() => setUiState('error')}
          >
            Error State
          </Button>
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
          {!USE_MOCK_DATA ? 'LIVE BACKEND CONNECTION' : 'DEMO MODE'}
        </span>
      </div>

      {/* LOADING STATE */}
      {(uiState === 'loading' || (isLoading && !USE_MOCK_DATA)) && (
        <LoadingState
          title="Loading your complaints..."
          description="Retrieving your submitted civic issue records from server."
        />
      )}

      {/* ERROR STATE */}
      {(uiState === 'error' || (apiError && !USE_MOCK_DATA)) && (
        <div className="space-y-4">
          <ErrorMessage
            severity="error"
            title="Unable to load your complaints"
            message={apiError || 'Failed to connect to the municipal complaint server. Please verify your connection or try again.'}
          />
          {!USE_MOCK_DATA && (
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRealComplaints}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Retry Loading Complaints
              </Button>
            </div>
          )}
        </div>
      )}

      {/* NORMAL CONTENT STATE */}
      {uiState !== 'loading' && uiState !== 'error' && (!isLoading || USE_MOCK_DATA) && !apiError && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Status Filters */}
          <Card className="shadow-2xs">
            <CardContent className="p-4 sm:p-5 space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Input
                    placeholder="Search by Complaint ID, Title, or Department..."
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

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0">
                  {filterTabs.map((tab) => {
                    const isActive = statusFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs text-slate-500 font-medium">
                  Showing {filteredList.length} of {sourceComplaints.length} complaints
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Complaints List */}
          {filteredList.length === 0 ? (
            uiState === 'empty' || sourceComplaints.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-lg border border-dashed border-slate-300 space-y-3">
                <p className="text-lg font-bold text-slate-900">No complaints yet.</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You haven't reported any civic issues yet. Click below to submit your first complaint.
                </p>
                <Link to="/citizen/report" className="inline-block pt-2">
                  <Button size="md" variant="primary" leftIcon={<FilePlus className="w-4 h-4" />}>
                    Report an Issue
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-10 text-center bg-white rounded-lg border border-dashed border-slate-300 space-y-3">
                <Search className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-base font-bold text-slate-900">No matching complaints found</p>
                <p className="text-xs text-slate-500">
                  Try adjusting your search query or switching the status filter tab.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('ALL');
                  }}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Reset Search & Filters
                </Button>
              </div>
            )
          ) : (
            <div className="space-y-4">
              {filteredList.map((c) => (
                <Card
                  key={c.id}
                  className="hover:border-blue-300 transition-all shadow-2xs hover:shadow-xs group text-left"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2.5 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300 shadow-2xs">
                            {c.id}
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityStyle(
                              c.priority
                            )}`}
                          >
                            {c.priority} Priority
                          </span>
                        </div>

                        <CardTitle className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {c.title}
                        </CardTitle>

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

                        <Link to={`/citizen/complaints/${c.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
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
