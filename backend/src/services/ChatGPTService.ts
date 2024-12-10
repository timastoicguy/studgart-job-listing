// src/services/ChatGPTService.ts
import OpenAI from "openai";
import { config } from "../config/dotenv.config";

import mongoose from "mongoose";
import { Conversation } from "../models/conversation.model";
import {
  getPromtForEvalutedCVAI,
  getPromtForSummaryAI,
  getPromtForExperienceDetailAI,
  promtForChatBotAI,
  getPromtForGenInfoFromCvAI,
  getPromptForCoverLetter,
} from "../utils/constant";
class ChatGPTService {
  private openai: OpenAI;

  private modelAPI = config.modelApi;
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openAiApiKey,
    });
  }

  async getResponse(
    user_id: mongoose.Types.ObjectId,
    userMessage: string,
    url?: string
  ) {
    let conversation = await Conversation.findOne({ user_id });

    if (!conversation) {
      conversation = new Conversation({
        user_id,
        conversationHistory: [],
      });
    }

    conversation.conversationHistory.push({
      role: "system",
      content: promtForChatBotAI,
      timestamp: new Date(),
    });

    if (url) {
      conversation.conversationHistory.push({
        role: "user",
        content: [
          { type: "text", text: userMessage },
          {
            type: "image_url",
            image_url: {
              url: url,
            },
          },
        ],
        timestamp: new Date(),
      });
    } else {
      conversation.conversationHistory.push({
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      });
    }

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

  async genCoverLeter(cvText: string, lg: string) {
    const prompt = getPromptForCoverLetter(lg); // Insert the prompt here
    const responseContent = await this.getChatGPTReply([
      { role: "system", content: prompt },
      { role: "user", content: cvText },
    ]);

    return { error: null, data: responseContent };
  }

  async genSumaryAIForCV(info: any) {
    const prompt = getPromtForSummaryAI(info); // Insert the prompt here
    const responseContent = await this.getChatGPTReply([
      { role: "user", content: prompt },
    ]);
    return { error: null, data: JSON.parse(responseContent) };
  }

  async genExperienceDetailAIForCV(info: any) {
    const prompt = getPromtForExperienceDetailAI(info); // Insert the prompt here
    const responseContent = await this.getChatGPTReply([
      { role: "user", content: prompt },
    ]);
    return { error: null, data: JSON.parse(responseContent) };
  }

  async genInfoFromCVUsingGPT(info: any, url?: string) {
    const prompt = getPromtForGenInfoFromCvAI(); // Insert the prompt here
    let responseContent: string;
    if (url) {
      responseContent = await this.getChatGPTReply([
        { role: "system", content: prompt },
        {
          role: "user",
          content: [
            { type: "text", text: "" },
            {
              type: "image_url",
              image_url: {
                url: url,
              },
            },
          ],
        },
      ]);
    } else {
      responseContent = await this.getChatGPTReply([
        { role: "system", content: prompt },
        { role: "user", content: prompt },
      ]);
    }
    return { error: null, data: JSON.parse(responseContent) };
  }
}

export default ChatGPTService;
