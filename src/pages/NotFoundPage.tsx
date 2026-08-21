import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '../components/ui';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 text-rose-700">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">404 - Page Not Found</h1>
          <p className="text-sm text-slate-600">
            The civic page or municipal portal URL you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Back to Home
            </Button>
          </Link>
          <Link to="/citizen/dashboard">
            <Button
              variant="outline"
              size="md"
            >
              Citizen Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
