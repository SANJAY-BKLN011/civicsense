import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FilePlus,
  Search,
  MapPin,
  Calendar,
  Building,
  ChevronRight,
  RotateCcw,
  X,
  Layers,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
  EmptyState,
  LoadingState,
  ErrorMessage,
} from '../../components/ui';
import { mockCitizenComplaints, type ComplaintData } from '../../data/mockComplaints';

type FilterStatus = 'ALL' | 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

export function CitizenComplaints() {
  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');

  // Preview state switcher for testing all UI states required in F5
  const [uiState, setUiState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');

  const filterTabs: { id: FilterStatus; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'NEW', label: 'New' },
    { id: 'ASSIGNED', label: 'Assigned' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
  ];

  const getFilteredComplaints = (): ComplaintData[] => {
    if (uiState === 'empty') return [];

    return mockCitizenComplaints.filter((item) => {
      // Status Filter
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      // Search matching ID, Title, or Department
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
            Populated List ({mockCitizenComplaints.length})
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
            No Complaints State
          </Button>
          <Button
            size="sm"
            variant={uiState === 'error' ? 'secondary' : 'outline'}
            onClick={() => setUiState('error')}
          >
            Error State
          </Button>
        </div>

        <span className="text-xs text-slate-500">
          Showing F5 Complaint Tracking
        </span>
      </div>

      {/* LOADING STATE */}
      {uiState === 'loading' && (
        <LoadingState
          title="Loading your complaints..."
          description="Retrieving your submitted civic cases, department dispatch records, and verification status."
        />
      )}

      {/* ERROR STATE */}
      {uiState === 'error' && (
        <div className="space-y-4">
          <ErrorMessage
            severity="error"
            title="Error Loading Complaints"
            message="Unable to load citizen complaint records. Please check your network connection or try refreshing the dashboard."
          />
          <div className="text-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUiState('normal')}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Retry Loading Complaints
            </Button>
          </div>
        </div>
      )}

      {/* NO COMPLAINTS YET EMPTY STATE */}
      {uiState === 'empty' && (
        <EmptyState
          icon={<Layers className="w-8 h-8 text-slate-400" />}
          title="No complaints yet"
          description="You haven't reported any neighborhood issues yet. Submit your first civic issue report to start tracking its resolution progress."
          action={
            <Link to="/citizen/report">
              <Button size="md" variant="primary" leftIcon={<FilePlus className="w-4 h-4" />}>
                Report an Issue
              </Button>
            </Link>
          }
        />
      )}

      {/* NORMAL STATE WITH SEARCH & FILTERS */}
      {uiState === 'normal' && (
        <>
          {/* 4. Search and Status Filter Bar */}
          <Card className="bg-slate-50/80 border-slate-200">
            <CardContent className="p-4 sm:p-5 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Input
                  id="complaints-search-input"
                  placeholder="Search using Complaint ID (e.g. CIV-1024), Issue Title, or Department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  rightIcon={
                    searchTerm ? (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        title="Clear search query"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : undefined
                  }
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-200/70">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1.5">
                    Filter by Status:
                  </span>
                  {filterTabs.map((tab) => {
                    const isActive = statusFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-blue-700 text-white shadow-2xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs text-slate-500 font-medium">
                  Showing {filteredList.length} of {mockCitizenComplaints.length} complaints
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 2. Complaints List */}
          {filteredList.length === 0 ? (
            /* Search with No Results State */
            <div className="p-10 text-center bg-white rounded-lg border border-dashed border-slate-300 space-y-3">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-base font-semibold text-slate-900">
                No matching complaints found
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No civic cases match your current query "{searchTerm}" and status filter. Try clearing the search keyword or choosing "All".
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
              >
                Clear Search & Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredList.map((complaint) => (
                <div
                  key={complaint.id}
                  onClick={() => navigate(`/citizen/complaints/${complaint.id}`)}
                  className="p-4 sm:p-5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/citizen/complaints/${complaint.id}`);
                    }
                  }}
                  aria-label={`View details for complaint ${complaint.id}`}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Thumbnail / Category Icon */}
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      {complaint.thumbnailIcon}
                    </div>

                    <div className="space-y-1.5 text-left">
                      {/* Top Badges Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {complaint.id}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityStyle(
                            complaint.priority
                          )}`}
                        >
                          {complaint.priority} Priority
                        </span>
                      </div>

                      {/* Title */}
                      <CardTitle className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {complaint.title}
                      </CardTitle>

                      {/* Meta Information: Department, Location, Submitted Date */}
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
                          Submitted {complaint.submittedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Badge & Chevron Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <Badge variant={complaint.status} size="md" dot />
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
