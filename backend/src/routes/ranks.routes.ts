import express from "express";
import Rank from "../models/rank.model";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rank
 *   description: API for managing ranks
 */

/**
 * @swagger
 * /ranks:
 *   get:
 *     summary: Get all ranks
 *     tags: [Rank]
 *     responses:
 *       200:
 *         description: List of ranks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rank'
 */
router.get("/", async (req, res) => {
  try {
    const ranks = await Rank.find();
    res.status(200).json({ error: null, data: ranks });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /ranks:
 *   post:
 *     summary: Create a new rank
 *     tags: [Rank]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rank'
 *     responses:
 *       201:
 *         description: Rank created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rank'
 */
router.post("/", async (req, res) => {
  try {
    const rank = new Rank(req.body);
    const savedRank = await rank.save();
    res.status(201).json({ error: null, data: savedRank });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /ranks/{id}:
 *   get:
 *     summary: Get a rank by ID
 *     tags: [Rank]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Rank ID
 *     responses:
 *       200:
 *         description: Rank data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rank'
 *       404:
 *         description: Rank not found
 */
router.get("/:id", async (req, res) => {
  try {
    const rank = await Rank.findById(req.params.id);
    if (!rank)
      return res.status(404).json({ error: "Rank not found", data: null });
    res.status(200).json({ error: null, data: rank });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /ranks/{id}:
 *   put:
 *     summary: Update a rank by ID
 *     tags: [Rank]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Rank ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rank'
 *     responses:
 *       200:
 *         description: Rank updated successfully
 *       404:
 *         description: Rank not found
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedRank = await Rank.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedRank)
      return res.status(404).json({ error: "Rank not found", data: null });
    res.status(200).json({ error: null, data: updatedRank });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /ranks/{id}:
 *   delete:
 *     summary: Delete a rank by ID
 *     tags: [Rank]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Rank ID
 *     responses:
 *       200:
 *         description: Rank deleted successfully
 *       404:
 *         description: Rank not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedRank = await Rank.findByIdAndDelete(req.params.id);
    if (!deletedRank)
      return res.status(404).json({ error: "Rank not found", data: null });
    res.status(200).json({ error: null, data: deletedRank });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
});

export default router;
