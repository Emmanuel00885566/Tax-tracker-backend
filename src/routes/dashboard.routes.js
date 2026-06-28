import express from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/summary/:userId', verifyToken, getDashboardSummary);

export default router;