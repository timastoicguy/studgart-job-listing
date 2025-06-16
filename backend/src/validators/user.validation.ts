import { body, query } from "express-validator";

export const createUserValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ max: 50 })
    .withMessage("Username must be at most 50 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one digit")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),

  body("role")
    .optional()
    .isIn(["job_seeker", "recruiter", "admin", "company"])
    .withMessage("Invalid role"),
];

export const updateUserValidation = [
  body("username")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Username must be at most 50 characters long"),

  body("email").optional().isEmail().withMessage("Invalid email format"),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one digit")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),

  body("role")
    .optional()
    .isIn(["job_seeker", "recruiter", "admin", "company"])
    .withMessage("Invalid role"),
];

export const getUsersValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),

  query("username")
    .optional()
    .isString()
    .withMessage("Username must be a string"),

  query("email").optional().isEmail().withMessage("Invalid email format"),

  query("fullName")
    .optional()
    .isString()
    .withMessage("Full name must be a string"),

  query("role")
    .optional()
    .isIn(["job_seeker", "recruiter", "admin", "company"])
    .withMessage("Invalid role"),
];
