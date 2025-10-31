import { sendMonthlyReminders, sendQuarterlyReminders } from '../services/reminder.service.js';

export async function testReminder(req, res) {
  try {
    const { type = 'monthly' } = req.query;

    if (type === 'monthly') {
      await sendMonthlyReminders();
    } else if (type === 'quarterly') {
      await sendQuarterlyReminders();
    } else {
      return res.status(400).json({ message: 'Invalid reminder type. Use monthly or quarterly.' });
    }

    res.status(200).json({ message: `${type} reminder triggered successfully.` });
  } catch (error) {
    console.error('❌ Reminder test error:', error);
    res.status(500).json({ message: 'Failed to send reminders', error: error.message });
  }
}
