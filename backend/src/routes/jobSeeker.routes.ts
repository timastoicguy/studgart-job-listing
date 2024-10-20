import express from "express";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import {
  jobSeekerValidation,
  jobSeekerQueryValidation,
} from "../validators/jobSeekerValidator.validation";
import {
  createJobSeeker,
  deleteJobSeeker,
  getJobSeekers,
  getJobSeekerById,
  updateJobSeeker,
} from "../controllers/jobSeeker.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Job Seeker
 *   description: Job seeker management endpoints
 */

/**
 * @swagger
 * /job_seekers:
 *   post:
 *     tags: [Job Seeker]
 *     summary: Create a new job seeker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: 60df7992fc13ae1af000006a
 *               resume:
 *                 type: string
 *                 example: "Resume content here"
 *               experience:
 *                 type: string
 *                 example: "3 years in software development"
 *               education:
 *                 type: string
 *                 example: "Bachelor's in Computer Science"
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "JavaScript"
 *               linkedin_profile:
 *                 type: string
 *                 example: "https://linkedin.com/in/example"
 *               portfolio_url:
 *                 type: string
 *                 example: "https://example.com"
 *               desired_salary:
 *                 type: string
 *                 example: "50000"
 *               availability:
 *                 type: string
 *                 example: "Immediate"
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "English"
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Certified Java Developer"
 *     responses:
 *       201:
 *         description: Job seeker created successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/job_seekers",
  jobSeekerValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), data: null });
    }
    next();
  },
  createJobSeeker
);

/**
 * @swagger
 * /job_seekers:
 *   get:
 *     tags: [Job Seeker]
 *     summary: Get a list of job seekers
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: user_id
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A list of job seekers
 *       400:
 *         description: Invalid input
 */
router.get(
  "/job_seekers",
  jobSeekerQueryValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), data: null });
    }
    next();
  },
  getJobSeekers
);

/**
 * @swagger
 * /job_seekers/{id}:
 *   get:
 *     tags: [Job Seeker]
 *     summary: Get a job seeker by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job seeker ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Job seeker found
 *       404:
 *         description: Job seeker not found
 *       400:
 *         description: Invalid ID format
 */
router.get("/job_seekers/:id", getJobSeekerById);

/**
 * @swagger
 * /job_seekers/{id}:
 *   put:
 *     tags: [Job Seeker]
 *     summary: Update a job seeker by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job seeker ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 example: "Updated resume content"
 *               experience:
 *                 type: string
 *                 example: "4 years in software development"
 *               education:
 *                 type: string
 *                 example: "Master's in Computer Science"
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "TypeScript"
 *               linkedin_profile:
 *                 type: string
 *                 example: "https://linkedin.com/in/example"
 *               portfolio_url:
 *                 type: string
 *                 example: "https://example.com"
 *               desired_salary:
 *                 type: string
 *                 example: "60000"
 *               availability:
 *                 type: string
 *                 example: "2 weeks"
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Spanish"
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Certified Python Developer"
 *     responses:
 *       200:
 *         description: Job seeker updated successfully
 *       404:
 *         description: Job seeker not found
 *       400:
 *         description: Invalid input
 */
router.put(
  "/job_seekers/:id",
  jobSeekerValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), data: null });
    }
    next();
  },
  updateJobSeeker
);

/**
 * @swagger
 * /job_seekers/{id}:
 *   delete:
 *     tags: [Job Seeker]
 *     summary: Delete a job seeker by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job seeker ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Job seeker deleted successfully
 *       404:
 *         description: Job seeker not found
 *       400:
 *         description: Invalid ID format
 */
router.delete("/job_seekers/:id", deleteJobSeeker);

export default router;
