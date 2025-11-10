import { User } from "../models/index.js";
import nodemailer from "nodemailer";
import axios from "axios"; 
import dotenv from "dotenv";
dotenv.config();

/**
 * Utility: Generate a 6-digit OTP
 */
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Utility: Create a mail transporter for Mailtrap (development)
 */
const mailtrapTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Function to send OTP via Brevo (Sendinblue)
 */
const sendViaBrevo = async (email, subject, text) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "TaxBuddy Support", email: process.env.BREVO_SENDER },
        to: [{ email }],
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
    console.log(`Brevo email sent to ${email}`);
  } catch (error) {
    console.error("Brevo send failed:", error.response?.data || error.message);
    throw new Error("Failed to send OTP email via Brevo.");
  }
};

/**
 * Send Email OTP (works for Mailtrap or Brevo depending on ENV)
 */
export const sendEmailOTP = async (user) => {
  if (user.isVerified) {
    throw new Error("User is already verified.");
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins validity

  // Save OTP and expiry
  user.otpCode = otp;
  user.otpExpiresAt = expiry;
  await user.save();

  const message = `Hello ${user.username || user.fullname || "User"},\n\nYour OTP for email verification is ${otp}. It will expire in 10 minutes.\n\nIf you didn’t request this, please ignore this message.\n\n– The TaxBuddy Team`;

  // Pick mail provider dynamically
  const provider = process.env.MAIL_PROVIDER || "mailtrap";

  // Non-blocking send (no await) for better UX
  (async () => {
    try {
      if (provider === "brevo") {
        await sendViaBrevo(user.email, "Verify Your Email - TaxBuddy OTP", message);
      } else {
        await mailtrapTransporter.sendMail({
          from: `"TaxBuddy Support" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Verify Your Email - TaxBuddy OTP",
          text: message,
        });
        console.log(`Mailtrap email sent to ${user.email}`);
      }
    } catch (err) {
      console.error("Email send error:", err.message);
    }
  })();

  return { email: user.email, expiresAt: expiry };
};

/**
 * Verify OTP Function
 */
export const verifyEmailOTP = async (email, otp) => {
  const user = await User.findOne({ where: { email } });

  if (!user) throw new Error("User not found.");
  if (user.isVerified) throw new Error("User already verified.");
  if (!user.otpCode || !user.otpExpiresAt) throw new Error("No OTP found. Request a new one.");
  if (user.otpExpiresAt < new Date()) throw new Error("OTP expired.");
  if (user.otpCode !== otp) throw new Error("Invalid OTP.");

  user.isVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  await user.save();

  return user;
};

/**
 * (Optional) Dev-only: Fetch latest OTP for testing
 */
export const getLatestOTP = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.otpCode) throw new Error("No OTP found for this user.");
  return { email: user.email, otp: user.otpCode, expiresAt: user.otpExpiresAt };
};
