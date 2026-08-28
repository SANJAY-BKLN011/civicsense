import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDepartments, type Department } from '../api/departments';
import { USE_MOCK_DATA } from '../api/client';
import { CIVIC_DEPARTMENTS } from '../constants/departments';

interface DepartmentContextType {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  refetchDepartments: () => Promise<void>;
  getDepartmentName: (idOrName: string) => string;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

/** Existing frontend mock list, used only when demo/mock mode is explicitly enabled. */
export const DEFAULT_MOCK_DEPARTMENTS: Department[] = CIVIC_DEPARTMENTS
  .filter((d) => !d.value.includes('Other / Not Sure'))
  .map((d, index) => ({
    id: `dept-00${index + 1}`,
    name: d.value,
    code: `DEPT-${index + 1}`,
    description: `Municipal department managing ${d.value.toLowerCase()}.`,
  }));

const DEPARTMENT_LOAD_ERROR = 'Unable to load departments. Please try again.';

export function DepartmentProvider({ children }: { children: React.ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);

    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setDepartments(DEFAULT_MOCK_DEPARTMENTS);
      setIsLoading(false);
      return;
    }

    const result = await getDepartments();

    if (result.success && result.data) {
      const backendDepartments = Array.isArray(result.data) ? result.data : [];
      setDepartments(backendDepartments);
      if (backendDepartments.length === 0) {
        setError(null);
      }
    } else {
      // Important: never substitute mock data in real backend mode.
      setDepartments([]);
      setError(DEPARTMENT_LOAD_ERROR);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    void fetchDepartments();
  }, []);

  const getDepartmentName = (idOrName: any): string => {
    if (!idOrName) return 'Unassigned Department';
    if (typeof idOrName === 'object') {
      return typeof idOrName.name === 'string' ? idOrName.name : typeof idOrName.title === 'string' ? idOrName.title : 'Unassigned Department';
    }
    const target = String(idOrName);
    const found = departments.find((department) =>
      String(department.id) === target || String(department.name) === target
    );
    return found ? String(found.name) : target;
  };

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        isLoading,
        error,
        refetchDepartments: fetchDepartments,
        getDepartmentName,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartments() {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartments must be used within a DepartmentProvider');
  }
  return context;
}
