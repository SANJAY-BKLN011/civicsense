import { Link } from 'react-router-dom';
import { Mail, MapPin, Building } from 'lucide-react';
import { PageHeader, Card, CardContent, Button } from '../../components/ui';
import { useAdminComplaints } from '../../context/AdminComplaintsContext';

export function AdminOfficers() {
  const { officers } = useAdminComplaints();

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {officers.map((off) => (
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
                  <span>{off.ward}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{off.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="p-2.5 rounded bg-blue-50/80 border border-blue-100">
                  <span className="text-[10px] text-blue-700 font-semibold block">Active Workload</span>
                  <span className="text-base font-extrabold text-blue-900">{off.assignedComplaints} Cases</span>
                </div>
                <div className="p-2.5 rounded bg-emerald-50/80 border border-emerald-100">
                  <span className="text-[10px] text-emerald-700 font-semibold block">Cases Resolved</span>
                  <span className="text-base font-extrabold text-emerald-900">{off.resolvedComplaints} Cases</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Link to="/admin/dashboard">
          <Button variant="outline" size="sm">← Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
