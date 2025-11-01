import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User } from "../models/index.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email is required." });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ success: false, message: "No user found with this email." });

    // Create a reset token (expires in 15 minutes)
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Reset link (adjust to your frontend domain)
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Hello ${user.username || "User"},</p>
        <p>You requested to reset your password. Click the link below to continue:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send password reset email.",
      error: error.message,
    });
  }
};

export const resetPasswordWithToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword)
      return res.status(400).json({ message: "Both password and confirmPassword are required." });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match." });

    // Verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset link expired. Please request a new one." });
    }
    res.status(500).json({
      success: false,
      message: "Password reset failed.",
      error: error.message,
    });
  }
};