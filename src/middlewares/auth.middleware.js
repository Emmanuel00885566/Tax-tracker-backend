import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";


export const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5, 
  message: {
    success: false,
    message: "Too many attempts. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const getToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
};

export const verifyToken = (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided or invalid format.",
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

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }
    next();
  };
};

export const registerValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["individual", "company", "admin"])
    .withMessage("Role must be either 'individual', 'company', or 'admin'"),
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
