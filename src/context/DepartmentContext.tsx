import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDepartmentsApi, type Department } from '../api/departments';
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

export const DEFAULT_MOCK_DEPARTMENTS: Department[] = CIVIC_DEPARTMENTS.filter(
  (d) => !d.value.includes('Other / Not Sure')
).map((d, index) => ({
  id: `dept-00${index + 1}`,
  name: d.value,
  code: `DEPT-${index + 1}`,
  description: `Municipal department managing ${d.value.toLowerCase()}.`,
}));

export function DepartmentProvider({ children }: { children: React.ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);

    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 200));
      setDepartments(DEFAULT_MOCK_DEPARTMENTS);
      setIsLoading(false);
      return;
    }

    const res = await getDepartmentsApi();
    if (res.success && res.data) {
      const dataList = Array.isArray(res.data) ? res.data : (res.data as any).departments || [];
      setDepartments(dataList.length > 0 ? dataList : DEFAULT_MOCK_DEPARTMENTS);
    } else {
      setError(
        res.error || 'Unable to load municipal departments from server. Please try again.'
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const getDepartmentName = (idOrName: string): string => {
    if (!idOrName) return 'Unassigned Department';
    const found = departments.find((d) => d.id === idOrName || d.name === idOrName);
    return found ? found.name : idOrName;
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
