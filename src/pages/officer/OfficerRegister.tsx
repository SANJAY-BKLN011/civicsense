import { Link } from 'react-router-dom';
import { ShieldAlert, User, Mail, Building, ArrowRight } from 'lucide-react';
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

export function OfficerRegister() {
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white mb-3 shadow-xs">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Officer Registration</h1>
        <p className="text-sm text-slate-600 mt-1">
          Municipal staff credential request and department assignment
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="text-base">Staff Onboarding Verification</CardTitle>
          <CardDescription>
            Frontend placeholder form (Authentication not wired in F1)
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <ErrorMessage
            severity="info"
            title="Frontend Foundation Mode"
            message="This is a static registration preview. Staff verification logic will be implemented in subsequent phases."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Officer Full Name"
              placeholder="e.g. Officer Marcus Vance"
              leftIcon={<User className="w-4 h-4" />}
              required
            />
            <Input
              label="Official Employee ID"
              placeholder="e.g. EMP-99201"
              leftIcon={<Building className="w-4 h-4" />}
              required
            />
          </div>

          <Input
            label="Government / Official Email"
            type="email"
            placeholder="officer.vance@muni.gov"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned Department"
              placeholder="Select department"
              options={[
                { value: 'pwd', label: 'Public Works (Roads & Bridges)' },
                { value: 'sanitation', label: 'Solid Waste Management' },
                { value: 'water', label: 'Water Supply & Sewerage' },
                { value: 'electrical', label: 'City Electrical Infrastructure' },
              ]}
              required
            />
            <Select
              label="Assigned Ward Jurisdiction"
              placeholder="Select primary ward"
              options={[
                { value: 'ward-12', label: 'Ward 12 - Central District' },
                { value: 'ward-14', label: 'Ward 14 - North Suburb' },
                { value: 'ward-22', label: 'Ward 22 - East Industrial' },
                { value: 'ward-35', label: 'Ward 35 - South Riverside' },
              ]}
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Link to="/officer/dashboard" className="w-full">
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Staff Access Request
            </Button>
          </Link>

          <div className="text-xs text-center text-slate-500">
            Already have staff credentials?{' '}
            <Link to="/officer/login" className="text-slate-900 font-semibold hover:underline">
              Sign In here
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
