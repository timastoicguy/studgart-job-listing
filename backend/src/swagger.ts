import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

// Cấu hình các tùy chọn cho Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Recruitment API",
      version: "1.0.0",
      description: "API documentation for Recruitment system",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local server",
      },
    ],
  },
  // Tìm kiếm các tập tin chứa các tài liệu API
  apis: ["./src/routes/*.ts"], // Cập nhật đường dẫn nếu cần thiết
};

// Tạo swagger specification
const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app: Express) => {
  // Cấu hình route cho Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
