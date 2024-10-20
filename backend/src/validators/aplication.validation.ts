import { body } from "express-validator";

export const createApplicationValidation = [
  body("job_id").isString().withMessage("Job ID must be an string"),
  body("job_seeker_id")
    .isString()
    .withMessage("Job Seeker ID must be an string"),
  body("cover_letter").isString().withMessage("Cover letter is required"),
  body("resume").isString().withMessage("Resume is required"),
  body("application_status")
    .isIn(["reviewed", "pending", "accepted", "offered", "rejected"])
    .withMessage("Invalid application status"),
];
