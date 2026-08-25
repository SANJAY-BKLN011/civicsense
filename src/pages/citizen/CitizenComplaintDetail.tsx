import { useState, useEffect } from 'react';
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
  RotateCcw,
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
  LoadingState,
  ErrorMessage,
  type BadgeVariant,
} from '../../components/ui';
import { useOfficerComplaints } from '../../context/OfficerComplaintsContext';
import { getComplaintByIdApi, type ComplaintResponseData } from '../../api/complaints';
import { USE_MOCK_DATA } from '../../api/client';

export function CitizenComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const { getComplaint } = useOfficerComplaints();
  const normalizedId = id?.toUpperCase() || 'CIV-1024';

  // Real backend complaint state
  const [apiComplaint, setApiComplaint] = useState<ComplaintResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchComplaintDetails = async () => {
    setIsLoading(true);
    setApiError(null);

    const res = await getComplaintByIdApi(normalizedId);
    if (res.success && res.data) {
      const complaintData: ComplaintResponseData = (res.data as any).complaint || res.data;
      setApiComplaint(complaintData);
    } else {
      setApiError(
        res.error?.includes('403')
          ? 'You are not authorized to view this complaint.'
          : res.error || 'Complaint not found.'
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      fetchComplaintDetails();
    }
  }, [normalizedId]);

  const storeComplaint = getComplaint(normalizedId);

  // Unified complaint data object
  const complaint = !USE_MOCK_DATA
    ? apiComplaint
      ? {
          id: apiComplaint.id,
          title: apiComplaint.title,
          category: apiComplaint.category || 'Municipal Services',
          department: apiComplaint.department || 'Municipality / Sanitation',
          submittedDate: apiComplaint.submittedDate || (apiComplaint.createdAt ? new Date(apiComplaint.createdAt).toLocaleDateString() : 'Aug 20, 2026'),
          submittedTime: apiComplaint.submittedTime || '10:30 AM',
          status: (apiComplaint.status || 'NEW') as BadgeVariant,
          priority: apiComplaint.priority || 'Medium',
          thumbnailIcon: apiComplaint.thumbnailIcon || '📌',
          description: apiComplaint.description,
          location: apiComplaint.location,
          ward: apiComplaint.ward || 'Ward 12 - Central District',
          coordinates: apiComplaint.coordinates || { lat: 12.9716, lng: 77.5946 },
          photoUrl: apiComplaint.photoUrl,
          timeline: (apiComplaint.timeline || [
            {
              title: 'Complaint Submitted',
              timestamp: apiComplaint.submittedDate || 'Aug 20, 10:30 AM',
              description: 'Issue reported by citizen and logged into central triage system.',
              author: apiComplaint.citizenName || 'Citizen',
            },
          ]).map((t) => ({
            status: (apiComplaint.status || 'NEW') as BadgeVariant,
            title: t.title,
            date: t.timestamp,
            description: `${t.description} (Logged by ${t.author})`,
            completed: true,
          })),
          resolution: apiComplaint.resolution
            ? {
                date: apiComplaint.resolution.resolvedDate,
                time: apiComplaint.resolution.resolvedTime,
                officerName: apiComplaint.resolution.officerName,
                officerBadge: 'OFF-SAN-402',
                message: 'Complaint Successfully Resolved & Closed',
                note: apiComplaint.resolution.note,
                photoPreview: apiComplaint.resolution.photoPreview,
              }
            : undefined,
        }
      : null
    : storeComplaint
    ? {
        id: storeComplaint.id,
        title: storeComplaint.title,
        category: storeComplaint.category,
        department: storeComplaint.department,
        submittedDate: storeComplaint.submittedDate,
        submittedTime: storeComplaint.submittedTime,
        status: storeComplaint.status as BadgeVariant,
        priority: storeComplaint.priority,
        thumbnailIcon: storeComplaint.thumbnailIcon,
        description: storeComplaint.description,
        location: storeComplaint.location,
        ward: storeComplaint.ward,
        coordinates: storeComplaint.coordinates,
        photoUrl: undefined,
        timeline: storeComplaint.timeline.map((t) => ({
          status: storeComplaint.status as BadgeVariant,
          title: t.title,
          date: t.timestamp,
          description: `${t.description} (Logged by ${t.author})`,
          completed: true,
        })),
        resolution: storeComplaint.resolution
          ? {
              date: storeComplaint.resolution.resolvedDate,
              time: storeComplaint.resolution.resolvedTime,
              officerName: storeComplaint.resolution.officerName,
              officerBadge: 'OFF-SAN-402',
              message: 'Complaint Successfully Resolved & Closed',
              note: storeComplaint.resolution.note,
              photoPreview: storeComplaint.resolution.photoPreview,
            }
          : undefined,
      }
    : {
        id: normalizedId,
        title: 'Civic Issue Case Record',
        category: 'General Public Service',
        department: 'Municipality / Sanitation',
        submittedDate: 'Aug 20, 2026',
        submittedTime: '10:30 AM',
        status: 'IN_PROGRESS' as BadgeVariant,
        priority: 'High',
        thumbnailIcon: '📋',
        description: `Complaint record tracking case ${normalizedId}. Field teams are addressing reported neighborhood condition.`,
        location: 'Ward 12 - Central District',
        ward: 'Ward 12 - Central District',
        coordinates: {
          lat: 12.9716,
          lng: 77.5946,
        },
        photoUrl: undefined,
        timeline: [
          {
            status: 'NEW' as BadgeVariant,
            title: 'Complaint Submitted',
            date: 'Aug 20, 10:30 AM',
            description: 'Complaint registered by citizen with photo evidence.',
            completed: true,
          },
        ],
        resolution: undefined,
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

  if (!USE_MOCK_DATA && isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <LoadingState title="Loading complaint..." description={`Retrieving case record ${normalizedId} from server.`} />
      </div>
    );
  }

  if (!USE_MOCK_DATA && (apiError || !complaint)) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6">
        <ErrorMessage
          severity="error"
          title="Unable to load complaint"
          message={apiError || `Complaint ${normalizedId} could not be found or you are not authorized to view it.`}
        />
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchComplaintDetails} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Retry Loading
          </Button>
          <Link to="/citizen/complaints">
            <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to My Complaints
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* 5. Page Header & Navigation */}
      <PageHeader
        title={`Complaint ${complaint.id}`}
        description="Detailed record, status timeline, and department activity updates."
        breadcrumbs={[
          { label: 'Citizen Portal', href: '/citizen' },
          { label: 'Dashboard', href: '/citizen/dashboard' },
          { label: 'My Complaints', href: '/citizen/complaints' },
          { label: complaint.id },
        ]}
        badge={<Badge variant={complaint.status as BadgeVariant} size="md" dot />}
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
      <Card className="shadow-2xs">
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
            <Badge variant={complaint.status as BadgeVariant} size="md" dot />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6 text-left">
          {/* Metadata Grid: Department, Date/Time, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">
                Assigned Department
              </span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                {complaint.department}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">
                Submission Date & Time
              </span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {complaint.submittedDate} at {complaint.submittedTime}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">
                Location & Ward
              </span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {complaint.location}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              Detailed Issue Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
              {complaint.description}
            </p>
          </div>

          {/* Attached Evidence Photo */}
          {(complaint.photoUrl || complaint.thumbnailIcon) && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Submitted Evidence Documentation
              </h3>
              {complaint.photoUrl ? (
                <img
                  src={complaint.photoUrl}
                  alt="Complaint Evidence"
                  className="w-full max-h-72 object-cover rounded-lg border border-slate-200"
                />
              ) : (
                <div className="p-4 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-3">
                  <span className="text-2xl">{complaint.thumbnailIcon}</span>
                  <span className="text-xs text-slate-600 font-medium">
                    Photo evidence attached at submission.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Location Coordinates Card if present */}
          {complaint.coordinates && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Captured GPS Coordinates:</span>
                <span className="font-mono text-slate-600">
                  {complaint.coordinates.lat.toFixed(4)}° N, {complaint.coordinates.lng.toFixed(4)}° E
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Precise Geotag
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* VERIFIED RESOLUTION CARD (WHEN COMPLAINT STATUS IS RESOLVED) */}
      {complaint.status === 'RESOLVED' && complaint.resolution && (
        <Card className="border-2 border-emerald-300 shadow-md bg-emerald-50/40 text-left">
          <CardHeader className="bg-emerald-100/70 border-b border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-emerald-950">
                  Verified Case Resolution
                </CardTitle>
                <p className="text-xs text-emerald-800">
                  Closed on {complaint.resolution.date} at {complaint.resolution.time}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300">
              RESOLVED
            </span>
          </CardHeader>

          <CardContent className="p-5 space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-white border border-emerald-200 space-y-1">
              <span className="font-semibold text-slate-500 block uppercase text-[10px]">
                Resolution Report Note
              </span>
              <p className="text-sm font-medium text-slate-900">{complaint.resolution.note}</p>
            </div>

            {complaint.resolution.photoPreview && (
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-500 block uppercase text-[10px]">
                  Field Resolution Photo Proof
                </span>
                <img
                  src={complaint.resolution.photoPreview}
                  alt="Resolution Proof"
                  className="w-full max-h-64 object-cover rounded-lg border border-emerald-200 shadow-2xs"
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-600 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Resolved by <strong>{complaint.resolution.officerName}</strong></span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 7. Status Timeline Card */}
      <Card className="shadow-2xs text-left">
        <CardHeader className="border-b border-slate-200 bg-slate-50/50">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Case Status & Timeline Activity
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {complaint.timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Status node icon circle */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 ${
                    item.completed
                      ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <span className="text-xs font-mono text-slate-500">{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-lg border border-slate-200">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Updates automatically as municipal field officers take action.</span>
          <Link to="/citizen/complaints">
            <Button variant="outline" size="sm">
              Return to My Complaints
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
