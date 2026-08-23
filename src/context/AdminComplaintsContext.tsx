import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  mockAdminComplaints,
  mockAdminOfficers,
  type AdminComplaint,
  type AdminOfficer,
} from '../data/mockAdminData';
import type { BadgeVariant } from '../components/ui';

const ADMIN_STORAGE_KEY = 'civicsense_admin_complaints_v1';

interface AdminComplaintsContextType {
  complaints: AdminComplaint[];
  officers: AdminOfficer[];
  getComplaint: (id: string) => AdminComplaint | undefined;
  addComplaint: (newComplaint: AdminComplaint) => void;
  assignOfficer: (complaintId: string, officerId: string) => void;
  changeDepartment: (complaintId: string, newDept: string) => void;
  changePriority: (complaintId: string, newPriority: 'Low' | 'Medium' | 'High' | 'Critical') => void;
  changeStatus: (complaintId: string, newStatus: BadgeVariant) => void;
  resetToMockData: () => void;
}

const AdminComplaintsContext = createContext<AdminComplaintsContextType | undefined>(undefined);

export const AdminComplaintsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<AdminComplaint[]>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return mockAdminComplaints;
  });

  const [officers] = useState<AdminOfficer[]>(mockAdminOfficers);

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.warn('Failed to save admin complaints to localStorage', e);
    }
  }, [complaints]);

  const getComplaint = (id: string): AdminComplaint | undefined => {
    const normalized = id.trim().toUpperCase();
    return complaints.find((c) => c.id.toUpperCase() === normalized);
  };

  const addComplaint = (newComplaint: AdminComplaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const assignOfficer = (complaintId: string, officerId: string) => {
    const targetOfficer = officers.find((o) => o.id === officerId);
    const officerName = targetOfficer ? targetOfficer.name : 'Assigned Officer';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id.toUpperCase() === complaintId.toUpperCase()) {
          return {
            ...c,
            assignedOfficer: officerName,
            assignedOfficerId: officerId,
            status: c.status === 'NEW' ? 'ASSIGNED' : c.status,
          };
        }
        return c;
      })
    );
  };

  const changeDepartment = (complaintId: string, newDept: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id.toUpperCase() === complaintId.toUpperCase() ? { ...c, department: newDept } : c))
    );
  };

  const changePriority = (
    complaintId: string,
    newPriority: 'Low' | 'Medium' | 'High' | 'Critical'
  ) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id.toUpperCase() === complaintId.toUpperCase() ? { ...c, priority: newPriority } : c))
    );
  };

  const changeStatus = (complaintId: string, newStatus: BadgeVariant) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id.toUpperCase() === complaintId.toUpperCase() ? { ...c, status: newStatus } : c))
    );
  };

  const resetToMockData = () => {
    setComplaints(mockAdminComplaints);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  return (
    <AdminComplaintsContext.Provider
      value={{
        complaints,
        officers,
        getComplaint,
        addComplaint,
        assignOfficer,
        changeDepartment,
        changePriority,
        changeStatus,
        resetToMockData,
      }}
    >
      {children}
    </AdminComplaintsContext.Provider>
  );
};

export const useAdminComplaints = () => {
  const context = useContext(AdminComplaintsContext);
  if (!context) {
    throw new Error('useAdminComplaints must be used within an AdminComplaintsProvider');
  }
  return context;
};
