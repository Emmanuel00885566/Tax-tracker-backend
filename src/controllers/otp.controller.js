import { sendEmailOTP, verifyEmailOTP } from "../services/otpService.js";
import { User } from "../models/index.js";

// Sending OTP after registration or manually
export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    const result = await sendEmailOTP(user);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending OTP.",
      error: error.message,
    });
  }
};

// OTP verification
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const verifiedUser = await verifyEmailOTP(email, otp);

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      data: { email: verifiedUser.email, isVerified: verifiedUser.isVerified },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "OTP verification failed.",
      error: error.message,
    });
  }
};
