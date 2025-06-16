import { body, query } from "express-validator";

export const companyValidation = [
  body("company_name")
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ max: 100 })
    .withMessage("Company name must not exceed 100 characters"),

  body("company_size")
    .optional()
    .isIn(["Small", "Medium", "Large"])
    .withMessage("Invalid company size"),

  body("contact_email")
    .optional()
    .isEmail()
    .withMessage("Must be a valid email")
    .isLength({ max: 100 })
    .withMessage("Email must not exceed 100 characters"),

  body("contact_phone")
    .optional()
    .matches(/^\d+$/)
    .withMessage("Phone number must contain only numbers")
    .isLength({ max: 20 })
    .withMessage("Phone number must not exceed 20 digits"),

  body("company_address")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Address must not exceed 255 characters"),

  body("tax_number")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Tax number must not exceed 50 characters"),
];

export const companyQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
];
