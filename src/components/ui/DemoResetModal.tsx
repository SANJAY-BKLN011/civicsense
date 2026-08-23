import { useState } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Button } from './Button';
import { useOfficerComplaints } from '../../context/OfficerComplaintsContext';
import { useAdminComplaints } from '../../context/AdminComplaintsContext';
import { useNotifications } from '../../context/NotificationContext';

export function DemoResetModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isResetDone, setIsResetDone] = useState(false);

  const { resetToDefault: resetOfficerComplaints } = useOfficerComplaints();
  const { resetToMockData: resetAdminComplaints } = useAdminComplaints();
  const { resetNotifications } = useNotifications();

  const handleReset = () => {
    resetOfficerComplaints();
    resetAdminComplaints();
    resetNotifications();
    setIsResetDone(true);

    setTimeout(() => {
      setIsResetDone(false);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
      >
        <span>Reset Demo Data</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 text-left">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Reset Demo Data</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isResetDone ? (
              <div className="p-6 space-y-4 text-xs">
                <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">Reset all demo data?</h4>
                    <p className="text-slate-700 leading-relaxed">
                      This will restore all complaint statuses, timeline entries, officer assignments, and notifications to their original initial demo state.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                    Reset Demo State
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Demo Data Restored!</h4>
                <p className="text-xs text-slate-600">All portal datasets have been reset to pristine initial state.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
