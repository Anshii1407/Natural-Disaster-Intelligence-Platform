import React from 'react';
import { ClipboardList, Camera, MapPin, CheckCircle2 } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function CitizenReportingPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-electric font-semibold uppercase tracking-wider">
              Module 3
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-cool-white flex items-center gap-2.5">
            <ClipboardList className="w-7 h-7 text-electric shrink-0" aria-hidden="true" />
            Citizen Reporting
          </h1>
          <p className="text-sm text-cool-muted mt-1 max-w-3xl leading-relaxed">
            Standardized intake channel for eyewitness hazard reports, localized severity observations,
            and photographic evidence to support emergency verification.
          </p>
        </div>
      </div>

      {/* Planned Intake Workflow */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-navy-surface border border-navy-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cool-white text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>1. Hazard Classification</span>
          </div>
          <p className="text-xs text-cool-muted leading-relaxed">
            Categorize incident as Flood (rising water, blocked drains) or Heatwave (urban heat stress).
          </p>
        </div>

        <div className="bg-navy-surface border border-navy-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cool-white text-sm font-semibold">
            <MapPin className="w-4 h-4 text-electric" />
            <span>2. GPS Geo-tagging</span>
          </div>
          <p className="text-xs text-cool-muted leading-relaxed">
            Capture device GPS coordinates or select location on map for exact geospatial positioning.
          </p>
        </div>

        <div className="bg-navy-surface border border-navy-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cool-white text-sm font-semibold">
            <Camera className="w-4 h-4 text-indigo-400" />
            <span>3. Visual Verification</span>
          </div>
          <p className="text-xs text-cool-muted leading-relaxed">
            Submit photographic evidence directly to cloud storage for verification by disaster coordinators.
          </p>
        </div>
      </div>

      {/* Strict Empty State */}
      <EmptyState
        icon={ClipboardList}
        title="Report Submission Pipeline Inactive (Phase 1)"
        description="The citizen reporting form and media ingestion gateway will be constructed in Phase 4. Currently, no active field reports exist and form submission endpoints are unattached."
        badgeText="No Synthetic Incident Records"
        badgeVariant="offline"
        details={[
          'Data Integrity: No fake user submissions or artificial hazard reports are present.',
          'Backend Storage: MongoDB Atlas with GeoJSON indexing will store verified reports upon API integration.',
          'Media Storage: Cloudinary pipeline integration planned for ground-truth photos.',
        ]}
      />
    </div>
  );
}
