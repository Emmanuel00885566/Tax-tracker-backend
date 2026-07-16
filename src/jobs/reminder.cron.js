import cron from 'node-cron';
import { sendMonthlyReminders, sendQuarterlyReminders } from '../services/reminder.service.js';

// Every 1st day of the month at 9:00 AM
cron.schedule('0 9 1 * *', async () => {
  
  await sendMonthlyReminders();
});

cron.schedule('0 9 1 */3 *', async () => {
  await sendQuarterlyReminders();
});

