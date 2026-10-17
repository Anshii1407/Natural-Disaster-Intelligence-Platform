import React from 'react';
import { Activity, Droplets, Flame, Cpu } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function RiskAssessmentPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-electric font-semibold uppercase tracking-wider">
              Module 1
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-cool-white flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-electric shrink-0" aria-hidden="true" />
            AI Disaster Risk Assessment
          </h1>
          <p className="text-sm text-cool-muted mt-1 max-w-3xl leading-relaxed">
            Multi-parameter environmental vulnerability modeling for flood and heatwave hazard risks.
            Evaluates historical indicators to compute categorical risk tiers.
          </p>
        </div>
      </div>

      {/* Planned Model Scope Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Flood Risk Card */}
        <div className="bg-navy-surface border border-navy-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cool-white font-semibold text-base">
              <div className="w-8 h-8 rounded-lg bg-electric/15 border border-electric/30 flex items-center justify-center text-electric">
                <Droplets className="w-4 h-4" />
              </div>
              <span>Flood Risk Assessment</span>
            </div>
          </div>
          <p className="text-xs text-cool-muted leading-relaxed">
            Planned model features: 24h/72h Cumulative Rainfall (mm), River Gauge Level (m),
            Topographic Elevation (m), and Soil Moisture Saturation (%).
          </p>
          <div className="pt-2 border-t border-navy-border flex items-center justify-between text-xs text-cool-faint font-mono">
            <span>Target: FastAPI / Port 8000</span>
            <span>Algorithm: Random Forest</span>
          </div>
        </div>

        {/* Heatwave Risk Card */}
        <div className="bg-navy-surface border border-navy-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cool-white font-semibold text-base">
              <div className="w-8 h-8 rounded-lg bg-amber-accent/15 border border-amber-accent/30 flex items-center justify-center text-amber-accent">
                <Flame className="w-4 h-4" />
              </div>
              <span>Heatwave Risk Assessment</span>
            </div>
          </div>
          <p className="text-xs text-cool-muted leading-relaxed">
            Planned model features: Maximum Ambient Temperature (&deg;C), Relative Humidity (%),
            Wind Velocity (km/h), and Consecutive Heat Index Duration (days).
          </p>
          <div className="pt-2 border-t border-navy-border flex items-center justify-between text-xs text-cool-faint font-mono">
            <span>Target: FastAPI / Port 8000</span>
            <span>Algorithm: Random Forest</span>
          </div>
        </div>
      </div>

      {/* Strict Empty State */}
      <EmptyState
        icon={Cpu}
        title="Assessment Service Standalone (Phase 1)"
        description="No environmental observations have been submitted for evaluation. Risk calculation forms and AI microservice endpoints are scheduled for subsequent implementation phases."
        badgeText="No Fabricated Scores"
        badgeVariant="offline"
        details={[
          'Data Integrity: No synthetic risk percentages, probabilities, or simulated forecasts are displayed.',
          'Model Connection: Python/FastAPI microservice integration will be established after frontend forms are validated.',
          'Decision Support: Risk levels reflect environmental indicators only; they do not guarantee timing or disaster certainty.',
        ]}
      />
    </div>
  );
}
