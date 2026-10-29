import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import StatusBadge from '../components/common/StatusBadge';

export default function RegisterPage() {
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect away from register page
  if (isAuthenticated && user) {
    const fromPath = location.state?.from?.pathname || (user.role === 'ADMIN' ? '/dashboard' : '/assessment');
    return <Navigate to={fromPath} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setFormError('Please enter your full name (at least 2 characters).');
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFormError('Please provide a valid email format.');
      return;
    }

    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(trimmedName, trimmedEmail, password);
      // New citizen accounts can immediately access reporting or assessment
      navigate('/report', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-10">
      <div className="w-full max-w-md space-y-6">
        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-electric/15 border border-electric/30 text-electric shadow-sm mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <StatusBadge variant="info">Verified Citizen Intake</StatusBadge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-cool-white">
            Create Citizen Account
          </h1>
          <p className="text-xs sm:text-sm text-cool-muted max-w-sm mx-auto">
            Register to submit verified eyewitness hazard reports and receive localized disaster advisories.
          </p>
        </div>

        {/* Public Citizen Notice */}
        <div className="bg-navy-surface border border-navy-border/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-cool-muted">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="text-cool-white font-medium">Public Access Level:</span> Registration creates a
            standard <span className="text-teal-300 font-semibold">CITIZEN</span> account. Agency administrative
            privileges (ADMIN) require official credential provisioning.
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-navy-surface border border-navy-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
          {formError && (
            <div
              role="alert"
              className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <div className="flex-1 leading-snug">{formError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-xs font-medium uppercase tracking-wider text-cool-muted"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cool-faint">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  disabled={isSubmitting}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-elevated/70 border border-navy-border text-cool-white placeholder:text-cool-faint/60 text-sm focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wider text-cool-muted"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cool-faint">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-elevated/70 border border-navy-border text-cool-white placeholder:text-cool-faint/60 text-sm focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-wider text-cool-muted"
                >
                  Password
                </label>
                <span className="text-[11px] text-cool-faint font-mono">Min 6 characters</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cool-faint">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-elevated/70 border border-navy-border text-cool-white placeholder:text-cool-faint/60 text-sm focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric transition-colors disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-cool-faint hover:text-cool-muted focus:outline-none focus-visible:text-electric"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-medium uppercase tracking-wider text-cool-muted"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cool-faint">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-elevated/70 border border-navy-border text-cool-white placeholder:text-cool-faint/60 text-sm focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-electric hover:bg-electric-hover text-white text-sm font-semibold tracking-wide transition-all duration-150 shadow-md shadow-electric/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-navy-base disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Citizen Account</span>
                </>
              )}
            </button>
          </form>

          {/* Login Navigation Link */}
          <div className="pt-4 border-t border-navy-border/60 text-center text-xs text-cool-muted space-y-2">
            <p>
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-electric hover:text-electric-hover font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric rounded"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-cool-faint text-center">
          <ShieldCheck className="w-4 h-4 text-cool-muted" />
          <span>Strict Role Isolation: Public Accounts Default to Citizen</span>
        </div>
      </div>
    </div>
  );
}
