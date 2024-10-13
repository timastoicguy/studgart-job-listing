import { Router } from "express";
import { JobPosition } from "../models/JobPosition";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: JobPositions
 *   description: API for managing job positions
 */

/**
 * @swagger
 * /filters/job-positions:
 *   get:
 *     summary: Get all job positions
 *     tags: [JobPositions]
 *     responses:
 *       200:
 *         description: List of all job positions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobPosition'
 */
router.get("/job-positions", async (req, res) => {
  try {
    const jobPositions = await JobPosition.find().sort({ priority: 1 });
    res.status(200).json({ error: null, data: jobPositions });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/job-position:
 *   post:
 *     summary: Create a new job position
 *     tags: [JobPositions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPosition'
 *     responses:
 *       201:
 *         description: The created job position
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobPosition'
 *       400:
 *         description: Validation error
 */
router.post("/job-position", async (req, res) => {
  try {
    const { name, code, priority } = req.body;
    const newJobPosition = new JobPosition({ name, code, priority });
    await newJobPosition.save();
    res.status(201).json({ error: null, data: newJobPosition });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/job-position/{id}:
 *   put:
 *     summary: Update an existing job position
 *     tags: [JobPositions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The job position id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPosition'
 *     responses:
 *       200:
 *         description: The updated job position
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobPosition'
 *       400:
 *         description: Validation error
 */
router.put("/job-position/:id", async (req, res) => {
  try {
    const updatedJobPosition = await JobPosition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ error: null, data: updatedJobPosition });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/job-position/{id}:
 *   delete:
 *     summary: Delete a job position
 *     tags: [JobPositions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The job position id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job position deleted successfully
 *       400:
 *         description: Validation error
 */
router.delete("/job-position/:id", async (req, res) => {
  try {
    await JobPosition.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ error: null, data: "Job Position deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

export default router;
