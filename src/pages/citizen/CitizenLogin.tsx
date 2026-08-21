import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, ArrowRight, Eye, EyeOff, Building2, ArrowLeft } from 'lucide-react';
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

export function CitizenLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginCitizen, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Validation & error states
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Check if redirected from a protected route
  const redirectNotice = location.state?.from
    ? 'Please sign in to access that citizen page.'
    : null;

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address (e.g., name@example.com).';
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    const result = await loginCitizen({ email: email.trim(), password, rememberMe });
    if (result.success) {
      const destination = location.state?.from?.pathname || '/citizen/dashboard';
      navigate(destination, { replace: true });
    } else {
      setFormError(result.error || 'Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-3 text-slate-700 hover:text-blue-700 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-slate-900">CivicSense</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Citizen Sign In</h1>
        <p className="text-sm text-slate-600 mt-1">
          Access your citizen dashboard and track reported civic issues
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="text-base">Account Credentials</CardTitle>
          <CardDescription>
            Enter your citizen email and password to sign in
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4 pt-6">
            {/* Redirect notice if from protected route */}
            {redirectNotice && (
              <ErrorMessage
                severity="info"
                title="Authentication Required"
                message={redirectNotice}
                onDismiss={() => {}}
              />
            )}

            {/* Error Banner */}
            {formError && (
              <ErrorMessage
                severity="error"
                title="Sign In Error"
                message={formError}
                onDismiss={() => setFormError(null)}
              />
            )}

            {/* Email Field */}
            <Input
              id="citizen-login-email"
              label="Email Address"
              type="email"
              placeholder="citizen@example.org"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              leftIcon={<User className="w-4 h-4" />}
              required
              autoComplete="email"
              autoFocus
            />

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="citizen-login-password"
                className="text-xs font-semibold uppercase tracking-wider text-slate-700 select-none flex items-center justify-between"
              >
                <span>
                  Password
                  <span className="text-rose-600 ml-1" aria-hidden="true">*</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-normal text-slate-500 hover:text-blue-700 flex items-center gap-1 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </label>

              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="citizen-login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`w-full rounded-md border bg-white pl-10 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ${
                    errors.password ? 'border-rose-500' : 'border-slate-300 hover:border-slate-400'
                  }`}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-rose-600 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/citizen/forgot-password"
                className="text-blue-700 font-medium hover:underline cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Citizen Portal
            </Button>

            <div className="text-xs text-center text-slate-500">
              Don't have a citizen account?{' '}
              <Link to="/citizen/register" className="text-blue-700 font-semibold hover:underline">
                Register now
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Footer Navigation Links */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
        <Link
          to="/citizen"
          className="hover:text-slate-800 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Citizen Portal Home</span>
        </Link>
        <span>•</span>
        <Link to="/" className="hover:text-slate-800 transition-colors">
          CivicSense Home
        </Link>
      </div>
    </div>
  );
}
