import React from 'react';

const VARIANTS = {
  offline: {
    bg: 'bg-navy-elevated/80',
    border: 'border-navy-border',
    text: 'text-cool-muted',
    dot: 'bg-cool-faint',
  },
  pending: {
    bg: 'bg-amber-accent/10',
    border: 'border-amber-accent/30',
    text: 'text-amber-accent',
    dot: 'bg-amber-accent',
  },
  verified: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
  active: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
  alert: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-300',
    dot: 'bg-rose-400',
  },
  info: {
    bg: 'bg-electric/10',
    border: 'border-electric/30',
    text: 'text-electric',
    dot: 'bg-electric',
  },
  low: {
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/30',
    text: 'text-teal-300',
    dot: 'bg-teal-400',
  },
  moderate: {
    bg: 'bg-amber-accent/10',
    border: 'border-amber-accent/30',
    text: 'text-amber-accent',
    dot: 'bg-amber-accent',
  },
  high: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-300',
    dot: 'bg-orange-400',
  },
  severe: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-300',
    dot: 'bg-red-400',
  },
};

export default function StatusBadge({
  children,
  variant = 'offline',
  showDot = true,
  pulse = false,
  className = '',
}) {
  const currentVariant = VARIANTS[variant] || VARIANTS.offline;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentVariant.bg} ${currentVariant.border} ${currentVariant.text} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentVariant.dot} ${
            pulse ? 'animate-pulse' : ''
          }`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
