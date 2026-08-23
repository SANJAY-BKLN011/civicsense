import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function CitizenLayout() {
  const navItems = [
    { label: 'Dashboard', href: '/citizen/dashboard' },
    { label: 'Report Issue', href: '/citizen/report' },
    { label: 'My Complaints', href: '/citizen/complaints' },
    { label: 'Profile', href: '/citizen/profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header portalType="citizen" navItems={navItems} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
