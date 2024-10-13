import { Router } from "express";
import { MainTechnology } from "../models/MainTechnology";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: MainTechnologies
 *   description: API for managing main technologies
 */

/**
 * @swagger
 * /filters/main_technologies:
 *   get:
 *     summary: Get all main technologies
 *     tags: [MainTechnologies]
 *     responses:
 *       200:
 *         description: List of all main technologies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MainTechnology'
 */
router.get("/main_technologies", async (req, res) => {
  try {
    const mainTechnologies = await MainTechnology.find().sort({ priority: 1 });
    res.status(200).json({ error: null, data: mainTechnologies });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/main_technology:
 *   post:
 *     summary: Create a new main technology
 *     tags: [MainTechnologies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MainTechnology'
 *     responses:
 *       201:
 *         description: The created main technology
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MainTechnology'
 *       400:
 *         description: Validation error
 */
router.post("/main_technology", async (req, res) => {
  try {
    const { name, code, priority } = req.body;
    const newMainTechnology = new MainTechnology({ name, code, priority });
    await newMainTechnology.save();
    res.status(201).json({ error: null, data: newMainTechnology });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/main_technology/{id}:
 *   put:
 *     summary: Update an existing main technology
 *     tags: [MainTechnologies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The main technology id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MainTechnology'
 *     responses:
 *       200:
 *         description: The updated main technology
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MainTechnology'
 *       400:
 *         description: Validation error
 */
router.put("/main_technology/:id", async (req, res) => {
  try {
    const updatedMainTechnology = await MainTechnology.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ error: null, data: updatedMainTechnology });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/main_technology/{id}:
 *   delete:
 *     summary: Delete a main technology
 *     tags: [MainTechnologies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The main technology id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Main technology deleted successfully
 *       400:
 *         description: Validation error
 */
router.delete("/main_technology/:id", async (req, res) => {
  try {
    await MainTechnology.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ error: null, data: "Main technology deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

export default router;
