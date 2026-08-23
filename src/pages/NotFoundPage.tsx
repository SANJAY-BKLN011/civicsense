import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '../components/ui';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 shadow-2xs">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">404 - Page Not Found</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The requested CivicSense portal route does not exist or has been moved.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 pt-2">
          <Link to="/">
            <Button variant="primary" size="sm" className="w-full" leftIcon={<Home className="w-4 h-4" />}>
              Back to CivicSense Home
            </Button>
          </Link>

          <div className="grid grid-cols-3 gap-2">
            <Link to="/citizen/dashboard">
              <Button variant="outline" size="sm" className="w-full text-xs">Citizen</Button>
            </Link>
            <Link to="/officer/dashboard">
              <Button variant="outline" size="sm" className="w-full text-xs">Officer</Button>
            </Link>
            <Link to="/admin/dashboard">
              <Button variant="outline" size="sm" className="w-full text-xs">Admin</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
