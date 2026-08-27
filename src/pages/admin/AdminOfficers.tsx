import { useState, useEffect } from 'react';
import { Mail, Building, RotateCcw, CheckCircle, XCircle, UserCheck, Lock, Unlock } from 'lucide-react';
import { PageHeader, Card, CardContent, Button, LoadingState, ErrorMessage } from '../../components/ui';
import { useAdminComplaints } from '../../context/AdminComplaintsContext';
import { getAdminOfficersApi, approveOfficerApi, rejectOfficerApi, blockUserApi, unblockUserApi, type AdminOfficerData } from '../../api/admin';
import { USE_MOCK_DATA } from '../../api/client';

export function AdminOfficers() {
  const { officers: mockOfficers } = useAdminComplaints();
  const [apiOfficers, setApiOfficers] = useState<AdminOfficerData[]>([]);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
  const [apiError, setApiError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const fetchRealOfficers = async () => {
    setIsLoading(true);
    setApiError(null);
    const res = await getAdminOfficersApi();
    if (res.success && res.data) {
      const list = Array.isArray(res.data) ? res.data : res.data.officers || [];
      setApiOfficers(list);
    } else {
      setApiError(
        res.error?.includes('403')
          ? 'You are not authorized to access the admin portal.'
          : res.error || 'Unable to load officer roster from server.'
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!USE_MOCK_DATA) fetchRealOfficers();
  }, []);

  const handleApproveOfficer = async (officerId: string, officerName: string) => {
    setActionError(null);
    setActionSuccess(null);
    setLoadingActionId(officerId);

    if (!USE_MOCK_DATA) {
      const res = await approveOfficerApi(officerId);
      if (res.success) {
        setActionSuccess(`Officer "${officerName}" approved successfully.`);
        await fetchRealOfficers();
      } else {
        setActionError(res.error || `Failed to approve officer "${officerName}".`);
      }
    } else {
      setActionSuccess(`Demo Mode: Officer "${officerName}" approved.`);
    }
    setLoadingActionId(null);
  };

  const handleRejectOfficer = async (officerId: string, officerName: string) => {
    setActionError(null);
    setActionSuccess(null);
    setLoadingActionId(officerId);

    if (!USE_MOCK_DATA) {
      const res = await rejectOfficerApi(officerId, 'Rejected by system administrator.');
      if (res.success) {
        setActionSuccess(`Officer "${officerName}" registration rejected.`);
        await fetchRealOfficers();
      } else {
        setActionError(res.error || `Failed to reject officer "${officerName}".`);
      }
    } else {
      setActionSuccess(`Demo Mode: Officer "${officerName}" rejected.`);
    }
    setLoadingActionId(null);
  };

  const handleToggleBlock = async (userId: string, userName: string, isBlocked: boolean) => {
    setActionError(null);
    setActionSuccess(null);

    if (!USE_MOCK_DATA) {
      const res = isBlocked ? await unblockUserApi(userId) : await blockUserApi(userId);
      if (!res.success) {
        setActionError(res.error || `Unable to change block status for "${userName}".`);
      } else {
        setActionSuccess(`User "${userName}" status updated successfully.`);
        await fetchRealOfficers();
      }
    } else {
      setActionSuccess(`Demo Mode: User "${userName}" ${isBlocked ? 'unblocked' : 'blocked'}.`);
    }
  };

  const officersList = !USE_MOCK_DATA
    ? apiOfficers.map((o) => ({
        id: o.id,
        user_id: o.user_id,
        name: o.name,
        badgeId: o.user_id.slice(0, 8).toUpperCase(),
        department: o.department.name,
        designation: o.designation || 'Field Officer',
        email: o.email,
        phone: o.phone || 'Not provided',
        verification_status: o.verification_status,
        rejection_reason: o.rejection_reason,
        status: o.verification_status === 'APPROVED' ? 'Active' : o.verification_status === 'REJECTED' ? 'Rejected' : 'Pending',
        isBlocked: false,
      }))
    : mockOfficers.map((o) => ({
        id: o.id,
        user_id: o.id,
        name: o.name,
        badgeId: (o as any).badgeId || 'OFF-402',
        department: o.department,
        designation: o.designation,
        email: o.email,
        phone: o.phone,
        verification_status: (o.status === 'Active' ? 'APPROVED' : 'PENDING') as 'APPROVED' | 'PENDING' | 'REJECTED',
        rejection_reason: null,
        status: o.status,
        isBlocked: false,
      }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Officer Roster & Approvals"
        description="Verify pending officer registrations, assign directorates, and manage personnel access."
        breadcrumbs={[
          { label: 'Admin Portal', href: '/admin' },
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Officers' },
        ]}
      />

      {actionSuccess && (
        <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-2">Dismiss</button>
        </div>
      )}

      {actionError && (
        <ErrorMessage
          severity="error"
          title="Operation Notice"
          message={actionError}
        />
      )}

      {!USE_MOCK_DATA && isLoading && (
        <LoadingState title="Loading officer roster..." description="Connecting to municipal admin server." />
      )}

      {!USE_MOCK_DATA && apiError && (
        <div className="space-y-4">
          <ErrorMessage severity="error" title="Unable to load officers" message={apiError} />
          <div className="text-center">
            <Button variant="outline" size="sm" onClick={fetchRealOfficers} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Retry Loading Officers
            </Button>
          </div>
        </div>
      )}

      {(!isLoading || USE_MOCK_DATA) && !apiError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {officersList.map((off) => (
            <Card key={off.id} className="shadow-2xs flex flex-col justify-between">
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                      {off.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{off.name}</h3>
                      <p className="text-slate-500">{off.designation}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      off.verification_status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : off.verification_status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {off.verification_status}
                  </span>
                </div>

                <div className="space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-900">{off.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{off.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>ID: {off.badgeId}</span>
                  </div>
                </div>

                {off.rejection_reason && (
                  <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                    <span className="font-bold block">Rejection Reason:</span>
                    {off.rejection_reason}
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  {off.verification_status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        className="flex-1 text-xs"
                        isLoading={loadingActionId === off.id}
                        onClick={() => handleApproveOfficer(off.id, off.name)}
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-rose-700 hover:bg-rose-50"
                        isLoading={loadingActionId === off.id}
                        onClick={() => handleRejectOfficer(off.id, off.name)}
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Reject
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[11px] text-slate-600 hover:text-slate-900"
                      onClick={() => handleToggleBlock(off.user_id, off.name, off.isBlocked)}
                      leftIcon={off.isBlocked ? <Unlock className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-rose-600" />}
                    >
                      {off.isBlocked ? 'Unblock User' : 'Block User'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
