import {
  createUser,
  userLogin,
  getUserProfile,
  getBusinessProfile,
  updateUserProf,
  updateBusinessProf,
  updateRemPreference,
  changePass,
  deleteUserProfile
} from "../services/auth.service.js";

import { sendEmailOTP } from "../services/otp.service.js"; // ✅ Added import
import BusinessProfile from "../models/business.profile.js";

// ======================= REGISTER ==========================
async function registerUser(req, res) {
  try {
    const {
      fullname,
      email,
      password,
      account_type,
      tax_identification_number,
      annualIncomeRange,
      tax_reminder = true,
      businessName,
      businessType
    } = req.body;

    // ✅ Create user
    const newUser = await createUser({
      username: fullname?.trim() || email.split("@")[0],
      email,
      password,
      role: account_type,
      tin: tax_identification_number || null,
      annualIncomeRange,
      tax_reminder,
    });

    // ✅ If business account, create business profile
    if (account_type === "business") {
      await BusinessProfile.create({
        userId: newUser.id,
        businessName,
        businessType,
      });
    }

    // ✅ Send OTP for email verification
    await sendEmailOTP(newUser);

    res.status(201).json({
      success: true,
      message: "User registration successful. Verification OTP sent to email.",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================= LOGIN ==========================
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userLogin({ email, password });

    res.status(200).json({
      success: true,
      message: "User login successful",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================= FETCH PROFILES ==========================
const fetchUserProfile = async (req, res) => {
  try {
    const data = await getUserProfile(req.user);
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user profile",
      error: error.message,
    });
  }
};

const fetchBusinessProfile = async (req, res) => {
  try {
    const data = await getBusinessProfile(req.user);
    res.status(200).json({
      success: true,
      message: "Business profile retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving business profile",
      error: error.message,
    });
  }
};

// ======================= UPDATE PROFILES ==========================
const updateIndividualProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const updatedProfile = await updateUserProf(userId, updates);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBusinessProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const updatedProfile = await updateBusinessProf(userId, updates);

    res.status(200).json({
      success: true,
      message: "Business profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================= SETTINGS & DELETION ==========================
const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    const updated = await changePass(userId, password);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found or no changes made.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error changing password.",
      error: error.message,
    });
  }
};

const updateReminderPreference = async (req, res) => {
  try {
    const { tax_reminder } = req.body;
    const userId = req.user.id;

    const updated = await updateRemPreference(userId, tax_reminder);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found or no changes made.",
      });
    }
    res.status(200).json({
      success: true,
      message: `Tax reminder preference updated to ${
        tax_reminder ? "ON" : "OFF"
      }.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating tax reminder preference.",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await deleteUserProfile(req.user.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user.",
      error: error.message,
    });
  }
};

// ======================= EXPORTS ==========================
export {
  registerUser,
  loginUser,
  fetchUserProfile,
  fetchBusinessProfile,
  updateBusinessProfile,
  updateIndividualProfile,
  updateReminderPreference,
  changePassword,
  deleteUser
};
