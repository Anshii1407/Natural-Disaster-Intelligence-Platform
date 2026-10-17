import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export default function DisclaimerBanner({ variant = 'amber' }) {
  const isAmber = variant === 'amber';

  return (
    <aside
      aria-label="System Methodology and Data Integrity Notice"
      className={`border-b text-xs transition-colors ${
        isAmber
          ? 'bg-navy-surface/95 border-amber-accent/30 text-cool-muted'
          : 'bg-navy-surface/95 border-electric/30 text-cool-muted'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {isAmber ? (
            <AlertTriangle className="w-4 h-4 text-amber-accent" aria-hidden="true" />
          ) : (
            <Info className="w-4 h-4 text-electric" aria-hidden="true" />
          )}
        </div>
        <div className="flex-1 leading-relaxed text-xs">
          <span
            className={`font-semibold uppercase tracking-wider text-[11px] mr-1.5 inline-block ${
              isAmber ? 'text-amber-accent' : 'text-electric'
            }`}
          >
            System Notice:
          </span>
          <span>
            This platform operates as an environmental{' '}
            <strong className="text-cool-white font-medium">risk assessment and decision-support prototype</strong>.
            It evaluates multi-parameter vulnerability patterns and does{' '}
            <strong className="text-cool-white font-medium">not</strong> provide guaranteed disaster
            predictions, exact event timing, or automated rescue guarantees. All metrics remain in inactive/empty state
            until verified live sensor or authority feeds are connected.
          </span>
        </div>
      </div>
    </aside>
  );
}
