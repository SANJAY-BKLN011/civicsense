import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary:
        'bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-600 shadow-sm border border-transparent',
      secondary:
        'bg-slate-800 text-white hover:bg-slate-900 focus-visible:ring-slate-700 shadow-sm border border-transparent',
      outline:
        'bg-white text-slate-750 border border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-blue-600 shadow-xs',
      danger:
        'bg-rose-700 text-white hover:bg-rose-800 focus-visible:ring-rose-600 shadow-sm border border-transparent',
      ghost:
        'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
