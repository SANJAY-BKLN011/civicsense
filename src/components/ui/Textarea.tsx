import React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      id,
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 select-none flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-rose-600 ml-1" aria-hidden="true">*</span>}
            </span>
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full rounded-md border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600',
            'disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed resize-y',
            error
              ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
              : 'border-slate-300 hover:border-slate-400',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />

        {error ? (
          <p id={`${textareaId}-error`} className="text-xs text-rose-600 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${textareaId}-helper`} className="text-xs text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
