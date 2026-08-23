import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  ClipboardList,
  Building,
  Users,
  BarChart3,
  UserCheck,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Footer } from './Footer';
import { cn } from '../../utils/cn';

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUser, logoutAdmin } = useAuth();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Complaints', href: '/admin/complaints', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Departments', href: '/admin/departments', icon: <Building className="w-4 h-4" /> },
    { label: 'Officers', href: '/admin/officers', icon: <Users className="w-4 h-4" /> },
    { label: 'Reports', href: '/admin/reports', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Profile', href: '/admin/profile', icon: <UserCheck className="w-4 h-4" /> },
  ];

  const adminName = adminUser?.name || 'Administrator';
  const adminDesignation = adminUser?.designation || 'Chief Administrator';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 text-slate-900">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shrink-0 border-r border-slate-800">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-white leading-none">CivicSense</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-blue-400 mt-1">Admin Portal</div>
            </div>
          </Link>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5" aria-label="Admin Sidebar Navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Admin Session Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {adminName.charAt(0)}
            </div>
            <div className="text-xs overflow-hidden">
              <div className="font-bold text-white truncate">{adminName}</div>
              <div className="text-[10px] text-slate-400 truncate">{adminDesignation}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-xs font-semibold text-rose-400 bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content & Mobile Header */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Topbar */}
        <header className="md:hidden sticky top-0 z-40 bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">CivicSense Admin</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
            aria-label="Toggle admin navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 text-white border-b border-slate-800 p-4 space-y-2 animate-in slide-in-from-top">
            <div className="p-3 bg-slate-800 rounded-lg flex items-center justify-between mb-2">
              <div className="text-xs">
                <div className="font-bold text-white">{adminName}</div>
                <div className="text-[10px] text-slate-400">{adminDesignation}</div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-400 bg-slate-700 px-2.5 py-1 rounded"
              >
                Log out
              </button>
            </div>

            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-colors',
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Top Header Bar for Desktop */}
        <div className="hidden md:flex sticky top-0 z-30 bg-white border-b border-slate-200 px-8 py-3.5 items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Administrative Command Center
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <span>CivicSense Home</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
