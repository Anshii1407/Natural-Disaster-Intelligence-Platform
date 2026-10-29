import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';
import authLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, requireFields(['name', 'email', 'password']), register);
router.post('/login', authLimiter, requireFields(['email', 'password']), login);
router.get('/me', authenticate, getMe);

export default router;
