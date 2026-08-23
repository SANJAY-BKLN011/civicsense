import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, CheckCircle2, ArrowLeft } from 'lucide-react';
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

export function CitizenProfile() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Sanjay Patel');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [ward, setWard] = useState(user?.ward || 'Ward 12 - Central District');
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-12">
      <PageHeader
        title="Citizen Profile & Account Settings"
        description="View and update your personal contact details and assigned municipal ward."
        breadcrumbs={[
          { label: 'Citizen Portal', href: '/citizen' },
          { label: 'Dashboard', href: '/citizen/dashboard' },
          { label: 'Profile' },
        ]}
      />

      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <Card className="shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 p-8 flex flex-col items-center text-center gap-3 text-white">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl font-bold text-white shadow-md">
            {name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{name}</h2>
            <p className="text-sm text-blue-200">{user?.email || 'sanjay.patel@civicsense.gov'}</p>
          </div>
          <span className="font-mono text-xs bg-blue-950/60 text-blue-200 px-3 py-1 rounded-full border border-blue-700/50 font-semibold">
            {user?.id || 'CIT-8842'}
          </span>
        </div>

        {!isEditing ? (
          <>
            <CardHeader className="bg-slate-50/60 border-b border-slate-200 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Personal Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit Profile
              </Button>
            </CardHeader>

            <CardContent className="space-y-4 py-6 text-sm">
              {[
                { icon: <User className="w-4 h-4 text-blue-600" />, label: 'Full Name', value: name },
                { icon: <Mail className="w-4 h-4 text-slate-500" />, label: 'Email Address', value: user?.email || 'sanjay.patel@civicsense.gov' },
                { icon: <Phone className="w-4 h-4 text-slate-500" />, label: 'Phone Number', value: phone },
                { icon: <MapPin className="w-4 h-4 text-slate-500" />, label: 'Registered Ward', value: ward },
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
              <CardTitle className="text-sm">Edit Profile Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 py-6">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
                required
              />

              <Input
                label="Municipal Ward"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
                required
              />
            </CardContent>

            <CardFooter className="bg-slate-50 flex items-center justify-end gap-3 p-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Changes
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>

      <div className="text-center">
        <Link to="/citizen/dashboard">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
