import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockOfficerComplaints, type OfficerComplaintData, type TimelineEntry } from '../data/mockOfficerComplaints';
import type { BadgeVariant } from '../components/ui';

const STORAGE_KEY = 'civicsense_officer_complaints_v1';

interface OfficerComplaintsContextType {
  complaints: OfficerComplaintData[];
  getComplaint: (id: string) => OfficerComplaintData | undefined;
  addComplaint: (newComplaint: OfficerComplaintData) => void;
  updateStatus: (id: string, newStatus: BadgeVariant) => void;
  addProgressNote: (id: string, noteText: string, officerName?: string) => void;
  resolveComplaint: (
    id: string,
    resolutionNote: string,
    photoPreview?: string,
    officerName?: string
  ) => void;
  resetToDefault: () => void;
}

const OfficerComplaintsContext = createContext<OfficerComplaintsContextType | undefined>(undefined);

export const OfficerComplaintsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<OfficerComplaintData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return mockOfficerComplaints;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.warn('Failed to save officer complaints to localStorage', e);
    }
  }, [complaints]);

  const getComplaint = (id: string): OfficerComplaintData | undefined => {
    const normalized = id.trim().toUpperCase();
    return complaints.find((c) => c.id.toUpperCase() === normalized);
  };

  const addComplaint = (newComplaint: OfficerComplaintData) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const updateStatus = (id: string, newStatus: BadgeVariant) => {
    const now = new Date();
    const formattedTimestamp = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id.toUpperCase() === id.toUpperCase()) {
          const newEntry: TimelineEntry = {
            id: `tl-status-${Date.now()}`,
            timestamp: formattedTimestamp,
            title: `Status Changed to ${newStatus}`,
            description: `Officer updated case status from ${c.status} to ${newStatus}.`,
            author: 'Officer Sanjay Kumar',
            type: 'status_change',
          };
          return {
            ...c,
            status: newStatus,
            timeline: [newEntry, ...c.timeline],
          };
        }
        return c;
      })
    );
  };

  const addProgressNote = (id: string, noteText: string, officerName: string = 'Officer Sanjay Kumar') => {
    const now = new Date();
    const formattedTimestamp = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id.toUpperCase() === id.toUpperCase()) {
          const newEntry: TimelineEntry = {
            id: `tl-note-${Date.now()}`,
            timestamp: formattedTimestamp,
            title: 'Progress Update Note',
            description: noteText,
            author: officerName,
            type: 'note',
          };
          return {
            ...c,
            timeline: [newEntry, ...c.timeline],
          };
        }
        return c;
      })
    );
  };

  const resolveComplaint = (
    id: string,
    resolutionNote: string,
    photoPreview?: string,
    officerName: string = 'Officer Sanjay Kumar'
  ) => {
    const now = new Date();
    const resolvedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const resolvedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formattedTimestamp = `${resolvedDate} at ${resolvedTime}`;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id.toUpperCase() === id.toUpperCase()) {
          const newEntry: TimelineEntry = {
            id: `tl-res-${Date.now()}`,
            timestamp: formattedTimestamp,
            title: 'Issue Resolved & Case Closed',
            description: resolutionNote,
            author: officerName,
            type: 'resolution',
          };
          return {
            ...c,
            status: 'RESOLVED',
            resolution: {
              resolvedDate,
              resolvedTime,
              officerName,
              note: resolutionNote,
              photoPreview,
            },
            timeline: [newEntry, ...c.timeline],
          };
        }
        return c;
      })
    );
  };

  const resetToDefault = () => {
    setComplaints(mockOfficerComplaints);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <OfficerComplaintsContext.Provider
      value={{
        complaints,
        getComplaint,
        addComplaint,
        updateStatus,
        addProgressNote,
        resolveComplaint,
        resetToDefault,
      }}
    >
      {children}
    </OfficerComplaintsContext.Provider>
  );
};

export const useOfficerComplaints = () => {
  const context = useContext(OfficerComplaintsContext);
  if (!context) {
    throw new Error('useOfficerComplaints must be used within an OfficerComplaintsProvider');
  }
  return context;
};
