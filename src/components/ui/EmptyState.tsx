import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'p-10 flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-slate-300 bg-white shadow-2xs',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h4 className="text-base font-semibold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500 mt-1.5 max-w-md">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
