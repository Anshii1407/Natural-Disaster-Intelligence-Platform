import express from 'express';
import { getDatabaseStatus } from '../config/db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const dbStatus = getDatabaseStatus();

  res.status(200).json({
    status: 'ok',
    service: 'Backend Service (Express.js)',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus.status,
      connected: dbStatus.isConnected,
      host: dbStatus.host,
      databaseName: dbStatus.name,
    },
    modules: {
      riskAssessment: 'online',
      disasterMap: 'online',
      citizenReporting: 'online',
      governmentDashboard: 'online',
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
