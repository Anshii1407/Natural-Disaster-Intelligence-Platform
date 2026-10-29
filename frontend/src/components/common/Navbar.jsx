import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Activity,
  Map,
  ClipboardList,
  LayoutDashboard,
  ShieldAlert,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Shield,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useAuth } from '../../hooks/useAuth';

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
  const { user, isAuthenticated, isLoading, logout } = useAuth();

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

          {/* Auth Controls & System State Indicator */}
          <div className="hidden md:flex items-center gap-2.5">
            {isLoading ? (
              <div className="w-20 h-8 rounded-lg bg-navy-elevated animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-navy-border">
                {/* User Pill */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-navy-elevated/70 border border-navy-border text-xs">
                  <div className="w-5 h-5 rounded-md bg-electric/20 text-electric flex items-center justify-center font-semibold text-[10px]">
                    {user.role === 'ADMIN' ? (
                      <Shield className="w-3 h-3 text-amber-accent" />
                    ) : (
                      <User className="w-3 h-3 text-electric" />
                    )}
                  </div>
                  <span className="font-medium text-cool-white max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <StatusBadge
                    variant={user.role === 'ADMIN' ? 'moderate' : 'info'}
                    showDot={false}
                    className="text-[10px] px-1.5 py-0 uppercase"
                  >
                    {user.role}
                  </StatusBadge>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-cool-muted hover:text-rose-300 hover:bg-rose-500/10 border border-navy-border hover:border-rose-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  title="Sign out of your account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-navy-border">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cool-muted hover:text-cool-white hover:bg-navy-elevated border border-navy-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-electric hover:bg-electric-hover text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
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
        <div className="md:hidden border-t border-navy-border bg-navy-surface/95 px-4 pt-3 pb-4 space-y-2">
          {/* User Status Card in Mobile Menu */}
          {isAuthenticated && user && (
            <div className="p-3 rounded-xl bg-navy-elevated/70 border border-navy-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-electric/20 text-electric flex items-center justify-center font-bold text-xs">
                  {user.role === 'ADMIN' ? (
                    <Shield className="w-4 h-4 text-amber-accent" />
                  ) : (
                    <User className="w-4 h-4 text-electric" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-cool-white">{user.name}</span>
                  <span className="text-[11px] text-cool-muted truncate max-w-[180px]">
                    {user.email}
                  </span>
                </div>
              </div>
              <StatusBadge
                variant={user.role === 'ADMIN' ? 'moderate' : 'info'}
                showDot={false}
                className="text-[10px] uppercase font-mono"
              >
                {user.role}
              </StatusBadge>
            </div>
          )}

          {/* Nav links */}
          <div className="space-y-1">
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
          </div>

          {/* Auth Actions in Mobile */}
          <div className="pt-2 border-t border-navy-border/60">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-cool-muted hover:text-cool-white bg-navy-elevated border border-navy-border"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-electric hover:bg-electric-hover"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
