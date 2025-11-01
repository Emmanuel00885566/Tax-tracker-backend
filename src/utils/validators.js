import { body, validationResult } from "express-validator";

export const registrationValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Name must have at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must have at least 6 characters"),

  body("confirmPassword").custom((value, { req }) => {
    if (req.body.password && value !== req.body.password) {
      throw new Error("Passwords do not match!");
    }
    return true;
  }),

  body("type")
    .optional()
    .isIn(["individual", "company", "admin"])
    .withMessage("Type must be either 'individual', 'company', or 'admin'"),
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required to login")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required to login"),
];

export const validationMiddleware = (req, res, next) => {
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
