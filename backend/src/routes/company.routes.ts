import express from "express";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import {
  companyQueryValidation,
  companyValidation,
} from "../validators/companyValidator.validation";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller";
import Job from "../models/jobs.models";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Company management endpoints
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     tags: [Company]
 *     summary: Create a new company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_name:
 *                 type: string
 *                 example: Example Company
 *               company_size:
 *                 type: string
 *                 example: Medium
 *               contact_email:
 *                 type: string
 *                 example: contact@example.com
 *               contact_phone:
 *                 type: string
 *                 example: 1234567890
 *               company_address:
 *                 type: string
 *                 example: 123 Example Street
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/companies",
  companyValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), data: null });
    }
    next();
  },
  createCompany
);

/**
 * @swagger
 * /companies:
 *   get:
 *     tags: [Company]
 *     summary: Get a list of companies with pagination
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of companies
 *       400:
 *         description: Invalid query parameters
 */

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     tags: [Company]
 *     summary: Get company by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006b
 *     responses:
 *       200:
 *         description: Company details
 *       404:
 *         description: Company not found
 */

router.get(
  "/companies",
  companyQueryValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array(), data: null });
    }
    next();
  },
  getCompanies
);

/**
 * @swagger
 * /companies/{id}:
 *   patch:
 *     tags: [Company]
 *     summary: Update company details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006b
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_name:
 *                 type: string
 *                 example: Updated Company Name
 *               company_size:
 *                 type: string
 *                 example: Large
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Company not found
 */
router.get("/companies/:id", getCompanyById);
/**
 * @swagger
 * /companies/{id}:
 *   patch:
 *     tags: [Company]
 *     summary: Update company details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006b
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_name:
 *                 type: string
 *                 example: Updated Company Name
 *               company_size:
 *                 type: string
 *                 example: Large
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Company not found
 */
router.patch("/companies/:id", companyValidation, updateCompany);
/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     tags: [Company]
 *     summary: Delete a company by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 60df7992fc13ae1af000006b
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 */
router.delete("/companies/:id", deleteCompany);

/**
 * @swagger
 * /companies-top/top:
 *   get:
 *     tags: [Company]
 *     summary: get top company
 *     parameters:
 *       - name: size
 *         in: query
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: get successfully
 *       404:
 *         description: Job not found
 */
router.get(
  "/companies-top/top",
  async (req: Request, res: Response, next: NextFunction) => {
    const { size = 5 } = req.query;

    try {
      // Tính số lượng công việc của từng công ty
      const topCompanies = await Job.aggregate([
        {
          $group: {
            _id: "$company", // Nhóm theo trường company
            jobCount: { $sum: 1 }, // Tính tổng số lượng công việc
          },
        },
        {
          $sort: { jobCount: -1 }, // Sắp xếp theo số lượng công việc giảm dần
        },
        {
          $limit: Number(size), // Giới hạn số lượng công ty
        },
        {
          $lookup: {
            from: "companies", // Tên collection của công ty (phải viết đúng theo tên đã định nghĩa trong MongoDB)
            localField: "_id", // Trường ID trong nhóm
            foreignField: "_id", // Trường ID trong collection công ty
            as: "companyDetails", // Tên trường kết quả
          },
        },
        {
          $unwind: "$companyDetails", // Giải nén thông tin công ty
        },
        {
          $project: {
            _id: 0,
            company: "$companyDetails", // Trả về thông tin chi tiết của công ty
            jobCount: 1, // Trả về số lượng công việc
          },
        },
      ]);

      console.log(topCompanies);
      // Kiểm tra xem có công ty nào không
      if (topCompanies.length === 0) {
        return res.status(404).json({
          error: "Không tìm thấy công ty nào có công việc.",
          data: null,
        });
      }

      // Trả về thông tin các công ty và số lượng công việc
      res.status(200).json({
        error: null,
        data: {
          topCompanies: topCompanies.map((company) => ({
            company: company.company,
            jobCount: company.jobCount,
          })),
        },
      });
    } catch (error) {
      console.error("Error fetching top companies: ", error);
      next(error);
    }
  }
);
export default router;
