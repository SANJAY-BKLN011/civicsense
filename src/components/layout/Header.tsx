import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Menu, X, User, Shield, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  portalType?: 'citizen' | 'officer' | 'public';
  navItems?: NavItem[];
}

export function Header({ portalType = 'public', navItems = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/citizen/login', { replace: true });
  };

  const getPortalBadge = () => {
    if (portalType === 'citizen') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          <User className="w-3 h-3" />
          Citizen Portal
        </span>
      );
    }
    if (portalType === 'officer') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-100 border border-slate-700">
          <Shield className="w-3 h-3" />
          Officer Portal
        </span>
      );
    }
    return null;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Portal Type */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md py-1"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-800 transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                  CivicSense
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mt-0.5">
                  Public Services
                </span>
              </div>
            </Link>

            {/* Portal Badge */}
            <div className="hidden sm:block pl-2 border-l border-slate-200">
              {getPortalBadge()}
            </div>
          </div>

          {/* Desktop Navigation */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'px-3.5 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-100 text-blue-800 font-semibold border-b-2 border-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Right Action / Auth & Portal Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {portalType === 'citizen' && isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900 block leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {user.id}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-medium text-slate-600 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  title="Sign out of Citizen Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            ) : portalType === 'public' ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/citizen/login"
                  className="text-xs font-semibold px-3 py-1.5 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Citizen Login
                </Link>
                <Link
                  to="/officer/login"
                  className="text-xs font-semibold px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Officer Login
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="text-xs text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
                >
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
                {portalType === 'citizen' ? (
                  <Link
                    to="/officer"
                    className="text-xs font-medium text-slate-600 hover:text-blue-700 bg-slate-100 px-2.5 py-1 rounded transition-colors"
                  >
                    Switch to Officer Portal
                  </Link>
                ) : (
                  <Link
                    to="/citizen"
                    className="text-xs font-medium text-slate-600 hover:text-blue-700 bg-slate-100 px-2.5 py-1 rounded transition-colors"
                  >
                    Switch to Citizen Portal
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {getPortalBadge()}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-150">
          {portalType === 'citizen' && isAuthenticated && user && (
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-md flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-900">{user.name}</div>
                  <div className="text-[10px] text-slate-500">{user.email}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-xs font-semibold text-rose-700 px-2 py-1 bg-white rounded border border-rose-200"
              >
                Log out
              </button>
            </div>
          )}

          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-slate-600 hover:text-slate-900 py-1"
            >
              ← Back to Main Landing
            </Link>
            {portalType !== 'citizen' && (
              <Link
                to="/citizen"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-blue-700 font-medium py-1"
              >
                Citizen Portal
              </Link>
            )}
            {portalType !== 'officer' && (
              <Link
                to="/officer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-slate-800 font-medium py-1"
              >
                Officer Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
