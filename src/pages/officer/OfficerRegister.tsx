import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, User, Mail, Building, Lock, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';
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
import { useDepartments } from '../../context/DepartmentContext';
import { registerOfficerApi } from '../../api/auth';
import { USE_MOCK_DATA } from '../../api/client';

export function OfficerRegister() {
  const { departments, isLoading: isDeptsLoading } = useDepartments();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [designation, setDesignation] = useState('Field Officer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Official email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!departmentId) {
      newErrors.departmentId = 'Please select your assigned department.';
    }

    if (!designation.trim()) {
      newErrors.designation = 'Official designation is required.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter (A-Z).';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain at least one lowercase letter (a-z).';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number (0-9).';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    if (!USE_MOCK_DATA) {
      const res = await registerOfficerApi({
        name: name.trim(),
        email: email.trim(),
        department_id: departmentId,
        designation: designation.trim(),
        password,
      });

      setIsSubmitting(false);

      if (res.success) {
        setIsSubmittedSuccess(true);
      } else {
        setFormError(res.error || 'Officer registration failed. Please verify your details or check if email is already registered.');
      }
    } else {
      // Demo/Mock mode delay
      await new Promise((res) => setTimeout(res, 500));
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white mb-3 shadow-xs">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Officer Registration</h1>
        <p className="text-sm text-slate-600 mt-1">
          Municipal staff credential request and department onboarding
        </p>
      </div>

      <Card className="shadow-md text-left">
        <CardHeader className="bg-slate-50/60 border-b border-slate-200">
          <CardTitle className="text-base">Staff Onboarding Verification</CardTitle>
          <CardDescription>
            Register your official officer credentials. Accounts require administrator review before activation.
          </CardDescription>
        </CardHeader>

        {isSubmittedSuccess ? (
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Registration Submitted</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Registration submitted successfully. Your account is pending admin approval.
            </p>
            <div className="pt-4">
              <Link to="/officer/login">
                <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Proceed to Officer Login
                </Button>
              </Link>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="space-y-4 pt-6">
              {formError && (
                <ErrorMessage
                  severity="error"
                  title="Registration Failed"
                  message={formError}
                  onDismiss={() => setFormError(null)}
                />
              )}

              {/* Full Name */}
              <Input
                id="officer-name"
                label="Full Name"
                placeholder="e.g. Officer Marcus Vance"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: '' }));
                }}
                error={errors.name}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              {/* Government / Official Email */}
              <Input
                id="officer-email"
                type="email"
                label="Official Email Address"
                placeholder="e.g. marcus.vance@civicsense.gov"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                }}
                error={errors.email}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              {/* Department & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="officer-dept" className="block text-xs font-semibold text-slate-700">
                    Assigned Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="officer-dept"
                    value={departmentId}
                    onChange={(e) => {
                      setDepartmentId(e.target.value);
                      if (errors.departmentId) setErrors((p) => ({ ...p, departmentId: '' }));
                    }}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isDeptsLoading}
                  >
                    <option value="">Select department...</option>
                    {departments.map((d) => {
                      const dId = typeof d === 'object' ? String(d.id || '') : String(d);
                      const dName = typeof d === 'object' ? String(d.name || d.id || '') : String(d);
                      return (
                        <option key={dId} value={dId}>{dName}</option>
                      );
                    })}
                  </select>
                  {errors.departmentId && <p className="text-[11px] text-rose-600 font-medium">{errors.departmentId}</p>}
                </div>

                <Input
                  id="officer-designation"
                  label="Official Designation"
                  placeholder="e.g. Field Officer / Inspector"
                  value={designation}
                  onChange={(e) => {
                    setDesignation(e.target.value);
                    if (errors.designation) setErrors((p) => ({ ...p, designation: '' }));
                  }}
                  error={errors.designation}
                  leftIcon={<Building className="w-4 h-4" />}
                  required
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="officer-password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="At least 8 chars (A-Z, a-z, 0-9)"
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
                />

                <Input
                  id="officer-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: '' }));
                  }}
                  error={errors.confirmPassword}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-3 p-6">
              <Button
                type="submit"
                variant="secondary"
                size="md"
                className="w-full"
                isLoading={isSubmitting}
                rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
              >
                Submit Officer Registration
              </Button>

              <div className="text-xs text-center text-slate-500">
                Already have staff credentials?{' '}
                <Link to="/officer/login" className="text-blue-700 font-semibold hover:underline">
                  Sign In here
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>

      <div className="mt-6 text-center">
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">
          ← Back to CivicSense Home
        </Link>
      </div>
    </div>
  );
}
