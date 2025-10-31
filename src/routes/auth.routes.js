import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import {
  registerValidation,
  loginValidation,
  verifyToken,
  authRateLimiter,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ============================================================
   AUTH ROUTES
   ============================================================ */

// Register a new user
router.post("/signup", authRateLimiter, registerValidation, registerUser);

// Login user
router.post("/login", authRateLimiter, loginValidation, loginUser);

// Forgot password (sends reset token via email)
router.post("/forgot-password", authRateLimiter, forgotPassword);

// Reset password using token
router.post("/reset-password", authRateLimiter, resetPassword);

/* Optional test-protected route */
router.get("/me", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "Authenticated user route",
    user: req.user,
  });
});

export default router;
