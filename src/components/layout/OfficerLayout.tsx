import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function OfficerLayout() {
  const navItems = [
    { label: 'Dashboard', href: '/officer/dashboard' },
    { label: 'Complaints', href: '/officer/complaints' },
    { label: 'Profile', href: '/officer/profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header portalType="officer" navItems={navItems} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
