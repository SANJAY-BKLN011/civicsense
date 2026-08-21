import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" label="Verifying citizen session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to citizen login with return path
    return <Navigate to="/citizen/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
