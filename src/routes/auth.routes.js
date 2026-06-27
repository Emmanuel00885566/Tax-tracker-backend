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
import User from '../models/user.model.js';
import TaxRecord from '../models/tax.record.model.js';
import IncomeExpense from '../models/income.expense.model.js';
import Transaction from '../models/transaction.model.js';
import BusinessProfile from '../models/business.profile.js';
import jwt from "jsonwebtoken";
import generateToken from "../utils/generate.token.js";



const router = express.Router();


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

router.delete('/clear-all-users', async (req, res) => {
  try {
    // Delete related records first to avoid foreign key errors
    await TaxRecord.destroy({ where: {} });
    await IncomeExpense.destroy({ where: {} });
    await Transaction.destroy({ where: {} });
    await BusinessProfile.destroy({ where: {} });
    await User.destroy({ where: {} });
    
    res.json({ success: true, message: 'All users and records cleared' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Add this route
router.post("/refresh_token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: "Refresh token required" 
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const newToken = generateToken({ 
      id: user.id, 
      account_type: user.account_type, 
      email: user.email 
    });

    res.json({ 
      success: true, 
      token: newToken 
    });

  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired refresh token. Please login again." 
    });
  }
});

export default router;
