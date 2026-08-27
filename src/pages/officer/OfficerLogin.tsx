import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Mail,
  Building2,
} from 'lucide-react';
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

export function OfficerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginOfficer } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: string })?.from || '/officer/dashboard';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Department email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid department email address.';
    }

    if (!password) {
      newErrors.password = 'Officer password is required.';
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
    const result = await loginOfficer({ email: email.trim(), password, rememberMe });
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setAuthError(result.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handlePrefill = () => {
    setEmail('sanjay.kumar@civicsense.gov');
    setPassword('officer123');
    setErrors({});
    setAuthError(null);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      {/* Header Icon & Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white mb-3 shadow-md">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Officer Portal Sign In</h1>
        <p className="text-sm text-slate-600 mt-1">
          Authorized access for municipal officers & department personnel
        </p>
      </div>

      {/* Demo Helper */}
      <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-700">Demo Officer Account</p>
          <p className="text-[11px] text-slate-500">sanjay.kumar@civicsense.gov</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handlePrefill}>
          Use Demo
        </Button>
      </div>

      {/* Login Card */}
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50/60 border-b border-slate-200">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-700" />
            Officer Credentials
          </CardTitle>
          <CardDescription>
            Municipality / Sanitation Department — Ward 12
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
              id="officer-email"
              type="email"
              label="Department Email Address"
              placeholder="e.g. officer@civicsense.gov"
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

            {/* Password with show/hide toggle */}
            <div className="space-y-1.5">
              <Input
                id="officer-password"
                type={showPassword ? 'text' : 'password'}
                label="Officer Password"
                placeholder="Enter your secure password"
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
                autoComplete="current-password"
              />
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-400 text-blue-700 accent-blue-700 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-700">Keep me signed in on this device</span>
            </label>
          </CardContent>

          <CardFooter className="flex-col gap-3 p-6">
            <Button
              type="submit"
              variant="secondary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              rightIcon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              Sign In to Officer Portal
            </Button>

            <div className="text-xs text-center text-slate-600 flex items-center justify-between gap-2 w-full pt-3 border-t border-slate-100">
              <Link to="/officer/register" className="text-blue-700 font-semibold hover:underline">
                Register as Officer →
              </Link>
              <Link to="/citizen/login" className="text-slate-500 hover:underline">
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
