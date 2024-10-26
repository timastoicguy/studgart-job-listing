import { body, query, param } from "express-validator";

export const jobSeekerValidation = [
  body("user_id").isMongoId().withMessage("Invalid user ID format"),
  body("resume").isString().withMessage("Resume must be a string"),
  body("experience").isString().withMessage("Experience must be a string"),
  body("education").isString().withMessage("Education must be a string"),
  body("skills")
    .isArray()
    .withMessage("Skills must be an array of strings")
    .optional(),
  body("linkedin_profile").isString().isLength({ max: 100 }).optional(),
  body("portfolio_url").isString().optional(),
  body("desired_salary").isString().optional(),
  body("availability").isString().optional(),
  body("languages").isArray().optional(),
  body("certifications").isArray().optional(),
];

export const jobSeekerQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be an integer greater than 0"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be an integer greater than 0"),
  query("user_id").optional().isMongoId().withMessage("Invalid user ID format"),
  query("skills").optional().isArray().withMessage("Skills must be an array"),
];
