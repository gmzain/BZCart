import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: "brotliCompress" }), // ✅ Serve compressed files
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["lucide-react", "react-icons", "react-slick"],
          utils: ["axios", "@reduxjs/toolkit", "uuid"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "terser", // ✅ Better compression
  },
});
