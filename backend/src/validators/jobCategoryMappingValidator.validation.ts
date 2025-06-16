import { body } from "express-validator";

export const jobCategoryMappingValidation = [
  body("job_id")
    .notEmpty()
    .withMessage("Job ID is required")
    .isMongoId()
    .withMessage("Invalid Job ID"),

  body("category_id")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid Category ID"),
];
