import express from "express";
import {
  createResume,
  deleteResumeByResumeId,
  getResumeByResumeId,
  getUserResumes,
  updateResumeByResumeId,
} from "../controllers/resume.controller";

const router = express.Router();

// Tạo resume mới
router.post("/user-resumes", createResume);

// Lấy danh sách resume theo email người dùng
router.get("/user-resumes", getUserResumes);

// Lấy resume chi tiết theo resumeId
router.get("/user-resumes/:resumeId", getResumeByResumeId);

// Cập nhật resume theo resumeId
router.put("/user-resumes/:resumeId", updateResumeByResumeId);

// Xóa resume theo resumeId
router.delete("/user-resumes/:resumeId", deleteResumeByResumeId);

export default router;
