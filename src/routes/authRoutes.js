import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { registrationValidator, loginValidator } from "../utils/validators.js";
import { validationMiddleware, auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registrationValidator, validationMiddleware, registerUser);
router.post("/login", loginValidator, validationMiddleware, loginUser);

// GET user welcome

export default router;
