import express from "express";
import {
  chatWithGPT,
  getInitialQuestion,
  evaluateSingleCV,
} from "../controllers/chatbotApi.controller";
import { upload } from "../utils/multer";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: Chatbot API for user interactions and predefined responses
 */

/**
 * @swagger
 * /chatbot-api:
 *   post:
 *     tags: [Chatbot]
 *     summary: Interact with the chatbot
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
 *               message:
 *                 type: string
 *                 description: Message from the user
 *                 example: "What job positions are available?"
 *     responses:
 *       200:
 *         description: Chatbot response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "There are currently openings for Software Developers."
 *       400:
 *         description: Invalid input
 */
router.post("/chatbot-api", chatWithGPT);

/**
 * @swagger
 * /chatbot-api:
 *   get:
 *     tags: [Chatbot]
 *     summary: Get initial chatbot questions
 *     responses:
 *       200:
 *         description: List of initial questions for the chatbot
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "How can I apply for a job?"
 *       400:
 *         description: Invalid input
 */
router.get("/chatbot-api", getInitialQuestion);

/**
 * @swagger
 * tags:
 *   name: Evaluation
 *   description: File upload and evaluate CV using OpenAI
 */

/**
 * @swagger
 * /evaluate-cv-api:
 *   post:
 *     tags: [Evaluation]
 *     summary: Upload and evaluate CV
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: CV uploaded and evaluated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://your-storage-url/imgs/yourfile.jpg"
 *       400:
 *         description: CV not uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "CV not uploaded"
 *                 data:
 *                   type: object
 *                   nullable: true
 */
router.post("/evaluate-cv-api", upload.single("file"), evaluateSingleCV);

export default router;
