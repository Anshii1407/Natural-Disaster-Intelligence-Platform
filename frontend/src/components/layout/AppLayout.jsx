import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import DisclaimerBanner from '../common/DisclaimerBanner';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-base text-cool-white font-sans selection:bg-electric selection:text-white">
      {/* Top System Methodology & Data Integrity Notice */}
      <DisclaimerBanner variant="amber" />

      {/* Main Sticky Navbar */}
      <Navbar />

      {/* Primary Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Standard Footer */}
      <Footer />
    </div>
  );
}
