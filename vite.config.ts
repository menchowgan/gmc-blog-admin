import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.join(__dirname, "src")
    },
  },
  server: {
    port: 8181,
    open: true,
    proxy: {
      '/hello': {
        target: "http://127.0.0.1:8888",
        changeOrigin: true
      },
      "/user": {
        target: "http://127.0.0.1:8888",
        changeOrigin: true
      },

      "/photo": {
        target: "http://127.0.0.1:8888",
        changeOrigin: true
      },

      "/music": {
        target: "http://127.0.0.1:8888",
        changeOrigin: true
      },

      "/article": {
        target: "http://127.0.0.1:8888",
        changeOrigin: true
      },

      "/video": {
        target: "http://127.0.0.1:8888",
        changeOrigin: true
      },
    }
  }
})