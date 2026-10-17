import express from 'express';
import {
  getDashboardSummary,
  getAllReportsForTriage,
  updateReportStatus,
  createAlert,
  getActiveAlerts,
  cancelAlert,
} from '../controllers/government.controller.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.get('/summary', getDashboardSummary);
router.get('/reports', getAllReportsForTriage);
router.patch('/reports/:id/status', requireFields(['status']), updateReportStatus);
router.post(
  '/alerts',
  requireFields(['title', 'description', 'disasterType', 'severity', 'affectedArea', 'expiresAt']),
  createAlert
);
router.get('/alerts', getActiveAlerts);
router.patch('/alerts/:id/cancel', cancelAlert);

export default router;
