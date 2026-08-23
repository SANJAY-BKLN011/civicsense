import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Eye, EyeOff, ArrowRight, Lock, Mail, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Button,
  ErrorMessage,
} from '../../components/ui';

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: string })?.from || '/admin/dashboard';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Administrator email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid administrator email address.';
    }

    if (!password) {
      newErrors.password = 'Admin security password is required.';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) return;

    setIsLoading(true);
    const result = await loginAdmin({ email: email.trim(), password, rememberMe });
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setAuthError(result.error || 'Authentication failed. Invalid admin credentials.');
    }
  };

  const handlePrefill = () => {
    setEmail('admin@civicsense.gov');
    setPassword('admin123');
    setErrors({});
    setAuthError(null);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      {/* Header Icon & Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-700 text-white mb-3 shadow-md">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Portal Sign In</h1>
        <p className="text-sm text-slate-600 mt-1">
          Municipal Command Center & System Management
        </p>
      </div>

      {/* Demo Helper */}
      <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-blue-900">Demo Admin Account</p>
          <p className="text-[11px] text-blue-700">admin@civicsense.gov</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handlePrefill}>
          Use Demo Admin
        </Button>
      </div>

      {/* Login Card */}
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50/70 border-b border-slate-200">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-700" />
            Administrator Credentials
          </CardTitle>
          <CardDescription>
            System-wide access for municipal directors & system managers
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-5 pt-6">
            {authError && (
              <ErrorMessage
                severity="error"
                title="Authentication Failed"
                message={authError}
                onDismiss={() => setAuthError(null)}
              />
            )}

            {/* Email */}
            <Input
              id="admin-email"
              type="email"
              label="Admin Email Address"
              placeholder="e.g. admin@civicsense.gov"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: '' }));
              }}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            {/* Password */}
            <Input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              label="Security Password"
              placeholder="Enter your admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((p) => ({ ...p, password: '' }));
              }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
              autoComplete="current-password"
            />

            {/* Remember Me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-400 text-blue-700 accent-blue-700 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-700">Keep me signed in on this workstation</span>
            </label>
          </CardContent>

          <CardFooter className="flex-col gap-3 p-6">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              rightIcon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              Sign In to Admin Portal
            </Button>

            <div className="text-xs text-center text-slate-500">
              Not an admin?{' '}
              <Link to="/officer/login" className="text-blue-700 font-semibold hover:underline mr-2">
                Officer Login
              </Link>
              •
              <Link to="/citizen/login" className="text-blue-700 font-semibold hover:underline ml-2">
                Citizen Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-5 text-center">
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">
          ← Back to CivicSense Home
        </Link>
      </div>
    </div>
  );
}
