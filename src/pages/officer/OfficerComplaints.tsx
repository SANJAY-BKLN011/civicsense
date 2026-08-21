import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Edit3,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Input,
  Select,
  Textarea,
  Modal,
  EmptyState,
  LoadingState,
  type BadgeVariant,
} from '../../components/ui';

interface OfficerComplaintItem {
  id: string;
  title: string;
  category: string;
  location: string;
  ward: string;
  reporter: string;
  date: string;
  status: BadgeVariant;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedCrew?: string;
}

export function OfficerComplaints() {
  const [activeTab, setActiveTab] = useState<'all' | 'empty' | 'loading'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState<OfficerComplaintItem | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const complaints: OfficerComplaintItem[] = [
    {
      id: 'CIV-2026-082',
      title: 'Water Main Burst Causing Street Flooding',
      category: 'Water Supply',
      location: 'Ward 12, 7th Cross Rd',
      ward: 'Ward 12',
      reporter: 'David K. (Citizen)',
      date: 'Aug 21, 2026',
      status: 'submitted',
      urgency: 'Critical',
      assignedCrew: 'Unassigned',
    },
    {
      id: 'CIV-2026-081',
      title: 'Deep Pothole near Central Market Road',
      category: 'Roads & Transport',
      location: 'Ward 12, Main Market St.',
      ward: 'Ward 12',
      reporter: 'Sarah J. (Citizen)',
      date: 'Aug 19, 2026',
      status: 'in-progress',
      urgency: 'High',
      assignedCrew: 'Roads Repair Crew #4',
    },
    {
      id: 'CIV-2026-079',
      title: 'Fallen Tree Branch on Power Cable',
      category: 'Electrical',
      location: 'Ward 12, Pine Avenue',
      ward: 'Ward 12',
      reporter: 'Elena R. (Citizen)',
      date: 'Aug 18, 2026',
      status: 'under-review',
      urgency: 'High',
      assignedCrew: 'Power & Grid Team #2',
    },
    {
      id: 'CIV-2026-074',
      title: 'Non-functioning Street Lights on 4th Cross',
      category: 'Streetlighting',
      location: 'Ward 12, 4th Cross Rd',
      ward: 'Ward 12',
      reporter: 'Sarah J. (Citizen)',
      date: 'Aug 15, 2026',
      status: 'submitted',
      urgency: 'Medium',
      assignedCrew: 'Unassigned',
    },
    {
      id: 'CIV-2026-061',
      title: 'Overflowing Municipal Garbage Bin',
      category: 'Sanitation',
      location: 'Ward 12, Parkside Avenue',
      ward: 'Ward 12',
      reporter: 'Alex M. (Citizen)',
      date: 'Aug 10, 2026',
      status: 'resolved',
      urgency: 'Medium',
      assignedCrew: 'Sanitation Unit B',
    },
  ];

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenUpdate = (item: OfficerComplaintItem) => {
    setSelectedCase(item);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Municipal Complaints Queue"
        description="Review, triage, and update neighborhood civic complaints assigned to your department."
        breadcrumbs={[
          { label: 'Officer Portal', href: '/officer' },
          { label: 'Dashboard', href: '/officer/dashboard' },
          { label: 'Complaints' },
        ]}
      />

      {/* View Switcher for Testing Component States */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-slate-500 mr-1">Preview State:</span>
          <Button
            size="sm"
            variant={activeTab === 'all' ? 'secondary' : 'outline'}
            onClick={() => setActiveTab('all')}
          >
            All Assigned ({complaints.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'empty' ? 'secondary' : 'outline'}
            onClick={() => setActiveTab('empty')}
          >
            Empty State Preview
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'loading' ? 'secondary' : 'outline'}
            onClick={() => setActiveTab('loading')}
          >
            Loading State Preview
          </Button>
        </div>

        <span className="text-xs text-slate-500">
          Showing mock UI placeholders
        </span>
      </div>

      {activeTab === 'loading' && (
        <LoadingState
          title="Loading Municipal Queue..."
          description="Retrieving department cases and triage assignments (visual loading state demonstration)."
        />
      )}

      {activeTab === 'empty' && (
        <EmptyState
          title="No Cases in Queue"
          description="All assigned civic complaints in Ward 12 have been reviewed and resolved."
          action={
            <Link to="/officer/dashboard">
              <Button size="sm" variant="secondary">
                Return to Dashboard
              </Button>
            </Link>
          }
        />
      )}

      {activeTab === 'all' && (
        <>
          {/* Filters Bar */}
          <Card className="bg-slate-50/70">
            <CardContent className="py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Input
                    placeholder="Search by Case ID, keyword, or street location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>
                <div>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Statuses' },
                      { value: 'submitted', label: 'Submitted (New)' },
                      { value: 'under-review', label: 'Under Review' },
                      { value: 'in-progress', label: 'In Progress' },
                      { value: 'resolved', label: 'Resolved' },
                      { value: 'rejected', label: 'Rejected' },
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cases List */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-sm text-slate-500">
                No matching records for your filter.
              </div>
            ) : (
              filtered.map((item) => (
                <Card key={item.id} className="hover:border-slate-300 transition-colors">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item.id}
                        </span>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-bold ${
                            item.urgency === 'Critical'
                              ? 'bg-rose-100 text-rose-800'
                              : item.urgency === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.urgency} Urgency
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-1">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.location} ({item.ward})
                        </span>
                        <span>•</span>
                        <span>Reported by {item.reporter}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                      <Badge variant={item.status} dot />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenUpdate(item)}
                        leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                      >
                        Update
                      </Button>
                    </div>
                  </CardHeader>

                  <CardFooter className="bg-slate-50/60 py-2.5 px-6 text-xs text-slate-600 justify-between">
                    <div>
                      <span className="font-semibold text-slate-700">Assigned Crew:</span>{' '}
                      <span className="text-slate-600">{item.assignedCrew}</span>
                    </div>
                    <div className="text-slate-400">Date: {item.date}</div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {/* Case Status Update Modal */}
      {selectedCase && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title={`Update Case ${selectedCase.id}`}
          description="Officer triage and status modification placeholder"
          footer={
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsUpdateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Save Updates (Mock)
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <div>
              <h5 className="font-semibold text-slate-900 text-sm">{selectedCase.title}</h5>
              <p className="text-xs text-slate-500">{selectedCase.location} • {selectedCase.category}</p>
            </div>

            <Select
              label="Update Workflow Status"
              defaultValue={selectedCase.status}
              options={[
                { value: 'submitted', label: 'Submitted (Unassigned)' },
                { value: 'under-review', label: 'Under Review / Inspection' },
                { value: 'in-progress', label: 'In Progress (Crew Dispatched)' },
                { value: 'resolved', label: 'Resolved (Work Completed)' },
                { value: 'rejected', label: 'Rejected (Out of Jurisdiction)' },
              ]}
            />

            <Select
              label="Assign Field Crew"
              defaultValue={selectedCase.assignedCrew || ''}
              options={[
                { value: 'Roads Repair Crew #4', label: 'Roads Repair Crew #4' },
                { value: 'Sanitation Unit B', label: 'Sanitation Unit B' },
                { value: 'Power & Grid Team #2', label: 'Power & Grid Team #2' },
                { value: 'Water Board Rapid Unit', label: 'Water Board Rapid Unit' },
              ]}
            />

            <Textarea
              label="Officer Action Notes"
              placeholder="e.g. Field inspection scheduled for 2:00 PM..."
              rows={3}
              helperText="Notes are logged for municipal audits and citizen status tracking."
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
