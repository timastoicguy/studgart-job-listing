import express from "express";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import {
  createRecruiterController,
  deleteRecruiterController,
  getRecruiterByIdController,
  getRecruitersController,
  updateRecruiterController,
} from "../controllers/recruiter.controller";
import {
  recruiterQueryValidation,
  recruiterValidation,
} from "../validators/recruiterValidator.validation";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recruiter
 *   description: Recruiter management endpoints
 */

/**
 * @swagger
 * /recruiters:
 *   post:
 *     tags: [Recruiter]
 *     summary: Create a new recruiter
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
 *               company_id:
 *                 type: string
 *                 example: 60df7992fc13ae1af000006b
 *               status:
 *                 type: string
 *                 enum: [lock, unlock, pending]
 *                 example: pending
 *     responses:
 *       201:
 *         description: Recruiter created successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/recruiters",
  recruiterValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), data: null });
    }
    next();
  },
  createRecruiterController
);

/**
 * @swagger
 * /recruiters:
 *   get:
 *     tags: [Recruiter]
 *     summary: Get a list of recruiters with pagination
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
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           example: unlock
 *       - name: company_id
 *         in: query
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006b
 *       - name: user_id
 *         in: query
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006a
 *     responses:
 *       200:
 *         description: List of recruiters
 *       400:
 *         description: Invalid query parameters
 */
router.get(
  "/recruiters",
  recruiterQueryValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), data: null });
    }
    next();
  },
  getRecruitersController
);

/**
 * @swagger
 * /recruiters/{id}:
 *   get:
 *     tags: [Recruiter]
 *     summary: Get recruiter by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006b
 *     responses:
 *       200:
 *         description: Recruiter details
 *       404:
 *         description: Recruiter not found
 */
router.get("/recruiters/:id", getRecruiterByIdController);

/**
 * @swagger
 * /recruiters/{id}:
 *   patch:
 *     tags: [Recruiter]
 *     summary: Update recruiter details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006b
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
 *               company_id:
 *                 type: string
 *                 example: 60df7992fc13ae1af000006b
 *               status:
 *                 type: string
 *                 enum: [lock, unlock, pending]
 *                 example: unlock
 *     responses:
 *       200:
 *         description: Recruiter updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Recruiter not found
 */
router.patch("/recruiters/:id", recruiterValidation, updateRecruiterController);

/**
 * @swagger
 * /recruiters/{id}:
 *   delete:
 *     tags: [Recruiter]
 *     summary: Delete a recruiter by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006b
 *     responses:
 *       200:
 *         description: Recruiter deleted successfully
 *       404:
 *         description: Recruiter not found
 */
router.delete("/recruiters/:id", deleteRecruiterController);

export default router;
