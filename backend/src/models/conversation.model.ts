// src/models/Conversation.ts
import mongoose, { Document, Schema } from "mongoose";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface ConversationDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  conversationHistory: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<Message>({
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new Schema<ConversationDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  conversationHistory: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

conversationSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

conversationSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 600 });

const Conversation = mongoose.model<ConversationDocument>(
  "Conversation",
  conversationSchema
);

export { Conversation, ConversationDocument };
