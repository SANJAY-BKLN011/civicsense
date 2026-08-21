import {
  Shield,
  Building,
  MapPin,
  Mail,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from '../../components/ui';

export function OfficerProfile() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Officer Profile & Department Settings"
        description="View your municipal credentials, assigned jurisdictions, and administrative privileges."
        breadcrumbs={[
          { label: 'Officer Portal', href: '/officer' },
          { label: 'Profile' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Officer Card */}
        <Card className="md:col-span-1 border-slate-300">
          <CardContent className="pt-6 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center mb-4 shadow-sm border-2 border-slate-700">
              <Shield className="w-10 h-10 text-amber-400" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Marcus Vance</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">ID: OFF-8821</p>

            <div className="mt-3">
              <Badge variant="in-progress">Senior Ward Officer</Badge>
            </div>

            <div className="mt-6 w-full space-y-2 text-left text-xs border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Public Works Division</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Ward 12 (Central Zone)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>m.vance@muni.gov</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details & Settings */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Administrative Jurisdictions</CardTitle>
              <CardDescription>
                Wards and civic categories assigned to your operational authority
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200">
                  <div className="text-xs font-semibold text-slate-700">Primary Ward</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">Ward 12 - Central</div>
                  <div className="text-xs text-slate-500 mt-0.5">Full triage and dispatch authorization</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200">
                  <div className="text-xs font-semibold text-slate-700">Secondary Ward</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">Ward 14 - North Suburb</div>
                  <div className="text-xs text-slate-500 mt-0.5">Shared triage backup</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Assigned Categories
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-xs font-medium">
                    Roads & Potholes
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-xs font-medium">
                    Drainage Infrastructure
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-xs font-medium">
                    Emergency Public Obstructions
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security & Authentication</CardTitle>
              <CardDescription>
                Staff access controls and credential status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Two-Factor Authentication:</span>
                <span className="font-semibold text-emerald-700">Enforced by Municipality</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Last Security Login:</span>
                <span className="font-mono text-slate-800">Today, 08:30 AM (IP: Internal LAN)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
