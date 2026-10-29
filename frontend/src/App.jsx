import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import RiskAssessmentPage from './pages/RiskAssessmentPage';
import DisasterMapPage from './pages/DisasterMapPage';
import CitizenReportingPage from './pages/CitizenReportingPage';
import GovernmentDashboardPage from './pages/GovernmentDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/assessment" replace />} />
            <Route path="assessment" element={<RiskAssessmentPage />} />
            <Route path="map" element={<DisasterMapPage />} />
            <Route path="report" element={<CitizenReportingPage />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <GovernmentDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
