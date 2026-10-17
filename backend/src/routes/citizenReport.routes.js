import express from 'express';
import {
  createReport,
  getPublicReports,
  getReportById,
} from '../controllers/citizenReport.controller.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.post('/', requireFields(['hazardType', 'coordinates', 'description']), createReport);
router.get('/public', getPublicReports);
router.get('/:id', getReportById);

export default router;
