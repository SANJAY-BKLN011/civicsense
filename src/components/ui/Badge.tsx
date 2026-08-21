import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant =
  | 'submitted'
  | 'in-progress'
  | 'under-review'
  | 'resolved'
  | 'rejected'
  | 'neutral'
  | 'NEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; dot: string; label: string }> = {
  submitted: {
    bg: 'bg-sky-50 text-sky-800 border-sky-200',
    dot: 'bg-sky-500',
    label: 'Submitted',
  },
  NEW: {
    bg: 'bg-blue-50 text-blue-800 border-blue-200 font-semibold',
    dot: 'bg-blue-600',
    label: 'NEW',
  },
  ASSIGNED: {
    bg: 'bg-purple-50 text-purple-800 border-purple-200 font-semibold',
    dot: 'bg-purple-600',
    label: 'ASSIGNED',
  },
  'in-progress': {
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    label: 'In Progress',
  },
  IN_PROGRESS: {
    bg: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold',
    dot: 'bg-amber-600',
    label: 'IN PROGRESS',
  },
  'under-review': {
    bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    dot: 'bg-indigo-500',
    label: 'Under Review',
  },
  resolved: {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Resolved',
  },
  RESOLVED: {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
    dot: 'bg-emerald-600',
    label: 'RESOLVED',
  },
  rejected: {
    bg: 'bg-rose-50 text-rose-800 border-rose-200',
    dot: 'bg-rose-500',
    label: 'Rejected',
  },
  neutral: {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    label: 'Neutral',
  },
};

export function Badge({
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const config = variantStyles[variant] || variantStyles.neutral;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border',
        config.bg,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)}
          aria-hidden="true"
        />
      )}
      <span>{children || config.label}</span>
    </span>
  );
}
