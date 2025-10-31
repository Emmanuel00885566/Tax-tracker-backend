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
  validationMiddleware,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", registerValidation, validationMiddleware, registerUser);
router.post("/login", loginValidation, validationMiddleware, loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordController);

export default router;
