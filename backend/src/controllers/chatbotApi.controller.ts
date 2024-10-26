// src/controllers/ChatController.ts
import { Request, Response } from "express";
import ChatGPTService from "../services/ChatGPTService";
import mongoose from "mongoose";

const chatGPTService = new ChatGPTService();

export const chatWithGPT = async (req: Request, res: Response) => {
  const { user_id, message } = req.body;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ error: "Invalid user ID", data: null });
  }

  try {
    const result = await chatGPTService.getResponse(user_id, message);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export const getInitialQuestion = async (req: Request, res: Response) => {
  try {
    const result = await [
      "Làm thế nào để tạo hồ sơ ứng tuyển?",
      "Quy trình ứng tuyển việc làm trên trang web là gì?",
      "Làm cách nào để đăng tin tuyển dụng?",
      "Tôi gặp sự cố khi đăng nhập, phải làm sao?",
    ];
    res.status(200).json({
      error: null,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};
