import { User } from "../models/index.js";
import nodemailer from "nodemailer";
import axios from "axios"; 
import dotenv from "dotenv";
dotenv.config();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const mailtrapTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
    
  } catch (error) {
    
    throw new Error("Failed to send OTP email via Brevo.");
  }
};

export const sendEmailOTP = async (user) => {
  if (user.isVerified) {
    throw new Error("User is already verified.");
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  user.otpCode = otp;
  user.otpExpiresAt = expiry;
  await user.save();

  const message = `Hello ${user.username || user.fullname || "User"},\n\nYour OTP for email verification is ${otp}. It will expire in 10 minutes.\n\nIf you didn’t request this, please ignore this message.\n\n– The TaxBuddy Team`;

  const provider = process.env.MAIL_PROVIDER || "mailtrap";

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
        c
      }
    } catch (err) {
      console.error("Email send error:", err.message);
    }
  })();

  return { email: user.email, expiresAt: expiry };
};

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

export const getLatestOTP = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.otpCode) throw new Error("No OTP found for this user.");
  return { email: user.email, otp: user.otpCode, expiresAt: user.otpExpiresAt };
};
