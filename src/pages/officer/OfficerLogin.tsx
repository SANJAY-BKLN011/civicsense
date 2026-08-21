import { Link } from 'react-router-dom';
import { Shield, Lock, ArrowRight, Building } from 'lucide-react';
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

export function OfficerLogin() {
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white mb-3 shadow-xs">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Officer Portal Sign In</h1>
        <p className="text-sm text-slate-600 mt-1">
          Authorized access for municipal officers & department personnel
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="text-base">Officer Credentials</CardTitle>
          <CardDescription>
            Frontend placeholder form (Authentication not wired in F1)
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <ErrorMessage
            severity="info"
            title="Frontend Foundation Mode"
            message="This is a static UI preview. Authentication logic will be implemented in subsequent phases."
          />

          <Select
            label="Department / Directorate"
            options={[
              { value: 'pwd', label: 'Public Works Department (PWD)' },
              { value: 'sanitation', label: 'Solid Waste & Sanitation Board' },
              { value: 'water', label: 'Municipal Water & Sewerage Board' },
              { value: 'electricity', label: 'City Power & Streetlighting' },
            ]}
            required
          />

          <Input
            label="Officer ID / Official Email"
            placeholder="e.g. OFF-8821 or officer@muni.gov"
            leftIcon={<Building className="w-4 h-4" />}
            defaultValue="OFF-8821"
          />

          <Input
            label="Security Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            defaultValue="password123"
          />
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Link to="/officer/dashboard" className="w-full">
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Officer Portal
            </Button>
          </Link>

          <div className="text-xs text-center text-slate-500">
            Need officer registration?{' '}
            <Link to="/officer/register" className="text-slate-900 font-semibold hover:underline">
              Request Staff Access
            </Link>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center">
        <Link
          to="/"
          className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          ← Back to CivicSense Home
        </Link>
      </div>
    </div>
  );
}
