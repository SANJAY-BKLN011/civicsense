import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Shield,
  ShieldCheck,
  CheckCircle2,
  FilePlus,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui';

export function AboutPage() {
  const steps = [
    {
      num: '1',
      title: 'Citizen Reports Issue',
      desc: 'A citizen submits a civic complaint with photo evidence, department selection, description, and GPS location coordinates.',
      icon: <FilePlus className="w-5 h-5 text-blue-600" />,
    },
    {
      num: '2',
      title: 'Department Receives Complaint',
      desc: 'The complaint is automatically routed to the responsible municipal directorate (Sanitation, PWD, Water, Power, etc.).',
      icon: <Building2 className="w-5 h-5 text-sky-600" />,
    },
    {
      num: '3',
      title: 'Officer Handles Issue',
      desc: 'An assigned field officer conducts site inspection, updates status to IN_PROGRESS, and logs update notes.',
      icon: <Shield className="w-5 h-5 text-amber-600" />,
    },
    {
      num: '4',
      title: 'Citizen Tracks Progress',
      desc: 'The citizen receives real-time timeline notifications and tracks case status changes on their dashboard.',
      icon: <Clock className="w-5 h-5 text-purple-600" />,
    },
    {
      num: '5',
      title: 'Issue Gets Resolved',
      desc: 'The officer completes work, uploads a resolution photo evidence, and marks the complaint RESOLVED with citizen confirmation.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    },
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      <PageHeader
        title="About CivicSense"
        description="An intelligent civic issue reporting platform connecting citizens, departments, and field officers."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About CivicSense' }]}
      />

      {/* Mission Section */}
      <Card className="bg-slate-900 text-white shadow-xl overflow-hidden border border-slate-800">
        <CardContent className="p-8 sm:p-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-700/50 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Civic Tech Mission</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What is CivicSense?</h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            CivicSense allows citizens to report civic issues with photos, descriptions, and location coordinates. Municipal departments and field officers can then track, manage, and resolve those complaints transparently.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link to="/citizen/report">
              <Button size="md" variant="primary" leftIcon={<FilePlus className="w-4 h-4" />}>
                Report an Issue
              </Button>
            </Link>
            <Link to="/citizen">
              <Button size="md" variant="outline" className="text-white border-slate-700 hover:bg-slate-800">
                Explore Citizen Portal
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* How It Works Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-slate-900">How CivicSense Works</h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            The complete 5-step lifecycle from neighborhood problem detection to verified resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step) => (
            <Card key={step.num} className="shadow-2xs text-left hover:border-slate-300 transition-all flex flex-col justify-between">
              <CardContent className="p-5 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-900">
                  {step.icon}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">Step {step.num}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Role Separation Overview */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 text-center">Built for Three Unified Roles</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-blue-300 transition-all">
            <CardHeader className="bg-blue-50/60 border-b border-blue-100">
              <CardTitle className="text-base text-blue-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-700" />
                Citizen Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2 text-xs text-slate-600">
              <p>Submit issues with photo & location, track resolution timeline, and receive instant status notifications.</p>
              <Link to="/citizen/login" className="block pt-2">
                <Button size="sm" variant="outline" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Citizen Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-slate-400 transition-all">
            <CardHeader className="bg-slate-100 border-b border-slate-200">
              <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-800" />
                Officer Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2 text-xs text-slate-600">
              <p>Manage assigned ward complaints, update status (ASSIGNED → IN_PROGRESS → RESOLVED), and log progress notes.</p>
              <Link to="/officer/login" className="block pt-2">
                <Button size="sm" variant="outline" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Officer Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-blue-400 transition-all">
            <CardHeader className="bg-slate-900 text-white">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                Admin Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2 text-xs text-slate-600">
              <p>System-wide command center, officer re-assignments, department performance metrics, and analytical reports.</p>
              <Link to="/admin/login" className="block pt-2">
                <Button size="sm" variant="secondary" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
