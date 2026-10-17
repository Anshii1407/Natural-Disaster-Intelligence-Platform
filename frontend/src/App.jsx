import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import RiskAssessmentPage from './pages/RiskAssessmentPage';
import DisasterMapPage from './pages/DisasterMapPage';
import CitizenReportingPage from './pages/CitizenReportingPage';
import GovernmentDashboardPage from './pages/GovernmentDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/assessment" replace />} />
          <Route path="assessment" element={<RiskAssessmentPage />} />
          <Route path="map" element={<DisasterMapPage />} />
          <Route path="report" element={<CitizenReportingPage />} />
          <Route path="dashboard" element={<GovernmentDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
