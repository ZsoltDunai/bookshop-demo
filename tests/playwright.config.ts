import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:8000";

export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "api-functional",
      testMatch: /api\/functional\/.*\.spec\.ts/,
    },
    {
      name: "api-non-functional",
      testMatch: /api\/non-functional\/.*\.spec\.ts/,
    },
    {
      name: "api-contract",
      testMatch: /api\/contract\/.*\.spec\.ts/,
    },
    {
      name: "ui",
      testMatch: /ui\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  ...(process.env.DOCKER
    ? {}
    : {
        webServer: {
          command:
            process.platform === "win32"
              ? "cd ../backend && .venv\\Scripts\\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"
              : "cd ../backend && .venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000",
          url: `${BASE_URL}/health`,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
