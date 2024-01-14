import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.USE_DEV_SERVER ? 3000 : 3001;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    colorScheme: "dark",
    trace: "on-first-retry",
    video: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: process.env.USE_DEV_SERVER
      ? "npm run dev"
      : `npm run build && PORT=${PORT} npm start`,
    cwd: "..",
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
