import express, { Request, Response, NextFunction } from "express";
import {
  createJobCategory,
  deleteJobCategory,
  getJobCategories,
  getJobCategoryById,
  updateJobCategory,
} from "../controllers/jobCategory.controller";
import { jobCategoryValidation } from "../validators/jobCategoryValidator.validation";
import { validationResult } from "express-validator";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: JobCategory
 *   description: Job Category management endpoints
 */

/**
 * @swagger
 * /job-categories:
 *   post:
 *     tags: [JobCategory]
 *     summary: Create a new job category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: IT
 *               description:
 *                 type: string
 *                 example: Jobs related to Information Technology
 *     responses:
 *       201:
 *         description: Job category created successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/job-categories",
  jobCategoryValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), data: null });
    }
    next();
  },
  createJobCategory
);
/**
 * @swagger
 * /job-categories:
 *   get:
 *     tags: [JobCategory]
 *     summary: Get a list of job categories with pagination
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
 *     responses:
 *       200:
 *         description: List of job categories
 *       400:
 *         description: Invalid query parameters
 */
router.get("/job-categories", getJobCategories);

/**
 * @swagger
 * /job-categories/{id}:
 *   get:
 *     tags: [JobCategory]
 *     summary: Get job category by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006c
 *     responses:
 *       200:
 *         description: Job category details
 *       404:
 *         description: Job category not found
 */
router.get("/job-categories/:id", getJobCategoryById);
/**
 * @swagger
 * /job-categories/{id}:
 *   patch:
 *     tags: [JobCategory]
 *     summary: Update job category details
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
 *               name:
 *                 type: string
 *                 example: Updated Job Category Name
 *     responses:
 *       200:
 *         description: Job category updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Job category not found
 */
router.patch("/job-categories/:id", updateJobCategory);
/**
 * @swagger
 * /job-categories/{id}:
 *   delete:
 *     tags: [JobCategory]
 *     summary: Delete a job category by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006c
 *     responses:
 *       200:
 *         description: Job category deleted successfully
 *       404:
 *         description: Job category not found
 */
router.delete("/job-categories/:id", deleteJobCategory);

export default router;
