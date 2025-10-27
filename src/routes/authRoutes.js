import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { registrationValidator, loginValidator } from "../utils/validators.js";
import { validationMiddleware, auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", auth, registrationValidator, validationMiddleware, registerUser);
router.post("/login", auth, loginValidator, validationMiddleware, loginUser);

export default router;
