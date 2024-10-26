import { body, query, param } from "express-validator";

export const recruiterValidation = [
  body("user_id").isMongoId().withMessage("Invalid user ID format"),
  body("company_id").isMongoId().withMessage("Invalid company ID format"),
  body("status")
    .isIn(["lock", "unlock", "pending"])
    .withMessage("Status must be one of 'lock', 'unlock', or 'pending'"),
];

export const recruiterQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be an integer greater than 0"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be an integer greater than 0"),
  query("status")
    .optional()
    .isIn(["lock", "unlock", "pending"])
    .withMessage("Status must be one of 'lock', 'unlock', or 'pending'"),
  query("company_id")
    .optional()
    .isMongoId()
    .withMessage("Invalid company ID format"),
  query("user_id").optional().isMongoId().withMessage("Invalid user ID format"),
];
