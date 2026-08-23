import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { CitizenLayout } from '../components/layout/CitizenLayout';
import { OfficerLayout } from '../components/layout/OfficerLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { OfficerProtectedRoute } from '../components/auth/OfficerProtectedRoute';
import { AdminProtectedRoute } from '../components/auth/AdminProtectedRoute';

// Public Pages
import { LandingPage } from '../pages/LandingPage';
import { AboutPage } from '../pages/AboutPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { NotificationPage } from '../pages/NotificationPage';

// Citizen Pages
import { CitizenHome } from '../pages/citizen/CitizenHome';
import { CitizenLogin } from '../pages/citizen/CitizenLogin';
import { CitizenRegister } from '../pages/citizen/CitizenRegister';
import { CitizenForgotPassword } from '../pages/citizen/CitizenForgotPassword';
import { CitizenDashboard } from '../pages/citizen/CitizenDashboard';
import { CitizenReport } from '../pages/citizen/CitizenReport';
import { CitizenComplaints } from '../pages/citizen/CitizenComplaints';
import { CitizenComplaintDetail } from '../pages/citizen/CitizenComplaintDetail';
import { CitizenProfile } from '../pages/citizen/CitizenProfile';

// Officer Pages
import { OfficerHome } from '../pages/officer/OfficerHome';
import { OfficerLogin } from '../pages/officer/OfficerLogin';
import { OfficerRegister } from '../pages/officer/OfficerRegister';
import { OfficerDashboard } from '../pages/officer/OfficerDashboard';
import { OfficerComplaints } from '../pages/officer/OfficerComplaints';
import { OfficerComplaintDetail } from '../pages/officer/OfficerComplaintDetail';
import { OfficerDepartment } from '../pages/officer/OfficerDepartment';
import { OfficerProfile } from '../pages/officer/OfficerProfile';

// Admin Pages
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminComplaints } from '../pages/admin/AdminComplaints';
import { AdminComplaintDetail } from '../pages/admin/AdminComplaintDetail';
import { AdminDepartments } from '../pages/admin/AdminDepartments';
import { AdminOfficers } from '../pages/admin/AdminOfficers';
import { AdminReports } from '../pages/admin/AdminReports';
import { AdminProfile } from '../pages/admin/AdminProfile';

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
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'notifications',
        element: <NotificationPage />,
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
        path: 'admin/login',
        element: <AdminLogin />,
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
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <CitizenProfile />
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
        element: (
          <OfficerProtectedRoute>
            <OfficerDashboard />
          </OfficerProtectedRoute>
        ),
      },
      {
        path: 'complaints',
        element: (
          <OfficerProtectedRoute>
            <OfficerComplaints />
          </OfficerProtectedRoute>
        ),
      },
      {
        path: 'complaints/:id',
        element: (
          <OfficerProtectedRoute>
            <OfficerComplaintDetail />
          </OfficerProtectedRoute>
        ),
      },
      {
        path: 'department',
        element: (
          <OfficerProtectedRoute>
            <OfficerDepartment />
          </OfficerProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <OfficerProtectedRoute>
            <OfficerProfile />
          </OfficerProtectedRoute>
        ),
      },
    ],
  },

  // Admin Portal Layout Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: (
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'complaints',
        element: (
          <AdminProtectedRoute>
            <AdminComplaints />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'complaints/:id',
        element: (
          <AdminProtectedRoute>
            <AdminComplaintDetail />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'departments',
        element: (
          <AdminProtectedRoute>
            <AdminDepartments />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'officers',
        element: (
          <AdminProtectedRoute>
            <AdminOfficers />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <AdminProtectedRoute>
            <AdminReports />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <AdminProtectedRoute>
            <AdminProfile />
          </AdminProtectedRoute>
        ),
      },
    ],
  },
]);
