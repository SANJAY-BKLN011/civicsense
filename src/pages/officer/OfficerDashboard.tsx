import { Link } from 'react-router-dom';
import {
  ClipboardList,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building,
  ArrowUpRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from '../../components/ui';

export function OfficerDashboard() {
  const stats = [
    {
      title: 'Pending Triage',
      value: '7',
      description: 'Awaiting officer review & crew assignment',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
    },
    {
      title: 'Active In Field',
      value: '12',
      description: 'Field technicians deployed on-site',
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Resolved This Week',
      value: '34',
      description: 'Issues closed with verified photos',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      title: 'Avg. Turnaround SLA',
      value: '36 hrs',
      description: 'Target SLA benchmark is <48 hrs',
      icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
  ];

  const priorityQueue = [
    {
      id: 'CIV-2026-081',
      title: 'Deep Pothole near Central Market Road',
      category: 'Roads & Transport',
      location: 'Ward 12 - Main Market St.',
      reportedAgo: '3 hours ago',
      priority: 'High',
      status: 'in-progress' as const,
    },
    {
      id: 'CIV-2026-082',
      title: 'Water Main Burst Causing Street Flooding',
      category: 'Water Supply',
      location: 'Ward 12 - 7th Cross',
      reportedAgo: '45 mins ago',
      priority: 'Critical',
      status: 'submitted' as const,
    },
    {
      id: 'CIV-2026-079',
      title: 'Fallen Tree Branch on Power Cable',
      category: 'Electrical',
      location: 'Ward 12 - Pine Avenue',
      reportedAgo: '5 hours ago',
      priority: 'High',
      status: 'under-review' as const,
    },
    {
      id: 'CIV-2026-074',
      title: 'Non-functioning Street Lights on 4th Cross',
      category: 'Streetlighting',
      location: 'Ward 12 - 4th Cross',
      reportedAgo: '1 day ago',
      priority: 'Medium',
      status: 'submitted' as const,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Officer Dashboard"
        description="Public Works & Municipal Triage Command. Real-time complaint dispatching and SLA monitoring."
        breadcrumbs={[
          { label: 'Officer Portal', href: '/officer' },
          { label: 'Dashboard' },
        ]}
        actions={
          <Link to="/officer/complaints">
            <Button
              size="md"
              variant="secondary"
              leftIcon={<ClipboardList className="w-4 h-4" />}
            >
              Manage Complaints Queue
            </Button>
          </Link>
        }
      />

      {/* Ward Status Bar */}
      <div className="p-4 bg-slate-900 text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-md">
            <Building className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-semibold">Ward 12 - Central Public Works Division</div>
            <div className="text-xs text-slate-400">Assigned Officer: Marcus Vance (ID: OFF-8821)</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SLA Health: 94.2% Normal
          </span>
        </div>
      </div>

      {/* Department KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 pt-1">{stat.description}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bg} shrink-0`}>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Priority Triage Queue */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Priority Triage Queue</CardTitle>
            <CardDescription>
              Unresolved issues in Ward 12 requiring immediate inspection or status escalation
            </CardDescription>
          </div>
          <Link to="/officer/complaints">
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
              Open Full Queue
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-6">Case ID & Issue</th>
                  <th className="py-3 px-6 hidden md:table-cell">Category</th>
                  <th className="py-3 px-6 hidden sm:table-cell">Location</th>
                  <th className="py-3 px-6 hidden lg:table-cell">Priority</th>
                  <th className="py-3 px-6 text-right sm:text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {priorityQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                        <span>{item.id}</span>
                        <span>•</span>
                        <span>{item.reportedAgo}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell text-slate-600 text-xs">
                      {item.category}
                    </td>
                    <td className="py-4 px-6 hidden sm:table-cell text-slate-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden lg:table-cell text-xs font-semibold">
                      <span
                        className={
                          item.priority === 'Critical'
                            ? 'text-rose-700 font-bold'
                            : item.priority === 'High'
                            ? 'text-amber-700 font-bold'
                            : 'text-slate-700'
                        }
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right sm:text-left">
                      <Badge variant={item.status} dot />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 text-xs text-slate-500 justify-between">
          <span>Showing 4 high priority cases</span>
          <Link to="/officer/complaints" className="text-slate-900 font-semibold hover:underline">
            Manage all complaints →
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
