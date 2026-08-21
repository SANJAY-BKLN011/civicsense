import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ErrorSeverity = 'error' | 'warning' | 'info' | 'success';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  severity?: ErrorSeverity;
  onDismiss?: () => void;
  className?: string;
}

const severityConfig: Record<
  ErrorSeverity,
  { bg: string; border: string; text: string; icon: React.ReactNode }
> = {
  error: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-900',
    icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-900',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
  },
};

export function ErrorMessage({
  title,
  message,
  severity = 'error',
  onDismiss,
  className,
}: ErrorMessageProps) {
  const config = severityConfig[severity];

  return (
    <div
      role="alert"
      className={cn(
        'rounded-md border p-4 flex items-start gap-3 text-left transition-all',
        config.bg,
        config.border,
        className
      )}
    >
      {config.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className={cn('text-sm font-semibold mb-0.5', config.text)}>
            {title}
          </h5>
        )}
        <p className={cn('text-sm leading-relaxed', config.text)}>{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 rounded p-1 -mr-1 -mt-1 cursor-pointer transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
