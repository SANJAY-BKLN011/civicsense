import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DepartmentProvider } from './context/DepartmentContext';
import { OfficerComplaintsProvider } from './context/OfficerComplaintsContext';
import { AdminComplaintsProvider } from './context/AdminComplaintsContext';
import { NotificationProvider } from './context/NotificationContext';
import { router } from './router';

export function App() {
  return (
    <AuthProvider>
      <DepartmentProvider>
        <OfficerComplaintsProvider>
          <AdminComplaintsProvider>
            <NotificationProvider>
              <RouterProvider router={router} />
            </NotificationProvider>
          </AdminComplaintsProvider>
        </OfficerComplaintsProvider>
      </DepartmentProvider>
    </AuthProvider>
  );
}

export default App;
