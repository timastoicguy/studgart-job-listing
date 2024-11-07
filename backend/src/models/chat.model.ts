// backend/models/Chat.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: String, // 'admin', 'bot', or 'user'
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema({
  userId: String,
  messages: [MessageSchema],
  activeResponder: { type: String, default: "bot" },
  chatbotPaused: { type: Boolean, default: false },
});

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
