/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, Foundry, test } from "../fixtures";
import {
    confirmDialog,
    createCharacter,
    createGroup,
    createItems,
    openSheet,
    placeTokens,
    viewNewScene,
    type DocumentRef,
} from "../helpers";

type Reference = { id: string; type: string; target: string; sort: number };

function references(foundry: Foundry, groupId: string): Promise<Reference[]> {
    return foundry.eval(
        (id) =>
            window.game.actors
                .get(id)
                .items.contents.filter((item: any) => ["actorReference", "tokenReference"].includes(item.type))
                .sort((a: any, b: any) => a.sort - b.sort)
                .map((item: any) => ({ id: item.id, type: item.type, target: item.system.id, sort: item.sort })),
        groupId,
    );
}

function inlineNames(foundry: Foundry, groupId: string) {
    return foundry.eval(
        (id) =>
            [...window.game.actors.get(id).sheet.element.querySelectorAll(".fatex-js-actor-group-sheets .fatex-headline__text")].map(
                (element: any) => element.textContent.trim(),
            ),
        groupId,
    );
}

/** Drops document data on an element, like a drag from the sidebar. */
function drop(foundry: Foundry, selector: string, data: Record<string, unknown>) {
    return foundry.eval(
        ({ selector, data }) => {
            const target = document.querySelector(selector);
            if (!target) throw new Error(`No drop target ${selector}`);
            const dataTransfer = new DataTransfer();
            dataTransfer.setData("text/plain", JSON.stringify(data));
            target.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }));
        },
        { selector, data },
    );
}

async function groupWithMembers(gm: Foundry, names: string[]) {
    const members: DocumentRef[] = [];
    for (const name of names) members.push(await createCharacter(gm, name));
    const group = await createGroup(gm, "E2E Group", { system: { groupType: "manual" } });
    await createItems(
        gm,
        group.id,
        members.map((member, index) => ({
            name: `actorReference-${member.id}`,
            type: "actorReference",
            system: { id: member.id },
            sort: 100000 + index,
        })),
    );
    return { group, members };
}

test.describe("manual groups", () => {
    test("shows its members as inline sheets in their order", async ({ gm }) => {
        const { group } = await groupWithMembers(gm, ["E2E Alpha", "E2E Beta"]);
        const sheet = await openSheet(gm, group.uuid);

        await expect(sheet.locator(".fatex__inline_sheet")).toHaveCount(2);
        expect(await inlineNames(gm, group.id)).toEqual(["E2E Alpha", "E2E Beta"]);
        // Groups have no token or sheet configuration.
        const controls = await gm.eval((id) => window.game.actors.get(id).sheet._getHeaderControls().map((c: any) => c.action), group.id);
        expect(controls).not.toContain("configurePrototypeToken");
        expect(controls).not.toContain("configureToken");
        expect(controls).not.toContain("configureSheet");
    });

    test("adds actors and folders dropped on the group, once", async ({ gm }) => {
        const { group } = await groupWithMembers(gm, ["E2E Alpha"]);
        const extra = await createCharacter(gm, "E2E Gamma");
        const folder = await gm.eval(async () => {
            const folder = await window.foundry.documents.Folder.create({ name: "E2E Folder", type: "Actor" });
            const actorClass = window.game.actors.documentClass;
            await actorClass.create({ name: "E2E Delta", type: "character", folder: folder.id });
            await actorClass.create({ name: "E2E Epsilon", type: "character", folder: folder.id });
            return folder.uuid;
        });
        await openSheet(gm, group.uuid);
        const desk = `#${await gm.eval((id) => window.game.actors.get(id).sheet.id, group.id)} .fatex-desk__content`;

        await drop(gm, desk, { type: "Actor", uuid: extra.uuid });
        await drop(gm, desk, { type: "Actor", uuid: extra.uuid });
        await expect.poll(() => references(gm, group.id).then((r) => r.length)).toBe(2);

        await drop(gm, desk, { type: "Folder", uuid: folder });
        await expect.poll(() => inlineNames(gm, group.id)).toEqual(["E2E Alpha", "E2E Gamma", "E2E Delta", "E2E Epsilon"]);
    });

    test("an actor dropped on a member joins the group, an item stays with the member", async ({ gm }) => {
        const { group, members } = await groupWithMembers(gm, ["E2E Alpha"]);
        const extra = await createCharacter(gm, "E2E Gamma");
        const [worldAspect] = await createItems(gm, null, [{ name: "E2E Aspect", type: "aspect" }]);
        await openSheet(gm, group.uuid);
        const inline = ".fatex-js-actor-group-sheets .fatex__inline_sheet";

        await drop(gm, inline, { type: "Item", uuid: worldAspect.uuid });
        await expect
            .poll(() => gm.eval((id) => window.game.actors.get(id).items.getName("E2E Aspect")?.type, members[0].id))
            .toBe("aspect");
        expect((await references(gm, group.id)).length).toBe(1);

        await drop(gm, inline, { type: "Actor", uuid: extra.uuid });
        await expect.poll(() => inlineNames(gm, group.id)).toEqual(["E2E Alpha", "E2E Gamma"]);
    });

    test("members can be reordered by dragging their headline", async ({ gm }) => {
        const { group } = await groupWithMembers(gm, ["E2E Alpha", "E2E Beta"]);
        const sheet = await openSheet(gm, group.uuid);
        const headlines = sheet.locator(".fatex__inline_sheet__headline");
        const from = (await headlines.nth(1).boundingBox())!;
        const to = (await headlines.nth(0).boundingBox())!;

        const page = gm.page;
        await page.mouse.move(from.x + 40, from.y + from.height / 2);
        await page.mouse.down();
        for (let step = 1; step <= 20; step++) {
            await page.mouse.move(from.x + 40 + ((to.x - from.x) * step) / 20, to.y + to.height / 2 + (step % 2));
            await page.waitForTimeout(30);
        }
        await page.mouse.up();

        await expect.poll(() => inlineNames(gm, group.id)).toEqual(["E2E Beta", "E2E Alpha"]);
        const sorted = await references(gm, group.id);
        expect(sorted.map((r) => r.sort)).toEqual([100000, 100001]);
    });

    test("removing a member asks first and keeps the actor", async ({ gm }) => {
        const { group, members } = await groupWithMembers(gm, ["E2E Alpha", "E2E Beta"]);
        const sheet = await openSheet(gm, group.uuid);
        const remove = sheet.locator('[data-action="removeFromGroup"]').first();

        await remove.click();
        await confirmDialog(gm, false);
        expect((await references(gm, group.id)).length).toBe(2);

        await remove.click();
        await confirmDialog(gm, true);
        await expect.poll(() => inlineNames(gm, group.id)).toEqual(["E2E Beta"]);
        expect(await gm.eval((id) => !!window.game.actors.get(id), members[0].id)).toBe(true);
    });

    test("editing a member changes the member, not the group", async ({ gm }) => {
        const { group, members } = await groupWithMembers(gm, ["E2E Alpha"]);
        const sheet = await openSheet(gm, group.uuid);
        const fatePoints = sheet.locator('.fatex__inline_sheet input[name="system.fatepoints.current"]');

        await fatePoints.fill("5");
        await fatePoints.press("Tab");
        await expect
            .poll(() => gm.eval((id) => Number(window.game.actors.get(id).system.fatepoints.current), members[0].id))
            .toBe(5);
        const groupData = await gm.eval((id) => window.game.actors.get(id).toObject(), group.id);
        expect(groupData.system.fatepoints).toBeUndefined();
        expect(groupData.name).toBe("E2E Group");
    });

    test("renaming the group in its header", async ({ gm }) => {
        const { group } = await groupWithMembers(gm, ["E2E Alpha"]);
        const sheet = await openSheet(gm, group.uuid);
        const name = sheet.locator('.fatex-group-form input[name="name"]');
        await name.fill("E2E Renamed Group");
        await name.press("Tab");
        await expect.poll(() => gm.eval((id) => window.game.actors.get(id).name, group.id)).toBe("E2E Renamed Group");
    });
});

test.describe("groups for players", () => {
    test("show members by permission and allow no membership changes", async ({ gm, player }) => {
        const { group, members } = await groupWithMembers(gm, ["E2E Owned", "E2E Limited", "E2E Hidden"]);
        await createItems(gm, members[1].id, [{ name: "Secret", type: "aspect", system: { value: "Secret aspect" } }]);
        await gm.eval(
            async ({ groupId, owned, limited, user }) => {
                const { game, CONST } = window;
                const id = game.users.getName(user).id;
                const levels = CONST.DOCUMENT_OWNERSHIP_LEVELS;
                await game.actors.get(owned).update({ [`ownership.${id}`]: levels.OWNER });
                await game.actors.get(limited).update({ [`ownership.${id}`]: levels.LIMITED });
                await game.actors.get(groupId).update({ [`ownership.${id}`]: levels.OBSERVER });
            },
            { groupId: group.id, owned: members[0].id, limited: members[1].id, user: player.user },
        );

        const sheet = await openSheet(player, group.uuid);
        await expect.poll(() => inlineNames(player, group.id)).toEqual(["E2E Owned", "E2E Limited"]);
        await expect(sheet.locator('[data-action="removeFromGroup"]:enabled')).toHaveCount(0);
        await expect(sheet.locator('select[name="system.groupType"]')).toBeDisabled();
        // Like the limited character sheet, a limited member shows only name and portrait.
        const limited = sheet.locator(".fatex__inline_sheet", { hasText: "E2E Limited" });
        await expect(limited.locator(".fatex-inline-tabs")).toHaveCount(0);
        await expect(sheet).not.toContainText("Secret aspect");
        await expect(sheet.locator(".fatex__inline_sheet", { hasText: "E2E Owned" }).locator(".fatex-inline-tabs")).toHaveCount(1);

        // The owner can mark stress on their own character without permission errors.
        await createItems(gm, members[0].id, [{ name: "E2E Physical", type: "stress", system: { size: 3 } }]);
        await sheet.locator('.fatex__inline_sheet [data-tab="stress"]').first().click();
        const box = sheet.locator(".fatex__inline_sheet").first().locator(".fatex-js-stress-checkbox:not(.fatex-checkbox--filler)").first();
        await box.click();
        await expect
            .poll(() => gm.eval((id) => window.game.actors.get(id).items.getName("E2E Physical").system.value, members[0].id))
            .not.toBe(0);
        await expect(player.page.locator("#notifications .notification.error")).toHaveCount(0);
    });
});

test.describe("scene and encounter groups", () => {
    test("a scene group shows the tokens of the viewed scene", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Token Actor");
        const group = await createGroup(gm, "E2E Scene Group", { system: { groupType: "scene" } });
        await viewNewScene(gm, "E2E Scene");
        await openSheet(gm, group.uuid);
        expect(await inlineNames(gm, group.id)).toEqual([]);

        const [token] = await placeTokens(gm, [actor.id]);
        await expect.poll(() => inlineNames(gm, group.id)).toEqual(["E2E Token Actor"]);

        await gm.eval((uuid) => window.foundry.utils.fromUuidSync(uuid).delete(), token.uuid);
        await expect.poll(() => inlineNames(gm, group.id)).toEqual([]);
    });

    test("an encounter group shows the combatants of the active combat", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Fighter");
        const group = await createGroup(gm, "E2E Encounter Group", { system: { groupType: "encounter" } });
        const scene = await viewNewScene(gm, "E2E Combat Scene");
        const [token] = await placeTokens(gm, [actor.id]);
        await openSheet(gm, group.uuid);
        expect(await inlineNames(gm, group.id)).toEqual([]);

        const combatId = await gm.eval(
            async ({ sceneId, tokenId, actorId }) => {
                const combat = await window.game.combats.documentClass.create({ scene: sceneId, active: true });
                await combat.createEmbeddedDocuments("Combatant", [{ tokenId, sceneId, actorId }]);
                return combat.id;
            },
            { sceneId: scene.id, tokenId: token.id, actorId: actor.id },
        );
        await expect.poll(() => inlineNames(gm, group.id)).toEqual(["E2E Fighter"]);

        // The combat belongs to its scene, so another scene has no active combat.
        await viewNewScene(gm, "E2E Quiet Scene");
        await expect.poll(() => inlineNames(gm, group.id)).toEqual([]);
        await gm.eval((id) => window.game.scenes.get(id).view(), scene.id);
        await expect.poll(() => inlineNames(gm, group.id)).toEqual(["E2E Fighter"]);

        // The member follows its token's actor when Link Actor Data changes.
        const memberIsToken = () =>
            gm.eval((id) => window.game.actors.get(id).sheet.inlineSheets[0]?.actor.isToken ?? null, group.id);
        expect(await memberIsToken()).toBe(true);
        await gm.eval(({ s, t }) => window.game.scenes.get(s).tokens.get(t).update({ actorLink: true }), {
            s: scene.id,
            t: token.id,
        });
        await expect.poll(memberIsToken).toBe(false);

        await gm.eval((id) => window.game.combats.get(id).delete(), combatId);
        await expect.poll(() => inlineNames(gm, group.id)).toEqual([]);
    });
});

test.describe("group settings", () => {
    test("the group type can be changed in the header", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Token Actor");
        const group = await createGroup(gm, "E2E Group");
        await viewNewScene(gm, "E2E Scene");
        await placeTokens(gm, [actor.id]);
        const sheet = await openSheet(gm, group.uuid);

        await sheet.locator('select[name="system.groupType"]').selectOption("scene");
        await expect.poll(() => gm.eval((id) => window.game.actors.get(id).system.groupType, group.id)).toBe("scene");
        await expect.poll(() => inlineNames(gm, group.id)).toEqual(["E2E Token Actor"]);
    });

    test("unlinked tokens of the scene can be added to a manual group", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Goblin", { prototypeToken: { actorLink: false } });
        const group = await createGroup(gm, "E2E Group");
        await viewNewScene(gm, "E2E Scene");
        const [token] = await placeTokens(gm, [actor.id], { name: "E2E Goblin Token" });
        const sheet = await openSheet(gm, group.uuid);

        await sheet.locator(`[data-action="createTokenReference"][data-token-id="${token.id}"]`).click();
        await expect.poll(() => references(gm, group.id).then((r) => r.map((x) => x.type))).toEqual(["tokenReference"]);
        // V14 names the synthetic actor of an unlinked token after the token, V13 after the base actor.
        const shown = await gm.eval((uuid) => window.foundry.utils.fromUuidSync(uuid).actor.name, token.uuid);
        expect(["E2E Goblin Token", "E2E Goblin"]).toContain(shown);
        await expect.poll(() => inlineNames(gm, group.id)).toEqual([shown]);
        // A referenced token is no longer offered.
        await expect(sheet.locator('[data-action="createTokenReference"]')).toHaveCount(0);

        // Renaming in the token's own sheet changes its synthetic actor.
        await gm.eval((uuid) => window.foundry.utils.fromUuidSync(uuid).actor.update({ name: "E2E Renamed Token" }), token.uuid);
        await expect.poll(() => inlineNames(gm, group.id)).toEqual(["E2E Renamed Token"]);
    });

    test("the token list follows the scene and hides hidden tokens from players", async ({ gm, browser, playerUser }) => {
        const goblin = await createCharacter(gm, "E2E Goblin", {
            prototypeToken: { actorLink: false },
            ownership: { default: 1 },
        });
        const group = await createGroup(gm, "E2E Group", { ownership: { default: 3 } });
        const scene = await viewNewScene(gm, "E2E Scene");
        const [visible] = await placeTokens(gm, [goblin.id], { name: "E2E Visible" });
        const [hidden] = await placeTokens(gm, [goblin.id], { name: "E2E Hidden", hidden: true });
        const offered = (sheet: ReturnType<Foundry["page"]["locator"]>) =>
            sheet.locator('[data-action="createTokenReference"]');

        const sheet = await openSheet(gm, group.uuid);
        await expect(offered(sheet)).toHaveCount(2);
        // New and deleted tokens update an open group.
        const [later] = await placeTokens(gm, [goblin.id], { name: "E2E Later" });
        await expect(offered(sheet)).toHaveCount(3);
        await gm.eval(({ s, t }) => window.game.scenes.get(s).tokens.get(t).delete(), { s: scene.id, t: later.id });
        await expect(offered(sheet)).toHaveCount(2);

        // Players see only the tokens they could see on the canvas. The player joins once the scene is active,
        // because Foundry fails to draw tokens when a scene is activated while the canvas is still empty.
        await gm.eval((id) => window.game.scenes.get(id).activate(), scene.id);
        const player = await Foundry.open(browser, playerUser);
        try {
            await expect.poll(() => player.eval(() => window.canvas.ready && window.canvas.scene?.id)).toBe(scene.id);
            const playerSheet = await openSheet(player, group.uuid);
            await expect(offered(playerSheet)).toHaveCount(1);
            await expect(playerSheet.locator(`[data-token-id="${visible.id}"]`)).toHaveCount(1);
            await expect(playerSheet.locator(`[data-token-id="${hidden.id}"]`)).toHaveCount(0);
            expect(player.errors, "player errors").toEqual([]);
        } finally {
            await player.page.context().close();
        }

        // Another scene offers its own tokens.
        await viewNewScene(gm, "E2E Empty Scene");
        await expect(offered(sheet)).toHaveCount(0);
    });
});
