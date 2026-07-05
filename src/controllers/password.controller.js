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

    const webLink = `${process.env.CLIENT_URL}/reset-password.html?token=${resetToken}`;
    const mobileLink = `taxwisy://reset-password/${resetToken}`;

    const text = `Hello ${user.fullname || "User"},

You requested to reset your password.

Open TaxWisy app and use this link:
${mobileLink}

Or reset via browser:
${webLink}

This link expires in 15 minutes.

If you didn't request this, please ignore this email.

– The TaxBuddy Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#0a1a0a;padding:32px;text-align:center;">
              <div style="width:60px;height:60px;background-color:#00d4aa;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:28px;font-weight:bold;color:#0a1a0a;line-height:60px;">₦</span>
              </div>
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:bold;">TaxBuddy</h1>
              <p style="color:#00d4aa;margin:4px 0 0;font-size:14px;">Your Smart Nigerian Tax Companion</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h2 style="color:#1a1a1a;margin:0 0 16px;font-size:22px;">Password Reset Request 🔐</h2>
              <p style="color:#555;margin:0 0 24px;font-size:16px;line-height:1.6;">
                Hello <strong>${user.fullname || "User"}</strong>,<br><br>
                We received a request to reset your TaxBuddy password. 
                Click the button below to create a new password.
              </p>

              <!-- Mobile App Button -->
              <div style="text-align:center;margin-bottom:16px;">
                <a href="${mobileLink}" 
                   style="display:inline-block;background-color:#00d4aa;color:#0a1a0a;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px;">
                  📱 Reset in TaxBuddy App
                </a>
              </div>

              <p style="text-align:center;color:#888;font-size:14px;margin:0 0 16px;">
                Don't have the app? 
                <a href="${webLink}" style="color:#00d4aa;">Reset via browser instead</a>
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

              <!-- Warning -->
              <div style="background-color:#fff8e1;border-left:4px solid #ffa500;padding:16px;border-radius:4px;margin-bottom:24px;">
                <p style="margin:0;color:#555;font-size:14px;">
                  ⚠️ This link expires in <strong>15 minutes</strong>. 
                  If you didn't request a password reset, please ignore this email — your account is safe.
                </p>
              </div>

              <!-- Token for manual use -->
              <div style="background-color:#f8f8f8;border-radius:8px;padding:16px;margin-bottom:24px;">
                <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">
                  Or copy this token into the app manually:
                </p>
                <p style="margin:0;color:#1a1a1a;font-size:13px;word-break:break-all;font-family:monospace;background:#eee;padding:8px;border-radius:4px;">
                  ${resetToken}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f8f8;padding:24px 32px;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;color:#888;font-size:13px;">
                © 2026 TaxBuddy. Powered by Nigerian Tax Law 🇳🇬
              </p>
              <p style="margin:8px 0 0;color:#aaa;font-size:12px;">
                This email was sent to ${email}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await sendEmail(email, "TaxBuddy Password Reset Request", text, html);

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
      return res.status(400).json({
        success: false,
        message: "Both password and confirmPassword are required."
      });

    if (password !== confirmPassword)
      return res.status(400).json({
        success: false,
        message: "Passwords do not match."
      });

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
      return res.status(400).json({
        success: false,
        message: "Reset link expired. Please request a new one."
      });
    }
    console.error("Reset Password Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Password reset failed.",
      error: error.message,
    });
  }
};