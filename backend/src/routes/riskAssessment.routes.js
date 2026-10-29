import express from 'express';
import {
  createAssessment,
  getLatestAssessments,
  getAssessmentHistory,
} from '../controllers/riskAssessment.controller.js';
import { requireFields } from '../middleware/validate.js';
import { authenticateInternalOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Risk assessment ingestion requires authorized AI internal service or NDIP ADMIN
router.post(
  '/',
  authenticateInternalOrAdmin,
  requireFields(['disasterType', 'region', 'coordinates', 'riskLevel']),
  createAssessment
);
router.get('/latest', getLatestAssessments);
router.get('/history', getAssessmentHistory);

export default router;
