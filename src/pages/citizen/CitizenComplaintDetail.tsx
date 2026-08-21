import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  ShieldCheck,
  Crosshair,
  FileText,
  LayoutDashboard,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from '../../components/ui';
import { mockCitizenComplaints, type ComplaintData } from '../../data/mockComplaints';

export function CitizenComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const normalizedId = id?.toUpperCase() || 'CIV-1024';

  // Find complaint in mock dataset or provide dynamic fallback
  const complaint: ComplaintData =
    mockCitizenComplaints.find((c) => c.id.toUpperCase() === normalizedId) || {
      id: normalizedId,
      title: 'Civic Issue Case Record',
      category: 'General Public Service',
      department: 'Municipality / Sanitation',
      submittedDate: 'Aug 20, 2026',
      submittedTime: '10:30 AM',
      status: 'IN_PROGRESS',
      priority: 'High',
      thumbnailIcon: '📋',
      description: 'Complaint record tracking case ' + normalizedId + '. Field teams are addressing reported neighborhood condition.',
      location: 'Ward 12 - Central District',
      ward: 'Ward 12 - Central District',
      coordinates: {
        lat: 12.9716,
        lng: 77.5946,
      },
      timeline: [
        {
          status: 'NEW',
          title: 'Complaint Submitted',
          date: 'Aug 20, 10:30 AM',
          description: 'Complaint registered by citizen with photo evidence.',
          completed: true,
        },
        {
          status: 'ASSIGNED',
          title: 'Assigned to Municipal Department',
          date: 'Aug 20, 11:15 AM',
          description: 'Assigned to responsible department triage queue.',
          completed: true,
        },
        {
          status: 'IN_PROGRESS',
          title: 'Officer Working on Issue',
          date: 'Aug 21, 09:00 AM',
          description: 'Field technicians deployed to inspect and resolve on-site.',
          completed: true,
        },
        {
          status: 'RESOLVED',
          title: 'Verified Resolution',
          date: 'Pending completion',
          description: 'Final closure verification.',
          completed: false,
        },
      ],
    };

  const getPriorityBadgeClass = (priority: string) => {
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

  const isResolved = complaint.status === 'RESOLVED' || complaint.status === 'resolved';

  // 4 Timeline progress steps
  const timelineStages: { key: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED'; label: string }[] = [
    { key: 'NEW', label: '1. New' },
    { key: 'ASSIGNED', label: '2. Assigned' },
    { key: 'IN_PROGRESS', label: '3. In Progress' },
    { key: 'RESOLVED', label: '4. Resolved' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'NEW':
        return 0;
      case 'ASSIGNED':
        return 1;
      case 'IN_PROGRESS':
        return 2;
      case 'RESOLVED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(complaint.status as string);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* 9. Navigation Header */}
      <PageHeader
        title={`Complaint ${complaint.id}`}
        description="Comprehensive case overview, department triage history, and resolution tracking."
        breadcrumbs={[
          { label: 'Citizen Portal', href: '/citizen' },
          { label: 'Dashboard', href: '/citizen/dashboard' },
          { label: 'My Complaints', href: '/citizen/complaints' },
          { label: complaint.id },
        ]}
        badge={<Badge variant={complaint.status} size="md" dot />}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/citizen/complaints">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to My Complaints
              </Button>
            </Link>
            <Link to="/citizen/dashboard">
              <Button variant="ghost" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
                Dashboard
              </Button>
            </Link>
          </div>
        }
      />

      {/* 6. Complaint Information Card */}
      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 shadow-2xs">
                {complaint.id}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityBadgeClass(
                  complaint.priority
                )}`}
              >
                {complaint.priority} Priority
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {complaint.category}
              </span>
            </div>

            <CardTitle className="text-xl font-bold text-slate-900">
              {complaint.title}
            </CardTitle>
          </div>

          <div className="shrink-0">
            <Badge variant={complaint.status} size="md" dot />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6 text-left">
          {/* Metadata Grid: Department, Date/Time, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Responsible Department</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600 shrink-0" />
                {complaint.department}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Submitted Date & Time</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                {complaint.submittedDate}, {complaint.submittedTime}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Municipal Ward</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                {complaint.ward}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Issue Description</span>
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
              {complaint.description}
            </p>
          </div>

          {/* Submitted Photo Evidence */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Submitted Photo Documentation</span>
            </h4>
            <div className="flex items-center gap-4">
              <div className="w-40 h-28 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-500 gap-1.5 shadow-2xs">
                <span className="text-2xl">{complaint.thumbnailIcon}</span>
                <span className="text-[11px] font-medium text-slate-600">On-Site Evidence Photo</span>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <p className="font-medium text-slate-700">Photo attached at submission</p>
                <p>Location tag and timestamp verified</p>
              </div>
            </div>
          </div>

          {/* Location Details (Coordinates + Landmark) */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Location Details</span>
            </h4>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-slate-500 block mb-0.5">Street Address / Landmark:</span>
                  <span className="font-semibold text-slate-900 text-sm">{complaint.location}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-slate-500 block mb-0.5">GPS Coordinates:</span>
                  <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 inline-flex items-center gap-1">
                    <Crosshair className="w-3 h-3 text-emerald-600" />
                    {complaint.coordinates.lat}° N, {complaint.coordinates.lng}° E
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Visual Status Timeline */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Visual Status Timeline (Progress)</span>
            </h4>

            {/* Stepper Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {timelineStages.map((stage, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div
                    key={stage.key}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                        : isPassed
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                      <span
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-blue-900'
                            : isPassed
                            ? 'text-emerald-900'
                            : 'text-slate-500'
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
                        Current Status
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Detailed Timeline Events List */}
            <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-4">
              {complaint.timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3 relative">
                  <div className="mt-0.5 shrink-0">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold ${
                          item.completed ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Resolution Section (Shown if RESOLVED) */}
          {isResolved && (
            <div className="p-5 rounded-xl bg-emerald-50 border-2 border-emerald-300 space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-2xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-emerald-950">
                    {complaint.resolution?.message || 'Complaint Successfully Resolved & Closed'}
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Resolved on {complaint.resolution?.date || complaint.submittedDate}
                  </p>
                </div>
              </div>

              {complaint.resolution?.note && (
                <div className="bg-white/90 p-4 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <span className="font-semibold block uppercase tracking-wider text-emerald-800 text-[10px]">
                    Municipal Resolution Notes
                  </span>
                  <p className="leading-relaxed font-medium">
                    "{complaint.resolution.note}"
                  </p>
                  {complaint.resolution.officerName && (
                    <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-700">
                      <span>
                        Verified by: <strong>{complaint.resolution.officerName}</strong>
                      </span>
                      <span className="font-mono font-semibold">
                        Badge ID: {complaint.resolution.officerBadge}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Resolution Photo Proof */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-900 block mb-2">
                  Resolution Verification Photo
                </span>
                <div className="w-44 h-32 rounded-lg bg-emerald-100/80 border border-emerald-300 flex flex-col items-center justify-center text-emerald-800 gap-1.5 shadow-2xs">
                  <ShieldCheck className="w-8 h-8 text-emerald-700" />
                  <span className="text-xs font-bold">Work Completed & Verified</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Photo Attached by Crew</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-6">
          <Link to="/citizen/complaints">
            <Button variant="ghost" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to My Complaints
            </Button>
          </Link>

          <Link to="/citizen/report">
            <Button variant="primary" size="md">
              Report Another Issue
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
