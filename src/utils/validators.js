import { body } from "express-validator";

const registrationValidator = [
    body("username")
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Username must have at least 3 characters"),
    body("email")
    .notEmpty()
    .withMessage("Email is reqired")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),
    body("password")
    .notEmpty()
    .withMessage("Password is reqired")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters"), // Logic for accepted password combo (uppercase, number, special character)
    body("confirmPassword").custom((value, { req }) => {
        if (req.body.password && value !== req.body.password) {
            throw new Error("Passwords do not match!");
        }
        return true;
    }),
];

const loginValidator = [
    body("email")
    .notEmpty()
    .withMessage("Email is required to login")
    .isEmail()
    .withMessage("Invalid email format"),
    body("password")
    .notEmpty()
    .withMessage("Password is required to login"),
];

export { registrationValidator, loginValidator };