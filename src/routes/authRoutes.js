import express from "express";
import { registerUser, loginUser, updateReminderPreference, resetPasswordWithToken } from "../controllers/authController.js";
import { authRateLimiter, verifyToken, registerValidation, loginValidation } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { forgotPassword } from "../controllers/passwordController.js";
// authorizeRoles("admin", "manager") for multi-roles or can use just one

// After verifyToken will be the role based access

const router = express.Router();

router.post("/choose_account");

router.post("/sign_up/individual", authRateLimiter, registerValidation, (req, res, next) => {
  req.body.account_type = "individual";
  next();
}, registerUser);
router.post("/sign_up/business", authRateLimiter, registerValidation, (req, res, next) => {
  req.body.account_type = "business";
  next();
}, registerUser);
// Put the middleware somewhere else, Register = Sign up in this context
router.post("/admin/register", authorizeRoles("admin"), createUserAsAdmin); // will have its own token logic as well


router.post("/sign_in", authRateLimiter, loginValidation, loginUser);
// Login = sign_in

router.put("/reset_password/:token", verifyToken, resetPasswordWithToken); // meant to link to the next
router.post("/forgot_password", forgotPassword);
router.patch("/users/change_password", verifyToken);

router.post("/email_verification_code", verifyToken);

router.put("/preferences/reminders", verifyToken, updateReminderPreference);

router.get("/individual/profile", verifyToken, authorizeRoles("individual"), (req, res) => {
  const user = req.user;

  const formattedUser = {
    full_name: user.fullname,
    account_type: user.role,
    incomeBracket: user.annualIncomeRange,
    tax_identification_number: user.tin,
    taxRemindersEnabled: user.tax_reminder,
  };

  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    data: formattedUser
  });
});

router.get("/business/profile", verifyToken, authorizeRoles("business"), (req, res) => {
  const user = req.user;

  const formattedUser = {
    account_type: user.role,
    business_name: user.businessName,
    incomeBracket: user.annualIncomeRange,
    tax_identification_number: user.tin,
    taxRemindersEnabled: user.tax_reminder,
  };

  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    data: formattedUser
  });
});


router.patch("/business/profile")
router.patch("/individual/profile")

router.delete("/profile")
// GET user welcome
// profile will be for both individual and business
// I might have to make provisions for admin as well
// Example: router.put("/reset_password", verifyToken, /* roles, controller */);

export default router;
