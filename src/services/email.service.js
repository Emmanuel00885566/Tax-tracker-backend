import nodemailer from 'nodemailer';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const mailtrapTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendViaBrevo(to, subject, text) {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { name: "TaxBuddy Notifications", email: process.env.BREVO_SENDER },
      to: [{ email: to }],
      subject,
      textContent: text,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
    }
  );
}

export async function sendEmail(to, subject, text) {
  const provider = process.env.MAIL_PROVIDER || "mailtrap";

  try {
    if (provider === "brevo") {
      await sendViaBrevo(to, subject, text);
      console.log(`Brevo email sent to ${to}`);
    } else {
      await mailtrapTransporter.sendMail({
        from: `"TaxBuddy Notifications" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
      });
      console.log(`Mailtrap email sent to ${to}`);
    }
  } catch (error) {
    console.error(`Email send error:`, error.message);
  }
}
