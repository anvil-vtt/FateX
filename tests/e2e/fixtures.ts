/* eslint-disable @typescript-eslint/no-explicit-any */
import { test as base, expect, type Browser, type Page } from "@playwright/test";

export { expect };

export const PLAYER = "E2E Player";

declare global {
    interface Window {
        game: any;
        ui: any;
        foundry: any;
        CONFIG: any;
        CONST: any;
        Hooks: any;
        __e2eTrack: (uuid: string) => void;
    }
}

const TRACKED = ["Actor", "Item", "ChatMessage", "Scene", "Folder", "Combat", "JournalEntry", "Macro", "User"];

/** One logged in Foundry client, as GM or as player. */
export class Foundry {
    readonly errors: string[] = [];
    readonly created = new Set<string>();
    private readonly settings = new Map<string, unknown>();

    constructor(
        readonly page: Page,
        readonly user: string,
    ) {
        page.on("pageerror", (error) => this.errors.push(`pageerror: ${error.message}\n${error.stack ?? ""}`));
        page.on("console", (message) => {
            const text = message.text();
            const fromFateX = text.includes("systems/fatex") || message.location().url.includes("systems/fatex");
            if (message.type() === "error" && !IGNORED_ERRORS.some((pattern) => pattern.test(text))) {
                this.errors.push(`console.error: ${text}`);
            } else if (message.type() === "warning" && fromFateX) {
                // Deprecation warnings carry the stack of the calling system.
                this.errors.push(`console.warn: ${text}`);
            }
        });
    }

    /** Removes expected errors, e.g. from an error notification, and returns them. */
    takeErrors(pattern: RegExp) {
        const taken = this.errors.filter((error) => pattern.test(error));
        this.errors.splice(0, this.errors.length, ...this.errors.filter((error) => !pattern.test(error)));
        return taken;
    }

    static async open(browser: Browser, user: string) {
        const context = await browser.newContext();
        const page = await context.newPage();
        // The dev server overlay would cover the page; errors are still collected above.
        await page.addInitScript(() => {
            // Foundry starts its welcome tour in every new browser session; it switches scenes and blocks clicks.
            localStorage.setItem("core.tourProgress", JSON.stringify({ core: { welcome: 0 } }));
            new MutationObserver(() => document.getElementById("webpack-dev-server-client-overlay")?.remove()).observe(
                document,
                { childList: true, subtree: true },
            );
        });
        const foundry = new Foundry(page, user);
        await page.exposeFunction("__e2eTrack", (uuid: string) => foundry.created.add(uuid));
        await foundry.join();
        return foundry;
    }

    async join() {
        await this.page.goto("/join");
        await this.page.locator('select[name="userid"], select[name="userId"]').selectOption({ label: this.user });
        await this.page.getByRole("button", { name: /join game session/i }).click();
        await this.waitForReady();
    }

    async reload() {
        await this.page.reload();
        await this.waitForReady();
    }

    private async waitForReady() {
        await this.page.waitForFunction(() => window.game?.ready, null, { timeout: 60_000 });
        await this.page.evaluate((names) => {
            for (const name of names) {
                window.Hooks.on(`create${name}`, (document: any) => {
                    if (!document.parent && !document.pack) window.__e2eTrack(document.uuid);
                });
            }
            window.foundry.nue.Tour.activeTour?.exit();
            // Headless browsers have no GPU; the warning about it would cover window headers.
            window.ui.notifications.clear?.();
        }, TRACKED);
    }

    /** Runs a function in the browser. */
    eval<R, A = undefined>(fn: (arg: A) => R | Promise<R>, arg?: A): Promise<R> {
        return this.page.evaluate(fn as any, arg) as Promise<R>;
    }

    /** Changes a world or client setting and restores it after the test. */
    async setSetting(key: string, value: unknown, { reload = false } = {}) {
        const original = await this.eval(([k, v]) => {
            const [namespace, name] = (k as string).split(".");
            const previous = window.game.settings.get(namespace, name);
            return window.game.settings.set(namespace, name, v).then(() => previous);
        }, [key, value] as const);
        if (!this.settings.has(key)) this.settings.set(key, original);
        if (reload) await this.reload();
    }

    async restoreSettings() {
        if (!this.settings.size) return;
        let reload = false;
        for (const [key, value] of this.settings) {
            reload ||= await this.eval(
                ([k, v]) => {
                    const [namespace, name] = (k as string).split(".");
                    const config = window.game.settings.settings.get(k);
                    if (window.game.settings.get(namespace, name) === v) return false;
                    return window.game.settings.set(namespace, name, v).then(() => !!config?.requiresReload);
                },
                [key, value] as const,
            );
        }
        this.settings.clear();
        if (reload) await this.reload();
    }

    /**
     * Makes dice results predictable. Each die takes the next value, between 0 and 1.
     * For Fate dice 0.99 rolls +, 0.5 rolls 0 and 0.01 rolls -.
     */
    async fixDice(values: number[]) {
        await this.eval((values) => {
            const w = window as any;
            w.__e2eRandom ??= w.CONFIG.Dice.randomUniform;
            let index = 0;
            w.CONFIG.Dice.randomUniform = () => values[index++ % values.length];
        }, values);
    }

    async resetDice() {
        await this.eval(() => {
            const w = window as any;
            if (w.__e2eRandom) w.CONFIG.Dice.randomUniform = w.__e2eRandom;
            delete w.__e2eRandom;
        });
    }

    /** Closes every document sheet, dialog and FateX window. */
    async closeWindows() {
        await this.eval(async () => {
            for (const app of [...window.foundry.applications.instances.values()]) {
                const fatex = app.options?.classes?.includes("fatex");
                if (app.document || fatex || app.constructor.name.includes("Dialog") || app.constructor.name.includes("FilePicker")) {
                    await app.close({ animate: false });
                }
            }
        });
    }

    /** Deletes every top-level document created since the last cleanup. */
    async deleteCreated() {
        const uuids = [...this.created];
        this.created.clear();
        await this.eval(async (list) => {
            // Delete combats first, they reference scenes and actors.
            const ordered = list.sort((a) => (a.startsWith("Combat.") ? -1 : 0));
            for (const uuid of ordered) {
                const document = window.foundry.utils.fromUuidSync(uuid);
                if (document && document.name !== "E2E Player") await document.delete();
            }
        }, uuids);
    }
}

const IGNORED_ERRORS = [
    // Browsers log failed resource loads, e.g. a missing favicon.
    /Failed to load resource/,
];

type WorkerFixtures = { gm: Foundry; playerUser: string };
type TestFixtures = { player: Foundry; guard: void };

export const test = base.extend<TestFixtures, WorkerFixtures>({
    gm: [
        async ({ browser }, use) => {
            const gm = await Foundry.open(browser, "Gamemaster");
            await use(gm);
            await gm.page.context().close();
        },
        { scope: "worker", timeout: 120_000 },
    ],

    playerUser: [
        async ({ gm }, use) => {
            await gm.eval(async (name) => {
                const { game, CONST } = window;
                if (!game.users.getName(name)) await game.users.documentClass.create({ name, role: CONST.USER_ROLES.PLAYER });
            }, PLAYER);
            await use(PLAYER);
        },
        { scope: "worker" },
    ],

    // A fresh player session per test, so permissions from the test apply.
    player: async ({ browser, playerUser }, use) => {
        const player = await Foundry.open(browser, playerUser);
        await use(player);
        expect(player.errors, "player errors").toEqual([]);
        await player.page.context().close();
    },

    // Fails a test on uncaught errors or FateX deprecation warnings, and removes what it created.
    guard: [
        async ({ gm }, use) => {
            gm.errors.length = 0;
            await use();
            const errors = [...gm.errors];
            await gm.closeWindows();
            await gm.resetDice();
            await gm.deleteCreated();
            await gm.restoreSettings();
            expect(errors, "GM errors").toEqual([]);
        },
        { auto: true },
    ],
});
