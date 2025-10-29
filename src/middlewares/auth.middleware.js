import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";

// Rate limiter for login/register routes (max 5 requests per minute per IP)
export const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    message: "Too many attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to extract token
const getToken = (req) => req.headers.authorization?.split(" ")[1];

// Verify JWT token middleware
export const verifyToken = (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    const msg =
      err.name === "TokenExpiredError"
        ? "Token has expired. Please log in again."
        : "Invalid token.";
    res.status(403).json({ success: false, message: msg });
  }
};

// Validation middleware for registration
export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["individual", "company"])
    .withMessage("Role must be either individual or company"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

// Validation middleware for login
export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];