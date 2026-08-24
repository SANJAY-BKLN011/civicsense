import { Link } from 'react-router-dom';
import { Building, RefreshCw } from 'lucide-react';
import { PageHeader, Card, CardContent, Button, LoadingState, ErrorMessage } from '../../components/ui';
import { useDepartments } from '../../context/DepartmentContext';
import { mockDepartmentPerformance } from '../../data/mockAdminData';

export function AdminDepartments() {
  const { departments, isLoading, error, refetchDepartments } = useDepartments();

  // Combine backend department records with existing demo performance metrics.
  // Department identity itself always comes from the backend/context.
  const displayDepartments = departments.map((d) => {
    const match = mockDepartmentPerformance.find(
      (m) => m.department.toLowerCase() === d.name.toLowerCase()
    );

    const totalComplaints = d.totalComplaints ?? match?.totalComplaints ?? 12;
    const resolved = d.resolved ?? match?.resolved ?? 8;
    const inProgress = d.inProgress ?? match?.inProgress ?? 3;
    const pending = d.pending ?? match?.pending ?? 1;
    const completionRate =
      d.completionRate ?? match?.completionRate ?? (totalComplaints > 0 ? Math.round((resolved / totalComplaints) * 100) : 0);

    return {
      id: d.id,
      name: d.name,
      description: d.description || 'Municipal department handling civic issues.',
      totalComplaints,
      resolved,
      inProgress,
      pending,
      completionRate,
    };
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Department Performance & Metrics"
        description="Overview of case throughput, clearance rates, and active caseloads across municipal directorates."
        breadcrumbs={[
          { label: 'Admin Portal', href: '/admin' },
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Departments' },
        ]}
      />

      {isLoading ? (
        <LoadingState title="Loading departments..." description="Retrieving municipal department data from server." />
      ) : error ? (
        <div className="space-y-4">
          <ErrorMessage severity="error" title="Unable to load departments" message={error} />
          <div className="text-center">
            <Button variant="outline" size="sm" onClick={refetchDepartments} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              Retry Loading Departments
            </Button>
          </div>
        </div>
      ) : displayDepartments.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg border border-dashed border-slate-300">
          <p className="text-sm font-semibold text-slate-600">No departments available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayDepartments.map((dept) => (
            <Card key={dept.id} className="shadow-2xs">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{dept.name}</h3>
                      <p className="text-xs text-slate-500 font-mono">ID: {dept.id} • {dept.totalComplaints} Registered Complaints</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                    {dept.completionRate}% Cleared
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{dept.description}</p>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>Overall Resolution Rate</span>
                    <span>{dept.resolved} of {dept.totalComplaints} cases</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
                    <div className="bg-emerald-600 h-full" style={{ width: `${dept.totalComplaints ? (dept.resolved / dept.totalComplaints) * 100 : 0}%` }} />
                    <div className="bg-amber-500 h-full" style={{ width: `${dept.totalComplaints ? (dept.inProgress / dept.totalComplaints) * 100 : 0}%` }} />
                    <div className="bg-sky-400 h-full" style={{ width: `${dept.totalComplaints ? (dept.pending / dept.totalComplaints) * 100 : 0}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200"><span className="text-[10px] uppercase font-bold text-slate-500 block">Pending</span><span className="font-extrabold text-sky-700 text-sm">{dept.pending}</span></div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200"><span className="text-[10px] uppercase font-bold text-slate-500 block">In Progress</span><span className="font-extrabold text-amber-700 text-sm">{dept.inProgress}</span></div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200"><span className="text-[10px] uppercase font-bold text-slate-500 block">Resolved</span><span className="font-extrabold text-emerald-700 text-sm">{dept.resolved}</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center"><Link to="/admin/dashboard"><Button variant="outline" size="sm">← Back to Dashboard</Button></Link></div>
    </div>
  );
}
