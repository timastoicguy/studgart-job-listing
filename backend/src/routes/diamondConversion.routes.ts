import express from "express";
import { DiamondConversion } from "../models/diamondConversion.model";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DiamondConversion
 *   description: API for managing diamond conversions
 */

/**
 * @swagger
 * /diamond-conversions:
 *   get:
 *     summary: Get all diamond conversions
 *     tags: [DiamondConversion]
 *     responses:
 *       200:
 *         description: List of diamond conversions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiamondConversion'
 */
router.get("/", async (req, res) => {
  try {
    const conversions = await DiamondConversion.find();
    res.status(200).json({ error: null, data: conversions });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /diamond-conversions:
 *   post:
 *     summary: Create a new diamond conversion
 *     tags: [DiamondConversion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiamondConversion'
 *     responses:
 *       201:
 *         description: Diamond conversion created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiamondConversion'
 */
router.post("/", async (req, res) => {
  try {
    const conversion = new DiamondConversion(req.body);
    const savedConversion = await conversion.save();
    res.status(201).json({ error: null, data: savedConversion });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /diamond-conversions/{id}:
 *   get:
 *     summary: Get a diamond conversion by ID
 *     tags: [DiamondConversion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Diamond conversion ID
 *     responses:
 *       200:
 *         description: Diamond conversion data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiamondConversion'
 *       404:
 *         description: Diamond conversion not found
 */
router.get("/:id", async (req, res) => {
  try {
    const conversion = await DiamondConversion.findById(req.params.id);
    if (!conversion)
      return res
        .status(404)
        .json({ error: "Conversion not found", data: null });
    res.status(200).json({ error: null, data: conversion });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /diamond-conversions/{id}:
 *   put:
 *     summary: Update a diamond conversion by ID
 *     tags: [DiamondConversion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Diamond conversion ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiamondConversion'
 *     responses:
 *       200:
 *         description: Diamond conversion updated successfully
 *       404:
 *         description: Diamond conversion not found
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedConversion = await DiamondConversion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedConversion)
      return res
        .status(404)
        .json({ error: "Conversion not found", data: null });
    res.status(200).json({ error: null, data: updatedConversion });
  } catch (error: any) {
    res.status(400).json({ error: error.message, data: null });
  }
});

/**
 * @swagger
 * /diamond-conversions/{id}:
 *   delete:
 *     summary: Delete a diamond conversion by ID
 *     tags: [DiamondConversion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Diamond conversion ID
 *     responses:
 *       200:
 *         description: Diamond conversion deleted successfully
 *       404:
 *         description: Diamond conversion not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedConversion = await DiamondConversion.findByIdAndDelete(
      req.params.id
    );
    if (!deletedConversion)
      return res
        .status(404)
        .json({ error: "Conversion not found", data: null });
    res.status(200).json({ error: null, data: deletedConversion });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
});

export default router;
