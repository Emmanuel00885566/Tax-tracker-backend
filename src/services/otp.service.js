import { User } from "../models/index.js";
import nodemailer from "nodemailer";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Create reusable transporter for Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailOTP = async (user) => {
  if (user.isVerified) {
    throw new Error("User is already verified.");
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  user.otpCode = otp;
  user.otpExpiresAt = expiry;
  await user.save();

  const mailOptions = {
    from: `"TaxBuddy Support" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Verify Your Email - TaxBuddy OTP",
    text: `Hello ${user.username || user.fullname || "User"},\n\nYour OTP for email verification is ${otp}. It will expire in 10 minutes.\n\nIf you didn’t request this, please ignore this message.\n\n– The TaxBuddy Team`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ OTP sent to ${user.email}`);

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
