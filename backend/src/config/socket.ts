import { Server } from "socket.io";
import dotenv from "dotenv";
import http from "http";
import { Conversation, Message } from "../models/conversation.model";
import ChatGPTService from "../services/ChatGPTService";
dotenv.config();

const chatGPTService = new ChatGPTService();
let io: Server;
const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinConversation", async ({ userId }) => {
      let conversation = await Conversation.findOne({ userId });

      if (!conversation) {
        conversation = new Conversation({
          user_id: userId,
          conversationHistory: [],
        });
      }

      const roomId = (conversation._id as string).toString();
      socket.join(roomId);

      // Remove any existing listeners before adding new ones
      socket
        .off("userMessage", () => {})
        .on("userMessage", async (content) => {
          // Check if the admin has joined the conversation
          if (!conversation.adminJoined) {
            io.to(roomId).emit("typing");
            const response = await chatGPTService.getResponse(
              content?.user_id,
              content?.message,
              content?.url
            );

            const botMessage = {
              sender: "bot",
              text: response?.error
                ? "I'm sorry, I'm having trouble processing your request. Please try again later."
                : response?.data,
            };

            io.to(roomId).emit("newMessage", botMessage);
          }
        });

      socket
        .off("adminJoin", () => {})
        .on("adminJoin", async () => {
          conversation.adminJoined = true;
          await conversation.save();
        });

      socket
        .off("adminMessage", () => {})
        .on("adminMessage", async (text) => {
          const message = {
            sender: "admin",
            text,
          };
          io.to(roomId).emit("newMessage", message);
        });
    });

    socket.on("joinNotification", async ({ userId }) => {
      console.log("joinNotification", userId);
      socket.join(userId); // Tham gia phòng của user
    });
    socket.on("disconnect", () => {
      // Optional: Remove specific listeners if necessary
      socket.removeAllListeners(); // Remove all listeners to prevent memory leaks
    });
  });
};

export { io, initSocket }; // Export io and initSocket;
