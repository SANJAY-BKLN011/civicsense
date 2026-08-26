import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building,
  ShieldCheck,
  LayoutDashboard,
  User,
  RotateCcw,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  ErrorMessage,
  LoadingState,
  type BadgeVariant,
} from '../../components/ui';
import { useAdminComplaints } from '../../context/AdminComplaintsContext';
import { getComplaintByIdApi, type ComplaintResponseData } from '../../api/complaints';
import { USE_MOCK_DATA } from '../../api/client';

export function AdminComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const normalizedId = id?.toUpperCase() || 'CIV-1024';

  const { getComplaint } = useAdminComplaints();

  const [apiComplaint, setApiComplaint] = useState<ComplaintResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
  const [apiError, setApiError] = useState<string | null>(null);
  const [previewState] = useState<'normal' | 'loading' | 'not-found' | 'error'>('normal');

  const fetchComplaintDetails = async () => {
    setIsLoading(true);
    setApiError(null);

    const res = await getComplaintByIdApi(normalizedId);
    if (res.success && res.data) {
      const data: ComplaintResponseData = (res.data as any).complaint || res.data;
      setApiComplaint(data);
    } else {
      setApiError(
        res.error?.includes('403')
          ? 'You are not authorized to view this complaint.'
          : res.error || 'Master complaint record not found.'
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!USE_MOCK_DATA) fetchComplaintDetails();
  }, [normalizedId]);

  const mockComplaint = getComplaint(normalizedId);

  const complaint = !USE_MOCK_DATA
    ? apiComplaint
      ? {
          id: apiComplaint.id,
          title: apiComplaint.title,
          category: apiComplaint.category || 'Municipal Master Record',
          department: apiComplaint.department || 'Department not provided',
          submittedDate: apiComplaint.submittedDate || (apiComplaint.createdAt ? new Date(apiComplaint.createdAt).toLocaleDateString() : 'Not provided'),
          submittedTime: apiComplaint.submittedTime || 'Not provided',
          citizenName: apiComplaint.citizenName || 'Not provided',
          assignedOfficer: 'Assignment not provided by complaint detail endpoint',
          assignedOfficerId: '',
          status: (apiComplaint.status || 'NEW') as BadgeVariant,
          priority: apiComplaint.priority || 'Medium',
          description: apiComplaint.description,
          location: apiComplaint.location,
          ward: apiComplaint.ward || 'Not provided',
          coordinates: apiComplaint.coordinates,
          photoUrl: apiComplaint.photoUrl,
          timeline: apiComplaint.timeline || [],
          resolution: apiComplaint.resolution,
        }
      : null
    : mockComplaint;

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (!USE_MOCK_DATA && isLoading) {
    return <LoadingState title="Loading master complaint record..." description="Connecting to municipal admin server." />;
  }

  if (previewState === 'error' || (!USE_MOCK_DATA && apiError)) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-4">
        <ErrorMessage severity="error" title="Error Loading Admin Case Data" message={apiError || 'Failed to retrieve case details from the central system registry.'} />
        <div className="text-center">
          <Button variant="outline" size="sm" onClick={fetchComplaintDetails} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  if (previewState === 'not-found' || !complaint) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4 bg-white rounded-lg border border-slate-200 p-8">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900">Complaint Record Not Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">No master complaint matching ID "{id}" could be located.</p>
        <Link to="/admin/complaints">
          <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Master Complaints</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <PageHeader
        title={`Master Case ${complaint.id}`}
        description="System administrator case review, department routing, and resolution compliance inspection."
        breadcrumbs={[
          { label: 'Admin Portal', href: '/admin' },
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Master Complaints', href: '/admin/complaints' },
          { label: complaint.id },
        ]}
        badge={<Badge variant={complaint.status} size="md" dot />}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/complaints"><Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>Master Queue</Button></Link>
            <Link to="/admin/dashboard"><Button variant="ghost" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4" />}>Dashboard</Button></Link>
          </div>
        }
      />

      <Card className="shadow-2xs text-left">
        <CardHeader className="bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">{complaint.id}</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(complaint.priority)}`}>{complaint.priority} Priority</span>
              <span className="text-xs font-medium text-slate-500">{complaint.category}</span>
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">{complaint.title}</CardTitle>
          </div>
          <div className="shrink-0"><Badge variant={complaint.status} size="md" dot /></div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Department</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />{complaint.department}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Citizen Reporter</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-500 shrink-0" />{complaint.citizenName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Assigned Officer</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />{complaint.assignedOfficer}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Submitted Date</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />{complaint.submittedDate}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" />Description & Details</h3>
            <p className="text-sm text-slate-800 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-200">{complaint.description}</p>
          </div>

          {(complaint as any).photoUrl && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-slate-400" />Attached Evidence</h3>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <a href={(complaint as any).photoUrl} target="_blank" rel="noreferrer" className="block" aria-label="Open complaint evidence photo in a new tab">
                  <img src={(complaint as any).photoUrl} alt="Complaint evidence" className="w-full max-h-96 object-contain rounded-md border border-slate-200 bg-white" loading="lazy" />
                </a>
              </div>
            </div>
          )}

          {!(complaint as any).photoUrl && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-slate-400" />Attached Evidence</h3>
              <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-200">No complaint photo was provided.</p>
            </div>
          )}

          <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-blue-900 uppercase text-[10px] tracking-wider block">Incident Location</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5 text-sm"><MapPin className="w-4 h-4 text-blue-600 shrink-0" />{complaint.location}</p>
            </div>
            {complaint.coordinates && <span className="text-slate-600 font-mono text-[11px]">GPS: {complaint.coordinates.lat.toFixed(4)}° N, {complaint.coordinates.lng.toFixed(4)}° E</span>}
          </div>
        </CardContent>
      </Card>

      {complaint.status === 'RESOLVED' && (complaint as any).resolution && (
        <Card className="border-2 border-emerald-300 shadow-md bg-emerald-50/40 text-left">
          <CardHeader className="bg-emerald-100/70 border-b border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold"><CheckCircle2 className="w-5 h-5" /></div>
              <div>
                <CardTitle className="text-base font-bold text-emerald-950">Verified Case Resolution Report</CardTitle>
                <p className="text-xs text-emerald-800">Closed on {(complaint as any).resolution.resolvedDate}</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300">RESOLVED</span>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs">
            <p className="text-sm font-medium text-slate-900 bg-white p-3 rounded border border-emerald-200">{(complaint as any).resolution.note}</p>
            {(complaint as any).resolution.photoPreview && <img src={(complaint as any).resolution.photoPreview} alt="Resolution Proof" className="w-full max-h-64 object-contain rounded border border-emerald-200 bg-white" loading="lazy" />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
