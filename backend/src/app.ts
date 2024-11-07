import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import connectDB from "./config/mongoose";
import cors from "cors";
import setupSwagger from "./swagger";
import companyRoutes from "./routes/company.routes";
import jobCategoryRoutes from "./routes/jobCategory.routes";
import jobCategoryMappingRoutes from "./routes/jobCategoryMapping.routes";
import userRoutes from "./routes/user.routes";
import fileUploadRoutes from "./routes/fileUpload.routes";
import recruiterRoutes from "./routes/recruiter.routes";
import jobSeekerRoutes from "./routes/jobSeeker.routes";
import jobsRoutes from "./routes/job.routes";
import jobTypeRoutes from "./routes/jobTypeRoutes.routes";
import jobLevelRoutes from "./routes/jobLevelRoutes.routes";
import jobPositionRoutes from "./routes/jobPositionRoutes.routes";
import locationRoutes from "./routes/locationRoutes.routes";
import mainTechnologyRoutes from "./routes/mainTechnologyRoutes.routes";
import applicationRoutes from "./routes/application.routes";
import favoriteRoutes from "./routes/favoriteRoutes.routes";
import chatbotApitRoutes from "./routes/chatbotApi.routes";
import resumeRoutes from "./routes/resume.routes";
import http from "http";
import initSocket from "./config/socket";
// Load environment variables
dotenv.config();

// Connect to MongoDB
const app = express();
const server = http.createServer(app);
initSocket(server);
// Middleware

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", companyRoutes);
app.use("/api", jobCategoryRoutes);
app.use("/api", jobCategoryMappingRoutes);
app.use("/api", userRoutes);
app.use("/api/upload", fileUploadRoutes);
app.use("/api", recruiterRoutes);
app.use("/api", jobSeekerRoutes);
app.use("/api", jobsRoutes);
app.use("/api", applicationRoutes);
app.use("/api", favoriteRoutes);
app.use("/api", chatbotApitRoutes);
app.use("/api", resumeRoutes);
//filters routes
app.use("/api/filters", jobTypeRoutes);
app.use("/api/filters", jobLevelRoutes);
app.use("/api/filters", jobPositionRoutes);
app.use("/api/filters", locationRoutes);
app.use("/api/filters", mainTechnologyRoutes);

// chatbot api

// io.on('connection', (socket) => {
//   socket.on('join-chat', async ({ userId }) => {
//     let chat = await Chat.findOne({ userId });
//     if (!chat) {
//       chat = new Chat({ userId, messages: [] });
//       await chat.save();
//     }
//     socket.join(userId);
//   });

//   socket.on('user-message', async ({ userId, message }) => {
//     const botMessage = await getAIResponse(message);

//     const chat = await Chat.findOneAndUpdate(
//       { userId },
//       {
//         $push: { messages: { sender: 'user', content: message } },
//         activeResponder: 'bot',
//       },
//       { new: true }
//     );
//     chat.messages.push({ sender: 'bot', content: botMessage });
//     await chat.save();

//     io.to(userId).emit('bot-message', { userId, message: botMessage });
//   });
// });

connectDB().then((res) => {
  // app.listen(process.env.PORT || 3000, () => {
  //   console.log(`Server running on port ${process.env.PORT || 3000}`);
  // });

  server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});
