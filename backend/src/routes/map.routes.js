import express from 'express';
import { getMapLayers, getNearbyHazards } from '../controllers/map.controller.js';

const router = express.Router();

router.get('/layers', getMapLayers);
router.get('/nearby', getNearbyHazards);

export default router;
