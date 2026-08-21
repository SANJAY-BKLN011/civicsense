import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  ArrowRight,
  Building,
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
} from '../../components/ui';

export function OfficerHome() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Officer & Municipal Portal"
        description="Authorized administrative interface for municipal officers, ward engineers, and field technicians."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Officer Portal' },
        ]}
        actions={
          <Link to="/officer/dashboard">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<LayoutDashboard className="w-4 h-4" />}
            >
              Open Department Dashboard
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Card 1: Dashboard */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-slate-900 text-white flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base">Department Metrics</CardTitle>
              <CardDescription>SLA & triage overview</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600">
              Review real-time incoming citizen complaint volume, turnaround times, and ward performance statistics.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/officer/dashboard" className="w-full">
              <Button variant="secondary" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Go to Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Quick Card 2: Complaints Management */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base">Manage Complaints</CardTitle>
              <CardDescription>Triage & field assignment</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600">
              Filter incoming civic issues, assign field crew, update statuses (In Progress, Resolved), and attach completion logs.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/officer/complaints" className="w-full">
              <Button variant="outline" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Review Complaints
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Quick Card 3: Officer Profile */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base">Officer Profile</CardTitle>
              <CardDescription>Department credentials</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600">
              View your officer badge information, assigned ward jurisdictions, and department notification preferences.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/officer/profile" className="w-full">
              <Button variant="outline" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Profile
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Staff Authentication Callout */}
      <div className="p-6 rounded-lg bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-md border border-slate-700">
            <Building className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold">
              Municipal Staff Authentication
            </h4>
            <p className="text-xs text-slate-300">
              Restricted to authorized municipal employees with valid department credentials.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/officer/login">
            <Button size="sm" variant="outline" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white">
              Officer Login
            </Button>
          </Link>
          <Link to="/officer/register">
            <Button size="sm" variant="primary">
              Register Staff
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
