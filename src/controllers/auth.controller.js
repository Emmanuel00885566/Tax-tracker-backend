import { createUser, userLogin } from "../services/auth.service.js";

// @desc Register a new user
export async function registerUser(req, res) {
  try {
    const { username, email, password, role, profilePicture } = req.body;

    const roleToUse = role || "individual"; // fallback default
    const userData = await createUser({ username, email, password, role: roleToUse, profilePicture });

    res.status(201).json({
      success: true,
      message: "User registration successful",
      data: userData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "User registration failed",
    });
  }
}

// @desc Login a user
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const userData = await userLogin({ email, password });

    res.status(200).json({
      success: true,
      message: "User login successful",
      data: userData,
    });
  } catch (error) {
    const statusCode = error.message.includes("Invalid") ? 401 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
}

// @desc Change password (to be implemented)
export async function changePassword(req, res) {
  try {
    // You’ll implement this after JWT middleware and user service update
    res.status(501).json({ success: false, message: "Not implemented yet" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// @desc Request OTP for email verification (future use)
export async function getEmailOTP(req, res) {
  res.status(501).json({ success: false, message: "Not implemented yet" });
}

// @desc Verify email OTP (future use)
export async function verifyEmailOTP(req, res) {
  res.status(501).json({ success: false, message: "Not implemented yet" });
}
