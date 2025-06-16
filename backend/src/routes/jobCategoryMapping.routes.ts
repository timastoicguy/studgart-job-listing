import express, { Request, Response, NextFunction } from "express";
import {
  createJobCategoryMapping,
  deleteJobCategoryMapping,
  getJobCategoryMappings,
} from "../controllers/jobCategoryMapping.controller";
import { jobCategoryMappingValidation } from "../validators/jobCategoryMappingValidator.validation";
import { validationResult } from "express-validator";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: JobCategoryMapping
 *   description: Job Category Mapping endpoints
 */

/**
 * @swagger
 * /job-category-mappings:
 *   post:
 *     tags: [JobCategoryMapping]
 *     summary: Map a job to a category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               job_id:
 *                 type: string
 *                 example: 60df7992fc13ae1af000006d
 *               category_id:
 *                 type: string
 *                 example: 60df7992fc13ae1af000006c
 *     responses:
 *       201:
 *         description: Job mapped to category successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/job-category-mappings",
  jobCategoryMappingValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), data: null });
    }
    next();
  },
  createJobCategoryMapping
);
/**
 * @swagger
 * /job-category-mappings:
 *   get:
 *     tags: [JobCategoryMapping]
 *     summary: Get all job category mappings
 *     responses:
 *       200:
 *         description: List of job category mappings
 */
router.get("/job-category-mappings", getJobCategoryMappings);

/**
 * @swagger
 * /job-category-mappings/{job_id}/{category_id}:
 *   delete:
 *     tags: [JobCategoryMapping]
 *     summary: Unmap a job from a category
 *     parameters:
 *       - name: job_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006d
 *       - name: category_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006c
 *     responses:
 *       200:
 *         description: Job unmapped from category successfully
 *       404:
 *         description: Mapping not found
 */
router.delete(
  "/job-category-mappings/:job_id/:category_id",
  deleteJobCategoryMapping
);

export default router;
