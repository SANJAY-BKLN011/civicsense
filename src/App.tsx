import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OfficerComplaintsProvider } from './context/OfficerComplaintsContext';
import { AdminComplaintsProvider } from './context/AdminComplaintsContext';
import { NotificationProvider } from './context/NotificationContext';
import { router } from './router';

export function App() {
  return (
    <AuthProvider>
      <OfficerComplaintsProvider>
        <AdminComplaintsProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </AdminComplaintsProvider>
      </OfficerComplaintsProvider>
    </AuthProvider>
  );
}

export default App;
