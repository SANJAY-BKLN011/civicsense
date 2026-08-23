import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  Building,
  ChevronRight,
  X,
  ClipboardList,
  Filter,
  RotateCcw,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  EmptyState,
  LoadingState,
  type BadgeVariant,
} from '../../components/ui';
import { useOfficerComplaints } from '../../context/OfficerComplaintsContext';
import type { OfficerComplaintData } from '../../data/mockOfficerComplaints';

type FilterStatus = 'ALL' | 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
type PriorityFilter = 'ALL' | 'Low' | 'Medium' | 'High' | 'Critical';

export function OfficerComplaints() {
  const navigate = useNavigate();
  const { complaints, resetToDefault } = useOfficerComplaints();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL');
  const [uiState, setUiState] = useState<'normal' | 'loading' | 'empty'>('normal');

  const filterTabs: { id: FilterStatus; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'NEW', label: 'New' },
    { id: 'ASSIGNED', label: 'Assigned' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
  ];

  const getFiltered = (): OfficerComplaintData[] => {
    if (uiState === 'empty') return [];
    return complaints.filter((item) => {
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
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Mock Data
          </Button>
        }
      />

      {/* State Switcher Preview */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase text-slate-500 mr-1">Preview State:</span>
          {(['normal', 'loading', 'empty'] as const).map((s) => (
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
        <span className="text-xs text-slate-500 font-mono">{complaints.length} Total Complaints Loaded</span>
      </div>

      {uiState === 'loading' && <LoadingState title="Loading assigned complaints..." />}

      {uiState === 'empty' && (
        <EmptyState
          icon={<ClipboardList className="w-6 h-6 text-slate-400" />}
          title="No Complaints Assigned"
          description="You currently have no complaints assigned to your officer profile."
          action={
            <Link to="/officer/department">
              <Button size="sm" variant="secondary">View Department Queue</Button>
            </Link>
          }
        />
      )}

      {uiState === 'normal' && (
        <>
          {/* Filter Toolbar */}
          <Card className="bg-slate-50/80 shadow-2xs">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Search Bar */}
                <div className="sm:col-span-2">
                  <Input
                    placeholder="Search by Complaint ID, title, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                    rightIcon={
                      searchTerm ? (
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ) : undefined
                    }
                  />
                </div>

                {/* Priority Selector */}
                <div>
                  <Select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
                    options={[
                      { value: 'ALL', label: 'All Priorities' },
                      { value: 'Critical', label: 'Critical Priority' },
                      { value: 'High', label: 'High Priority' },
                      { value: 'Medium', label: 'Medium Priority' },
                      { value: 'Low', label: 'Low Priority' },
                    ]}
                  />
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-200/70">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    Status:
                  </span>
                  {filterTabs.map((tab) => {
                    const count =
                      tab.id === 'ALL'
                        ? complaints.length
                        : complaints.filter((c) => c.status === tab.id).length;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          statusFilter === tab.id
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            statusFilter === tab.id ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {(searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('ALL');
                      setPriorityFilter('ALL');
                    }}
                    className="text-xs text-blue-700 font-semibold hover:underline cursor-pointer ml-auto"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="text-xs text-slate-500 flex items-center justify-between px-1">
            <span>Showing <strong className="text-slate-900 font-bold">{filtered.length}</strong> assigned complaint{filtered.length === 1 ? '' : 's'}</span>
          </div>

          {/* Complaints List */}
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-lg border border-dashed border-slate-300 space-y-3">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No matching complaints found</p>
              <p className="text-xs text-slate-500">Try adjusting your search keywords, priority filter, or status selection.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/officer/complaints/${c.id}`)}
                  className="p-4 sm:p-5 rounded-lg bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') navigate(`/officer/complaints/${c.id}`);
                  }}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      {c.thumbnailIcon}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {c.id}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityStyle(c.priority)}`}
                        >
                          {c.priority} Priority
                        </span>
                      </div>

                      <CardTitle className="text-base text-slate-900 group-hover:text-slate-700 transition-colors">
                        {c.title}
                      </CardTitle>

                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {c.department}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {c.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {c.submittedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <Badge variant={c.status as BadgeVariant} size="md" dot />
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
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
