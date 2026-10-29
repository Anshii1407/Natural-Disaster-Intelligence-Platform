import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from './StatusBadge';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 text-electric animate-spin" />
        <span className="text-xs font-mono text-cool-muted tracking-wider uppercase">
          Verifying Security Credentials...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <StatusBadge variant="alert">Access Restricted</StatusBadge>
            <StatusBadge variant="info">Role: {user.role}</StatusBadge>
          </div>
          <h2 className="text-2xl font-bold text-cool-white">
            Administrative Authorization Required
          </h2>
          <p className="text-sm text-cool-muted max-w-lg mx-auto leading-relaxed">
            Module 4 Government Dashboard is strictly restricted to designated emergency management
            authorities and response coordinators with <span className="text-cool-white font-medium">ADMIN</span> credentials.
            Public accounts with Citizen status cannot access triage, verification, or broadcast tools.
          </p>
        </div>

        <div className="bg-navy-surface border border-navy-border rounded-xl p-4 text-xs text-cool-muted text-left space-y-1 max-w-md mx-auto">
          <p className="font-semibold text-cool-white">Account Details</p>
          <p><span className="text-cool-faint">Name:</span> {user.name}</p>
          <p><span className="text-cool-faint">Email:</span> {user.email}</p>
          <p><span className="text-cool-faint">Access Level:</span> Verified Public Citizen</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-electric hover:bg-electric-hover text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Risk Assessment</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-elevated hover:bg-navy-surface border border-navy-border text-cool-muted hover:text-cool-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out & Switch Account</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
}
