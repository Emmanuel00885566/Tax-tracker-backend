import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPasswordController,
} from "../controllers/auth.controller.js";
import {
  registerValidation,
  loginValidation,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// User registration
router.post("/signup", registerValidation, registerUser);

// User login
router.post("/login", loginValidation, loginUser);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordController);

export default router;
