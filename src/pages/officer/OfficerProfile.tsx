import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Building, MapPin, Mail, LogOut, ShieldCheck, Edit3, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Input,
} from '../../components/ui';

export function OfficerProfile() {
  const navigate = useNavigate();
  const { officerUser, logoutOfficer } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(officerUser?.name || 'Sanjay Kumar');
  const [designation, setDesignation] = useState(officerUser?.designation || 'Field Officer');
  const [department, setDepartment] = useState(officerUser?.department || 'Municipality / Sanitation');
  const [ward, setWard] = useState(officerUser?.ward || 'Ward 12 - Central District');
  const [successMessage, setSuccessMessage] = useState(false);

  const badgeId = officerUser?.badgeId || 'OFF-SAN-402';
  const email = officerUser?.email || 'sanjay.kumar@civicsense.gov';

  const handleLogout = () => {
    logoutOfficer();
    navigate('/officer/login', { replace: true });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-12">
      <PageHeader
        title="Officer Profile & Credentials"
        description="Your official department credentials and ward assignment details."
        breadcrumbs={[
          { label: 'Officer Portal', href: '/officer' },
          { label: 'Dashboard', href: '/officer/dashboard' },
          { label: 'Profile' },
        ]}
      />

      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Officer profile details updated successfully!</span>
        </div>
      )}

      <Card className="shadow-sm overflow-hidden">
        {/* Profile Hero */}
        <div className="bg-slate-900 p-8 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-2xl font-bold text-white shadow-md">
            {name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{name}</h2>
            <p className="text-sm text-slate-400">{designation}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="font-mono text-xs bg-slate-800 text-slate-200 px-2.5 py-1 rounded-full border border-slate-700 font-semibold">
              {badgeId}
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-900/60 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-800">
              <ShieldCheck className="w-3 h-3" />
              Active Officer
            </span>
          </div>
        </div>

        {!isEditing ? (
          <>
            <CardHeader className="bg-slate-50/60 border-b border-slate-200 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Official Details</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit Info
              </Button>
            </CardHeader>

            <CardContent className="space-y-4 py-6 text-sm">
              {[
                { icon: <Shield className="w-4 h-4 text-blue-600" />, label: 'Badge ID', value: badgeId },
                { icon: <Building className="w-4 h-4 text-slate-500" />, label: 'Department', value: department },
                { icon: <MapPin className="w-4 h-4 text-slate-500" />, label: 'Assigned Ward', value: ward },
                { icon: <Mail className="w-4 h-4 text-slate-500" />, label: 'Department Email', value: email },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2 text-slate-500">
                    {row.icon}
                    <span className="font-medium">{row.label}</span>
                  </div>
                  <span className="font-semibold text-slate-900 text-right">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <CardHeader className="bg-slate-50/60 border-b border-slate-200">
              <CardTitle className="text-sm">Edit Officer Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 py-6">
              <Input label="Officer Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Designation Title" value={designation} onChange={(e) => setDesignation(e.target.value)} required />
              <Input label="Assigned Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
              <Input label="Assigned Ward" value={ward} onChange={(e) => setWard(e.target.value)} required />
            </CardContent>

            <CardFooter className="bg-slate-50 flex items-center justify-end gap-3 p-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" variant="secondary" size="sm">Save Changes</Button>
            </CardFooter>
          </form>
        )}
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link to="/officer/dashboard">
          <Button variant="outline" size="md">← Back to Dashboard</Button>
        </Link>
        <Button variant="danger" size="md" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />}>
          Sign Out of Officer Portal
        </Button>
      </div>
    </div>
  );
}
