import dotenv from "dotenv";

dotenv.config();

export const config = {
  openAiApiKey: process.env.OPEN_API_KEY || "",
  mongoUri: process.env.MONGODB_URI || "",
  maxMessageCount: parseInt(process.env.MAX_MESSAGE_COUNT || "20", 10),
  modelApi: process.env.MODEL_API || "gpt-3.5-turbo",
};
