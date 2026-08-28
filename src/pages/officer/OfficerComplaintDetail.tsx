import { useState, useRef, useEffect } from 'react';
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
  LayoutDashboard,
  Upload,
  X,
  AlertTriangle,
  Send,
  CheckCircle,
  Copy,
  Check,
  RotateCcw,
  Users,
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
  Textarea,
  ErrorMessage,
  LoadingState,
  type BadgeVariant,
} from '../../components/ui';
import { useOfficerComplaints } from '../../context/OfficerComplaintsContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  getOfficerComplaintByIdApi,
  updateComplaintStatusApi,
  addComplaintProgressApi,
  resolveComplaintApi,
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
          id: apiComplaint.id,
          title: apiComplaint.title,
          category: apiComplaint.category || 'Municipal Triage',
          department: apiComplaint.department || officerUser?.department || 'Municipality / Sanitation',
          submittedDate: apiComplaint.submittedDate || (apiComplaint.createdAt ? new Date(apiComplaint.createdAt).toLocaleDateString() : 'Aug 20, 2026'),
          submittedTime: apiComplaint.submittedTime || '10:30 AM',
          citizenName: apiComplaint.citizenName || 'Sanjay Patel',
          status: (apiComplaint.status || 'NEW') as BadgeVariant,
          priority: apiComplaint.priority || 'Medium',
          thumbnailIcon: apiComplaint.thumbnailIcon || '📌',
          description: apiComplaint.description,
          location: apiComplaint.location,
          ward: apiComplaint.ward || 'Ward 12 - Central District',
          coordinates: apiComplaint.coordinates || { lat: 12.9716, lng: 77.5946 },
          photoUrl: apiComplaint.photoUrl || (apiComplaint as any).photo_url || (apiComplaint as any).photo,
          timeline: (apiComplaint.timeline || [
            { id: `tl-1`, timestamp: apiComplaint.submittedDate || 'Aug 20, 10:30 AM', title: 'Complaint Submitted', description: 'Issue reported by citizen and logged into central triage system.', author: apiComplaint.citizenName || 'Citizen', type: 'submission' },
          ]).map((t, idx) => ({ id: t.id || `tl-${idx + 1}`, timestamp: t.timestamp, title: t.title, description: t.description, author: t.author, type: t.type || 'status_change' })),
          resolution: apiComplaint.resolution ? {
            resolvedDate: apiComplaint.resolution.resolvedDate,
            resolvedTime: apiComplaint.resolution.resolvedTime,
            officerName: apiComplaint.resolution.officerName,
            note: apiComplaint.resolution.note,
            photoPreview: apiComplaint.resolution.photoPreview,
          } : undefined,
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
    if (val === 'RESOLVED') { setResolveModalOpen(true); return; }

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
      addNotification({ role: 'citizen', title: `Status Update (${complaint.id})`, message: `Your complaint "${complaint.title}" status changed to ${val}.`, complaintId: complaint.id, type: val === 'IN_PROGRESS' ? 'in_progress' : 'assigned' });
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
      fetchComplaintData();
    } else {
      addProgressNote(complaint.id, progressNoteText.trim(), officerName);
      setIsSubmittingNote(false);
    }
    setProgressNoteText('');
    setToastMessage({ type: 'success', title: 'Progress Note Added', desc: 'Update note logged successfully to complaint activity history.' });
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResolutionPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setResolutionPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleStartResolve = (e: React.FormEvent) => {
    e.preventDefault();
    setResolutionNoteError('');
    if (!resolutionNote.trim()) { setResolutionNoteError('Resolution note is required explaining what work was completed.'); return; }
    setConfirmModalOpen(true);
  };

  const handleFinalConfirmResolve = async () => {
    if (!complaint) return;
    setIsResolving(true);
    if (!USE_MOCK_DATA) {
      const res = await resolveComplaintApi(complaint.id, resolutionNote.trim(), resolutionPhotoFile);
      setIsResolving(false);
      if (!res.success) { setResolutionNoteError(res.error || 'Unable to submit resolution report to server.'); setConfirmModalOpen(false); return; }
      await fetchComplaintData();
    } else {
      resolveComplaint(complaint.id, resolutionNote.trim(), resolutionPhotoPreview || undefined, officerName);
      addNotification({ role: 'citizen', title: `Complaint Resolved (${complaint.id})`, message: `Your complaint "${complaint.title}" has been successfully resolved!`, complaintId: complaint.id, type: 'resolved' });
      setIsResolving(false);
    }

    setConfirmModalOpen(false);
    setResolveModalOpen(false);
    setResolutionNote('');
    setResolutionPhotoPreview(null);
    setResolutionPhotoFile(null);
    setToastMessage({ type: 'success', title: 'Complaint Resolved', desc: `Case ${complaint.id} has been marked RESOLVED with completion proof attached.` });
  };

  if (!USE_MOCK_DATA && isLoading) return <LoadingState title="Loading complaint details..." description="Retrieving case data and activity logs from server." />;
  if (previewState === 'error' || (!USE_MOCK_DATA && apiError)) return <div className="max-w-3xl mx-auto py-12 space-y-4"><ErrorMessage severity="error" title="Error Loading Case Data" message={apiError || 'Failed to connect to the municipal record server. Please retry.'} /><div className="text-center"><Button variant="outline" size="sm" onClick={fetchComplaintData} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>Retry Loading</Button></div></div>;
  if (previewState === 'not-found' || !complaint) return <div className="max-w-3xl mx-auto py-12 text-center space-y-4 bg-white rounded-lg border border-slate-200 p-8"><AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" /><h2 className="text-xl font-bold text-slate-900">Complaint Not Found</h2><p className="text-xs text-slate-500 max-w-sm mx-auto">The requested complaint reference "{id}" does not exist in your officer queue.</p><Link to="/officer/complaints"><Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Assigned Complaints</Button></Link></div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {toastMessage && <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-700 flex items-start gap-3 animate-in slide-in-from-bottom duration-300"><CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /><div className="flex-1 space-y-0.5"><h4 className="text-sm font-bold text-white">{toastMessage.title}</h4><p className="text-xs text-slate-300 leading-relaxed">{toastMessage.desc}</p></div><button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white p-1"><X className="w-4 h-4" /></button></div>}
      <PageHeader title={`Manage Complaint ${complaint.id}`} description="Review reported details, update status, record field notes, and log resolution proof." breadcrumbs={[{ label: 'Officer Portal', href: '/officer' }, { label: 'Officer Dashboard', href: '/officer/dashboard' }, { label: 'Assigned Complaints', href: '/officer/complaints' }, { label: complaint.id }]} badge={<Badge variant={complaint.status} size="md" dot />} actions={<div className="flex items-center gap-2"><Link to="/officer/complaints"><Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>Assigned Queue</Button></Link><Link to="/officer/dashboard"><Button variant="ghost" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4" />}>Dashboard</Button></Link></div>} />
      <Card className="shadow-2xs text-left"><CardHeader className="bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4"><div className="space-y-1.5 flex-1"><div className="flex items-center gap-2.5 flex-wrap"><span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">{complaint.id}</span><span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(complaint.priority)}`}>{complaint.priority} Priority</span><span className="text-xs font-medium text-slate-500">{complaint.category}</span></div><CardTitle className="text-xl font-bold text-slate-900">{complaint.title}</CardTitle></div><div className="shrink-0 flex items-center gap-2"><Badge variant={complaint.status} size="md" dot /></div></CardHeader>
        <CardContent className="space-y-6 pt-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs"><div><span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Department Queue</span><span className="font-bold text-slate-900 flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />{complaint.department}</span></div><div><span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Submitted Timestamp</span><span className="font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />{complaint.submittedDate} at {complaint.submittedTime}</span></div><div><span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Citizen Reporter</span><span className="font-bold text-slate-900 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />{complaint.citizenName} ({complaint.ward})</span></div></div>
          <div className="space-y-2"><h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" />Citizen Issue Description</h3><p className="text-sm text-slate-800 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-200">{complaint.description}</p></div>
          {complaint.photoUrl ? <div className="space-y-2"><h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-slate-400" />Attached Evidence Photo</h3><div className="bg-slate-50 p-3 rounded-lg border border-slate-200"><a href={complaint.photoUrl} target="_blank" rel="noreferrer" className="block" aria-label="Open complaint evidence photo in a new tab"><img src={complaint.photoUrl} alt="Citizen uploaded complaint evidence" className="w-full max-h-96 object-contain rounded-md border border-slate-200 bg-white" loading="lazy" /></a></div></div> : <div className="space-y-2"><h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-slate-400" />Attached Evidence Photo</h3><p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-200">No complaint evidence photo was uploaded for this issue.</p></div>}
          <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"><div className="space-y-1"><span className="font-semibold text-blue-900 uppercase text-[10px] tracking-wider block">Reported Incident Location</span><p className="font-bold text-slate-900 flex items-center gap-1.5 text-sm"><MapPin className="w-4 h-4 text-blue-600 shrink-0" />{complaint.location}</p>{complaint.coordinates && <p className="text-slate-600 font-mono text-[11px]">GPS: {complaint.coordinates.lat.toFixed(4)}° N, {complaint.coordinates.lng.toFixed(4)}° E</p>}</div><Button size="sm" variant="outline" onClick={() => setLocationModalOpen(true)} leftIcon={<Crosshair className="w-3.5 h-3.5 text-blue-600" />}>View Geotag Details</Button></div>
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3"><div className="flex items-center justify-between flex-wrap gap-2"><span className="text-xs font-bold uppercase tracking-wider text-slate-300">Officer Actions & Workflow</span><span className="text-[11px] text-slate-400">Current Status: {complaint.status}</span></div><div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"><div className="flex-1"><select disabled={isUpdatingStatus || complaint.status === 'RESOLVED'} value={selectedStatus || complaint.status} onChange={handleStatusSelect} className="w-full text-xs font-semibold bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"><option value="NEW">Status: NEW (Unassigned/Triage)</option><option value="ASSIGNED">Status: ASSIGNED (In Triage)</option><option value="IN_PROGRESS">Status: IN_PROGRESS (Field Technician On-Site)</option><option value="RESOLVED">Status: RESOLVED (Mark Complete & Close)</option></select></div>{complaint.status !== 'RESOLVED' && <Button size="md" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 font-bold shrink-0" onClick={() => setResolveModalOpen(true)} leftIcon={<CheckCircle2 className="w-4 h-4" />}>Mark as Resolved & Upload Proof</Button>}</div></div>
        </CardContent>
      </Card>
      {complaint.status === 'RESOLVED' && complaint.resolution && <Card className="border-2 border-emerald-300 shadow-md bg-emerald-50/40 text-left"><CardHeader className="bg-emerald-100/70 border-b border-emerald-200 flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold"><CheckCircle2 className="w-5 h-5" /></div><div><CardTitle className="text-base font-bold text-emerald-950">Case Resolution Report</CardTitle><p className="text-xs text-emerald-800">Closed on {complaint.resolution.resolvedDate} at {complaint.resolution.resolvedTime}</p></div></div><span className="font-mono text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300">RESOLVED</span></CardHeader><CardContent className="p-5 space-y-4 text-xs"><div className="p-3 rounded-lg bg-white border border-emerald-200 space-y-1"><span className="font-semibold text-slate-500 block uppercase text-[10px]">Work Completed Note</span><p className="text-sm font-medium text-slate-900">{complaint.resolution.note}</p></div>{complaint.resolution.photoPreview && <div className="space-y-1.5"><span className="font-semibold text-slate-500 block uppercase text-[10px]">Uploaded Resolution Proof</span><img src={complaint.resolution.photoPreview} alt="Resolution Proof" className="w-full max-h-64 object-cover rounded-lg border border-emerald-200 shadow-2xs" /></div>}<div className="flex items-center gap-2 text-slate-700 pt-1 font-medium"><ShieldCheck className="w-4 h-4 text-emerald-600" /><span>Resolved by Officer <strong>{complaint.resolution.officerName}</strong></span></div></CardContent></Card>}
      {complaint.status !== 'RESOLVED' && <Card className="shadow-2xs text-left"><CardHeader className="border-b border-slate-200 bg-slate-50"><CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2"><Send className="w-4 h-4 text-blue-600" />Add Progress Update Note</CardTitle></CardHeader><CardContent className="p-5 space-y-4"><form onSubmit={handleAddProgressNote} className="space-y-3"><Textarea rows={3} placeholder="Log field update (e.g. Dispatched crew to inspect pavement slab, estimated completion by 4 PM)..." value={progressNoteText} onChange={(e) => setProgressNoteText(e.target.value)} error={progressNoteError} /><div className="flex items-center justify-between"><span className="text-xs text-slate-500">Notes are logged publicly to the citizen tracking timeline.</span><Button type="submit" variant="primary" size="sm" isLoading={isSubmittingNote} leftIcon={<Send className="w-3.5 h-3.5" />}>Log Progress Note</Button></div></form></CardContent></Card>}
      <Card className="shadow-2xs text-left"><CardHeader className="border-b border-slate-200 bg-slate-50"><CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" />Complaint Activity & Timeline History</CardTitle></CardHeader><CardContent className="p-6"><div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">{complaint.timeline.map((entry) => <div key={entry.id} className="relative group"><div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900 text-white flex items-center justify-center border-2 border-white shadow-2xs"><CheckCircle2 className="w-3.5 h-3.5" /></div><div className="space-y-1"><div className="flex items-center justify-between flex-wrap gap-2"><h4 className="text-sm font-bold text-slate-900">{entry.title}</h4><span className="text-xs font-mono text-slate-500">{entry.timestamp}</span></div><p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">{entry.description}</p><div className="text-[11px] text-slate-400 font-medium pt-0.5">Author: {entry.author}</div></div></div>)}</div></CardContent></Card>
      {resolveModalOpen && <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"><div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in text-left"><div className="flex items-center justify-between border-b border-slate-200 pb-3"><h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" />Resolve Complaint {complaint.id}</h3><button onClick={() => setResolveModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button></div><form onSubmit={handleStartResolve} className="space-y-4 text-xs"><div className="space-y-1"><label className="font-semibold text-slate-700 block">Work Completed Resolution Note <span className="text-rose-600">*</span></label><Textarea rows={3} placeholder="Describe the action taken (e.g. Pavement slab re-laid and sealed, area cleared)..." value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)} error={resolutionNoteError} /></div><div className="space-y-2"><label className="font-semibold text-slate-700 block">Attach Field Resolution Photo Proof (Optional)</label><input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoSelect} className="hidden" />{resolutionPhotoPreview ? <div className="space-y-2"><img src={resolutionPhotoPreview} alt="Resolution Proof Preview" className="w-full h-40 object-cover rounded-lg border border-slate-200" /><Button type="button" variant="outline" size="sm" onClick={() => setResolutionPhotoPreview(null)} leftIcon={<X className="w-3.5 h-3.5" />}>Remove Photo</Button></div> : <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg p-6 text-center bg-slate-50 cursor-pointer hover:bg-blue-50/40 transition-colors"><Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" /><p className="font-bold text-slate-700">Click to upload completion photo</p><p className="text-[11px] text-slate-400">JPG, PNG, or WEBP up to 10MB</p></div>}</div><div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100"><Button type="button" variant="outline" size="sm" onClick={() => setResolveModalOpen(false)}>Cancel</Button><Button type="submit" variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700">Proceed to Resolve</Button></div></form></div></div>}
      {confirmModalOpen && <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"><div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left"><div className="flex items-center gap-3 text-amber-600"><AlertTriangle className="w-8 h-8 shrink-0" /><div><h3 className="font-bold text-base text-slate-900">Confirm Case Resolution</h3><p className="text-xs text-slate-500">Marking this case as RESOLVED will close the complaint and notify the citizen.</p></div></div><div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1"><span className="font-semibold text-slate-700 block">Resolution Note Preview:</span><p className="text-slate-600 italic">"{resolutionNote}"</p></div><div className="flex items-center justify-end gap-2 pt-2"><Button type="button" variant="outline" size="sm" onClick={() => setConfirmModalOpen(false)}>Go Back</Button><Button type="button" variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold" isLoading={isResolving} onClick={handleFinalConfirmResolve}>Confirm Resolution</Button></div></div></div>}
      {locationModalOpen && <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"><div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left"><div className="flex items-center justify-between border-b border-slate-200 pb-3"><h3 className="font-bold text-base text-slate-900 flex items-center gap-2"><Crosshair className="w-5 h-5 text-blue-600" />Geotag Location Details</h3><button onClick={() => setLocationModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button></div><div className="space-y-3 text-xs"><div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1"><span className="font-semibold text-slate-500 block uppercase text-[10px]">Address</span><p className="font-bold text-slate-900">{complaint.location}</p></div>{complaint.coordinates && <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 space-y-2"><span className="font-semibold text-blue-900 block uppercase text-[10px]">Coordinates</span><div className="font-mono text-sm text-slate-900 flex items-center justify-between"><span>{complaint.coordinates.lat.toFixed(6)}°, {complaint.coordinates.lng.toFixed(6)}°</span><button type="button" onClick={() => { if (complaint.coordinates) { navigator.clipboard.writeText(`${complaint.coordinates.lat},${complaint.coordinates.lng}`); setCopiedCoords(true); setTimeout(() => setCopiedCoords(false), 2000); } }} className="text-blue-700 hover:underline flex items-center gap-1 font-sans text-xs">{copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}{copiedCoords ? 'Copied' : 'Copy'}</button></div></div>}</div><div className="flex justify-end pt-2"><Button size="sm" variant="outline" onClick={() => setLocationModalOpen(false)}>Close</Button></div></div></div>}
    </div>
  );
}
