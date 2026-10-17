import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  Map,
  ClipboardList,
  LayoutDashboard,
  ShieldAlert,
  Menu,
  X,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const NAV_ITEMS = [
  {
    name: 'Risk Assessment',
    path: '/assessment',
    icon: Activity,
    badge: 'Module 1',
  },
  {
    name: 'Disaster Map',
    path: '/map',
    icon: Map,
    badge: 'Module 2',
  },
  {
    name: 'Citizen Reporting',
    path: '/report',
    icon: ClipboardList,
    badge: 'Module 3',
  },
  {
    name: 'Gov Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    badge: 'Module 4',
  },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-navy-surface/90 backdrop-blur-md border-b border-navy-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <NavLink
              to="/assessment"
              className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric p-1 -m-1"
              aria-label="Natural Disaster Intelligence Platform Home"
            >
              <div className="w-9 h-9 rounded-xl bg-electric/15 border border-electric/30 flex items-center justify-center text-electric shadow-sm">
                <ShieldAlert className="w-5 h-5 text-electric" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base tracking-tight text-cool-white leading-tight">
                  NDIP
                </span>
                <span className="text-[10px] text-cool-muted hidden sm:inline-block tracking-wider uppercase font-medium">
                  Disaster Intelligence Platform
                </span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 lg:gap-2"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric ${
                      isActive
                        ? 'bg-electric/15 text-electric border border-electric/30 shadow-sm'
                        : 'text-cool-muted hover:text-cool-white hover:bg-navy-elevated border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Environment / System State Indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <StatusBadge variant="info" showDot={true}>
              Frontend Prototype
            </StatusBadge>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-cool-muted hover:text-cool-white hover:bg-navy-elevated border border-navy-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-navy-border bg-navy-surface/95 px-4 pt-3 pb-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-electric/20 text-electric border border-electric/30'
                      : 'text-cool-muted hover:text-cool-white hover:bg-navy-elevated'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </div>
                <span className="text-[11px] text-cool-faint font-mono">
                  {item.badge}
                </span>
              </NavLink>
            );
          })}

          <div className="pt-3 border-t border-navy-border/60 flex items-center justify-between px-3">
            <span className="text-xs text-cool-muted">System State</span>
            <StatusBadge variant="info">Frontend Prototype</StatusBadge>
          </div>
        </div>
      )}
    </header>
  );
}
