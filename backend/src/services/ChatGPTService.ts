// src/services/ChatGPTService.ts
import OpenAI from "openai";
import { config } from "../config/dotenv.config";

import mongoose from "mongoose";
import { Conversation } from "../models/conversation.model";
import { getPromtForEvalutedCVAI } from "../utils/constant";
class ChatGPTService {
  private openai: OpenAI;

  private modelAPI = config.modelApi;
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openAiApiKey,
    });
  }

  async getResponse(user_id: mongoose.Types.ObjectId, userMessage: string) {
    let conversation = await Conversation.findOne({ user_id });

    if (!conversation) {
      conversation = new Conversation({
        user_id,
        conversationHistory: [],
      });
    }

    conversation.conversationHistory.push({
      role: "system",
      content:
        "Bạn là một chatbot hỗ trợ các câu hỏi về trang web tuyển dụng. Hãy tập trung vào các câu hỏi liên quan đến quy trình ứng tuyển, đăng tuyển, và các vấn đề liên quan.",
      timestamp: new Date(),
    });

    conversation.conversationHistory.push({
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    });

    if (conversation.conversationHistory.length > config.maxMessageCount) {
      conversation.conversationHistory = conversation.conversationHistory.slice(
        -config.maxMessageCount
      );
    }

    const responseContent = await this.getChatGPTReply(
      conversation.conversationHistory
    );

    conversation.conversationHistory.push({
      role: "assistant",
      content: responseContent,
      timestamp: new Date(),
    });
    await conversation.save();

    return { error: null, data: responseContent };
  }

  private async getChatGPTReply(messages: any[]) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.modelAPI,
        messages,
      });
      return (
        response.choices[0].message?.content || "No response from assistant."
      );
    } catch (error) {
      console.error("ChatGPT API Error:", error);
      throw new Error("ChatGPT API error");
    }
  }

  async evaluateSingleCV(cvText: string) {
    const prompt = getPromtForEvalutedCVAI(); // Insert the prompt here
    const responseContent = await this.getChatGPTReply([
      { role: "system", content: prompt },
      { role: "user", content: cvText },
    ]);
    return { error: null, data: JSON.parse(responseContent) };
  }
}

export default ChatGPTService;
