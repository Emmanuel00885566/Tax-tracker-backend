import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { sendEmail } from "../services/email.service.js";

dotenv.config();

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email is required." });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ success: false, message: "No user found with this email." });

    
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      email,
      "TaxBuddy Password Reset Request",
      `Hello ${user.fullname || "User"},

You requested to reset your password. Click the link below to continue:
${resetLink}

This link expires in 15 minutes.`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error.message);
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset link expired. Please request a new one." });
    }
    console.error("Reset Password Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Password reset failed.",
      error: error.message,
    });
  }
};
