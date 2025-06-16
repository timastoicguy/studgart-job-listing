import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // Nạp biến môi trường

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_APP_PORT || "5173"), // Lấy cổng từ biến môi trường
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL, // Lấy URL từ biến môi trường
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@views": path.resolve(__dirname, "./src/views"),
      },
    },
  };
});
