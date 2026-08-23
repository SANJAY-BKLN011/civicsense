import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingState } from '../ui';

interface OfficerProtectedRouteProps {
  children: React.ReactNode;
}

export function OfficerProtectedRoute({ children }: OfficerProtectedRouteProps) {
  const { isOfficerAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState title="Verifying officer session..." description="Please wait." />;
  }

  if (!isOfficerAuthenticated) {
    return (
      <Navigate
        to="/officer/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
}
