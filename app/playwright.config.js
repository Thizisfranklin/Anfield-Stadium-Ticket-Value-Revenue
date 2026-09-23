import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  use: { baseURL: "http://127.0.0.1:4173", headless: true },
  webServer: {
    command:
      "node node_modules/vite/bin/vite.js preview --configLoader native --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
  },
  reporter: "list",
});
