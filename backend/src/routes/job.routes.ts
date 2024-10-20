import express from "express";
import {
  createJob,
  getAllJobs,
  getJobByIdOrTitle,
  updateJobById,
  deleteJobById,
} from "../controllers/job.controller";
import {
  createJobValidation,
  updateJobValidation,
} from "../validators/job.validation";
import { validationResult } from "express-validator";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Job
 *   description: Job management endpoints
 */

/**
 * @swagger
 * /jobs:
 *   post:
 *     tags: [Job]
 *     summary: Create a new job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Frontend Developer
 *               description:
 *                 type: string
 *                 example: We are looking for a skilled frontend developer...
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: Develop user interfaces
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: Experience with React
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: JavaScript
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: Health insurance
 *               location:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Ho Chi Minh
 *                     code:
 *                       type: string
 *                       example: HCM
 *               salaryRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                     example: 6000000
 *                   max:
 *                     type: number
 *                     example: 12000000
 *               company:
 *                 type: string
 *                 example: 60df7992fc13ae1af000006c
 *               jobCategory:
 *                 type: string
 *                 example: 60df7992fc13ae1af000006d
 *               recruiter:
 *                 type: string
 *                 example: 60df7992fc13ae1af000006e
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: React
 *                     code:
 *                       type: string
 *                       example: REACT
 *               employmentType:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Full-time
 *                     code:
 *                       type: string
 *                       example: FT
 *               experienceLevel:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Junior
 *                     code:
 *                       type: string
 *                       example: JR
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/jobs", createJobValidation, createJob);

/**
 * @swagger
 * /jobs:
 *   get:
 *     tags: [Job]
 *     summary: Get all jobs with pagination and filtering
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *           example: -postedDate
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *           example: Frontend
 *       - name: company
 *         in: query
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006c
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006d
 *       - name: location
 *         in: query
 *         schema:
 *           type: string
 *           example: HCM
 *       - name: experienceLevel
 *         in: query
 *         schema:
 *           type: string
 *           example: JR
 *       - name: employmentType
 *         in: query
 *         schema:
 *           type: string
 *           example: FT
 *       - name: minSalary
 *         in: query
 *         schema:
 *           type: number
 *           example: 6000000
 *       - name: maxSalary
 *         in: query
 *         schema:
 *           type: number
 *           example: 12000000
 *     responses:
 *       200:
 *         description: A list of jobs with pagination
 *       400:
 *         description: Invalid query parameters
 */
router.get("/jobs", getAllJobs);

/**
 * @swagger
 * /jobs/{id_or_title}:
 *   get:
 *     tags: [Job]
 *     summary: Get job by ID or Title
 *     parameters:
 *       - name: id_or_title
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006c
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get("/jobs/:id_or_title", getJobByIdOrTitle);

/**
 * @swagger
 * /jobs/{id}:
 *   patch:
 *     tags: [Job]
 *     summary: Update job details by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006c
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Job Title
 *               description:
 *                 type: string
 *                 example: Updated job description
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Job not found
 */
router.patch("/jobs/:id", updateJobValidation, updateJobById);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     tags: [Job]
 *     summary: Delete a job by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006c
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 */
router.delete("/jobs/:id", deleteJobById);

export default router;
