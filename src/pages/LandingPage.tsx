import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Modal,
  Input,
  Select,
  ErrorMessage,
} from '../components/ui';

export function LandingPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/50 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Civic-Tech Platform • Foundation Release</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            CivicSense
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Report civic issues in your neighborhood, track resolution progress in real time, and collaborate directly with local municipal officers.
          </p>

          {/* Quick Portal Switcher Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/citizen">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 font-semibold px-6 text-white shadow-md cursor-pointer"
                leftIcon={<Users className="w-5 h-5" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Enter Citizen Portal
              </Button>
            </Link>

            <Link to="/officer">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700 hover:text-white font-semibold px-6 shadow-md cursor-pointer"
                leftIcon={<Shield className="w-5 h-5" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Enter Officer Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Two Portal Access Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Citizen Portal Card */}
          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-shadow shadow-md hover:shadow-lg bg-white flex flex-col justify-between">
            <div>
              <CardHeader className="bg-blue-50/50 border-b border-blue-100 flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl text-blue-950">Citizen Portal</CardTitle>
                  <CardDescription className="text-blue-900/70">
                    For residents, community members, and civic reporters
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-6">
                <p className="text-sm text-slate-600">
                  File civic complaints (potholes, sanitation, streetlights, water supply), track live status updates, and verify municipal resolutions.
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Report civic complaints in under 2 minutes</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Live status badges: Submitted → In Progress → Resolved</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Location tag & photo attachment support</span>
                  </div>
                </div>
              </CardContent>
            </div>

            <CardFooter className="bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Link to="/citizen/login" className="text-blue-700 font-semibold hover:underline">
                  Sign In
                </Link>
                <span className="text-slate-300">•</span>
                <Link to="/citizen/register" className="text-slate-600 hover:text-slate-900">
                  Register
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/citizen/report">
                  <Button size="sm" variant="outline" className="w-full">
                    Report Issue
                  </Button>
                </Link>
                <Link to="/citizen/dashboard">
                  <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Dashboard
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Officer Portal Card */}
          <Card className="border-2 border-slate-300 hover:border-slate-400 transition-shadow shadow-md hover:shadow-lg bg-white flex flex-col justify-between">
            <div>
              <CardHeader className="bg-slate-100/70 border-b border-slate-200 flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900">Officer Portal</CardTitle>
                  <CardDescription className="text-slate-600">
                    For municipal officers, department heads, and field staff
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-6">
                <p className="text-sm text-slate-600">
                  Triage incoming neighborhood issues, assign field staff, update progress notes, and manage department resolution SLAs.
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
                    <span>Department complaint queue & filtering</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
                    <span>Triage, status updating & SLA tracking</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
                    <span>Official resolution notes & verification</span>
                  </div>
                </div>
              </CardContent>
            </div>

            <CardFooter className="bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Link to="/officer/login" className="text-slate-900 font-semibold hover:underline">
                  Officer Login
                </Link>
                <span className="text-slate-300">•</span>
                <Link to="/officer/register" className="text-slate-600 hover:text-slate-900">
                  Staff Access
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/officer/complaints">
                  <Button size="sm" variant="outline" className="w-full">
                    Complaints Queue
                  </Button>
                </Link>
                <Link to="/officer/dashboard">
                  <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Officer Dashboard
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              How CivicSense Resolves Civic Problems
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              A transparent, closed-loop process connecting citizens with municipal departments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-left">
              <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1.5">Citizen Reports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit an issue with location, category, description, and optional photo attachment.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-left">
              <div className="w-10 h-10 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1.5">Department Triage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Municipal officers review the report, verify jurisdiction, and assign field teams.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-left">
              <div className="w-10 h-10 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1.5">Active Resolution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Field personnel address the issue on-site while citizens receive real-time status updates.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-left">
              <div className="w-10 h-10 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1.5">Verified Completion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Work is documented, marked resolved, and citizen feedback is collected to ensure quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Component Library Showcase Trigger Bar */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-slate-100 border border-slate-300 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-blue-700 text-white shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-slate-900">
                Frontend UI Foundation System
              </h4>
              <p className="text-xs text-slate-600">
                Test and inspect all 10 reusable UI components (Buttons, Modals, Badges, Inputs, Cards, etc.)
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDemoModalOpen(true)}
            className="shrink-0 bg-white"
          >
            Preview UI Component Kit
          </Button>
        </div>
      </section>

      {/* UI Component Kit Interactive Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="CivicSense UI Component Kit"
        description="Foundation preview of reusable UI elements crafted for civic workflows."
        size="lg"
        footer={
          <Button variant="secondary" size="sm" onClick={() => setIsDemoModalOpen(false)}>
            Close Preview
          </Button>
        }
      >
        <div className="space-y-6">
          {/* Status Badges */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Status Badges
            </label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="submitted" dot>Submitted</Badge>
              <Badge variant="in-progress" dot>In Progress</Badge>
              <Badge variant="under-review" dot>Under Review</Badge>
              <Badge variant="resolved" dot>Resolved</Badge>
              <Badge variant="rejected" dot>Rejected</Badge>
              <Badge variant="neutral">Neutral</Badge>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Button Variants
            </label>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">Primary</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="danger" size="sm">Danger</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="primary" size="sm" isLoading>Loading</Button>
            </div>
          </div>

          {/* Form Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Sample Text Input"
              placeholder="e.g. 124 Main Street"
              helperText="Accessible input field with helper text"
            />
            <Select
              label="Sample Select Dropdown"
              placeholder="Select department..."
              options={[
                { value: 'roads', label: 'Roads & Transport' },
                { value: 'sanitation', label: 'Sanitation & Waste' },
                { value: 'electrical', label: 'Streetlighting & Power' },
              ]}
            />
          </div>

          {/* Error Banner */}
          <ErrorMessage
            severity="info"
            title="Design System Standard"
            message="All components meet WCAG AA contrast guidelines with full keyboard accessibility."
          />
        </div>
      </Modal>
    </div>
  );
}
