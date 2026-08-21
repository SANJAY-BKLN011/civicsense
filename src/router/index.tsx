import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { CitizenLayout } from '../components/layout/CitizenLayout';
import { OfficerLayout } from '../components/layout/OfficerLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Public Pages
import { LandingPage } from '../pages/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Citizen Pages
import { CitizenHome } from '../pages/citizen/CitizenHome';
import { CitizenLogin } from '../pages/citizen/CitizenLogin';
import { CitizenRegister } from '../pages/citizen/CitizenRegister';
import { CitizenForgotPassword } from '../pages/citizen/CitizenForgotPassword';
import { CitizenDashboard } from '../pages/citizen/CitizenDashboard';
import { CitizenReport } from '../pages/citizen/CitizenReport';
import { CitizenComplaints } from '../pages/citizen/CitizenComplaints';
import { CitizenComplaintDetail } from '../pages/citizen/CitizenComplaintDetail';

// Officer Pages
import { OfficerHome } from '../pages/officer/OfficerHome';
import { OfficerLogin } from '../pages/officer/OfficerLogin';
import { OfficerRegister } from '../pages/officer/OfficerRegister';
import { OfficerDashboard } from '../pages/officer/OfficerDashboard';
import { OfficerComplaints } from '../pages/officer/OfficerComplaints';
import { OfficerProfile } from '../pages/officer/OfficerProfile';

export const router = createBrowserRouter([
  // Public & Landing Layout Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'citizen/login',
        element: <CitizenLogin />,
      },
      {
        path: 'citizen/register',
        element: <CitizenRegister />,
      },
      {
        path: 'citizen/forgot-password',
        element: <CitizenForgotPassword />,
      },
      {
        path: 'officer/login',
        element: <OfficerLogin />,
      },
      {
        path: 'officer/register',
        element: <OfficerRegister />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },

  // Citizen Portal Layout Routes
  {
    path: '/citizen',
    element: <CitizenLayout />,
    children: [
      {
        index: true,
        element: <CitizenHome />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <CitizenDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'report',
        element: (
          <ProtectedRoute>
            <CitizenReport />
          </ProtectedRoute>
        ),
      },
      {
        path: 'complaints',
        element: (
          <ProtectedRoute>
            <CitizenComplaints />
          </ProtectedRoute>
        ),
      },
      {
        path: 'complaints/:id',
        element: (
          <ProtectedRoute>
            <CitizenComplaintDetail />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Officer Portal Layout Routes
  {
    path: '/officer',
    element: <OfficerLayout />,
    children: [
      {
        index: true,
        element: <OfficerHome />,
      },
      {
        path: 'dashboard',
        element: <OfficerDashboard />,
      },
      {
        path: 'complaints',
        element: <OfficerComplaints />,
      },
      {
        path: 'profile',
        element: <OfficerProfile />,
      },
    ],
  },
]);
