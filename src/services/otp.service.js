import { User } from "../models/index.js";
import nodemailer from "nodemailer";

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP to user's email
export const sendEmailOTP = async (user) => {
  if (user.isVerified) {
    throw new Error("User is already verified.");
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save OTP and expiry to user
  user.otpCode = otp;
  user.otpExpiresAt = expiry;
  await user.save();

  // Configure transporter (use environment variables in production)
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"TaxEase Support" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Verify Your Email - TaxEase OTP",
    text: `Hello ${user.username || ""},\n\nYour OTP for email verification is ${otp}. It will expire in 10 minutes.\n\nIf you didn’t request this, please ignore this message.\n\n– The TaxEase Team`,
  };

  await transporter.sendMail(mailOptions);

  return { email: user.email, expiresAt: expiry };
};

// Verify OTP
export const verifyEmailOTP = async (email, otp) => {
  const user = await User.findOne({ where: { email } });

  if (!user) throw new Error("User not found.");
  if (user.isVerified) throw new Error("User already verified.");
  if (!user.otpCode || !user.otpExpiresAt) throw new Error("No OTP found. Request a new one.");
  if (user.otpExpiresAt < new Date()) throw new Error("OTP expired.");
  if (user.otpCode !== otp) throw new Error("Invalid OTP.");

  // Mark verified
  user.isVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  await user.save();

  return user;
};
