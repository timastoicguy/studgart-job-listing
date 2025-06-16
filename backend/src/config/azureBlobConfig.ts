import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
dotenv.config();
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error(
    "Azure Storage connection string is missing in environment variables."
  );
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

export default blobServiceClient;
