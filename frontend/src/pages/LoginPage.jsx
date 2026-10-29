import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import StatusBadge from '../components/common/StatusBadge';

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect away from login page
  if (isAuthenticated && user) {
    const fromPath = location.state?.from?.pathname || (user.role === 'ADMIN' ? '/dashboard' : '/assessment');
    return <Navigate to={fromPath} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

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

    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const authenticatedUser = await login(trimmedEmail, password);
      const destination = location.state?.from?.pathname || (authenticatedUser?.role === 'ADMIN' ? '/dashboard' : '/assessment');
      navigate(destination, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-electric/15 border border-electric/30 text-electric shadow-sm mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <StatusBadge variant="info">NDIP Access Portal</StatusBadge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-cool-white">
            Sign In to Platform
          </h1>
          <p className="text-xs sm:text-sm text-cool-muted max-w-sm mx-auto">
            Access disaster analytics, submit verified field reports, or manage regional coordination.
          </p>
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
                  placeholder="name@agency.gov or personal@domain.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-elevated/70 border border-navy-border text-cool-white placeholder:text-cool-faint/60 text-sm focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium uppercase tracking-wider text-cool-muted"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cool-faint">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  autoComplete="current-password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-electric hover:bg-electric-hover text-white text-sm font-semibold tracking-wide transition-all duration-150 shadow-md shadow-electric/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-navy-base disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Navigation Link */}
          <div className="pt-4 border-t border-navy-border/60 text-center text-xs text-cool-muted space-y-2">
            <p>
              Need access for public incident reporting?{' '}
              <Link
                to="/register"
                className="text-electric hover:text-electric-hover font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric rounded"
              >
                Register Citizen Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-cool-faint text-center">
          <ShieldCheck className="w-4 h-4 text-cool-muted" />
          <span>Protected by Rate Limiting and JWT Role Authorization</span>
        </div>
      </div>
    </div>
  );
}
