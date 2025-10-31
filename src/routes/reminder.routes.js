import express from 'express';
import { testReminder } from '../controllers/reminder.controller.js';

const router = express.Router();

router.get('/test', testReminder); // GET /api/reminders/test?type=monthly

export default router;
