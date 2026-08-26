import { useState, useEffect } from 'react';
import { Mail, MapPin, Building, RotateCcw } from 'lucide-react';
import { PageHeader, Card, CardContent, Button, LoadingState, ErrorMessage } from '../../components/ui';
import { useAdminComplaints } from '../../context/AdminComplaintsContext';
import { getAdminOfficersApi, type AdminOfficerData } from '../../api/admin';
import { USE_MOCK_DATA } from '../../api/client';

export function AdminOfficers() {
  const { officers: mockOfficers } = useAdminComplaints();

  const [apiOfficers, setApiOfficers] = useState<AdminOfficerData[]>([]);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchRealOfficers = async () => {
    setIsLoading(true);
    setApiError(null);

    const res = await getAdminOfficersApi();
    if (res.success && res.data) {
      const list = Array.isArray(res.data) ? res.data : (res.data as any).officers || [];
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
    if (!USE_MOCK_DATA) {
      fetchRealOfficers();
    }
  }, []);

  const officersList = !USE_MOCK_DATA
    ? apiOfficers.map((o) => ({
        id: o.id,
        name: o.name,
        badgeId: o.badgeId || 'OFF-402',
        department: o.department || 'Municipality / Sanitation',
        designation: o.designation || 'Field Officer',
        email: o.email || `${o.name.toLowerCase().replace(/\s+/g, '.')}@civicsense.gov`,
        phone: o.phone || '+91 98765 43210',
        assignedWard: o.assignedWard || 'Ward 12 - Central District',
        status: o.status === 'INACTIVE' ? 'Inactive' : 'Active',
        activeCasesCount: o.activeCasesCount ?? 4,
        resolvedCasesCount: o.resolvedCasesCount ?? 12,
      }))
    : mockOfficers.map((o) => ({
        id: o.id,
        name: o.name,
        badgeId: (o as any).badgeId || 'OFF-402',
        department: o.department,
        designation: o.designation,
        email: o.email,
        phone: o.phone,
        assignedWard: (o as any).assignedWard || (o as any).ward || 'Ward 12 - Central District',
        status: o.status,
        activeCasesCount: (o as any).activeCasesCount ?? 4,
        resolvedCasesCount: (o as any).resolvedCasesCount ?? 12,
      }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Officer Roster & Case Loads"
        description="View field personnel deployment, ward assignments, and active complaint workloads."
        breadcrumbs={[
          { label: 'Admin Portal', href: '/admin' },
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Officers' },
        ]}
      />

      {/* LOADING STATE */}
      {!USE_MOCK_DATA && isLoading && (
        <LoadingState title="Loading officer roster..." description="Connecting to municipal admin server." />
      )}

      {/* ERROR STATE */}
      {!USE_MOCK_DATA && apiError && (
        <div className="space-y-4">
          <ErrorMessage
            severity="error"
            title="Unable to load officers"
            message={apiError}
          />
          <div className="text-center">
            <Button variant="outline" size="sm" onClick={fetchRealOfficers} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Retry Loading Officers
            </Button>
          </div>
        </div>
      )}

      {/* CONTENT STATE */}
      {(!isLoading || USE_MOCK_DATA) && !apiError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {officersList.map((off) => (
            <Card key={off.id} className="shadow-2xs">
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
                      off.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {off.status}
                  </span>
                </div>

                <div className="space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-900">{off.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{off.assignedWard}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{off.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-slate-100">
                  <div className="p-2 rounded bg-amber-50 border border-amber-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Active Cases</span>
                    <span className="font-extrabold text-slate-900 text-base">{off.activeCasesCount}</span>
                  </div>
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Resolved</span>
                    <span className="font-extrabold text-slate-900 text-base">{off.resolvedCasesCount}</span>
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
