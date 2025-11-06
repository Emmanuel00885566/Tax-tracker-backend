import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";

// RATE LIMITER FOR AUTH ROUTES
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

// TOKEN EXTRACTION HELPER
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
};



// TOKEN VERIFICATION MIDDLEWARE
export const verifyToken = (req, res, next) => {
  const token = extractToken(req);
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
    const message =
      err.name === "TokenExpiredError"
        ? "Token has expired. Please log in again."
        : "Invalid token.";
    return res.status(403).json({ success: false, message });
  }
};

// ROLE AUTHORIZATION MIDDLEWARE
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

// VALIDATION HANDLER
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Registration and Login Validations
export const registerValidation = [
  body("fullname").notEmpty().withMessage("Full Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("account_type")
  .optional()
  .isIn(["individual", "business", "admin"])
  .withMessage("Type must be either 'individual', 'business', or 'admin'"),
  handleValidationErrors,
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Account Type Middlewares
export const individualAccountType = (req, res, next) => {
  req.body.type = "individual";
  next();
};

export const businessAccountType = (req, res, next) => {
  req.body.type = "business";
  next();
};
