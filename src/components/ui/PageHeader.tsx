import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8 pb-6 border-b border-slate-200', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={index} className="flex items-center gap-1.5">
                  {crumb.href && !isLast ? (
                    <Link
                      to={crumb.href}
                      className="hover:text-blue-700 hover:underline transition-colors font-medium"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={cn(isLast ? 'text-slate-900 font-semibold' : '')}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Title & Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
