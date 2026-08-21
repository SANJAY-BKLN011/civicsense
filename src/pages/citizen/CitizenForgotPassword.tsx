import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight, ArrowLeft, CheckCircle2, Building2 } from 'lucide-react';
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

export function CitizenForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const result = await requestPasswordReset(email.trim());
    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(result.error || 'Failed to process request.');
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reset Password</h1>
        <p className="text-sm text-slate-600 mt-1">
          Recover access to your CivicSense citizen profile
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-slate-50/50">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
            <KeyRound className="w-5 h-5" />
          </div>
          <CardTitle className="text-base">Password Assistance</CardTitle>
          <CardDescription>
            Enter your registered citizen email address to receive recovery instructions
          </CardDescription>
        </CardHeader>

        {isSubmitted ? (
          <div>
            <CardContent className="space-y-4 pt-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-left space-y-1">
                  <h4 className="text-sm font-semibold text-emerald-900">
                    Request Received
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    Password reset instructions have been requested.
                  </p>
                  <p className="text-xs text-emerald-700 leading-relaxed pt-1">
                    If an account is associated with <span className="font-mono font-semibold">{email}</span>, you will receive an official municipal recovery link within 5 minutes.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Link to="/citizen/login" className="w-full">
                <Button variant="primary" size="md" className="w-full">
                  Return to Citizen Login
                </Button>
              </Link>
            </CardFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <ErrorMessage
                  severity="error"
                  title="Validation Error"
                  message={error}
                  onDismiss={() => setError(null)}
                />
              )}

              <Input
                id="citizen-reset-email"
                label="Registered Email Address"
                type="email"
                placeholder="citizen@example.org"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                leftIcon={<Mail className="w-4 h-4" />}
                required
                autoComplete="email"
                autoFocus
              />

              <p className="text-xs text-slate-500">
                You will receive a secure token to reset your password if your account exists in the municipal register.
              </p>
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
                Request Password Reset
              </Button>

              <div className="text-xs text-center text-slate-500">
                Remember your password?{' '}
                <Link to="/citizen/login" className="text-blue-700 font-semibold hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
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
