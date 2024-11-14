import { body } from "express-validator";

export const createJobValidation = [
  body("title").notEmpty().withMessage("Job title is required"),
  body("description").notEmpty().withMessage("Job description is required"),
  body("responsibilities")
    .isArray()
    .withMessage("Responsibilities must be an array"),
  body("requirements").isArray().withMessage("Requirements must be an array"),
  body("skills").isArray().withMessage("Skills must be an array"),
  body("location")
    .isArray()
    .withMessage("Location must be an array")
    .custom((value) => {
      value.forEach((item: any) => {
        if (!item.name || !item.code) {
          throw new Error("Each location item must have a name and a code.");
        }
      });
      return true;
    }),
  body("salaryRange.min")
    .isNumeric()
    .withMessage("Minimum salary must be a number"),
  body("salaryRange.max")
    .isNumeric()
    .withMessage("Maximum salary must be a number"),
  body("company").notEmpty().withMessage("Company ID is required"),
  body("technologies")
    .isArray()
    .withMessage("Technologies must be an array")
    .custom((value) => {
      value.forEach((item: any) => {
        if (!item.name || !item.code) {
          throw new Error("Each technology item must have a name and a code.");
        }
      });
      return true;
    }),
  body("employmentType")
    .isArray()
    .withMessage("Employment Type must be an array")
    .custom((value) => {
      value.forEach((item: any) => {
        if (!item.name || !item.code) {
          throw new Error(
            "Each employment type item must have a name and a code."
          );
        }
      });
      return true;
    }),
  body("experienceLevel")
    .isArray()
    .withMessage("Experience Level must be an array")
    .custom((value) => {
      value.forEach((item: any) => {
        if (!item.name || !item.code) {
          throw new Error(
            "Each experience level item must have a name and a code."
          );
        }
      });
      return true;
    }),

  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefits must be an array"),
  body("numberOfVacancies")
    .optional()
    .isNumeric()
    .withMessage("Number of vacancies must be a number"),
];

export const updateJobValidation = [
  body("title").optional().notEmpty().withMessage("Job title cannot be empty"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Job description cannot be empty"),
  body("responsibilities")
    .optional()
    .isArray()
    .withMessage("Responsibilities must be an array"),
  body("requirements")
    .optional()
    .isArray()
    .withMessage("Requirements must be an array"),
  body("skills").optional().isArray().withMessage("Skills must be an array"),
  body("location")
    .optional()
    .isArray()
    .withMessage("Location must be an array")
    .custom((value) => {
      value.forEach((item: any) => {
        if (!item.name || !item.code) {
          throw new Error("Each location item must have a name and a code.");
        }
      });
      return true;
    }),
  body("salaryRange.min")
    .optional()
    .isNumeric()
    .withMessage("Minimum salary must be a number"),
  body("salaryRange.max")
    .optional()
    .isNumeric()
    .withMessage("Maximum salary must be a number"),
  body("company")
    .optional()
    .notEmpty()
    .withMessage("Company ID cannot be empty"),
  body("jobCategory")
    .optional()
    .notEmpty()
    .withMessage("Job Category ID cannot be empty"),
  body("recruiter")
    .optional()
    .notEmpty()
    .withMessage("Recruiter ID cannot be empty"),
  body("programmingLanguages")
    .optional()
    .isArray()
    .withMessage("Programming Languages must be an array"),
  body("technologies")
    .optional()
    .isArray()
    .withMessage("Technologies must be an array")
    .custom((value) => {
      value.forEach((item: any) => {
        if (!item.name || !item.code) {
          throw new Error("Each technology item must have a name and a code.");
        }
      });
      return true;
    }),
  body("employmentType")
    .optional()
    .isArray()
    .withMessage("Employment Type must be an array")
    .custom((value) => {
      value.forEach((item: any) => {
        if (!item.name || !item.code) {
          throw new Error(
            "Each employment type item must have a name and a code."
          );
        }
      });
      return true;
    }),
  body("experienceLevel")
    .optional()
    .isArray()
    .withMessage("Experience Level must be an array")
    .custom((value) => {
      value.forEach((item: any) => {
        if (!item.name || !item.code) {
          throw new Error(
            "Each experience level item must have a name and a code."
          );
        }
      });
      return true;
    }),
  body("applicationDeadline")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Application deadline must be a valid date"),
  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefits must be an array"),
  body("numberOfVacancies")
    .optional()
    .isNumeric()
    .withMessage("Number of vacancies must be a number"),
];
