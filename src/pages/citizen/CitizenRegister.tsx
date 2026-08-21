import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  ArrowLeft,
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
  Select,
  Button,
  ErrorMessage,
} from '../../components/ui';

export function CitizenRegister() {
  const navigate = useNavigate();
  const { registerCitizen, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ward: 'Ward 12 - Central District',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    // Phone
    const cleanPhone = formData.phone.replace(/[\s()-]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10,12}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
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

    const result = await registerCitizen({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      ward: formData.ward,
    });

    if (result.success) {
      navigate('/citizen/dashboard', { replace: true });
    } else {
      setFormError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Citizen Account</h1>
        <p className="text-sm text-slate-600 mt-1">
          Join CivicSense to report issues and track municipal improvements in your locality
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="text-base">Citizen Registration</CardTitle>
          <CardDescription>
            Enter your details to create a resident account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4 pt-6">
            {/* Form-level Error Banner */}
            {formError && (
              <ErrorMessage
                severity="error"
                title="Registration Error"
                message={formError}
                onDismiss={() => setFormError(null)}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <Input
                id="citizen-register-name"
                label="Full Name"
                placeholder="e.g. Sarah Jenkins"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                error={errors.name}
                leftIcon={<User className="w-4 h-4" />}
                required
                autoComplete="name"
                autoFocus
              />

              {/* Phone Number */}
              <Input
                id="citizen-register-phone"
                label="Phone Number"
                type="tel"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                error={errors.phone}
                leftIcon={<Phone className="w-4 h-4" />}
                required
                autoComplete="tel"
              />
            </div>

            {/* Email Address */}
            <Input
              id="citizen-register-email"
              label="Email Address"
              type="email"
              placeholder="citizen@example.org"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            {/* Municipal Ward Selector */}
            <Select
              id="citizen-register-ward"
              label="Municipal Ward / Zone"
              value={formData.ward}
              onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
              options={[
                { value: 'Ward 12 - Central District', label: 'Ward 12 - Central District' },
                { value: 'Ward 14 - North Suburb', label: 'Ward 14 - North Suburb' },
                { value: 'Ward 22 - East Industrial', label: 'Ward 22 - East Industrial' },
                { value: 'Ward 35 - South Riverside', label: 'Ward 35 - South Riverside' },
              ]}
              helperText="Helps route your civic reports to the appropriate local department"
            />

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="citizen-register-password"
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
                        <EyeOff className="w-3 h-3" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
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
                    id="citizen-register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className={`w-full rounded-md border bg-white pl-10 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ${
                      errors.password ? 'border-rose-500' : 'border-slate-300 hover:border-slate-400'
                    }`}
                    required
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="citizen-register-confirm-password"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-700 select-none flex items-center justify-between"
                >
                  <span>
                    Confirm Password
                    <span className="text-rose-600 ml-1" aria-hidden="true">*</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-xs font-normal text-slate-500 hover:text-blue-700 flex items-center gap-1 focus:outline-none cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
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
                    id="citizen-register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    className={`w-full rounded-md border bg-white pl-10 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ${
                      errors.confirmPassword ? 'border-rose-500' : 'border-slate-300 hover:border-slate-400'
                    }`}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer focus:outline-none"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-xs text-rose-600 font-medium">{errors.confirmPassword}</p>
                )}
              </div>
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
              Complete Citizen Registration
            </Button>

            <div className="text-xs text-center text-slate-500">
              Already have a citizen account?{' '}
              <Link to="/citizen/login" className="text-blue-700 font-semibold hover:underline">
                Sign In here
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
