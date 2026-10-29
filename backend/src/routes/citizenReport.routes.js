import express from 'express';
import {
  createReport,
  getPublicReports,
  getReportById,
} from '../controllers/citizenReport.controller.js';
import { requireFields } from '../middleware/validate.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  optionalAuthenticate,
  requireFields(['hazardType', 'coordinates', 'description']),
  createReport
);
router.get('/public', getPublicReports);
router.get('/:id', getReportById);

export default router;
