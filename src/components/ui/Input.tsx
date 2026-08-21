import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      error,
      id,
      leftIcon,
      rightIcon,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 select-none flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-rose-600 ml-1" aria-hidden="true">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            required={required}
            className={cn(
              'w-full rounded-md border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600',
              'disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed',
              error
                ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                : 'border-slate-300 hover:border-slate-400',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 text-slate-400 pointer-events-none flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-rose-600 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
