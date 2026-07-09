import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/reactflow") ||
            id.includes("node_modules/@reactflow")
          ) {
            return "reactflow";
          }
          if (
            id.includes("node_modules/@monaco-editor/react") ||
            id.includes("node_modules/monaco-editor")
          ) {
            return "monaco";
          }
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    globals: true,
  },
});
