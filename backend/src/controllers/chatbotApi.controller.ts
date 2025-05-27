// src/controllers/ChatController.ts
import { Request, Response } from "express";
import ChatGPTService from "../services/ChatGPTService";
import pdfParse from "pdf-parse";
import mongoose from "mongoose";

const chatGPTService = new ChatGPTService();

export const chatWithGPT = async (req: Request, res: Response) => {
  const { user_id, message, url } = req.body;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ error: "Invalid user ID", data: null });
  }

  try {
    const result = await chatGPTService.getResponse(user_id, message, url);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export const chatWithGPTUsingPDFFIle = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded", data: null });
  }
  const { user_id, message } = req.body;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ error: "Invalid user ID", data: null });
  }

  try {
    const pdfData = await pdfParse(req.file.buffer);
    const pdfText = pdfData.text;
    console.log(pdfText);
    const combinedInput = `${message}\n\n Sau đây là nội dung file pdf đã được chuyển sang text:\n${pdfText}`;
    const result = await chatGPTService.getResponse(user_id, combinedInput);
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

export const evaluateSingleCV = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Extract text from the PDF
    const pdfText = await pdfParse(req.file.buffer);
    // Send the extracted text to the OpenAI API
    const response = await chatGPTService.evaluateSingleCV(pdfText.text);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process the file" });
  }
};

export const genCoverLeter = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Extract text from the PDF

    const pdfText = await pdfParse(req.file.buffer);
    // Send the extracted text to the OpenAI API

    const response = await chatGPTService.genCoverLeter(
      pdfText.text,
      "English"
    );

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process the file" });
  }
};

export const genSumaryAIForCV = async (req: Request, res: Response) => {
  const data = req.body;

  if (!data) {
    return res.status(400).json({ error: "No data provided", data: null });
  }
  try {
    const result = await chatGPTService.genSumaryAIForCV(data);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export const genExperienceDetailAIForCV = async (
  req: Request,
  res: Response
) => {
  const data = req.body;

  if (!data) {
    return res.status(400).json({ error: "No data provided", data: null });
  }
  try {
    const result = await chatGPTService.genExperienceDetailAIForCV(data);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export const genInfoFromCVUsingGPTByPDF = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const pdfText = await pdfParse(req.file.buffer);
    const response = await chatGPTService.genInfoFromCVUsingGPT(pdfText.text);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process the file" });
  }
};

export const genInfoFromCVUsingGPTByImage = async (
  req: Request,
  res: Response
) => {
  try {
    const { url } = req.body;

    if (!!url) {
      return res.status(400).json({ error: "No url" });
    }
    const response = await chatGPTService.genInfoFromCVUsingGPT("", url);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process the image" });
  }
};
