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

// Load environment variables
dotenv.config();

// Connect to MongoDB

const app = express();

// Middleware

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
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
connectDB().then((res) => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});
