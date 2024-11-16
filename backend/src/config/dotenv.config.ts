import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  openAiApiKey: process.env.OPEN_API_KEY || "",
  mongoUri: process.env.MONGODB_URI || "",
  maxMessageCount: parseInt(process.env.MAX_MESSAGE_COUNT || "20", 10),
  modelApi: process.env.MODEL_API || "gpt-3.5-turbo",
  frontentApi: process.env.FRONTEND_URL,
  accessMomoKey: process.env.ACCESS_MOMO_KEY,
  secretMomoKey: process.env.SECRET_MOMO_KEY,
  parnerMomoCode: process.env.PARNER_CODE_MOMO,
  redirectUrl: process.env.REDIRECT_URL,
  ipnURl: process.env.IPN_URL,
  baseURL: process.env.BASE_URL,
};
