import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building,
  ShieldCheck,
  Crosshair,
  FileText,
  LayoutDashboard,
  UserCheck,
  Edit,
  CheckCircle,
  X,
  AlertTriangle,
  User,
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
  Select,
  ErrorMessage,
  EmptyState,
  LoadingState,
  type BadgeVariant,
} from '../../components/ui';
import { useAdminComplaints } from '../../context/AdminComplaintsContext';
import { CIVIC_DEPARTMENTS } from '../../constants/departments';

export function AdminComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const { getComplaint, officers, assignOfficer, changeDepartment, changePriority, changeStatus } = useAdminComplaints();

  const complaint = getComplaint(id || '');

  // UI state switcher
  const [previewState, setPreviewState] = useState<'normal' | 'loading' | 'not-found' | 'error'>('normal');

  // Modals state
  const [activeModal, setActiveModal] = useState<'assign' | 'department' | 'priority' | 'status' | null>(null);
  const [confirmStep, setConfirmStep] = useState(false);

  // Form field temporary values
  const [targetOfficerId, setTargetOfficerId] = useState('');
  const [targetDepartment, setTargetDepartment] = useState('');
  const [targetPriority, setTargetPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [targetStatus, setTargetStatus] = useState<BadgeVariant>('ASSIGNED');

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  if (previewState === 'loading') {
    return <LoadingState title="Loading master complaint record..." description="Connecting to municipal admin server." />;
  }

  if (previewState === 'error') {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-4">
        <ErrorMessage
          severity="error"
          title="Error Loading Admin Case Data"
          message="Failed to retrieve case details from the central system registry."
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
          icon={<AlertTriangle className="w-8 h-8 text-rose-500" />}
          title="Complaint Record Not Found"
          description={`No master complaint matching ID "${id}" could be located.`}
          action={
            <Link to="/admin/complaints">
              <Button size="sm" variant="secondary">Back to Master Complaints</Button>
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

  // Action Submission Handlers
  const handleConfirmAction = () => {
    if (activeModal === 'assign' && targetOfficerId) {
      assignOfficer(complaint.id, targetOfficerId);
      const off = officers.find((o) => o.id === targetOfficerId);
      setToastMessage({
        title: 'Officer Reassigned',
        desc: `Complaint ${complaint.id} assigned to ${off?.name || 'selected officer'}.`,
      });
    } else if (activeModal === 'department' && targetDepartment) {
      changeDepartment(complaint.id, targetDepartment);
      setToastMessage({
        title: 'Department Reclassified',
        desc: `Complaint ${complaint.id} transferred to ${targetDepartment}.`,
      });
    } else if (activeModal === 'priority' && targetPriority) {
      changePriority(complaint.id, targetPriority);
      setToastMessage({
        title: 'Priority Escalated',
        desc: `Complaint ${complaint.id} priority changed to ${targetPriority}.`,
      });
    } else if (activeModal === 'status' && targetStatus) {
      changeStatus(complaint.id, targetStatus);
      setToastMessage({
        title: 'Status Updated',
        desc: `Complaint ${complaint.id} status changed to ${targetStatus}.`,
      });
    }

    setActiveModal(null);
    setConfirmStep(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h5 className="font-bold text-white text-sm">{toastMessage.title}</h5>
            <p className="text-slate-300 mt-0.5">{toastMessage.desc}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Breadcrumbs */}
      <PageHeader
        title={`Admin Case View: ${complaint.id}`}
        description="System-wide administration, officer dispatch override, and case reclassification."
        breadcrumbs={[
          { label: 'Admin Portal', href: '/admin' },
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Master Complaints', href: '/admin/complaints' },
          { label: complaint.id },
        ]}
        badge={<Badge variant={complaint.status as BadgeVariant} size="md" dot />}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/complaints">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Master List
              </Button>
            </Link>
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
                Dashboard
              </Button>
            </Link>
          </div>
        }
      />

      {/* Preview Switcher */}
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
        <span className="text-xs text-slate-500 font-mono">F9 Admin Case Management</span>
      </div>

      {/* Main Complaint Detail Card */}
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
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Department</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600 shrink-0" />
                {complaint.department}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Assigned Officer</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                {complaint.assignedOfficer}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Citizen Reporter</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-500 shrink-0" />
                {complaint.citizenName}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Submission Date</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                {complaint.submittedDate}, {complaint.submittedTime}
              </span>
            </div>
          </div>

          {/* ADMIN MOCK ACTIONS TOOLBAR */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 shadow-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Administrative Actions & Control Overrides
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-slate-700 hover:bg-slate-800"
                onClick={() => {
                  setActiveModal('assign');
                  setTargetOfficerId(complaint.assignedOfficerId || officers[0].id);
                  setConfirmStep(false);
                }}
                leftIcon={<UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
              >
                Assign Officer
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-white border-slate-700 hover:bg-slate-800"
                onClick={() => {
                  setActiveModal('department');
                  setTargetDepartment(complaint.department);
                  setConfirmStep(false);
                }}
                leftIcon={<Building className="w-3.5 h-3.5 text-blue-400" />}
              >
                Change Dept
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-white border-slate-700 hover:bg-slate-800"
                onClick={() => {
                  setActiveModal('priority');
                  setTargetPriority(complaint.priority);
                  setConfirmStep(false);
                }}
                leftIcon={<Edit className="w-3.5 h-3.5 text-amber-400" />}
              >
                Change Priority
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-white border-slate-700 hover:bg-slate-800"
                onClick={() => {
                  setActiveModal('status');
                  setTargetStatus(complaint.status);
                  setConfirmStep(false);
                }}
                leftIcon={<Edit className="w-3.5 h-3.5 text-sky-400" />}
              >
                Change Status
              </Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Full Issue Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
              {complaint.description}
            </p>
          </div>

          {/* Photo Evidence */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Submitted Photo Evidence</h4>
            <div className="w-44 h-32 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-1.5 shadow-2xs">
              <span className="text-3xl">{complaint.thumbnailIcon}</span>
              <span className="text-[11px] font-semibold text-slate-600">Attached Evidence</span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Location Details
            </h4>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Address:</span>
                <span className="font-semibold text-slate-900 text-sm">{complaint.location}</span>
                <p className="text-slate-500">{complaint.ward}</p>
              </div>
              <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200 inline-flex items-center gap-1">
                <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
                {complaint.coordinates.lat}° N, {complaint.coordinates.lng}° E
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 flex flex-col sm:flex-row justify-between gap-3 p-6">
          <Link to="/admin/complaints">
            <Button variant="ghost" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Master List
            </Button>
          </Link>
          <Link to="/admin/dashboard">
            <Button variant="secondary" size="md">
              Back to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* ADMIN ACTION MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base uppercase">
                  {activeModal === 'assign' && 'Assign Officer'}
                  {activeModal === 'department' && 'Change Department'}
                  {activeModal === 'priority' && 'Escalate Priority'}
                  {activeModal === 'status' && 'Override Status'}
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!confirmStep ? (
              <div className="p-6 space-y-4 text-xs">
                {activeModal === 'assign' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-700">Select Municipal Officer:</label>
                    <Select
                      value={targetOfficerId}
                      onChange={(e) => setTargetOfficerId(e.target.value)}
                      options={officers.map((o) => ({
                        value: o.id,
                        label: `${o.name} (${o.department} - ${o.assignedComplaints} active)`,
                      }))}
                    />
                  </div>
                )}

                {activeModal === 'department' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-700">Select Department:</label>
                    <Select
                      value={targetDepartment}
                      onChange={(e) => setTargetDepartment(e.target.value)}
                      options={CIVIC_DEPARTMENTS.map((d) => ({ value: d.value, label: d.label }))}
                    />
                  </div>
                )}

                {activeModal === 'priority' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-700">Select Priority Level:</label>
                    <Select
                      value={targetPriority}
                      onChange={(e) => setTargetPriority(e.target.value as any)}
                      options={[
                        { value: 'Low', label: 'Low Priority' },
                        { value: 'Medium', label: 'Medium Priority' },
                        { value: 'High', label: 'High Priority' },
                        { value: 'Critical', label: 'Critical Priority' },
                      ]}
                    />
                  </div>
                )}

                {activeModal === 'status' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-700">Select Status:</label>
                    <Select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value as BadgeVariant)}
                      options={[
                        { value: 'NEW', label: 'NEW' },
                        { value: 'ASSIGNED', label: 'ASSIGNED' },
                        { value: 'IN_PROGRESS', label: 'IN_PROGRESS' },
                        { value: 'RESOLVED', label: 'RESOLVED' },
                      ]}
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                  <Button variant="secondary" size="sm" onClick={() => setConfirmStep(true)}>
                    Proceed to Confirm →
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4 text-xs animate-in fade-in">
                <div className="text-center space-y-2">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900">Confirm Admin Action?</h4>
                  <p className="text-slate-600">
                    Are you sure you want to update complaint <strong className="text-slate-900">{complaint.id}</strong>?
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button variant="outline" size="sm" onClick={() => setConfirmStep(false)}>Back</Button>
                  <Button variant="primary" size="sm" onClick={handleConfirmAction}>
                    Confirm & Update
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
