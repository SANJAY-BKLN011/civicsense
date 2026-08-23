import { Link } from 'react-router-dom';
import { Building } from 'lucide-react';
import { PageHeader, Card, CardContent, Button } from '../../components/ui';
import { mockDepartmentPerformance } from '../../data/mockAdminData';

export function AdminDepartments() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockDepartmentPerformance.map((dept, idx) => (
          <Card key={idx} className="shadow-2xs">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{dept.department}</h3>
                    <p className="text-xs text-slate-500">{dept.totalComplaints} Total Registered Complaints</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                  {dept.completionRate}% Cleared
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Overall Resolution Rate</span>
                  <span>{dept.resolved} of {dept.totalComplaints} cases</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
                  <div
                    className="bg-emerald-600 h-full"
                    style={{ width: `${(dept.resolved / dept.totalComplaints) * 100}%` }}
                  />
                  <div
                    className="bg-amber-500 h-full"
                    style={{ width: `${(dept.inProgress / dept.totalComplaints) * 100}%` }}
                  />
                  <div
                    className="bg-sky-400 h-full"
                    style={{ width: `${(dept.pending / dept.totalComplaints) * 100}%` }}
                  />
                </div>
              </div>

              {/* Metric Breakdown Cards */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Pending</span>
                  <span className="font-extrabold text-sky-700 text-sm">{dept.pending}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">In Progress</span>
                  <span className="font-extrabold text-amber-700 text-sm">{dept.inProgress}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Resolved</span>
                  <span className="font-extrabold text-emerald-700 text-sm">{dept.resolved}</span>
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
