import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, UserCheck, LogOut, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui';

export function AdminProfile() {
  const navigate = useNavigate();
  const { adminUser, logoutAdmin } = useAuth();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  const name = adminUser?.name || 'Vikramaditya Rao';
  const designation = adminUser?.designation || 'Chief Municipal Administrator';
  const email = adminUser?.email || 'admin@civicsense.gov';
  const id = adminUser?.id || 'ADM-SYS-001';

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-12">
      <PageHeader
        title="Admin Security Profile"
        description="System administrator credentials and security permissions."
        breadcrumbs={[
          { label: 'Admin Portal', href: '/admin' },
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Profile' },
        ]}
      />

      <Card className="shadow-sm overflow-hidden">
        <div className="bg-slate-900 p-8 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-blue-700 border-2 border-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-md">
            {name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{name}</h2>
            <p className="text-sm text-slate-400">{designation}</p>
          </div>
          <span className="font-mono text-xs bg-slate-800 text-blue-300 px-3 py-1 rounded-full border border-slate-700 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            {id} • Full System Override Access
          </span>
        </div>

        <CardHeader className="bg-slate-50/60 border-b border-slate-200">
          <CardTitle className="text-sm">Account & Security Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 py-6 text-sm">
          {[
            { icon: <UserCheck className="w-4 h-4 text-blue-600" />, label: 'Administrator ID', value: id },
            { icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, label: 'Role Designation', value: designation },
            { icon: <Mail className="w-4 h-4 text-slate-500" />, label: 'Official Email', value: email },
            { icon: <Key className="w-4 h-4 text-slate-500" />, label: 'Security Level', value: 'Level 5 (Super Admin)' },
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
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link to="/admin/dashboard">
          <Button variant="outline" size="md">← Back to Dashboard</Button>
        </Link>
        <Button variant="danger" size="md" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />}>
          Sign Out of Admin Portal
        </Button>
      </div>
    </div>
  );
}
