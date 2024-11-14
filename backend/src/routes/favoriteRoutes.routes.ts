// routes/favoriteRoutes.js
import express from "express";
import {
  createFavorite,
  deleteFavorite,
  getAllFavorites,
  updateFavorite,
} from "../controllers/favoriteController.controller";

const router = express.Router();

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Create a new favorite
 *     description: Adds a job to the user's favorites.
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               job_id:
 *                 type: integer
 *                 description: The ID of the job to favorite.
 *               job_seeker_id:
 *                 type: integer
 *                 description: The ID of the job seeker.
 *               status:
 *                 type: string
 *                 enum: [saved, unsaved]
 *                 description: The status of the favorite.
 *     responses:
 *       201:
 *         description: Favorite created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     favorite_id:
 *                       type: integer
 *                     job_id:
 *                       type: integer
 *                     job_seeker_id:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Internal Server Error.
 */
router.post("/favorites", createFavorite);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Retrieve all favorites
 *     description: Gets a list of saved favorites for a user.
 *     tags: [Favorites]
 *     parameters:
 *       - in: query
 *         name: job_seeker_id
 *         schema:
 *           type: string
 *           description: The ID of the job seeker.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           description: Number of items per page.
 *     responses:
 *       200:
 *         description: A list of favorites.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       favorite_id:
 *                         type: integer
 *                       job_id:
 *                         type: integer
 *                       job_seeker_id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal Server Error.
 */
router.get("/favorites", getAllFavorites);

/**
 * @swagger
 * /favorites/{job_id}/{job_seeker_id}:
 *   put:
 *     summary: Update a favorite
 *     description: Updates a favorite job for a user.
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the job to update.
 *       - in: path
 *         name: job_seeker_id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the job seeker.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [saved, unsaved]
 *                 description: The new status of the favorite.
 *     responses:
 *       200:
 *         description: Favorite updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     favorite_id:
 *                       type: integer
 *                     job_id:
 *                       type: integer
 *                     job_seeker_id:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Favorite not found.
 *       500:
 *         description: Internal Server Error.
 */
router.put("/favorites/:job_id/:job_seeker_id", updateFavorite);

/**
 * @swagger
 * /favorites/{job_id}/{job_seeker_id}:
 *   delete:
 *     summary: Delete a favorite
 *     description: Removes a favorite job for a user.
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the job to delete.
 *       - in: path
 *         name: job_seeker_id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the job seeker.
 *     responses:
 *       204:
 *         description: Favorite deleted successfully.
 *       404:
 *         description: Favorite not found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete("/favorites/:job_id/:job_seeker_id", deleteFavorite);

export default router;
