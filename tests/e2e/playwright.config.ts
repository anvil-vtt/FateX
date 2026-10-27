import { defineConfig } from "@playwright/test";

const baseURL = process.env.FOUNDRY_URL ?? "http://localhost:8080";
const foundryMain = process.env.FOUNDRY_MAIN;
const foundryData = process.env.FOUNDRY_DATA;

export default defineConfig({
    testDir: "./specs",
    // All tests share one Foundry world, so they run one after another.
    fullyParallel: false,
    workers: 1,
    timeout: 90_000,
    expect: { timeout: 10_000 },
    globalSetup: "./global-setup.ts",
    reporter: [["list"], ["html", { open: "never", outputFolder: "../../playwright-report" }]],
    outputDir: "../../test-results",
    use: {
        baseURL,
        viewport: { width: 1600, height: 1000 },
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
    },
    webServer: [
        // Starts Foundry only when its install is configured, otherwise an already running server is used.
        ...(foundryMain && foundryData
            ? [
                  {
                      command: `node "${foundryMain}" --dataPath="${foundryData}" --port=30000 --noupnp`,
                      url: "http://localhost:30000/api/status",
                      reuseExistingServer: true,
                      timeout: 120_000,
                  },
              ]
            : []),
        {
            command: "npm start",
            cwd: "../..",
            url: `${baseURL}/systems/fatex/system.json`,
            reuseExistingServer: true,
            timeout: 120_000,
        },
    ],
});
