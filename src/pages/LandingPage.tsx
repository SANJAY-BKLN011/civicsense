import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FilePlus,
  Zap,
  Camera,
  MapPin,
  Building,
  BarChart3,
  UserCheck,
  Bell,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, CardContent, Badge } from '../components/ui';
import { DemoResetModal } from '../components/ui/DemoResetModal';

export function LandingPage() {
  const navigate = useNavigate();
  const { loginCitizen, loginOfficer, loginAdmin } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

  // 1-Click Demo Login Handlers for Hackathon / Contest Judges
  const handleQuickCitizenDemo = async () => {
    setIsLoggingIn('citizen');
    await loginCitizen({ email: 'sanjay.patel@civicsense.gov', password: 'password123', rememberMe: true });
    setIsLoggingIn(null);
    navigate('/citizen/dashboard');
  };

  const handleQuickOfficerDemo = async () => {
    setIsLoggingIn('officer');
    await loginOfficer({ email: 'sanjay.kumar@civicsense.gov', password: 'officer123', rememberMe: true });
    setIsLoggingIn(null);
    navigate('/officer/dashboard');
  };

  const handleQuickAdminDemo = async () => {
    setIsLoggingIn('admin');
    await loginAdmin({ email: 'admin@civicsense.gov', password: 'admin123', rememberMe: true });
    setIsLoggingIn(null);
    navigate('/admin/dashboard');
  };

  const roles = [
    {
      title: 'CITIZEN',
      desc: 'Report and track civic issues in your neighborhood.',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      btnText: 'Report an Issue',
      href: '/citizen/report',
      btnVariant: 'primary' as const,
    },
    {
      title: 'OFFICER',
      desc: 'Receive, manage and resolve assigned municipal complaints.',
      icon: <Shield className="w-6 h-6 text-slate-800" />,
      btnText: 'Officer Portal',
      href: '/officer/login',
      btnVariant: 'outline' as const,
    },
    {
      title: 'ADMIN',
      desc: 'Monitor departments, officers and overall complaint resolution performance.',
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      btnText: 'Admin Portal',
      href: '/admin/login',
      btnVariant: 'secondary' as const,
    },
  ];

  const features = [
    { title: 'Photo-Based Reporting', desc: 'Attach live photo evidence at submission', icon: <Camera className="w-5 h-5 text-blue-600" /> },
    { title: 'Location Capture', desc: 'GPS coordinates & street address tagging', icon: <MapPin className="w-5 h-5 text-emerald-600" /> },
    { title: 'Department Routing', desc: 'Automatic triage to Sanitation, PWD, Water', icon: <Building className="w-5 h-5 text-purple-600" /> },
    { title: 'Complaint Tracking', desc: 'Real-time timeline & status updates', icon: <BarChart3 className="w-5 h-5 text-amber-600" /> },
    { title: 'Officer Management', desc: 'Field officer deployment & case workloads', icon: <UserCheck className="w-5 h-5 text-sky-600" /> },
    { title: 'Notifications', desc: 'Status change alerts for citizens & officers', icon: <Bell className="w-5 h-5 text-indigo-600" /> },
    { title: 'Admin Monitoring', desc: 'System-wide metrics & resolution analytics', icon: <TrendingUp className="w-5 h-5 text-teal-600" /> },
  ];

  const visualWorkflow = [
    { num: '1', title: 'Citizen Reports', desc: 'Citizen submits issue with photo, location & details' },
    { num: '2', title: 'Department Receives', desc: 'Routed to correct municipal department queue' },
    { num: '3', title: 'Officer Handles', desc: 'Field officer assigned to inspect and take action' },
    { num: '4', title: 'Progress Is Updated', desc: 'Officer logs progress notes and updates status' },
    { num: '5', title: 'Issue Gets Resolved', desc: 'Officer uploads resolution photo & closes case' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-700/50 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Civic Tech Platform • Final Presentation Build</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            CivicSense
          </h1>

          {/* Exact Tagline & Short Description */}
          <div className="space-y-2">
            <p className="text-xl sm:text-2xl font-bold text-blue-400 tracking-wide uppercase">
              "Report. Track. Resolve."
            </p>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              An integrated civic issue reporting platform connecting citizens, departments and officers.
            </p>
          </div>

          {/* 3 Entry Point Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            <Link to="/citizen/report" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="primary"
                className="w-full bg-blue-600 hover:bg-blue-700 font-bold px-6 cursor-pointer"
                leftIcon={<FilePlus className="w-5 h-5" />}
              >
                Report an Issue
              </Button>
            </Link>

            <Link to="/officer/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full text-white border-slate-700 hover:bg-slate-800 font-semibold cursor-pointer"
                leftIcon={<Shield className="w-5 h-5 text-slate-300" />}
              >
                Officer Portal
              </Button>
            </Link>

            <Link to="/admin/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full font-semibold cursor-pointer"
                leftIcon={<ShieldCheck className="w-5 h-5 text-blue-400" />}
              >
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* THREE ROLES SECTION */}
      <section className="py-12 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Integrated Architecture</span>
            <h2 className="text-2xl font-bold text-white">Built for Three Unified Roles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((r, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800 text-white shadow-md flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                    {r.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white tracking-wider">{r.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                  </div>
                  <Link to={r.href} className="block pt-2">
                    <Button variant={r.btnVariant} size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      {r.btnText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO QUICK ACCESS (1-CLICK DEMO FOR JUDGES) */}
      <section className="py-12 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Judge Prototype Quick Access
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">One-Click Demo Portals</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Instantly launch pre-configured demo sessions without typing credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
            {/* Citizen Demo Card */}
            <Card className="bg-slate-950 border-slate-800 text-white hover:border-blue-500 transition-all shadow-md flex flex-col justify-between">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-blue-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Citizen Demo
                  </span>
                  <Badge variant="neutral" size="sm">CIT-8842</Badge>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Sanjay Patel</h3>
                  <p className="text-xs text-slate-400">Ward 12 - Central District</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Submit complaints, upload photos, and track resolution timelines.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  isLoading={isLoggingIn === 'citizen'}
                  onClick={handleQuickCitizenDemo}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Launch Citizen Portal
                </Button>
              </CardContent>
            </Card>

            {/* Officer Demo Card */}
            <Card className="bg-slate-950 border-slate-800 text-white hover:border-amber-500 transition-all shadow-md flex flex-col justify-between">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Officer Demo
                  </span>
                  <Badge variant="neutral" size="sm">OFF-SAN-402</Badge>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Officer Sanjay Kumar</h3>
                  <p className="text-xs text-slate-400">Municipality / Sanitation</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Inspect assigned cases, update status, and submit resolution photos.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-white border-slate-700 hover:bg-slate-800"
                  isLoading={isLoggingIn === 'officer'}
                  onClick={handleQuickOfficerDemo}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Launch Officer Portal
                </Button>
              </CardContent>
            </Card>

            {/* Admin Demo Card */}
            <Card className="bg-slate-950 border-slate-800 text-white hover:border-indigo-500 transition-all shadow-md flex flex-col justify-between">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Demo
                  </span>
                  <Badge variant="neutral" size="sm">ADM-SYS-001</Badge>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Vikramaditya Rao</h3>
                  <p className="text-xs text-slate-400">Chief Administrator</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Monitor system metrics, department performance, and override assignments.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  isLoading={isLoggingIn === 'admin'}
                  onClick={handleQuickAdminDemo}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Launch Admin Portal
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2">
            <span>Demo Data Status: <strong className="text-slate-300 font-semibold">Synchronized</strong></span>
            <span>•</span>
            <DemoResetModal />
          </div>
        </div>
      </section>

      {/* 5-STEP HOW CIVICSENSE WORKS SECTION */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How CivicSense Works</h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              A simple, transparent 5-step lifecycle from problem report to verified resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
            {visualWorkflow.map((w) => (
              <div key={w.num} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white font-extrabold text-sm flex items-center justify-center shadow-2xs">
                  {w.num}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">{w.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE SHOWCASE SECTION (7 CAPABILITIES) */}
      <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Platform Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Feature Showcase</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Key operational capabilities powering the CivicSense municipal platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
