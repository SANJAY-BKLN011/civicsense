import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, PieChart, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui';
import { mockDepartmentPerformance } from '../../data/mockAdminData';

export function AdminReports() {
  const statusBreakdown = [
    { status: 'Resolved', count: 18, color: 'bg-emerald-600', text: 'text-emerald-700', pct: 37.5 },
    { status: 'In Progress', count: 18, color: 'bg-amber-500', text: 'text-amber-700', pct: 37.5 },
    { status: 'New (Pending Triage)', count: 12, color: 'bg-sky-500', text: 'text-sky-700', pct: 25.0 },
  ];

  const priorityBreakdown = [
    { priority: 'Critical', count: 8, color: 'bg-rose-600', pct: 16.6 },
    { priority: 'High', count: 16, color: 'bg-amber-600', pct: 33.3 },
    { priority: 'Medium', count: 18, color: 'bg-blue-600', pct: 37.5 },
    { priority: 'Low', count: 6, color: 'bg-slate-500', pct: 12.5 },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="System Analytics & Analytical Reports"
        description="Comprehensive civic reporting breakdown by status, priority escalations, and department resolution performance."
        breadcrumbs={[
          { label: 'Admin Portal', href: '/admin' },
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Reports' },
        ]}
      />

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Overall Resolution</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            </div>
            <p className="text-3xl font-extrabold text-white">62.5%</p>
            <p className="text-xs text-emerald-100">30 of 48 total complaints closed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white shadow-md">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Avg Resolution Time</span>
              <Clock className="w-5 h-5 text-blue-200" />
            </div>
            <p className="text-3xl font-extrabold text-white">2.4 Days</p>
            <p className="text-xs text-blue-100">Ward average SLA response speed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-md">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Critical Priority</span>
              <AlertCircle className="w-5 h-5 text-amber-200" />
            </div>
            <p className="text-3xl font-extrabold text-white">8 Cases</p>
            <p className="text-xs text-amber-100">Critical infrastructure escalations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report 1: Complaints by Status */}
        <Card className="shadow-2xs">
          <CardHeader className="bg-slate-50/60 border-b border-slate-200">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              Complaints by Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
              {statusBreakdown.map((s, i) => (
                <div
                  key={i}
                  className={`${s.color} h-full`}
                  style={{ width: `${s.pct}%` }}
                  title={`${s.status}: ${s.count}`}
                />
              ))}
            </div>

            <div className="space-y-3 pt-2">
              {statusBreakdown.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${s.color}`} />
                    <span className="font-bold text-slate-800">{s.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900 text-sm">{s.count} cases</span>
                    <span className="font-mono text-slate-500 font-medium">({s.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report 2: Complaints by Priority */}
        <Card className="shadow-2xs">
          <CardHeader className="bg-slate-50/60 border-b border-slate-200">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              Complaints by Priority Level
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="space-y-3">
              {priorityBreakdown.map((p, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between font-medium text-slate-700">
                    <span className="font-bold text-slate-900">{p.priority} Priority</span>
                    <span>{p.count} cases ({p.pct}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`${p.color} h-full rounded-full`} style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report 3: Department Resolution Summary */}
      <Card className="shadow-2xs">
        <CardHeader className="bg-slate-50/60 border-b border-slate-200">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Resolved vs Pending by Department
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-xs">
          <div className="space-y-4">
            {mockDepartmentPerformance.map((dept, i) => (
              <div key={i} className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span>{dept.department}</span>
                  <span className="text-emerald-700 font-bold">{dept.resolved} Resolved / {dept.pending + dept.inProgress} Pending</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="bg-emerald-600 h-full" style={{ width: `${(dept.resolved / dept.totalComplaints) * 100}%` }} />
                  <div className="bg-amber-500 h-full" style={{ width: `${(dept.inProgress / dept.totalComplaints) * 100}%` }} />
                  <div className="bg-sky-400 h-full" style={{ width: `${(dept.pending / dept.totalComplaints) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link to="/admin/dashboard">
          <Button variant="outline" size="sm">← Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
