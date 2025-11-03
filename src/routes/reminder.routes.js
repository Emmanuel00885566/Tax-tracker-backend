import express from 'express';
import { testReminder } from '../controllers/reminder.controller.js';

const router = express.Router();

router.get('/test', testReminder); 

export default router;