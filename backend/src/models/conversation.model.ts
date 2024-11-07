// src/models/Conversation.ts
import mongoose, { Document, Schema } from "mongoose";

interface Message {
  role: "user" | "assistant" | "system" | "admin";
  content: any[] | string;
  timestamp: Date;
}

interface ConversationDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  conversationHistory: Message[];
  adminJoined?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<Message>({
  role: {
    type: String,
    enum: ["user", "assistant", "system", "admin"],
    required: true,
  },
  content: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new Schema<ConversationDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  conversationHistory: [messageSchema],
  adminJoined: { type: Boolean, default: false },
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

export { Conversation, ConversationDocument, Message };
