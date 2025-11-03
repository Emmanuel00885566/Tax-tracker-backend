import { sendEmail } from './email.service.js';
import { sendMockSMS } from './sms.service.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import { getUserTaxSummary } from './tax.summary.service.js';

function buildReminderMessage(user, type) {
  const summary = getUserTaxSummary(user); 
  return `
Hi ${user.name || 'there'}!

This is your ${type} reminder to review and file your taxes.

📊 Tax Summary:
- Total Income: ${summary.totalIncome}
- Total Deductible Expenses: ${summary.totalDeductible}
- Taxable Income: ${summary.taxableIncome}
- Tax Payable: ${summary.taxPayable}

Visit your dashboard on TaxBuddy to complete your filing.
  `;
}

export async function sendMonthlyReminders() {
  const users = await User.findAll();
  const type = 'monthly';

  for (const user of users) {
    const message = buildReminderMessage(user, type);
    const subject = '📅 Monthly Tax Reminder';

    if (user.email) await sendEmail(user.email, subject, message);
    if (user.phone) sendMockSMS(user.phone, message);

    
    await Notification.create({
      userId: user.id,
      title: subject,
      message,
      isRead: false,
    });
  }
}

export async function sendQuarterlyReminders() {
  const users = await User.findAll();
  const type = 'quarterly';

  for (const user of users) {
    const message = buildReminderMessage(user, type);
    const subject = '📊 Quarterly Tax Filing Reminder';

    if (user.email) await sendEmail(user.email, subject, message);
    if (user.phone) sendMockSMS(user.phone, message);

    await Notification.create({
      userId: user.id,
      title: subject,
      message,
      isRead: false,
    });
  }
}
