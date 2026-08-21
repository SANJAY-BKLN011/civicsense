import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, HelpCircle, FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Platform Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight">CivicSense</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering citizens and municipal officers to report, track, and resolve local civic issues with full transparency.
            </p>
          </div>

          {/* Col 2: Citizen Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/citizen/dashboard" className="hover:text-white transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link to="/citizen/report" className="hover:text-white transition-colors">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link to="/citizen/complaints" className="hover:text-white transition-colors">
                  Track Complaints
                </Link>
              </li>
              <li>
                <Link to="/citizen/login" className="hover:text-white transition-colors">
                  Citizen Account Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Department Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Officer & Municipal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/officer/dashboard" className="hover:text-white transition-colors">
                  Department Dashboard
                </Link>
              </li>
              <li>
                <Link to="/officer/complaints" className="hover:text-white transition-colors">
                  Complaint Management
                </Link>
              </li>
              <li>
                <Link to="/officer/profile" className="hover:text-white transition-colors">
                  Officer Profile
                </Link>
              </li>
              <li>
                <Link to="/officer/login" className="hover:text-white transition-colors">
                  Officer Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Civic Standards & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Standards & Support
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Public Service Transparency Initiative</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Citizen Support & Accessibility</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FileText className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Municipal Response SLAs</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CivicSense Civic Issue Platform. Frontend Foundation.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Accessibility: WCAG AA</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Data Privacy Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
