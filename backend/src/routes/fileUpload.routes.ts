import express from "express";

import {
  deleteFile,
  uploadMultipleFiles,
  uploadSingleFile,
} from "../controllers/fileUpload.controller";
import { upload } from "../utils/multer";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: File
 *   description: File upload and management endpoints
 */

/**
 * @swagger
 * /upload/upload-single:
 *   post:
 *     tags: [File]
 *     summary: Upload a single file
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
 *         description: File uploaded successfully
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
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No file uploaded"
 *                 data:
 *                   type: object
 *                   nullable: true
 */
router.post("/upload-single", upload.single("file"), uploadSingleFile);
/**
 * @swagger
 * /upload/upload-multiple:
 *   post:
 *     tags: [File]
 *     summary: Upload multiple files
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
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
 *                     urls:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "https://your-storage-url/docs/file.docx"
 *       400:
 *         description: No files uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No files uploaded"
 *                 data:
 *                   type: object
 *                   nullable: true
 */

router.post("/upload-multiple", upload.array("files"), uploadMultipleFiles);
/**
 * @swagger
 * /upload/delete-file:
 *   delete:
 *     tags: [File]
 *     summary: Delete a file by name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 example: "yourfile.pdf"
 *     responses:
 *       200:
 *         description: File deleted successfully
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
 *                   type: string
 *                   example: "File yourfile.pdf deleted successfully"
 *       400:
 *         description: File name is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "File name is required"
 *                 data:
 *                   type: object
 *                   nullable: true
 */
router.delete("/delete-file", deleteFile);

export default router;
