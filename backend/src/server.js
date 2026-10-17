import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/db.js';

// Route imports strictly mapped to the 4 modules
import healthRoutes from './routes/health.routes.js';
import riskAssessmentRoutes from './routes/riskAssessment.routes.js';
import mapRoutes from './routes/map.routes.js';
import citizenReportRoutes from './routes/citizenReport.routes.js';
import governmentRoutes from './routes/government.routes.js';

// Middleware imports
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas (Graceful startup: continues running even if DB is offline)
connectDatabase();

// Global Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Module-Mapped API Routes
app.use('/api/health', healthRoutes);
app.use('/api/assessment', riskAssessmentRoutes); // Module 1: AI Disaster Risk Assessment
app.use('/api/map', mapRoutes);                   // Module 2: Interactive Disaster Map
app.use('/api/reports', citizenReportRoutes);     // Module 3: Citizen Reporting
app.use('/api/dashboard', governmentRoutes);      // Module 4: Government Dashboard

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

// Start Server
const server = app.listen(PORT, () => {
  console.log(`[Backend Service] Online and listening on port ${PORT}`);
  console.log(`[Backend Service] Health Check: http://localhost:${PORT}/api/health`);
  console.log(`[Backend Service] Architecture strictly aligned with the 4 approved modules.`);
});

export default app;
