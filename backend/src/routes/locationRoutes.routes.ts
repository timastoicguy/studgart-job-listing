import { Router } from "express";
import { Location } from "../models/locations";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: API for managing locations
 */

/**
 * @swagger
 * /filters/locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of all locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 */
router.get("/locations", async (req, res) => {
  try {
    const locations = await Location.find().sort({ priority: 1 });
    res.status(200).json({ error: null, data: locations });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/location:
 *   post:
 *     summary: Create a new location
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       201:
 *         description: The created location
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Validation error
 */
router.post("/location", async (req, res) => {
  try {
    const { name, code, priority } = req.body;
    const newLocation = new Location({ name, code, priority });
    await newLocation.save();
    res.status(201).json({ error: null, data: newLocation });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/location/{id}:
 *   put:
 *     summary: Update an existing location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The location id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: The updated location
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Validation error
 */
router.put("/location/:id", async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ error: null, data: updatedLocation });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /filters/location/{id}:
 *   delete:
 *     summary: Delete a location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The location id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       400:
 *         description: Validation error
 */
router.delete("/location/:id", async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ error: null, data: "Location deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

export default router;
