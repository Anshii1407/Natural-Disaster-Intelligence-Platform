import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-navy-surface border border-navy-border flex items-center justify-center text-electric">
        <Compass className="w-8 h-8 text-electric" />
      </div>
      <h1 className="text-2xl font-bold text-cool-white">404 - Page Not Found</h1>
      <p className="text-sm text-cool-muted max-w-md">
        The requested module or view does not exist within the Natural Disaster Intelligence Platform.
      </p>
      <Link
        to="/assessment"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-electric hover:bg-electric-hover text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Risk Assessment</span>
      </Link>
    </div>
  );
}
