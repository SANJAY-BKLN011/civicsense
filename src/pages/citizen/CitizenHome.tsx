import { Link } from 'react-router-dom';
import { FilePlus, ListFilter, LayoutDashboard, UserCheck, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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

export function CitizenHome() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="space-y-8">
      <PageHeader
        title={isAuthenticated && user ? `Welcome back, ${user.name}` : 'Citizen Portal'}
        description="Welcome to the CivicSense Citizen Portal. Report neighborhood issues, track municipal resolution progress, and stay updated on local public services."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Citizen Portal' },
        ]}
        actions={
          <Link to="/citizen/report">
            <Button
              size="md"
              leftIcon={<FilePlus className="w-4 h-4" />}
            >
              Report New Issue
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Card 1: Dashboard */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base">Citizen Dashboard</CardTitle>
              <CardDescription>Overview & status metrics</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600">
              View your active complaint summaries, resolution timelines, and recent updates from municipal officers.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/citizen/dashboard" className="w-full">
              <Button variant="outline" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Go to Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Quick Card 2: Report Issue */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base">Report an Issue</CardTitle>
              <CardDescription>File new civic complaint</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600">
              Submit details about potholes, broken street lights, garbage dumps, or water leakages directly to civic authorities.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/citizen/report" className="w-full">
              <Button variant="primary" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Start Report
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Quick Card 3: My Complaints */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
              <ListFilter className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base">My Complaints</CardTitle>
              <CardDescription>Track filed issues</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600">
              Check real-time status badges, department assignment notes, and verification photos for all your submissions.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/citizen/complaints" className="w-full">
              <Button variant="outline" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Complaints
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Access and Security Notice */}
      {!isAuthenticated ? (
        <div className="p-6 rounded-lg bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-700 text-white rounded-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-950">
                Citizen Account Access
              </h4>
              <p className="text-xs text-blue-800">
                Sign in to save your default residential ward and receive automatic SMS/email resolution alerts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link to="/citizen/login">
              <Button size="sm" variant="outline" className="bg-white">
                Sign In
              </Button>
            </Link>
            <Link to="/citizen/register">
              <Button size="sm" variant="primary">
                Register
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-md">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-slate-100">{user?.name}</span> ({user?.email}) • Assigned: <span className="text-slate-300">{user?.ward}</span>
            </div>
          </div>
          <Link to="/citizen/dashboard">
            <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Dashboard
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
