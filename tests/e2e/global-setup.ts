import type { FullConfig } from "@playwright/test";

export const WORLD_ID = process.env.FOUNDRY_WORLD ?? "fatex-e2e";

type Status = { active?: boolean; world?: string; system?: string; version?: string };

async function status(baseURL: string): Promise<Status> {
    const response = await fetch(`${baseURL}/api/status`);
    return response.ok ? ((await response.json()) as Status) : {};
}

async function post(baseURL: string, route: string, body: Record<string, unknown>) {
    const response = await fetch(`${baseURL}${route}`, {
        method: "POST",
        // Foundry rejects cross-site POST requests.
        headers: { "Content-Type": "application/json", "Sec-Fetch-Site": "same-origin" },
        body: JSON.stringify(body),
        redirect: "manual",
    });
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        return { status: response.status, text };
    }
}

/**
 * Makes sure the test world exists and is the active world.
 * The world is created on first use, with FateX as its system.
 */
export default async function globalSetup(config: FullConfig) {
    const baseURL = config.projects[0].use.baseURL ?? "http://localhost:8080";
    let current = await status(baseURL);

    if (current.active && current.world !== WORLD_ID) {
        throw new Error(
            `World "${current.world}" is active. Return to setup or set FOUNDRY_WORLD to run the tests in it.`,
        );
    }

    if (!current.active) {
        const world = { action: "createWorld", id: WORLD_ID, title: "FateX E2E", system: "fatex" };
        // Foundry V14 creates worlds on /create, V13 on /setup.
        let created = await post(baseURL, "/create", world);
        if (created?.status === 404 || created?.error?.includes?.("Unsupported")) {
            created = await post(baseURL, "/setup", world);
        }
        if (created?.error && !created.error.includes("already exists")) {
            throw new Error(`Could not create the test world: ${created.error}`);
        }

        const launched = await post(baseURL, "/setup", { action: "launchWorld", world: WORLD_ID });
        if (launched?.error) throw new Error(`Could not launch the test world: ${launched.error}`);

        for (let i = 0; i < 60 && !current.active; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            current = await status(baseURL);
        }
        if (!current.active) throw new Error("The test world did not start within 60 seconds.");
    }

    if (current.system !== "fatex") throw new Error(`World "${current.world}" uses ${current.system}, not fatex.`);
    process.env.FOUNDRY_VERSION = current.version;
}
