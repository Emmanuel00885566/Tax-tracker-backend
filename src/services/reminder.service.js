import { sendEmail } from './email.service.js';
import { sendMockSMS } from './sms.service.js';
import  User  from '../models/user.model.js';

export async function sendMonthlyReminders() {
  const users = await User.findAll();
  const subject = '📅 Monthly Tax Reminder';
  const message = 'Hi there! This is your monthly reminder to review and file your taxes via TaxBuddy.';

  for (const user of users) {
    if (user.email) await sendEmail(user.email, subject, message);
    if (user.phone) sendMockSMS(user.phone, message);
  }
}

export async function sendQuarterlyReminders() {
  const users = await User.findAll();
  const subject = '📊 Quarterly Tax Filing Reminder';
  const message = 'Hello! It’s time for your quarterly tax computation and filing. Visit your dashboard on TaxBuddy.';

  for (const user of users) {
    if (user.email) await sendEmail(user.email, subject, message);
    if (user.phone) sendMockSMS(user.phone, message);
  }
}
