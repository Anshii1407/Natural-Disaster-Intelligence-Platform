import React from 'react';
import { LayoutDashboard, Shield, BellRing, FileCheck } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function GovernmentDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-electric font-semibold uppercase tracking-wider">
              Module 4
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-cool-white flex items-center gap-2.5">
            <LayoutDashboard className="w-7 h-7 text-electric shrink-0" aria-hidden="true" />
            Government Dashboard
          </h1>
          <p className="text-sm text-cool-muted mt-1 max-w-3xl leading-relaxed">
            Operational triage console for emergency management authorities to review citizen reports,
            validate hazard severities, and coordinate regional response directives.
          </p>
        </div>
      </div>

      {/* Planned Governance Operations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-navy-surface border border-navy-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cool-white text-sm font-semibold">
            <FileCheck className="w-4 h-4 text-teal-400" />
            <span>Report Triage & Verification</span>
          </div>
          <p className="text-xs text-cool-muted leading-relaxed">
            Review incoming citizen submissions, filter by region/severity, and mark as Verified or Dismissed.
          </p>
        </div>

        <div className="bg-navy-surface border border-navy-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cool-white text-sm font-semibold">
            <BellRing className="w-4 h-4 text-rose-400" />
            <span>Emergency Broadcasts</span>
          </div>
          <p className="text-xs text-cool-muted leading-relaxed">
            Draft and publish official regional advisories and severity warnings to the public portal.
          </p>
        </div>

        <div className="bg-navy-surface border border-navy-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cool-white text-sm font-semibold">
            <Shield className="w-4 h-4 text-electric" />
            <span>Agency Access Control</span>
          </div>
          <p className="text-xs text-cool-muted leading-relaxed">
            Role-based authentication (JWT) restricting administrative triage and broadcast privileges.
          </p>
        </div>
      </div>

      {/* Strict Empty State */}
      <EmptyState
        icon={LayoutDashboard}
        title="Authority Incident Queue Standalone (Phase 1)"
        description="The government response console is unattached to live databases. No emergency reports or active alerts are loaded. All metrics remain at initial zero state."
        badgeText="Zero Fabricated Statistics"
        badgeVariant="offline"
        details={[
          'Data Integrity: No fake casualty numbers, invented emergency alerts, or artificial response metrics.',
          'Database Sync: Real-time report stream will connect to MongoDB Atlas in Phase 5.',
          'Auth Gateway: JWT verification API on port 5000 required for official status modification.',
        ]}
      />
    </div>
  );
}
