import { Router } from "express";
import { JobType } from "../models/job_types";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: JobTypes
 *   description: API for managing job types
 */

/**
 * @swagger
 * /filters/job_types:
 *   get:
 *     summary: Get all job types
 *     tags: [JobTypes]
 *     responses:
 *       200:
 *         description: List of all job types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobType'
 */
router.get("/job_types", async (req, res) => {
  try {
    const jobTypes = await JobType.find().sort({ priority: 1 });
    res.status(200).json({ error: null, data: jobTypes });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/job_type:
 *   post:
 *     summary: Create a new job type
 *     tags: [JobTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobType'
 *     responses:
 *       201:
 *         description: The created job type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobType'
 *       400:
 *         description: Validation error
 */
router.post("/job_type", async (req, res) => {
  try {
    const { name, code, priority } = req.body;
    const newJobType = new JobType({ name, code, priority });
    await newJobType.save();
    res.status(201).json({ error: null, data: newJobType });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/job_type/{id}:
 *   put:
 *     summary: Update an existing job type
 *     tags: [JobTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The job type id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobType'
 *     responses:
 *       200:
 *         description: The updated job type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobType'
 *       400:
 *         description: Validation error
 */
router.put("/job_type/:id", async (req, res) => {
  try {
    const updatedJobType = await JobType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ error: null, data: updatedJobType });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/job_type/{id}:
 *   delete:
 *     summary: Delete a job type
 *     tags: [JobTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The job type id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job type deleted successfully
 *       400:
 *         description: Validation error
 */
router.delete("/job_type/:id", async (req, res) => {
  try {
    await JobType.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ error: null, data: "Job type deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

export default router;
