import { Request, Response } from "express";
import {
  uploadFileToBlob,
  deleteFileFromBlob,
} from "../services/azureBlobService";

// Single file upload
export const uploadSingleFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file)
      return res.status(400).json({ error: "No file uploaded", data: null });

    const fileUrl = await uploadFileToBlob(
      file.buffer,
      file.originalname,
      file.mimetype
    );
    res.status(200).json({ error: null, data: { url: fileUrl } });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

// Multiple files upload
export const uploadMultipleFiles = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0)
      return res.status(400).json({ error: "No files uploaded", data: null });

    const uploadedFiles = await Promise.all(
      files.map((file) =>
        uploadFileToBlob(file.buffer, file.originalname, file.mimetype)
      )
    );
    res.status(200).json({ error: null, data: { urls: uploadedFiles } });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

// Delete file
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { fileName } = req.body;
    if (!fileName)
      return res
        .status(400)
        .json({ error: "File name is required", data: null });

    await deleteFileFromBlob(fileName);
    res
      .status(200)
      .json({ error: null, data: `File ${fileName} deleted successfully` });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};
