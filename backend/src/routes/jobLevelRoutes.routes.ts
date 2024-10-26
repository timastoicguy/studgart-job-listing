import { Router } from "express";
import { JobLevel } from "../models/job_levels";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: JobLevels
 *   description: API for managing job levels
 */

/**
 * @swagger
 * /filters/job-levels:
 *   get:
 *     summary: Get all job levels
 *     tags: [JobLevels]
 *     responses:
 *       200:
 *         description: List of all job levels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobLevel'
 */
router.get("/job-levels", async (req, res) => {
  try {
    const jobLevels = await JobLevel.find().sort({ priority: 1 });
    res.status(200).json({ error: null, data: jobLevels });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/job-level:
 *   post:
 *     summary: Create a new job level
 *     tags: [JobLevels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobLevel'
 *     responses:
 *       201:
 *         description: The created job level
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobLevel'
 *       400:
 *         description: Validation error
 */
router.post("/job-level", async (req, res) => {
  try {
    const { name, code, priority } = req.body;
    const newJobLevel = new JobLevel({ name, code, priority });
    await newJobLevel.save();
    res.status(201).json({ error: null, data: newJobLevel });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/job-level/{id}:
 *   put:
 *     summary: Update an existing job level
 *     tags: [JobLevels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The job level id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobLevel'
 *     responses:
 *       200:
 *         description: The updated job level
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobLevel'
 *       400:
 *         description: Validation error
 */
router.put("/job-level/:id", async (req, res) => {
  try {
    const updatedJobLevel = await JobLevel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ error: null, data: updatedJobLevel });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/job-level/{id}:
 *   delete:
 *     summary: Delete a job level
 *     tags: [JobLevels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The job level id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job level deleted successfully
 *       400:
 *         description: Validation error
 */
router.delete("/job-level/:id", async (req, res) => {
  try {
    await JobLevel.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ error: null, data: "Job Level deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

export default router;
