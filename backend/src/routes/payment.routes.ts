// routes/paymentRoutes.ts
import { Router } from "express";
import {
  manualPayment,
  approveManualTransaction,
  getTransactionsByUserId,
  getTransactionById,
  createMomoPayment,
  handleMomoPayReturn,
  handelCheckStatus,
  diamondPayment,
  handelCheckDiamonds,
  getTransactions,
} from "../controllers/payment.controller";
import { checkDiamonds } from "../middlewares/payment.middkeware";

const router = Router();
// Route tạo giao dịch thanh toán thủ công

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment related endpoints
 */

/**
 * @swagger
 * /payments/manual:
 *   post:
 *     tags: [Payments]
 *     summary: Create a manual payment transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60df7992fc13ae1af000006d"
 *               amount:
 *                 type: number
 *                 example: 1000
 *               urlImage:
 *                 type: string
 *                 example: "https://example.com/payment-proof.jpg"
 *     responses:
 *       200:
 *         description: Manual payment transaction created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/manual", manualPayment);
// Route xác nhận giao dịch thủ công

/**
 * @swagger
 * /payments/approve:
 *   post:
 *     tags: [Payments]
 *     summary: Approve or reject a manual payment transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *                 example: "60df7992fc13ae1af000006d"
 *               status:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       404:
 *         description: Transaction not found
 */
router.post("/approve", approveManualTransaction);
// Route lấy danh sách giao dịch của người dùng với phân trang

/**
 * @swagger
 * /payments/user/{userId}:
 *   get:
 *     tags: [Payments]
 *     summary: Get all transactions for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60df7992fc13ae1af000006d"
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *     responses:
 *       200:
 *         description: User transactions retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/user/:userId", getTransactionsByUserId);
// Route lấy chi tiết giao dịch theo _id

// Route lấy danh sách giao dịch của người dùng với phân trang

/**
 * @swagger
 * /payments:
 *   get:
 *     tags: [Payments]
 *     summary: Get all transactions
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *     responses:
 *       200:
 *         description: transactions retrieved successfully
 *       404:
 *         description: not found
 */
router.get("/", getTransactions);
/**
 * @swagger
 * /payments/{transactionId}:
 *   get:
 *     tags: [Payments]
 *     summary: Get details of a transaction by its ID
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60df7992fc13ae1af000006d"
 *     responses:
 *       200:
 *         description: Transaction details retrieved successfully
 *       404:
 *         description: Transaction not found
 */
router.get("/:transactionId", getTransactionById);

/**
 * @swagger
 * /payments/momo:
 *   post:
 *     tags: [Payments]
 *     summary: Create a MoMo payment transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60df7992fc13ae1af000006d"
 *               amount:
 *                 type: number
 *                 example: 50000
 *               info:
 *                 type: string
 *                 example: "Payment for diamonds"
 *     responses:
 *       200:
 *         description: MoMo payment transaction created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/momo", createMomoPayment);

/**
 * @swagger
 * /payments/momo/momo_return:
 *   post:
 *     tags: [Payments]
 *     summary: Handle MoMo payment return status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "60df7992fc13ae1af000006d"
 *               resultCode:
 *                 type: number
 *                 example: 0
 *               signature:
 *                 type: string
 *                 example: "abcd1234"
 *     responses:
 *       200:
 *         description: Payment return status handled successfully
 *       400:
 *         description: Invalid signature
 */
router.post("/momo_return", handleMomoPayReturn);

/**
 * @swagger
 * /payments/momo-check-status:
 *   post:
 *     tags: [Payments]
 *     summary: Check the status of a payment order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "60df7992fc13ae1af000006d"
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.post("/momo-check-status", handelCheckStatus);

/**
 * @swagger
 * /payments/pay-diamond:
 *   post:
 *     tags: [Payments]
 *     summary: Make a payment using diamonds
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60df7992fc13ae1af000006d"
 *               requiredDiamonds:
 *                 type: number
 *                 example: 100
 *               description:
 *                 type: string
 *                 example: "Payment for premium feature"
 *     responses:
 *       200:
 *         description: Diamond payment completed successfully
 *       404:
 *         description: User not found
 */
router.post("/pay-diamond", checkDiamonds, diamondPayment);
/**
 * @swagger
 * /payments/check-diamonds/{userId}:
 *   get:
 *     tags: [Payments]
 *     summary: Check the number of diamonds a user has
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60df7992fc13ae1af000006d"
 *     responses:
 *       200:
 *         description: User diamonds retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/check-diamonds/:userId", handelCheckDiamonds);

export default router;
