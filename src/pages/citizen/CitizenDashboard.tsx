import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FilePlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Layers,
  Inbox,
  Sparkles,
  Building,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  PageHeader,
  Card,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Badge,
  EmptyState,
  LoadingState,
  ErrorMessage,
  type BadgeVariant,
} from '../../components/ui';

interface MockRecentComplaint {
  id: string;
  title: string;
  department: string;
  location: string;
  date: string;
  status: BadgeVariant;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  thumbnailIcon: string;
}

export function CitizenDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State switcher to preview different UI states requested in F3 requirements
  const [dashboardState, setDashboardState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');

  // Citizen displayName fallback
  const citizenName = user?.name || 'Sanjay Patel';
  const citizenWard = user?.ward || 'Ward 12 - Central District';
  const citizenId = user?.id || 'CIT-8842';

  // Complaint Statistics (4 required metrics)
  const stats = [
    {
      title: 'Total Complaints',
      value: '5',
      description: 'Lifetime issues filed',
      icon: <Layers className="w-5 h-5 text-blue-700" />,
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      title: 'New',
      value: '1',
      description: 'Awaiting initial triage',
      icon: <AlertCircle className="w-5 h-5 text-sky-700" />,
      bg: 'bg-sky-50',
      border: 'border-sky-100',
    },
    {
      title: 'In Progress',
      value: '2',
      description: 'Field crews assigned',
      icon: <Clock className="w-5 h-5 text-amber-700" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      title: 'Resolved',
      value: '2',
      description: 'Completed & verified',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
  ];

  // Recent 4 Mock Complaints with thumbnails and clickable targets
  const recentComplaints: MockRecentComplaint[] = [
    {
      id: 'CIV-2026-085',
      title: 'Damaged Pavement Slab on High Street Pedestrian Walkway',
      department: 'Public Works Department (PWD)',
      location: 'High Street, opposite City Bank',
      date: 'Aug 21, 2026',
      status: 'NEW',
      urgency: 'Medium',
      thumbnailIcon: '🚧',
    },
    {
      id: 'CIV-2026-081',
      title: 'Deep Pothole near Central Market Road',
      department: 'Roads & Public Works',
      location: 'Main Market St, opposite Gate 3',
      date: 'Aug 19, 2026',
      status: 'IN_PROGRESS',
      urgency: 'High',
      thumbnailIcon: '🕳️',
    },
    {
      id: 'CIV-2026-074',
      title: 'Non-functioning Street Lights on 4th Cross',
      department: 'City Electrical Infrastructure',
      location: '4th Cross Rd, near Park Junction',
      date: 'Aug 15, 2026',
      status: 'ASSIGNED',
      urgency: 'Medium',
      thumbnailIcon: '💡',
    },
    {
      id: 'CIV-2026-061',
      title: 'Overflowing Municipal Garbage Bin',
      department: 'Solid Waste & Sanitation Board',
      location: 'Parkside Avenue corner',
      date: 'Aug 10, 2026',
      status: 'RESOLVED',
      urgency: 'Medium',
      thumbnailIcon: '🗑️',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header / Welcome Section */}
      <PageHeader
        title={`Welcome back, ${citizenName}`}
        description="Help keep your neighborhood clean, safe, and functional by reporting issues or tracking the resolution progress of your active complaints."
        breadcrumbs={[
          { label: 'Citizen Portal', href: '/citizen' },
          { label: 'Dashboard' },
        ]}
        badge={
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-semibold border border-blue-200">
              {citizenId}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium border border-slate-200">
              <MapPin className="w-3 h-3 text-slate-400" />
              {citizenWard}
            </span>
          </div>
        }
        actions={
          <Link to="/citizen/report">
            <Button
              size="md"
              variant="primary"
              leftIcon={<FilePlus className="w-4 h-4" />}
              className="shadow-sm"
            >
              Report New Issue
            </Button>
          </Link>
        }
      />

      {/* State Preview Toolbar for UI Testing */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase text-slate-500 mr-1">
            Dashboard UI State:
          </span>
          <Button
            size="sm"
            variant={dashboardState === 'normal' ? 'secondary' : 'outline'}
            onClick={() => setDashboardState('normal')}
          >
            Normal (Populated)
          </Button>
          <Button
            size="sm"
            variant={dashboardState === 'loading' ? 'secondary' : 'outline'}
            onClick={() => setDashboardState('loading')}
          >
            Loading State
          </Button>
          <Button
            size="sm"
            variant={dashboardState === 'empty' ? 'secondary' : 'outline'}
            onClick={() => setDashboardState('empty')}
          >
            Empty State
          </Button>
          <Button
            size="sm"
            variant={dashboardState === 'error' ? 'secondary' : 'outline'}
            onClick={() => setDashboardState('error')}
          >
            Error State
          </Button>
        </div>

        <span className="text-xs text-slate-500">
          Showing F3 Citizen Dashboard
        </span>
      </div>

      {/* UI State: Loading */}
      {dashboardState === 'loading' && (
        <LoadingState
          title="Loading Citizen Dashboard..."
          description="Retrieving complaint summaries, status updates, and municipal ward statistics."
        />
      )}

      {/* UI State: Error */}
      {dashboardState === 'error' && (
        <div className="space-y-4">
          <ErrorMessage
            severity="error"
            title="Failed to load dashboard data"
            message="We were unable to connect to the municipal record service to fetch your complaints. Please check your internet connection or retry."
          />
          <div className="text-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDashboardState('normal')}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Retry Loading Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* UI State: Empty or Normal */}
      {(dashboardState === 'normal' || dashboardState === 'empty') && (
        <>
          {/* 2. Primary Action: Prominent "Report an Issue" Card */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600/60 border border-blue-400/40 text-blue-100 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Active Municipal Service</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Spotted a Civic Issue in Your Ward?
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Report potholes, broken street lights, garbage dumps, or water leakages directly to the responsible municipal department for rapid resolution.
              </p>
            </div>

            <Link to="/citizen/report" className="shrink-0">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-blue-900 hover:bg-blue-50 font-bold px-6 shadow-sm border border-transparent cursor-pointer"
                leftIcon={<FilePlus className="w-5 h-5 text-blue-700" />}
                rightIcon={<ArrowRight className="w-4 h-4 text-blue-700" />}
              >
                Report an Issue
              </Button>
            </Link>
          </div>

          {/* 3. Complaint Statistics (4 Summary Cards) */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Complaint Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat, i) => (
                <Card key={i} className={`border ${stat.border} shadow-2xs`}>
                  <CardContent className="flex items-start justify-between py-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {stat.title}
                      </p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {dashboardState === 'empty' ? '0' : stat.value}
                      </p>
                      <p className="text-xs text-slate-500 pt-0.5">{stat.description}</p>
                    </div>
                    <div className={`p-2.5 rounded-lg ${stat.bg} shrink-0`}>
                      {stat.icon}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 4. Recent Complaints Section */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Complaints</h3>
                <p className="text-xs text-slate-500">
                  Click any complaint to view full case timeline and officer notes
                </p>
              </div>
              <Link to="/citizen/complaints">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View All Complaints
                </Button>
              </Link>
            </div>

            {dashboardState === 'empty' ? (
              <EmptyState
                icon={<Inbox className="w-6 h-6 text-slate-400" />}
                title="No Civic Complaints Found"
                description="You haven't reported any neighborhood issues yet. Submit your first complaint to start tracking resolution progress."
                action={
                  <Link to="/citizen/report">
                    <Button size="sm" variant="primary" leftIcon={<FilePlus className="w-4 h-4" />}>
                      Report Your First Issue
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {recentComplaints.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/citizen/complaints/${item.id}`)}
                    className="p-4 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-start sm:items-center gap-3.5">
                      {/* Thumbnail Placeholder */}
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                        {item.thumbnailIcon}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {item.id}
                          </span>
                          <h4 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {item.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            {item.department}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {item.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {item.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status Badge & Chevron */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <Badge variant={item.status} size="md" dot />
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Quick Actions Section */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Quick Actions & Civic Resources
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Action 1 */}
              <Link to="/citizen/report" className="block">
                <Card className="hover:border-blue-300 hover:shadow-xs transition-all h-full flex flex-col justify-between">
                  <CardContent className="py-4 space-y-2">
                    <div className="w-9 h-9 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                      <FilePlus className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-sm">Report New Issue</CardTitle>
                    <p className="text-xs text-slate-500">
                      Submit neighborhood civic complaints with photo and location
                    </p>
                  </CardContent>
                  <CardFooter className="bg-slate-50/70 py-2.5 text-xs text-blue-700 font-semibold flex items-center justify-between">
                    <span>File Complaint</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </CardFooter>
                </Card>
              </Link>

              {/* Action 2 */}
              <Link to="/citizen/complaints" className="block">
                <Card className="hover:border-blue-300 hover:shadow-xs transition-all h-full flex flex-col justify-between">
                  <CardContent className="py-4 space-y-2">
                    <div className="w-9 h-9 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-sm">View My Complaints</CardTitle>
                    <p className="text-xs text-slate-500">
                      Track resolution progress and department notes for your cases
                    </p>
                  </CardContent>
                  <CardFooter className="bg-slate-50/70 py-2.5 text-xs text-emerald-700 font-semibold flex items-center justify-between">
                    <span>Track All Cases</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </CardFooter>
                </Card>
              </Link>

              {/* Action 3: Municipal Support Reference */}
              <div className="block">
                <Card className="border-slate-200 h-full flex flex-col justify-between">
                  <CardContent className="py-4 space-y-2">
                    <div className="w-9 h-9 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-sm">Ward 12 Helpline</CardTitle>
                    <p className="text-xs text-slate-500">
                      Toll-free municipal helpline: <span className="font-semibold text-slate-800">1800-CIVIC-12</span> (24x7)
                    </p>
                  </CardContent>
                  <CardFooter className="bg-slate-50/70 py-2.5 text-xs text-slate-600 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Public Works Division
                    </span>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
