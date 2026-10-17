import React from 'react';
import { Database, ShieldAlert } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function EmptyState({
  icon: Icon = Database,
  title = 'No Data Available',
  description = 'There are currently no active records or verified observations available for this view.',
  badgeText,
  badgeVariant = 'offline',
  details = [],
  action,
  className = '',
}) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-navy-surface/80 border border-navy-border shadow-inner ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-navy-elevated border border-navy-border flex items-center justify-center text-electric mb-4 shadow-sm">
        <Icon className="w-7 h-7 text-electric" aria-hidden="true" />
      </div>

      {badgeText && (
        <div className="mb-3">
          <StatusBadge variant={badgeVariant}>{badgeText}</StatusBadge>
        </div>
      )}

      <h3 className="text-lg font-semibold text-cool-white tracking-tight mb-2">
        {title}
      </h3>

      <p className="max-w-md text-sm text-cool-muted leading-relaxed mb-4">
        {description}
      </p>

      {details.length > 0 && (
        <div className="w-full max-w-md bg-navy-base/90 border border-navy-border rounded-xl p-3.5 mb-5 text-left text-xs text-cool-muted space-y-1.5">
          <div className="flex items-center gap-1.5 font-medium text-cool-white pb-1.5 border-b border-navy-border/80">
            <ShieldAlert className="w-3.5 h-3.5 text-electric" aria-hidden="true" />
            <span>Data Integrity & System State</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-cool-muted pl-1">
            {details.map((item, idx) => (
              <li key={idx} className="leading-normal">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
