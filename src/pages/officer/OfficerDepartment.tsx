import { Link } from 'react-router-dom';
import { Inbox, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  PageHeader,
  Card,
  CardTitle,
  CardContent,
  Button,
  Badge,
  type BadgeVariant,
} from '../../components/ui';
import { mockOfficerComplaints } from '../../data/mockOfficerComplaints';

export function OfficerDepartment() {
  const { officerUser } = useAuth();
  const dept = officerUser?.department || 'Municipality / Sanitation';

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Department Queue"
        description={`All incoming complaints routed to the ${dept} department.`}
        breadcrumbs={[
          { label: 'Officer Portal', href: '/officer' },
          { label: 'Dashboard', href: '/officer/dashboard' },
          { label: 'Department Queue' },
        ]}
      />

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
        Department-level queue management, triage assignment, and bulk actions will be available in a future phase. This is a read-only preview.
      </div>

      {mockOfficerComplaints.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed border-slate-300 rounded-lg">
          <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No pending complaints in department queue</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockOfficerComplaints.map((c) => (
            <Link key={c.id} to={`/officer/complaints/${c.id}`} className="block">
              <Card className="hover:border-slate-400 hover:shadow-md transition-all group">
                <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shrink-0">
                      {c.thumbnailIcon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{c.id}</span>
                        <CardTitle className="text-sm group-hover:text-slate-700">{c.title}</CardTitle>
                      </div>
                      <p className="text-xs text-slate-500">{c.location} • {c.submittedDate} • Reported by {c.citizenName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={c.status as BadgeVariant} size="sm" dot />
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center">
        <Link to="/officer/dashboard">
          <Button variant="outline" size="sm">← Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
