import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Crosshair,
  FileText,
  Users,
  LayoutDashboard,
  ExternalLink,
  MessageSquare,
  Upload,
  X,
  AlertTriangle,
  Send,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
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
  Textarea,
  Select,
  ErrorMessage,
  EmptyState,
  LoadingState,
  type BadgeVariant,
} from '../../components/ui';
import { useOfficerComplaints } from '../../context/OfficerComplaintsContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export function OfficerComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const { getComplaint, updateStatus, addProgressNote, resolveComplaint } = useOfficerComplaints();
  const { officerUser } = useAuth();
  const { addNotification } = useNotifications();

  const officerName = officerUser?.name || 'Officer Sanjay Kumar';
  const complaint = getComplaint(id || '');

  // UI state switcher for testing error/not-found/loading
  const [previewState, setPreviewState] = useState<'normal' | 'loading' | 'not-found' | 'error'>('normal');

  // Form states
  const [selectedStatus, setSelectedStatus] = useState<BadgeVariant | ''>('');
  const [progressNoteText, setProgressNoteText] = useState('');
  const [progressNoteError, setProgressNoteError] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Success Feedback Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; title: string; desc: string } | null>(null);

  // Location Modal state
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Resolution Modal states
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionNoteError, setResolutionNoteError] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (previewState === 'loading') {
    return <LoadingState title="Loading complaint details..." description="Retrieving case data and activity logs." />;
  }

  if (previewState === 'error') {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-4">
        <ErrorMessage
          severity="error"
          title="Error Loading Case Data"
          message="Failed to connect to the municipal record server. Please retry."
        />
        <div className="text-center">
          <Button variant="outline" onClick={() => setPreviewState('normal')}>Retry Loading</Button>
        </div>
      </div>
    );
  }

  if (previewState === 'not-found' || !complaint) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-6">
        <EmptyState
          icon={<AlertCircle className="w-8 h-8 text-rose-500" />}
          title="Complaint Not Found"
          description={`No civic complaint matching ID "${id}" could be found in the assigned queue.`}
          action={
            <Link to="/officer/complaints">
              <Button size="sm" variant="secondary">Back to Complaints List</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Status Change Handler
  const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as BadgeVariant;
    if (!val || val === complaint.status) return;

    if (val === 'RESOLVED') {
      // Open resolution flow modal instead
      setResolveModalOpen(true);
      return;
    }

    updateStatus(complaint.id, val);
    setSelectedStatus('');
    addNotification({
      role: 'citizen',
      title: `Status Update (${complaint.id})`,
      message: `Your complaint "${complaint.title}" status changed to ${val}.`,
      complaintId: complaint.id,
      type: val === 'IN_PROGRESS' ? 'in_progress' : 'assigned',
    });
    setToastMessage({
      type: 'success',
      title: 'Status Updated',
      desc: `Complaint status changed to ${val}. Activity logged to case timeline.`,
    });
  };

  // Add Progress Note Handler
  const handleAddProgressNote = (e: React.FormEvent) => {
    e.preventDefault();
    setProgressNoteError('');

    if (!progressNoteText.trim()) {
      setProgressNoteError('Please enter a progress note before submitting.');
      return;
    }

    if (progressNoteText.trim().length < 5) {
      setProgressNoteError('Progress note should be at least 5 characters.');
      return;
    }

    setIsSubmittingNote(true);

    setTimeout(() => {
      addProgressNote(complaint.id, progressNoteText.trim(), officerName);
      setProgressNoteText('');
      setIsSubmittingNote(false);
      setToastMessage({
        type: 'success',
        title: 'Progress Note Added',
        desc: 'Update note logged successfully to complaint activity history.',
      });
    }, 300);
  };

  // Photo Select Handler for Resolution
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResolutionPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Resolution Confirmation
  const handleStartResolve = (e: React.FormEvent) => {
    e.preventDefault();
    setResolutionNoteError('');

    if (!resolutionNote.trim()) {
      setResolutionNoteError('Resolution note is required explaining what work was completed.');
      return;
    }

    // Open confirmation step
    setConfirmModalOpen(true);
  };

  // Final Confirmation of Resolution
  const handleFinalConfirmResolve = () => {
    resolveComplaint(complaint.id, resolutionNote.trim(), resolutionPhoto || undefined, officerName);
    addNotification({
      role: 'citizen',
      title: `Complaint Resolved (${complaint.id})`,
      message: `Your complaint "${complaint.title}" has been successfully resolved!`,
      complaintId: complaint.id,
      type: 'resolved',
    });
    setConfirmModalOpen(false);
    setResolveModalOpen(false);
    setResolutionNote('');
    setResolutionPhoto(null);
    setToastMessage({
      type: 'success',
      title: 'Complaint Marked as RESOLVED',
      desc: 'Resolution details logged, completion photo saved, and case successfully closed.',
    });
  };

  const copyCoordinates = () => {
    const coordsStr = `${complaint.coordinates.lat}, ${complaint.coordinates.lng}`;
    navigator.clipboard.writeText(coordsStr);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h5 className="font-bold text-white text-sm">{toastMessage.title}</h5>
            <p className="text-slate-300 mt-0.5">{toastMessage.desc}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Navigation */}
      <PageHeader
        title={`Case: ${complaint.id}`}
        description="Detailed complaint management, location map, status timeline, and resolution controls."
        breadcrumbs={[
          { label: 'Officer Portal', href: '/officer' },
          { label: 'Dashboard', href: '/officer/dashboard' },
          { label: 'Assigned Complaints', href: '/officer/complaints' },
          { label: complaint.id },
        ]}
        badge={<Badge variant={complaint.status as BadgeVariant} size="md" dot />}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/officer/complaints">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Complaints
              </Button>
            </Link>
            <Link to="/officer/dashboard">
              <Button variant="ghost" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
                Dashboard
              </Button>
            </Link>
          </div>
        }
      />

      {/* Preview State Switcher */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase text-slate-500 mr-1">Preview State:</span>
          {(['normal', 'loading', 'error', 'not-found'] as const).map((st) => (
            <Button
              key={st}
              size="sm"
              variant={previewState === st ? 'secondary' : 'outline'}
              onClick={() => setPreviewState(st)}
            >
              {st}
            </Button>
          ))}
        </div>
        <span className="text-xs text-slate-500 font-mono">F7 Officer Case View</span>
      </div>

      {/* Main Complaint Overview Card */}
      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">
                {complaint.id}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(complaint.priority)}`}>
                {complaint.priority} Priority
              </span>
              <span className="text-xs text-slate-500 font-medium">{complaint.category}</span>
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">{complaint.title}</CardTitle>
          </div>
          <Badge variant={complaint.status as BadgeVariant} size="md" dot />
        </CardHeader>

        <CardContent className="space-y-6 pt-6 text-left">
          {/* SECTION 1: COMPLAINT INFORMATION GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Department</span>
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
              <span className="text-slate-500 block mb-1">Reported Citizen</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-500 shrink-0" />
                {complaint.citizenName}
              </span>
            </div>
          </div>

          {/* Full Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Full Issue Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
              {complaint.description}
            </p>
          </div>

          {/* Submitted Photo Evidence */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Citizen Submitted Photo Evidence</h4>
            <div className="w-44 h-32 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-1.5 shadow-2xs">
              <span className="text-3xl">{complaint.thumbnailIcon}</span>
              <span className="text-[11px] font-semibold text-slate-600">Initial Evidence Image</span>
              <span className="text-[10px] text-slate-400 font-mono">Attachment ID: {complaint.id}-IMG</span>
            </div>
          </div>

          {/* SECTION 4: LOCATION SECTION */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Location & Coordinates
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocationModalOpen(true)}
                leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Open Location
              </Button>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-500 block">Manual Location Description:</span>
                <span className="font-semibold text-slate-900 text-sm">{complaint.location}</span>
                <p className="text-[11px] text-slate-500">{complaint.ward}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200 flex items-center gap-1">
                  <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
                  {complaint.coordinates.lat}° N, {complaint.coordinates.lng}° E
                </span>
                <Button variant="ghost" size="sm" onClick={copyCoordinates} title="Copy Coordinates">
                  {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* SECTION 9: RESOLVED COMPLAINT VIEW (Displayed if status === 'RESOLVED') */}
          {complaint.status === 'RESOLVED' && complaint.resolution && (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-emerald-950">Complaint Resolved & Case Closed</h4>
                    <p className="text-xs text-emerald-700">Verified by {complaint.resolution.officerName}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300">
                  Closed on {complaint.resolution.resolvedDate} at {complaint.resolution.resolvedTime}
                </span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-emerald-200 space-y-2">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Official Resolution Note</h5>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">{complaint.resolution.note}</p>
              </div>

              {complaint.resolution.photoPreview ? (
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Resolution Evidence Photo</h5>
                  <img
                    src={complaint.resolution.photoPreview}
                    alt="Resolution evidence"
                    className="max-h-56 rounded-lg border border-emerald-200 object-cover shadow-2xs"
                  />
                </div>
              ) : (
                <div className="p-3 bg-emerald-100/50 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Verified resolution completed on-site by field sanitation unit.</span>
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: STATUS MANAGEMENT CONTROLS */}
          {complaint.status !== 'RESOLVED' && (
            <div className="p-5 rounded-xl bg-slate-900 text-white space-y-4 shadow-md">
              <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Officer Management Controls
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Current Status: <strong className="text-white font-semibold">{complaint.status}</strong>
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setResolveModalOpen(true)}
                  leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                >
                  Mark as Resolved
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Update Complaint Status
                  </label>
                  <Select
                    value={selectedStatus}
                    onChange={handleStatusSelect}
                    options={[
                      { value: '', label: `Select status change (Current: ${complaint.status})` },
                      { value: 'NEW', label: 'Set Status to NEW' },
                      { value: 'ASSIGNED', label: 'Set Status to ASSIGNED' },
                      { value: 'IN_PROGRESS', label: 'Set Status to IN_PROGRESS' },
                      { value: 'RESOLVED', label: 'Set Status to RESOLVED (Opens Resolution Modal)' },
                    ]}
                  />
                </div>
                <div className="text-xs text-slate-400 bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-300 font-semibold block mb-0.5">Workflow Sequence:</span>
                  NEW → ASSIGNED → IN_PROGRESS → RESOLVED
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: PROGRESS NOTES FORM */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              Add Progress Update Note
            </h4>

            <form onSubmit={handleAddProgressNote} className="space-y-3">
              <Textarea
                placeholder="Enter field update or progress details (e.g. 'Inspection completed. Cleanup team assigned.')..."
                value={progressNoteText}
                onChange={(e) => {
                  setProgressNoteText(e.target.value);
                  if (progressNoteError) setProgressNoteError('');
                }}
                maxLength={500}
                error={progressNoteError}
                rows={3}
              />

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs text-slate-500">
                  Author: <strong className="text-slate-800 font-semibold">{officerName}</strong>
                </span>
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  isLoading={isSubmittingNote}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Add Update Note
                </Button>
              </div>
            </form>
          </div>

          {/* SECTION 7: STATUS TIMELINE */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Complete Case History & Activity Timeline
              </h4>
              <span className="text-xs text-slate-500 font-mono">{complaint.timeline.length} Events</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-5">
              {complaint.timeline.map((entry, index) => {
                const isLatest = index === 0;

                return (
                  <div key={entry.id} className="relative flex items-start gap-3 group">
                    {/* Connecting line */}
                    {index < complaint.timeline.length - 1 && (
                      <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-slate-200 -z-0" />
                    )}

                    <div className="mt-0.5 shrink-0 z-10">
                      {entry.type === 'resolution' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 bg-white rounded-full" />
                      ) : entry.type === 'status_change' ? (
                        <ShieldCheck className="w-5 h-5 text-blue-600 bg-white rounded-full" />
                      ) : isLatest ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                          ●
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`font-bold text-sm ${isLatest ? 'text-slate-900' : 'text-slate-700'}`}>
                          {entry.title}
                          {isLatest && (
                            <span className="ml-2 text-[10px] font-semibold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Latest Activity
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{entry.timestamp}</span>
                      </div>

                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100">
                        {entry.description}
                      </p>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-0.5">
                        <span>Logged by:</span>
                        <strong className="text-slate-700 font-semibold">{entry.author}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 flex flex-col sm:flex-row justify-between gap-3 p-6">
          <Link to="/officer/complaints">
            <Button variant="ghost" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Complaints List
            </Button>
          </Link>
          <Link to="/officer/dashboard">
            <Button variant="secondary" size="md">
              Back to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* LOCATION MAP PREVIEW MODAL */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 space-y-4">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Location Map Preview</h3>
              </div>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-2 space-y-4 text-xs">
              <div className="p-8 rounded-xl bg-slate-100 border border-slate-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                  <Crosshair className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Interactive Map Integration</h4>
                <p className="text-slate-500 max-w-xs mx-auto">
                  Map tile renderer and GPS navigation routing will be integrated in a future phase.
                </p>
                <div className="font-mono text-xs bg-white px-3 py-1.5 rounded-md border border-slate-200 inline-block font-bold text-slate-800">
                  {complaint.coordinates.lat}° N, {complaint.coordinates.lng}° E
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block">Reported Location Address:</span>
                <p className="font-semibold text-slate-900 text-sm">{complaint.location}</p>
                <p className="text-slate-500">{complaint.ward}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={copyCoordinates}>
                {copiedCoords ? 'Coordinates Copied!' : 'Copy GPS Coordinates'}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setLocationModalOpen(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RESOLUTION WORKFLOW MODAL */}
      {resolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Resolve Civic Complaint</h3>
              </div>
              <button
                onClick={() => {
                  setResolveModalOpen(false);
                  setConfirmModalOpen(false);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!confirmModalOpen ? (
              <form onSubmit={handleStartResolve} className="p-6 space-y-5">
                <div className="text-xs text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Closing this complaint requires an official resolution note describing the cleanup/repair work done and an optional completion photo.
                  </span>
                </div>

                {/* Resolution Note input */}
                <Textarea
                  label="Official Resolution Note *"
                  placeholder="Describe the action taken (e.g. 'Garbage cleared, dumpster disinfected, and area inspected by field team.')..."
                  value={resolutionNote}
                  onChange={(e) => {
                    setResolutionNote(e.target.value);
                    if (resolutionNoteError) setResolutionNoteError('');
                  }}
                  error={resolutionNoteError}
                  rows={4}
                  required
                />

                {/* Photo Upload UI */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Resolution Photo (Optional Upload)
                  </label>

                  {resolutionPhoto ? (
                    <div className="relative rounded-lg overflow-hidden border border-slate-300">
                      <img src={resolutionPhoto} alt="Resolution Preview" className="h-40 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setResolutionPhoto(null)}
                        className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-slate-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 p-6 rounded-lg text-center cursor-pointer transition-colors space-y-2"
                    >
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-semibold text-slate-700">Click to upload resolution evidence photo</p>
                      <p className="text-[11px] text-slate-400">PNG, JPG, or WEBP up to 5MB</p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setResolveModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="secondary" size="sm">
                    Proceed to Confirmation →
                  </Button>
                </div>
              </form>
            ) : (
              /* CONFIRMATION DIALOG STEP */
              <div className="p-6 space-y-5 animate-in fade-in">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Are you sure this issue has been resolved?</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    This action will update the complaint status to <strong className="text-emerald-700">RESOLVED</strong>, publish your resolution note to the citizen, and mark the case as closed.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="text-slate-500 font-semibold">Resolution Summary:</div>
                  <p className="text-slate-800 italic">"{resolutionNote}"</p>
                  {resolutionPhoto && (
                    <div className="text-[11px] text-emerald-700 font-semibold">✓ Resolution photo attached</div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmModalOpen(false)}
                  >
                    Back to Edit Note
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleFinalConfirmResolve}
                    leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  >
                    Yes, Mark as Resolved
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
