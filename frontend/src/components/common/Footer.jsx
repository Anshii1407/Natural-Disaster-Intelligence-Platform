import React from 'react';
import { ShieldCheck, Cpu, Globe, Server } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-navy-border bg-navy-surface text-cool-muted text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Column 1: Platform Overview */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cool-white font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-electric" aria-hidden="true" />
              <span>Natural Disaster Intelligence Platform</span>
            </div>
            <p className="text-cool-muted leading-relaxed text-xs">
              An academic decision-support platform designed to model environmental risk vulnerabilities,
              coordinate geospatial visualization, and structure citizen reports.
            </p>
          </div>

          {/* Column 2: Data Integrity & Methodology */}
          <div className="space-y-2">
            <h4 className="text-cool-white font-medium text-xs uppercase tracking-wider">
              Methodology & Integrity Policy
            </h4>
            <p className="text-cool-muted leading-relaxed text-xs">
              Operating strictly on empirical and verified datasets. Synthetic disaster counts and fabricated
              risk scores are prohibited. Unintegrated modules explicitly present empty states until live pipelines
              are verified.
            </p>
          </div>

          {/* Column 3: Architecture Stack */}
          <div className="space-y-2">
            <h4 className="text-cool-white font-medium text-xs uppercase tracking-wider">
              System Architecture
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-cool-muted">
              <div className="flex items-center gap-1.5 bg-navy-base border border-navy-border rounded p-1.5">
                <Globe className="w-3.5 h-3.5 text-electric shrink-0" />
                <span>Frontend: React 19 + Tailwind</span>
              </div>
              <div className="flex items-center gap-1.5 bg-navy-base border border-navy-border rounded p-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Backend: Node/Express (Port 5000)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-navy-base border border-navy-border rounded p-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>AI Service: FastAPI (Port 8000)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-navy-base border border-navy-border rounded p-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-accent shrink-0" />
                <span>GIS: Leaflet / GeoJSON</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-navy-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-cool-faint text-[11px]">
          <p>
            &copy; {currentYear} Natural Disaster Intelligence Platform. Academic Research & Decision-Support Prototype.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-cool-muted font-mono">Phase 1: Frontend Foundation</span>
            <span>&bull;</span>
            <span className="text-amber-accent">Decision Support Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
