import { Request, Response } from "express";
import Resume, { IResume } from "../models/resume.model";

// Tạo mới Resume
export const createResume = async (req: Request, res: Response) => {
  try {
    const resumeData: IResume = req.body;
    const resume = new Resume(resumeData);
    const newResume = await resume.save();
    res.status(201).json({ error: null, data: newResume });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

// Lấy danh sách Resume theo userEmail
export const getUserResumes = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    // Nếu có email, tìm theo userEmail, ngược lại trả về tất cả các bản ghi
    const query = email ? { userEmail: email } : {};
    const resumes = await Resume.find(query);
    res.status(200).json({ error: null, data: resumes });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

// Lấy Resume chi tiết dựa trên resumeId
export const getResumeByResumeId = async (req: Request, res: Response) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ resumeId });
    if (!resume) {
      return res.status(404).json({ error: "Resume not found", data: null });
    }
    res.status(200).json({ error: null, data: resume });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

// Cập nhật Resume dựa trên resumeId
export const updateResumeByResumeId = async (req: Request, res: Response) => {
  try {
    const { resumeId } = req.params;
    const updatedResume = await Resume.findOneAndUpdate(
      { resumeId },
      req.body,
      { new: true }
    );
    if (!updatedResume) {
      return res.status(404).json({ error: "Resume not found", data: null });
    }
    res.status(200).json({ error: null, data: updatedResume });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

// Xóa Resume dựa trên resumeId
export const deleteResumeByResumeId = async (req: Request, res: Response) => {
  try {
    const { resumeId } = req.params;
    const deletedResume = await Resume.findOneAndDelete({ resumeId });
    if (!deletedResume) {
      return res.status(404).json({ error: "Resume not found", data: null });
    }
    res.status(200).json({ error: null, data: deletedResume });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};
