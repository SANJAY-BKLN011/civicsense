import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function Spinner({
  size = 'md',
  label = 'Loading...',
  className,
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={cn('inline-flex flex-col items-center justify-center gap-2 text-slate-500', className)}
      role="status"
      aria-label={label}
      {...props}
    >
      <Loader2 className={cn('animate-spin text-blue-700', sizeClasses[size])} />
      {label && <span className="text-xs text-slate-500 font-medium">{label}</span>}
    </div>
  );
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
}

export function Skeleton({
  variant = 'rect',
  className,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    rect: 'rounded-md',
    circle: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200/80',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingState({
  title = 'Loading records...',
  description = 'Please wait while we fetch the latest civic updates.',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'p-12 flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50',
        className
      )}
    >
      <Loader2 className="w-8 h-8 animate-spin text-blue-700 mb-3" />
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      {description && <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>}
    </div>
  );
}
