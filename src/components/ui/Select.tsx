import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      id,
      options = [],
      placeholder,
      disabled,
      required,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 select-none flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-rose-600 ml-1" aria-hidden="true">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            className={cn(
              'w-full appearance-none rounded-md border bg-white px-3.5 py-2 pr-10 text-sm text-slate-900 transition-colors cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600',
              'disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed',
              error
                ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                : 'border-slate-300 hover:border-slate-400',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-slate-400">
                {placeholder}
              </option>
            )}
            {children
              ? children
              : options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))}
          </select>

          <div className="absolute right-3 text-slate-400 pointer-events-none flex items-center justify-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error ? (
          <p id={`${selectId}-error`} className="text-xs text-rose-600 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${selectId}-helper`} className="text-xs text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
