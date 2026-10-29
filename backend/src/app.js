import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Route imports
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import riskAssessmentRoutes from './routes/riskAssessment.routes.js';
import mapRoutes from './routes/map.routes.js';
import citizenReportRoutes from './routes/citizenReport.routes.js';
import governmentRoutes from './routes/government.routes.js';

// Middleware imports
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Global Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// API Route Endpoints
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);                   // Phase 3: Auth & RBAC
app.use('/api/assessment', riskAssessmentRoutes);   // Module 1: AI Disaster Risk Assessment
app.use('/api/map', mapRoutes);                     // Module 2: Interactive Disaster Map
app.use('/api/reports', citizenReportRoutes);       // Module 3: Citizen Reporting
app.use('/api/dashboard', governmentRoutes);        // Module 4: Government Dashboard

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint Not Found',
    path: req.originalUrl,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
