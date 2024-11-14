import path from "path";
import { v4 as uuidv4 } from "uuid";
import blobServiceClient from "../config/azureBlobConfig";
import { BlockBlobUploadOptions, ContainerClient } from "@azure/storage-blob";

// Define containers
const containers = {
  imgs: "imgs",
  pdfs: "pdfs",
  docs: "docs",
  excels: "excels",
  audios: "audios",
  videos: "videos",
};

const ensureContainerExists = async (containerClient: ContainerClient) => {
  const exists = await containerClient.exists();
  if (!exists) {
    await containerClient.create();
    console.log(`Container ${containerClient.containerName} created.`);
  }
};

// Determine the container based on file type
const getContainerName = (fileMimeType: string): string => {
  if (fileMimeType.startsWith("image")) return containers.imgs;
  if (fileMimeType === "application/pdf") return containers.pdfs;
  if (
    fileMimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    fileMimeType === "application/vnd.ms-excel"
  )
    return containers.excels;
  if (
    fileMimeType === "application/msword" ||
    fileMimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return containers.docs;
  if (fileMimeType.startsWith("audio")) return containers.audios;
  if (fileMimeType.startsWith("video")) return containers.videos;
  throw new Error("Unsupported file type");
};

// Upload file to Azure Blob
export const uploadFileToBlob = async (
  fileBuffer: Buffer,
  fileName: string,
  fileMimeType: string
): Promise<string> => {
  const uploadOptions: BlockBlobUploadOptions = {
    blobHTTPHeaders: {
      blobContentType: fileMimeType,
    },
  };

  const containerName = getContainerName(fileMimeType);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  await ensureContainerExists(containerClient);

  const uniqueFileName = uuidv4() + path.extname(fileName);
  const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName);
  await blockBlobClient.upload(fileBuffer, fileBuffer.length, uploadOptions);
  return blockBlobClient.url;
};

// Delete file from Azure Blob
export const deleteFileFromBlob = async (fileName: string): Promise<void> => {
  const ext = path.extname(fileName);
  const containerName = getContainerNameByExtension(ext);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  await blockBlobClient.deleteIfExists();
};

// Helper: Determine container based on file extension
const getContainerNameByExtension = (extension: string): string => {
  if ([".jpg", ".jpeg", ".png", ".gif"].includes(extension))
    return containers.imgs;
  if (extension === ".pdf") return containers.pdfs;
  if ([".doc", ".docx"].includes(extension)) return containers.docs;
  if ([".xls", ".xlsx"].includes(extension)) return containers.excels;
  if ([".mp3", ".wav"].includes(extension)) return containers.audios;
  if ([".mp4", ".avi", ".mkv"].includes(extension)) return containers.videos;
  throw new Error("Unsupported file extension");
};
