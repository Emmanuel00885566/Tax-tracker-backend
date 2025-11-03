import express from "express";
import { registerUser, loginUser, updateReminderPreference, fetchUserProfile, fetchBusinessProfile, updateIndividualProfile, updateBusinessProfile, changePassword, deleteUser } from "../controllers/auth.controller.js";
import { authRateLimiter, verifyToken, registerValidation, loginValidation } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { forgotPassword, resetPasswordWithToken } from "../controllers/password.controller.js";
import { sendOtpController, verifyOtpController } from "../controllers/otp.controller.js";
import { individualAccountType, businessAccountType } from "../middlewares/auth.2.middleware.js";

const router = express.Router();

router.post("/choose_account", authorizeRoles("individual", "business"), (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

router.post("/sign_up/individual", authRateLimiter, individualAccountType, authorizeRoles("individual"), registerValidation, registerUser); // Works
router.post("/sign_up/business", authRateLimiter, businessAccountType, authorizeRoles("business"), registerValidation, registerUser); // Works
// Register = Sign up 

//ADMIN
router.post("/admin/register", authorizeRoles("admin")); // will have its own token logic as well - createUserAsAdmin
//token gen here as well
router.get("/admin/dashboard", verifyToken, authorizeRoles("admin"), /*adminDashboard*/);
router.get("/admin/users", verifyToken, authorizeRoles("admin"), /*getAllUsers*/);
router.delete("/admin/users/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  res.json({ success: true, message: `User with ID ${id} has been deleted.` });
}); // refactor

router.post("/send_otp", authorizeRoles("individual", "business"), sendOtpController);
router.post("/verify_otp", authorizeRoles("individual", "business"), verifyOtpController);

router.post("/sign_in", authRateLimiter, loginValidation, loginUser); // Works
// Login = sign_in

router.put("/reset_password/:token", verifyToken, authorizeRoles("individual", "business"), resetPasswordWithToken); // Works
router.post("/forgot_password", authorizeRoles("individual", "business"), forgotPassword); // Works
router.patch("/users/change_password", verifyToken, authorizeRoles("individual", "business"), changePassword);

router.put("/preferences/reminders", verifyToken, authorizeRoles("individual", "business"), updateReminderPreference); // Works

router.get("/individual/profile", verifyToken, authorizeRoles("individual"), fetchUserProfile); //Works
router.get("/business/profile", verifyToken, authorizeRoles("business"), fetchBusinessProfile); //Works


router.patch("/business/profile", verifyToken, authorizeRoles("business"), updateBusinessProfile);
router.patch("/individual/profile", verifyToken, authorizeRoles("individual"), updateIndividualProfile);

router.delete("/profile", verifyToken, deleteUser); // should have some validation for it

// Do I need routes for the onboarding/splash screens as well
// I might have to make provisions for admin as well

export default router;