import express from "express";
import {
  registerUser,
  loginUser,
  updateReminderPreference,
  fetchUserProfile,
  fetchBusinessProfile,
  updateIndividualProfile,
  updateBusinessProfile,
  changePassword,
  deleteUser
} from "../controllers/auth.controller.js";

import {
  authRateLimiter,
  verifyToken,
  registerValidation,
  loginValidation,
  individualAccountType,
  businessAccountType
} from "../middlewares/auth.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";
import { forgotPassword, resetPasswordWithToken } from "../controllers/password.controller.js";
import { sendOtpController, verifyOtpController } from "../controllers/otp.controller.js";

const router = express.Router();
import User from '../models/user.model.js';

// =================== Account Creation ===================
router.post("/choose_account", (req, res) => {
  res.status(200).json({ message: "Choose account type endpoint - will handle account type selection here." });
});
router.post("/sign_up/individual", authRateLimiter, individualAccountType, registerValidation, registerUser);
router.post("/sign_up/business", authRateLimiter, businessAccountType, registerValidation, registerUser);
router.post("/sign_in", authRateLimiter, loginValidation, loginUser);

// =================== OTP Routes ===================
router.post("/send_otp", sendOtpController);
router.post("/verify_otp", verifyOtpController);

// =================== Password Management ===================
router.post("/forgot_password", forgotPassword);
router.put("/reset_password/:token", resetPasswordWithToken);
router.patch("/users/change_password", verifyToken, changePassword);

// =================== Profile Management ===================
router.get("/individual/profile", verifyToken, authorizeRoles("individual"), fetchUserProfile);
router.get("/business/profile", verifyToken, authorizeRoles("business"), fetchBusinessProfile);
router.patch("/individual/profile", verifyToken, updateIndividualProfile);
router.patch("/business/profile", verifyToken, updateBusinessProfile);
router.put("/preferences/reminders", verifyToken, updateReminderPreference);
router.delete("/profile", verifyToken, deleteUser);

router.delete('/clear-test-users', async (req, res) => {
  try {
    await User.destroy({ 
      where: { 
        isVerified: false 
      } 
    });
    res.json({ success: true, message: 'Test users cleared' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/all-users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'account_type', 'isVerified', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
