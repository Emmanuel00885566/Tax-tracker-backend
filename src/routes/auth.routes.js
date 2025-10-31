import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPasswordController,
} from "../controllers/auth.controller.js";
import {
  registrationValidator,
  loginValidator,
  validationMiddleware,
} from "../utils/validators.js";


const router = express.Router();

router.post("/signup", registrationValidator, validationMiddleware, registerUser);
router.post("/login", loginValidator, validationMiddleware, loginUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordController);

export default router;
