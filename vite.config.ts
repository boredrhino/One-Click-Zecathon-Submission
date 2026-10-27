import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const oneClickProxy = {
  "/oneclick": {
    target: "https://1click.chaindefuser.com",
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/oneclick/, ""),
  },
};

export default defineConfig({
  plugins: [react()],
  server: { proxy: oneClickProxy },
  preview: { proxy: oneClickProxy },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
