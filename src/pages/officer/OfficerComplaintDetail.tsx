import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, Building, Clock, CheckCircle2, ShieldCheck, Crosshair, FileText,
  LayoutDashboard, Upload, X, AlertTriangle, Send, CheckCircle, Copy, Check, RotateCcw, Users,
  Image as ImageIcon,
} from 'lucide-react';
import {
  PageHeader, Card, CardHeader, CardTitle, CardContent, Button, Badge, Textarea, ErrorMessage,
  LoadingState, type BadgeVariant,
} from '../../components/ui';
import { useOfficerComplaints } from '../../context/OfficerComplaintsContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  getOfficerComplaintByIdApi, updateComplaintStatusApi, addComplaintProgressApi, resolveComplaintApi,
  type ComplaintResponseData,
} from '../../api/complaints';
import { USE_MOCK_DATA } from '../../api/client';

export function OfficerComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const normalizedId = id?.toUpperCase() || 'CIV-1024';
  const { getComplaint, updateStatus, addProgressNote, resolveComplaint } = useOfficerComplaints();
  const { officerUser } = useAuth();
  const { addNotification } = useNotifications();
  const officerName = officerUser?.name || 'Officer Sanjay Kumar';

  const [apiComplaint, setApiComplaint] = useState<ComplaintResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
  const [apiError, setApiError] = useState<string | null>(null);
  const [previewState] = useState<'normal' | 'loading' | 'not-found' | 'error'>('normal');
  const [selectedStatus, setSelectedStatus] = useState<BadgeVariant | ''>('');
  const [progressNoteText, setProgressNoteText] = useState('');
  const [progressNoteError, setProgressNoteError] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; title: string; desc: string } | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionNoteError, setResolutionNoteError] = useState('');
  const [resolutionPhotoPreview, setResolutionPhotoPreview] = useState<string | null>(null);
  const [resolutionPhotoFile, setResolutionPhotoFile] = useState<File | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchComplaintData = async () => {
    setIsLoading(true);
    setApiError(null);
    const res = await getOfficerComplaintByIdApi(normalizedId);
    if (res.success && res.data) {
      const data: ComplaintResponseData = (res.data as any).complaint || res.data;
      setApiComplaint(data);
    } else {
      setApiError(res.error?.includes('403') ? 'You are not authorized to view or modify this complaint.' : res.error || 'Complaint not found.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!USE_MOCK_DATA) fetchComplaintData();
  }, [normalizedId]);

  const mockComplaint = getComplaint(normalizedId);
  const complaint = !USE_MOCK_DATA
    ? apiComplaint
      ? {
          id: apiComplaint.id, title: apiComplaint.title, category: apiComplaint.category || 'Municipal Triage',
          department: apiComplaint.department || officerUser?.department || 'Municipality / Sanitation',
          submittedDate: apiComplaint.submittedDate || (apiComplaint.createdAt ? new Date(apiComplaint.createdAt).toLocaleDateString() : 'Aug 20, 2026'),
          submittedTime: apiComplaint.submittedTime || '10:30 AM', citizenName: apiComplaint.citizenName || 'Citizen',
          status: (apiComplaint.status || 'NEW') as BadgeVariant, priority: apiComplaint.priority || 'Medium',
          thumbnailIcon: apiComplaint.thumbnailIcon || '📌', description: apiComplaint.description, location: apiComplaint.location,
          ward: apiComplaint.ward || 'Ward 12 - Central District', coordinates: apiComplaint.coordinates || null,
          photoUrl: apiComplaint.photoUrl || (apiComplaint as any).photo_url || (apiComplaint as any).photo,
          timeline: (apiComplaint.timeline || [{ id: 'tl-1', timestamp: apiComplaint.submittedDate || 'Aug 20, 10:30 AM', title: 'Complaint Submitted', description: 'Issue reported by citizen and logged into central triage system.', author: apiComplaint.citizenName || 'Citizen', type: 'submission' }]).map((t, idx) => ({ id: t.id || `tl-${idx + 1}`, timestamp: t.timestamp, title: t.title, description: t.description, author: t.author, type: t.type || 'status_change' })),
          resolution: apiComplaint.resolution ? { resolvedDate: apiComplaint.resolution.resolvedDate, resolvedTime: apiComplaint.resolution.resolvedTime, officerName: apiComplaint.resolution.officerName, note: apiComplaint.resolution.note, photoPreview: apiComplaint.resolution.photoPreview } : undefined,
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

  const handleStatusSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as BadgeVariant;
    if (!val || !complaint || val === complaint.status) return;
    if (val === 'RESOLVED') {
      setResolveModalOpen(true);
      return;
    }

    if (!USE_MOCK_DATA) {
      setIsUpdatingStatus(true);
      const res = await updateComplaintStatusApi(complaint.id, val);
      setIsUpdatingStatus(false);
      if (!res.success) {
        setToastMessage({ type: 'info', title: 'Status Update Failed', desc: res.error || 'Unable to update complaint status on server.' });
        return;
      }
      await fetchComplaintData();
    } else {
      updateStatus(complaint.id, val);
      addNotification({
        role: 'citizen', title: `Status Update (${complaint.id})`,
        message: `Your complaint "${complaint.title}" status changed to ${val}.`, complaintId: complaint.id,
        type: val === 'IN_PROGRESS' ? 'in_progress' : 'assigned',
      });
    }

    setSelectedStatus('');
    setToastMessage({ type: 'success', title: 'Status Updated', desc: `Complaint status changed to ${val}. Activity logged to case timeline.` });
  };

  const handleAddProgressNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;
    setProgressNoteError('');
    if (!progressNoteText.trim()) { setProgressNoteError('Please enter a progress note before submitting.'); return; }
    if (progressNoteText.trim().length < 5) { setProgressNoteError('Progress note should be at least 5 characters.'); return; }
    setIsSubmittingNote(true);
    if (!USE_MOCK_DATA) {
      const res = await addComplaintProgressApi(complaint.id, progressNoteText.trim());
      setIsSubmittingNote(false);
      if (!res.success) { setProgressNoteError(res.error || 'Failed to save progress note to server.'); return; }
      await fetchComplaintData();
    } else {
      addProgressNote(complaint.id, progressNoteText.trim(), officerName);
      setIsSubmittingNote(false);
    }
    setProgressNoteText('');
    setToastMessage({ type: 'success', title: 'Progress Note Added', desc: 'Update note logged successfully to complaint activity history.' });
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) { setToastMessage({ type: 'info', title: 'Invalid Photo', desc: 'Please upload a JPG, PNG, or WEBP image.' }); return; }
    if (file.size > 10 * 1024 * 1024) { setToastMessage({ type: 'info', title: 'Photo Too Large', desc: 'Please choose an image smaller than 10MB.' }); return; }
    if (resolutionPhotoPreview) URL.revokeObjectURL(resolutionPhotoPreview);
    setResolutionPhotoFile(file);
    setResolutionPhotoPreview(URL.createObjectURL(file));
  };

  const handleResolve = async () => {
    if (!complaint || !resolutionNote.trim()) { setResolutionNoteError('Resolution note is required.'); return; }
    if (!resolutionPhotoFile) { setResolutionNoteError('Resolution photo is required.'); return; }
    setIsResolving(true);
    if (!USE_MOCK_DATA) {
      const res = await resolveComplaintApi(complaint.id, resolutionNote.trim(), resolutionPhotoFile);
      setIsResolving(false);
      if (!res.success) { setResolutionNoteError(res.error || 'Unable to resolve complaint on server.'); return; }
      await fetchComplaintData();
    } else {
      resolveComplaint(complaint.id, resolutionNote.trim(), officerName, resolutionPhotoPreview || undefined);
      addNotification({ role: 'citizen', title: `Complaint Resolved (${complaint.id})`, message: `Your complaint "${complaint.title}" has been resolved by ${officerName}.`, complaintId: complaint.id, type: 'resolved' });
      setIsResolving(false);
    }
    setResolveModalOpen(false);
    setConfirmModalOpen(false);
    setResolutionNote('');
    setResolutionPhotoFile(null);
    if (resolutionPhotoPreview) URL.revokeObjectURL(resolutionPhotoPreview);
    setResolutionPhotoPreview(null);
    setToastMessage({ type: 'success', title: 'Complaint Resolved', desc: 'The resolution has been saved to the complaint record.' });
  };

  if (!USE_MOCK_DATA && isLoading) return <LoadingState title="Loading complaint..." description="Connecting to municipal server." />;
  if (previewState === 'error' || (!USE_MOCK_DATA && apiError)) return <div className="max-w-3xl mx-auto py-12 space-y-4"><ErrorMessage severity="error" title="Unable to Load Complaint" message={apiError || 'Failed to retrieve complaint details.'} /><div className="text-center"><Button variant="outline" size="sm" onClick={fetchComplaintData} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>Retry Loading</Button></div></div>;
  if (previewState === 'not-found' || !complaint) return <div className="max-w-3xl mx-auto py-12 text-center space-y-4 bg-white rounded-lg border border-slate-200 p-8"><AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" /><h3 className="text-xl font-bold text-slate-900">Complaint Not Found</h3><p className="text-xs text-slate-500">No complaint matching ID "{id}" was found.</p><Link to="/officer/complaints"><Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Queue</Button></Link></div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <PageHeader title={`Complaint ${complaint.id}`} description="Officer case handling and municipal field response." breadcrumbs={[{ label: 'Officer Portal', href: '/officer' }, { label: 'Complaints', href: '/officer/complaints' }, { label: complaint.id }]} badge={<Badge variant={complaint.status} size="md" dot />} actions={<div className="flex items-center gap-2"><Link to="/officer/complaints"><Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Queue</Button></Link><Link to="/officer/dashboard"><Button variant="ghost" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4" />}>Dashboard</Button></Link></div>} />
      <Card className="shadow-2xs text-left">
        <CardHeader className="bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4"><div className="space-y-1.5 flex-1"><div className="flex items-center gap-2.5 flex-wrap"><span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">{complaint.id}</span><span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(complaint.priority)}`}>{complaint.priority} Priority</span><span className="text-xs font-medium text-slate-500">{complaint.category}</span></div><CardTitle className="text-xl font-bold text-slate-900">{complaint.title}</CardTitle></div><Badge variant={complaint.status} size="md" dot /></CardHeader>
        <CardContent className="space-y-6 pt-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs"><div><span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Department</span><span className="font-bold text-slate-900 flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />{complaint.department}</span></div><div><span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Citizen Reporter</span><span className="font-bold text-slate-900 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />{complaint.citizenName}</span></div><div><span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Submitted Date</span><span className="font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />{complaint.submittedDate}</span></div></div>
          <div className="space-y-2"><h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" />Description & Details</h3><p className="text-sm text-slate-800 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-200">{complaint.description}</p></div>
          {complaint.photoUrl ? <div className="space-y-2"><h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-slate-400" />Citizen Evidence</h3><div className="bg-slate-50 p-3 rounded-lg border border-slate-200"><a href={complaint.photoUrl} target="_blank" rel="noreferrer" className="block"><img src={complaint.photoUrl} alt="Citizen complaint evidence" className="block w-full max-h-96 object-contain rounded-md border border-slate-200 bg-white" loading="lazy" /></a></div></div> : null}
          <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"><div className="space-y-1"><span className="font-semibold text-blue-900 uppercase text-[10px] tracking-wider block">Incident Location</span><p className="font-bold text-slate-900 flex items-center gap-1.5 text-sm"><MapPin className="w-4 h-4 text-blue-600 shrink-0" />{complaint.location}</p></div>{complaint.coordinates && <span className="text-slate-600 font-mono text-[11px]">GPS: {complaint.coordinates.lat.toFixed(4)}° N, {complaint.coordinates.lng.toFixed(4)}° E</span>}</div>
        </CardContent>
      </Card>

      <Card className="text-left"><CardHeader><CardTitle className="text-base">Case Actions</CardTitle></CardHeader><CardContent className="space-y-5"><div><label className="text-xs font-semibold text-slate-600 block mb-2">Update Status</label><select value={selectedStatus} disabled={isUpdatingStatus || complaint.status === 'RESOLVED'} onChange={handleStatusSelect} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"><option value="">Select new status</option><option value="ASSIGNED">ASSIGNED</option><option value="IN_PROGRESS">IN_PROGRESS</option><option value="RESOLVED">RESOLVED</option></select></div><form onSubmit={handleAddProgressNote} className="space-y-2"><label className="text-xs font-semibold text-slate-600 block">Progress Note</label><Textarea value={progressNoteText} onChange={(e) => setProgressNoteText(e.target.value)} placeholder="Enter progress update" disabled={isSubmittingNote} />{progressNoteError && <p className="text-xs text-rose-600">{progressNoteError}</p>}<Button type="submit" size="sm" disabled={isSubmittingNote}>{isSubmittingNote ? 'Saving...' : 'Add Progress Note'}</Button></form></CardContent></Card>

      {complaint.status === 'RESOLVED' && complaint.resolution && <Card className="border-2 border-emerald-300 shadow-md bg-emerald-50/40 text-left"><CardHeader className="bg-emerald-100/70 border-b border-emerald-200"><CardTitle className="text-base font-bold text-emerald-950">Resolution</CardTitle></CardHeader><CardContent className="p-5 space-y-3 text-xs"><p className="text-sm font-medium text-slate-900 bg-white p-3 rounded border border-emerald-200">{complaint.resolution.note}</p>{complaint.resolution.photoPreview && <img src={complaint.resolution.photoPreview} alt="Resolution proof" className="block w-full max-h-64 object-contain rounded border border-emerald-200 bg-white" loading="lazy" />}</CardContent></Card>}

      {toastMessage && <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-slate-200 bg-white shadow-lg p-4"><p className="font-semibold text-sm">{toastMessage.title}</p><p className="text-xs text-slate-600 mt-1">{toastMessage.desc}</p><button className="text-xs text-blue-600 mt-2" onClick={() => setToastMessage(null)}>Dismiss</button></div>}

      {resolveModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-lg rounded-xl bg-white shadow-xl p-6 space-y-4"><div><h2 className="text-lg font-bold">Resolve Complaint</h2><p className="text-xs text-slate-500 mt-1">Resolution requires a note and evidence photo.</p></div><Textarea value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)} placeholder="Describe the resolution" />{resolutionNoteError && <p className="text-xs text-rose-600">{resolutionNoteError}</p>}<input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoSelect} className="text-sm" />{resolutionPhotoPreview && <img src={resolutionPhotoPreview} alt="Resolution preview" className="w-full max-h-48 object-contain rounded border" />}<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setResolveModalOpen(false)}>Cancel</Button><Button onClick={handleResolve} disabled={isResolving}>{isResolving ? 'Resolving...' : 'Resolve Complaint'}</Button></div></div></div>}
    </div>
  );
}
