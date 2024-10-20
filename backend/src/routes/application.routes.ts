import express, { NextFunction, Request, Response } from "express";
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/application.controller";

import { validationResult } from "express-validator";
import { createApplicationValidation } from "../validators/aplication.validation";

const router = express.Router();

// Middleware to handle validation errors
const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
      data: null,
    });
  }
  next();
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       required:
 *         - job_id
 *         - job_seeker_id
 *         - cover_letter
 *         - resume
 *       properties:
 *         job_id:
 *           type: string
 *           description: ObjectId của công việc
 *         job_seeker_id:
 *           type: string
 *           description: ObjectId của người tìm việc
 *         cover_letter:
 *           type: string
 *           description: Thư ứng tuyển
 *         resume:
 *           type: string
 *           description: Đường dẫn đến file resume
 *         job_reviewer_id:
 *           type: string
 *           description: ObjectId của người phê duyệt
 *         application_status:
 *           type: string
 *           enum: [reviewed, pending, accepted, offered, rejected]
 *           description: Trạng thái của đơn ứng tuyển
 *         interview_date:
 *           type: string
 *           format: date-time
 *           description: Ngày phỏng vấn
 *         offer_details:
 *           type: string
 *           description: Thông tin chi tiết về offer (nếu có)
 *         applied_at:
 *           type: string
 *           format: date-time
 *           description: Ngày ứng tuyển
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Tạo đơn ứng tuyển mới
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Application'
 *     responses:
 *       201:
 *         description: Đơn ứng tuyển được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   nullable: true
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 data:
 *                   nullable: true
 */

router.post(
  "/applications",
  createApplicationValidation,
  handleValidation,
  createApplication
);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Lấy tất cả đơn ứng tuyển với phân trang và lọc
 *     tags: [Applications]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang (mặc định là 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng đơn trên mỗi trang (mặc định là 10)
 *       - in: query
 *         name: application_status_sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sắp xếp theo trạng thái ứng tuyển
 *       - in: query
 *         name: applied_at_sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sắp xếp theo ngày ứng tuyển
 *       - in: query
 *         name: application_status
 *         schema:
 *           type: string
 *           enum: [reviewed, pending, accepted, offered, rejected]
 *         description: Lọc theo trạng thái ứng tuyển
 *       - in: query
 *         name: job_id
 *         schema:
 *           type: string
 *         description: Lọc theo công việc
 *       - in: query
 *         name: job_seeker_id
 *         schema:
 *           type: string
 *         description: Lọc theo người tìm việc
 *       - in: query
 *         name: job_reviewer_id
 *         schema:
 *           type: string
 *         description: Lọc theo người phê duyệt
 *       - in: query
 *         name: applied_at
 *         schema:
 *           type: string
 *           format: date
 *         description: Lọc theo ngày ứng tuyển
 *     responses:
 *       200:
 *         description: Danh sách đơn ứng tuyển
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   nullable: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     docs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Application'
 *                     totalDocs:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     page:
 *                       type: integer
 *       400:
 *         description: Lỗi validation hoặc không tìm thấy dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 data:
 *                   nullable: true
 */

router.get("/applications", getAllApplications);

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một đơn ứng tuyển
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của đơn ứng tuyển
 *     responses:
 *       200:
 *         description: Đơn ứng tuyển được lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   nullable: true
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       404:
 *         description: Đơn ứng tuyển không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 data:
 *                   nullable: true
 */

router.get("/applications/:id", getApplicationById);

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     summary: Cập nhật một đơn ứng tuyển
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của đơn ứng tuyển
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Application'
 *     responses:
 *       200:
 *         description: Đơn ứng tuyển được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   nullable: true
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       404:
 *         description: Đơn ứng tuyển không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 data:
 *                   nullable: true
 */
router.put(
  "/applications/:id",
  createApplicationValidation,
  handleValidation,
  updateApplication
);

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: Xóa một đơn ứng tuyển
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của đơn ứng tuyển
 *     responses:
 *       204:
 *         description: Đơn ứng tuyển đã được xóa thành công
 *       404:
 *         description: Đơn ứng tuyển không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 data:
 *                   nullable: true
 */
router.delete("/applications/:id", deleteApplication);

export default router;
