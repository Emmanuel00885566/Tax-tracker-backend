import express from "express";
import { registerUser, loginUser, updateReminderPreference, fetchUserProfile, fetchBusinessProfile, updateIndividualProfile, updateBusinessProfile, changePassword, deleteUser } from "../controllers/auth.controller.js";
import { authRateLimiter, verifyToken, registerValidation, loginValidation } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { forgotPassword, resetPasswordWithToken } from "../controllers/password.controller.js";
import { sendOtpController, verifyOtpController } from "../controllers/otp.controller.js";
import { individualAccountType, businessAccountType } from "../middlewares/auth.2.middleware.js";

// authorizeRoles("admin", "manager") for multi-roles or can use just one
// After verifyToken will be the role based access

const router = express.Router();

router.post("/choose_account", authorizeRoles("individual", "business"), (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

router.post("/sign_up/individual", authRateLimiter, individualAccountType, registerValidation, registerUser); // Works
router.post("/sign_up/business", authRateLimiter, businessAccountType, registerValidation, registerUser); // Works
// Register = Sign up 

router.post("/admin/register", authorizeRoles("admin")); // will have its own token logic as well - createUserAsAdmin

router.post("/send_otp", sendOtpController);
router.post("/verify_otp", verifyOtpController);
// I will decide on roles

router.post("/sign_in", authRateLimiter, loginValidation, loginUser); // Works
// Login = sign_in

router.put("/reset_password/:token", verifyToken, authorizeRoles("individual", "business"), resetPasswordWithToken); // Works
router.post("/forgot_password", forgotPassword); // Works
router.patch("/users/change_password", verifyToken, changePassword);



router.put("/preferences/reminders", verifyToken, updateReminderPreference); // Works

router.get("/individual/profile", verifyToken, authorizeRoles("individual"), fetchUserProfile); //Works
router.get("/business/profile", verifyToken, authorizeRoles("business"), fetchBusinessProfile); //Works


router.patch("/business/profile", verifyToken, updateBusinessProfile);
router.patch("/individual/profile", verifyToken, updateIndividualProfile);

router.delete("/profile", verifyToken, deleteUser); // should have some validation for it

// GET user welcome
// I might have to make provisions for admin as well

export default router;