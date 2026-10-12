/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Locator } from "@playwright/test";
import type { Foundry } from "./fixtures";

export type DocumentRef = { id: string; uuid: string; name: string };

/** Creates a character directly, without the template picker. */
export async function createCharacter(foundry: Foundry, name: string, data: Record<string, any> = {}) {
    return foundry.eval(
        async ({ name, data }) => {
            const actor = await window.game.actors.documentClass.create({ name, type: "character", ...data });
            return { id: actor.id, uuid: actor.uuid, name: actor.name } as DocumentRef;
        },
        { name, data },
    );
}

export async function createGroup(foundry: Foundry, name: string, data: Record<string, any> = {}) {
    return foundry.eval(
        async ({ name, data }) => {
            const actor = await window.game.actors.documentClass.create({ name, type: "group", ...data });
            return { id: actor.id, uuid: actor.uuid, name: actor.name } as DocumentRef;
        },
        { name, data },
    );
}

export async function createItems(foundry: Foundry, actorId: string | null, items: Record<string, any>[]) {
    return foundry.eval(
        async ({ actorId, items }) => {
            const { game } = window;
            const created = actorId
                ? await game.actors.get(actorId).createEmbeddedDocuments("Item", items)
                : await game.items.documentClass.createDocuments(items);
            return created.map((item: any) => ({ id: item.id, uuid: item.uuid, name: item.name })) as DocumentRef[];
        },
        { actorId, items },
    );
}

/** Opens the sheet of a document and returns its window. */
export async function openSheet(foundry: Foundry, uuid: string): Promise<Locator> {
    const id = await foundry.eval(async (uuid) => {
        const document = window.foundry.utils.fromUuidSync(uuid);
        await document.sheet.render({ force: true });
        return document.sheet.id as string;
    }, uuid);
    const sheet = foundry.page.locator(`[id="${id}"]`);
    await sheet.waitFor();
    return sheet;
}

/** The single open window of an application class, e.g. "SheetSetup". */
export function app(foundry: Foundry, className: string) {
    return foundry.eval((name) => {
        const app = [...window.foundry.applications.instances.values()].find((a: any) => a.constructor.name === name);
        return app?.id as string | undefined;
    }, className);
}

export function dialog(foundry: Foundry) {
    return foundry.page.locator(".application.dialog").last();
}

export async function confirmDialog(foundry: Foundry, confirm = true) {
    const window = dialog(foundry);
    await window.locator(`button[data-action="${confirm ? "yes" : "no"}"]`).click();
    await window.waitFor({ state: "detached" });
}

/** Reads document data from the client. */
export function getDocument(foundry: Foundry, uuid: string) {
    return foundry.eval((uuid) => window.foundry.utils.fromUuidSync(uuid)?.toObject() ?? null, uuid);
}

export function getItems(foundry: Foundry, actorId: string, type?: string) {
    return foundry.eval(
        ({ actorId, type }) =>
            window.game.actors
                .get(actorId)
                .items.filter((item: any) => !type || item.type === type)
                .map((item: any) => item.toObject()),
        { actorId, type },
    );
}

export function chatMessages(foundry: Foundry) {
    return foundry.eval(() =>
        window.game.messages.contents.map((message: any) => ({
            id: message.id,
            content: message.content as string,
            flags: message.flags,
            speaker: message.speaker,
            whisper: message.whisper,
            blind: message.blind,
        })),
    );
}

export function lastChatMessage(foundry: Foundry) {
    return foundry.page.locator("#chat .chat-log .chat-message, #chat-log .chat-message").last();
}

/** Changes an input like a user: fill and leave the field. */
export async function setInput(locator: Locator, value: string) {
    await locator.fill(value);
    await locator.press("Tab");
}

/** Creates a scene, views it and waits until the canvas has drawn it. */
export async function viewNewScene(foundry: Foundry, name: string) {
    return foundry.eval(async (name) => {
        const { game, Hooks } = window as any;
        const scene = await game.scenes.documentClass.create({ name, width: 1000, height: 1000 });
        const drawn = new Promise((resolve) => Hooks.once("canvasReady", resolve));
        await scene.view();
        await drawn;
        return { id: scene.id, uuid: scene.uuid, name: scene.name } as DocumentRef;
    }, name);
}

/** Places tokens of actors on the viewed scene. */
export async function placeTokens(foundry: Foundry, actorIds: string[], data: Record<string, any> = {}) {
    return foundry.eval(
        async ({ actorIds, data }) => {
            const { game, canvas } = window as any;
            const tokens: any[] = [];
            for (const [index, id] of actorIds.entries()) {
                const token = await game.actors.get(id).getTokenDocument({ x: 100 * (index + 1), y: 100, ...data });
                tokens.push(token.toObject());
            }
            const created = await canvas.scene.createEmbeddedDocuments("Token", tokens);
            return created.map((token: any) => ({ id: token.id, uuid: token.uuid, name: token.name })) as DocumentRef[];
        },
        { actorIds, data },
    );
}
