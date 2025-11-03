import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { testReminder, getUserReminders } from '../controllers/reminder.controller.js';

const router = express.Router();

router.get('/test', testReminder);

router.get('/:userId', verifyToken, getUserReminders);

export default router;
