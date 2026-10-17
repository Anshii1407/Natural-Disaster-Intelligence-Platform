import express from 'express';
import {
  createAssessment,
  getLatestAssessments,
  getAssessmentHistory,
} from '../controllers/riskAssessment.controller.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/',
  requireFields(['disasterType', 'region', 'coordinates', 'riskLevel']),
  createAssessment
);
router.get('/latest', getLatestAssessments);
router.get('/history', getAssessmentHistory);

export default router;
