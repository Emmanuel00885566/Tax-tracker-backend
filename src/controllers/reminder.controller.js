import { sendMonthlyReminders, sendQuarterlyReminders } from '../services/reminder.service.js';
import Reminder from '../models/reminder.model.js'; 

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

export async function getUserReminders(req, res) {
  try {
    const { userId } = req.params;
    const reminders = await Reminder.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'User reminders fetched successfully',
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    console.error('❌ Error fetching user reminders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
