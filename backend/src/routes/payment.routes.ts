// routes/paymentRoutes.ts
import { Router } from "express";
import {
  manualPayment,
  approveManualTransaction,
  getTransactionsByUserId,
  getTransactionById,
  createMomoPayment,
} from "../controllers/payment.controller";

const router = Router();

// Route tạo giao dịch thanh toán thủ công
router.post("/manual", manualPayment);

// Route xác nhận giao dịch thủ công
router.post("/manual/approve", approveManualTransaction);

// Route lấy danh sách giao dịch của người dùng với phân trang
router.get("/user/:userId", getTransactionsByUserId);

// Route lấy chi tiết giao dịch theo _id
router.get("/:transactionId", getTransactionById);

router.post("/momo", createMomoPayment);

export default router;
