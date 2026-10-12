/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, type Foundry } from "../fixtures";
import {
    confirmDialog,
    createCharacter,
    createItems,
    enterEditMode,
    getItems,
    headerControl,
    openSheet,
    setInput,
} from "../helpers";

const actorData = (foundry: Foundry, id: string) => foundry.eval((id) => window.game.actors.get(id).toObject(), id);
const messageCount = (foundry: Foundry) => foundry.eval(() => window.game.messages.size);

/** Closes item sheets that open after adding an item. */
async function closeItemSheets(foundry: Foundry) {
    await foundry.eval(async () => {
        for (const app of [...window.foundry.applications.instances.values()] as any[]) {
            if (app.document?.documentName === "Item") await app.close({ animate: false });
        }
    });
}

test.describe("character sheet", () => {
    test("shows a hint for an empty actor and edits name and fate points", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Hero");
        const sheet = await openSheet(gm, actor.uuid);
        await expect(sheet.locator(".fatex-message")).toBeVisible();

        // Each change submits the sheet and renders it again.
        await setInput(sheet.locator('.fatex-header input[name="name"]'), "E2E Renamed Hero");
        await expect.poll(() => actorData(gm, actor.id).then((a) => a.name)).toBe("E2E Renamed Hero");
        await setInput(sheet.locator('input[name="system.fatepoints.current"]'), "1");
        await expect.poll(() => actorData(gm, actor.id).then((a) => `${a.system.fatepoints.current}`)).toBe("1");
        await setInput(sheet.locator('input[name="system.fatepoints.refresh"]'), "4");
        await expect.poll(() => actorData(gm, actor.id).then((a) => `${a.system.fatepoints.refresh}`)).toBe("4");
    });

    test("editing actions only work in edit mode", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Hero");
        const sheet = await openSheet(gm, actor.uuid);
        const add = sheet.locator(".fatex-js-aspect-add");
        await expect(add).toHaveCSS("pointer-events", "none");

        await enterEditMode(gm, sheet);
        await expect(add).not.toHaveCSS("pointer-events", "none");
        await headerControl(gm, sheet, "toggleEditMode");
        await expect(add).toHaveCSS("pointer-events", "none");
    });

    test("aspects can be added, written, configured, sent to chat and deleted", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Hero");
        const sheet = await openSheet(gm, actor.uuid);
        await enterEditMode(gm, sheet);

        await sheet.locator(".fatex-js-aspect-add").click();
        await expect.poll(() => getItems(gm, actor.id, "aspect").then((items) => items.length)).toBe(1);
        // A new item opens its sheet.
        await expect(gm.page.locator(".fatex-sheet--item")).toBeVisible();
        await closeItemSheets(gm);

        const [aspect] = await getItems(gm, actor.id, "aspect");
        const input = sheet.locator(`.fatex-js-aspect-input[data-item-id="${aspect._id}"]`);
        await input.click();
        await input.pressSequentially("Captain of the Gallant");
        await sheet.locator(".fatex-header__logo").click();
        await expect
            .poll(() => getItems(gm, actor.id, "aspect").then((items) => items[0].system.value))
            .toContain("Captain of the Gallant");

        await sheet.locator(`.fatex-js-aspect-settings[data-item="${aspect._id}"]`).click();
        await expect(gm.page.locator(".fatex-sheet--item")).toBeVisible();
        await closeItemSheets(gm);

        const before = await messageCount(gm);
        await sheet.locator(`.fatex-js-item-to-chat[data-item="${aspect._id}"]`).click();
        await expect.poll(() => messageCount(gm)).toBe(before + 1);
        await expect(gm.page.locator(".chat-message .fatex-item-card").last()).toContainText("Captain of the Gallant");

        await sheet.locator(`.fatex-js-aspect-delete[data-item="${aspect._id}"]`).click();
        await confirmDialog(gm, false);
        expect((await getItems(gm, actor.id, "aspect")).length).toBe(1);
        await sheet.locator(`.fatex-js-aspect-delete[data-item="${aspect._id}"]`).click();
        await confirmDialog(gm, true);
        await expect.poll(() => getItems(gm, actor.id, "aspect").then((items) => items.length)).toBe(0);
    });

    test("skills change rank in edit mode and roll outside of it", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Hero");
        await createItems(gm, actor.id, [
            { name: "Fight", type: "skill", system: { rank: 2 }, sort: 1 },
            { name: "Athletics", type: "skill", system: { rank: 4 }, sort: 2 },
            { name: "Lore", type: "skill", system: { rank: 1 }, sort: 3 },
        ]);
        const sheet = await openSheet(gm, actor.uuid);
        const skills = () => getItems(gm, actor.id, "skill");
        const order = () =>
            skills().then((items) => items.sort((a: any, b: any) => a.sort - b.sort).map((item: any) => item.name));
        const fight = (await skills()).find((s: any) => s.name === "Fight");

        const before = await messageCount(gm);
        await sheet.locator(`.fatex-js-skill[data-item-id="${fight._id}"] .fatex-headline__text`).click();
        await expect.poll(() => messageCount(gm)).toBe(before + 1);
        await expect(gm.page.locator(".chat-message .fatex-chat__roll").last()).toContainText("Fight");

        await enterEditMode(gm, sheet);
        await sheet.locator(`.fatex-js-skill-increment[data-item="${fight._id}"]`).click();
        await expect.poll(() => skills().then((s) => s.find((x: any) => x.name === "Fight").system.rank)).toBe(3);
        await sheet.locator(`.fatex-js-skill-decrement[data-item="${fight._id}"]`).click();
        await expect.poll(() => skills().then((s) => s.find((x: any) => x.name === "Fight").system.rank)).toBe(2);

        // Clicking a skill in edit mode does not roll.
        await sheet.locator(`.fatex-js-skill[data-item-id="${fight._id}"] .fatex-headline__text`).click();
        await gm.page.waitForTimeout(500);
        expect(await messageCount(gm)).toBe(before + 1);

        await sheet.locator(".fatex-js-skill-sort-rank").click();
        await expect.poll(order).toEqual(["Athletics", "Fight", "Lore"]);
        await sheet.locator(".fatex-js-skill-sort-name").click();
        await expect.poll(order).toEqual(["Athletics", "Fight", "Lore"]);
        await sheet.locator(".fatex-js-skill-sort-reverse").click();
        await expect.poll(order).toEqual(["Lore", "Fight", "Athletics"]);

        await sheet.locator(".fatex-js-skill-add").click();
        await expect.poll(() => skills().then((s) => s.length)).toBe(4);
        await closeItemSheets(gm);
    });

    test("stunts and extras collapse, show their description and go to chat", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Hero");
        const [stunt, extra] = await createItems(gm, actor.id, [
            { name: "E2E Stunt", type: "stunt", system: { description: "<p>Stunt text</p>" } },
            { name: "E2E Extra", type: "extra", system: { description: "<p>Extra text</p>" } },
        ]);
        const sheet = await openSheet(gm, actor.uuid);
        const collapsed = (id: string) =>
            gm.eval(({ actor, id }) => window.game.actors.get(actor).items.get(id).system.collapsed, { actor: actor.id, id });

        await expect(sheet.locator(`.fatex__stunt[data-item-id="${stunt.id}"] .fatex-item-description`)).toContainText("Stunt text");
        await sheet.locator(`.fatex-js-item-collapse[data-item="${stunt.id}"]`).click();
        await expect.poll(() => collapsed(stunt.id)).toBe(true);
        await expect(sheet.locator(`.fatex__stunt[data-item-id="${stunt.id}"] .fatex-item-description`)).toHaveCount(0);

        await sheet.locator('a[data-tab="extras"]').click();
        await expect(sheet.locator('.tab[data-tab="extras"]')).toContainText("Extra text");
        await sheet.locator(`.fatex-js-item-collapse[data-item="${extra.id}"]`).click();
        await expect.poll(() => collapsed(extra.id)).toBe(true);
        // A single click toggles once.
        await gm.page.waitForTimeout(300);
        expect(await collapsed(extra.id)).toBe(true);

        const before = await messageCount(gm);
        await sheet.locator(`.fatex-js-item-to-chat[data-item="${extra.id}"]`).click();
        await expect.poll(() => messageCount(gm)).toBe(before + 1);
        await expect(gm.page.locator(".chat-message .fatex-item-card").last()).toContainText("Extra text");

        await enterEditMode(gm, sheet);
        await sheet.locator(".fatex-js-extra-add").click();
        await sheet.locator('a[data-tab="skills"]').click();
        await sheet.locator(".fatex-js-stunt-add").click();
        await expect.poll(() => getItems(gm, actor.id).then((items) => items.length)).toBe(4);
        await closeItemSheets(gm);
    });

    test("stress boxes toggle and new tracks can be added", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Hero");
        const [stress] = await createItems(gm, actor.id, [{ name: "Physical", type: "stress", system: { size: 3 } }]);
        const sheet = await openSheet(gm, actor.uuid);
        const value = () =>
            gm.eval(({ actor, id }) => window.game.actors.get(actor).items.get(id).system.value, { actor: actor.id, id: stress.id });
        const boxes = sheet.locator(`.fatex-js-stress-checkbox[data-item="${stress.id}"]`);

        await expect(boxes).toHaveCount(3);
        await expect(boxes.locator(".fatex-checkbox__label")).toHaveText(["1", "2", "3"]);
        await boxes.nth(1).click();
        await expect.poll(value).toBe(2);
        await boxes.nth(2).click();
        await expect.poll(value).toBe(6);
        await boxes.nth(1).click();
        await expect.poll(value).toBe(4);

        await enterEditMode(gm, sheet);
        await sheet.locator(".fatex-js-stress-add").click();
        await expect.poll(() => getItems(gm, actor.id, "stress").then((items) => items.length)).toBe(2);
        await closeItemSheets(gm);
    });

    test("consequences take text and conditions toggle", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Hero");
        const [consequence, condition] = await createItems(gm, actor.id, [
            { name: "Mild", type: "consequence", system: { label: "Mild", icon: "2", type: 0 } },
            { name: "Angry", type: "consequence", system: { label: "Angry", icon: "1", type: 1 } },
        ]);
        const sheet = await openSheet(gm, actor.uuid);
        const item = (id: string) =>
            gm.eval(({ actor, id }) => window.game.actors.get(actor).items.get(id).system, { actor: actor.id, id });

        const input = sheet.locator(`.fatex-js-consequence-input[data-item-id="${consequence.id}"]`);
        await input.click();
        await input.pressSequentially("Broken arm");
        await sheet.locator(".fatex-header__logo").click();
        await expect.poll(() => item(consequence.id).then((s) => s.value)).toContain("Broken arm");

        await sheet.locator(`.fatex-js-consequence-checkbox[data-item="${condition.id}"]`).click();
        await expect.poll(() => item(condition.id).then((s) => s.active)).toBe(true);

        await enterEditMode(gm, sheet);
        await sheet.locator(".fatex-js-consequence-add").click();
        await expect.poll(() => getItems(gm, actor.id, "consequence").then((items) => items.length)).toBe(3);
        await closeItemSheets(gm);
    });

    test("the biography is saved from the editor", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Hero");
        const sheet = await openSheet(gm, actor.uuid);
        await sheet.locator('a[data-tab="bio"]').click();

        const editor = sheet.locator('prose-mirror[name="system.biography.value"]');
        // The edit button shows on hover.
        await editor.hover();
        await editor.locator("button.toggle").click();
        const content = editor.locator(".ProseMirror[contenteditable='true']");
        await content.click();
        await content.pressSequentially("Born on a ship.");
        await editor.locator('button[data-action="save"], button.toggle').first().click();

        await expect.poll(() => actorData(gm, actor.id).then((a) => a.system.biography.value)).toContain("Born on a ship.");
        await expect(sheet.locator('.tab[data-tab="bio"]')).toContainText("Born on a ship.");
    });

    test("the portrait opens the file picker", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Hero");
        const sheet = await openSheet(gm, actor.uuid);
        await sheet.locator('img[data-action="editImage"]').click();
        await expect(gm.page.locator("#file-picker")).toBeVisible();
        // Closing the picker while its search is pending trips a Foundry error.
        await gm.page.waitForTimeout(500);
    });

    test("journal entries, item folders and items can be dropped on the sheet", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Hero");
        const sheet = await openSheet(gm, actor.uuid);
        const sources = await gm.eval(async () => {
            const { foundry, game } = window as any;
            const journal = await foundry.documents.JournalEntry.create({
                name: "E2E Starship",
                pages: [{ name: "Page", type: "text", text: { content: "<p>A fast ship.</p>" } }],
            });
            const folder = await foundry.documents.Folder.create({ name: "E2E Item Folder", type: "Item" });
            await game.items.documentClass.createDocuments([
                { name: "E2E Folder Aspect", type: "aspect", folder: folder.id },
                { name: "E2E Folder Skill", type: "skill", folder: folder.id },
            ]);
            const item = await game.items.documentClass.create({ name: "E2E World Stunt", type: "stunt" });
            return { journal: journal.uuid, folder: folder.uuid, item: item.uuid };
        });
        const drop = (data: Record<string, unknown>) =>
            sheet.evaluate((element, data) => {
                const dataTransfer = new DataTransfer();
                dataTransfer.setData("text/plain", JSON.stringify(data));
                element
                    .querySelector(".fatex-desk__content")!
                    .dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }));
            }, data);

        await drop({ type: "JournalEntry", uuid: sources.journal });
        await drop({ type: "Folder", uuid: sources.folder });
        await drop({ type: "Item", uuid: sources.item });

        await expect
            .poll(() => getItems(gm, actor.id).then((items) => items.map((i: any) => `${i.type}:${i.name}`).sort()))
            .toEqual(["aspect:E2E Folder Aspect", "extra:E2E Starship", "skill:E2E Folder Skill", "stunt:E2E World Stunt"]);
        const extra = (await getItems(gm, actor.id, "extra"))[0];
        expect(extra.system.description).toContain("A fast ship.");
    });

    test("items can be reordered with their sort handle", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Hero");
        const [first, second] = await createItems(gm, actor.id, [
            { name: "First", type: "aspect", system: { value: "First" }, sort: 1 },
            { name: "Second", type: "aspect", system: { value: "Second" }, sort: 2 },
        ]);
        const sheet = await openSheet(gm, actor.uuid);
        await enterEditMode(gm, sheet);

        const handle = sheet.locator(`.fatex-item[data-item-id="${second.id}"] .fatex-js-item-sort`);
        await handle.hover();
        await gm.page.mouse.down();
        await handle.dragTo(sheet.locator(`.fatex-item[data-item-id="${first.id}"]`), { targetPosition: { x: 20, y: 2 } });

        await expect
            .poll(() =>
                getItems(gm, actor.id, "aspect").then((items) =>
                    items.sort((a: any, b: any) => a.sort - b.sort).map((item: any) => item.name),
                ),
            )
            .toEqual(["Second", "First"]);
    });
});

test.describe("character sheet permissions", () => {
    test("observers see the sheet read-only and can still roll", async ({ gm, player }) => {
        const actor = await createCharacter(gm, "E2E Observed");
        const [stress] = await createItems(gm, actor.id, [
            { name: "Physical", type: "stress", system: { size: 2 } },
            { name: "Fight", type: "skill", system: { rank: 2 } },
        ]);
        await gm.eval(
            ({ id, user }) =>
                window.game.actors.get(id).update({
                    [`ownership.${window.game.users.getName(user).id}`]: window.CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
                }),
            { id: actor.id, user: player.user },
        );

        const sheet = await openSheet(player, actor.uuid);
        const controls = await player.eval(
            (id) => window.game.actors.get(id).sheet._getHeaderControls().map((c: any) => c.action),
            actor.id,
        );
        expect(controls).not.toContain("toggleEditMode");
        expect(controls).not.toContain("sheetSetup");
        await expect(sheet.locator('input[name="name"]')).toBeDisabled();

        // Foundry disables the form for observers; a click changes nothing.
        const box = sheet.locator(`.fatex-js-stress-checkbox[data-item="${stress.id}"]`).first();
        await expect(box.locator("input")).toBeDisabled();
        await box.click({ force: true });
        await player.page.waitForTimeout(500);
        expect(
            await gm.eval(({ a, s }) => window.game.actors.get(a).items.get(s).system.value, { a: actor.id, s: stress.id }),
        ).toBe(0);

        const before = await messageCount(gm);
        await sheet.locator(".fatex-js-skill .fatex-headline__text").first().click();
        await expect.poll(() => messageCount(gm)).toBe(before + 1);
    });

    test("players only copy the items of a dropped folder they can see", async ({ gm, player }) => {
        const actor = await createCharacter(gm, "E2E Own Hero");
        await gm.eval(
            ({ id, user }) =>
                window.game.actors.get(id).update({
                    [`ownership.${window.game.users.getName(user).id}`]: window.CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
                }),
            { id: actor.id, user: player.user },
        );
        const folder = await gm.eval(async () => {
            const { foundry, game } = window as any;
            const folder = await foundry.documents.Folder.create({ name: "E2E Loot", type: "Item" });
            await game.items.documentClass.createDocuments([
                { name: "E2E Visible Loot", type: "extra", folder: folder.id, ownership: { default: 2 } },
                { name: "E2E Secret Loot", type: "extra", folder: folder.id, ownership: { default: 0 } },
            ]);
            return folder.uuid as string;
        });

        const sheet = await openSheet(player, actor.uuid);
        await sheet.evaluate((element, uuid) => {
            const dataTransfer = new DataTransfer();
            dataTransfer.setData("text/plain", JSON.stringify({ type: "Folder", uuid }));
            element
                .querySelector(".fatex-desk__content")!
                .dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }));
        }, folder);
        await expect.poll(() => getItems(gm, actor.id).then((items) => items.map((i: any) => i.name))).toEqual([
            "E2E Visible Loot",
        ]);
    });

    test("journal drops keep the secrets a player was not shown", async ({ gm, player }) => {
        const actor = await createCharacter(gm, "E2E Own Hero", {
            ownership: { [await gm.eval((name) => window.game.users.getName(name).id, player.user)]: 3 },
        });
        const journal = await gm.eval(async () => {
            const { foundry } = window as any;
            const content =
                '<p>Public part</p><section class="secret" id="secret-a1"><p>GM only</p></section>' +
                '<section class="secret revealed" id="secret-b2"><p>Revealed part</p></section>';
            const entry = await foundry.documents.JournalEntry.create({
                name: "E2E Rumors",
                ownership: { default: 2 },
                pages: [{ name: "Page", type: "text", text: { content } }],
            });
            return entry.uuid as string;
        });

        const sheet = await openSheet(player, actor.uuid);
        await sheet.evaluate((element, uuid) => {
            const dataTransfer = new DataTransfer();
            dataTransfer.setData("text/plain", JSON.stringify({ type: "JournalEntry", uuid }));
            element
                .querySelector(".fatex-desk__content")!
                .dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }));
        }, journal);
        await expect.poll(() => getItems(gm, actor.id, "extra").then((items) => items.length)).toBe(1);
        const description = (await getItems(gm, actor.id, "extra"))[0].system.description;
        expect(description).toContain("Public part");
        expect(description).toContain("Revealed part");
        expect(description).not.toContain("GM only");
    });

    test("players with limited permission see the limited sheet", async ({ gm, player }) => {
        const actor = await createCharacter(gm, "E2E Stranger", { system: { biography: { value: "<p>Mysterious.</p>" } } });
        await createItems(gm, actor.id, [{ name: "Secret", type: "aspect", system: { value: "Secret aspect" } }]);
        await gm.eval(
            ({ id, user }) =>
                window.game.actors.get(id).update({
                    [`ownership.${window.game.users.getName(user).id}`]: window.CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED,
                }),
            { id: actor.id, user: player.user },
        );

        const sheet = await openSheet(player, actor.uuid);
        await expect(sheet).toContainText("E2E Stranger");
        await expect(sheet).toContainText("Mysterious.");
        await expect(sheet).not.toContainText("Secret aspect");
        await expect(sheet.locator(".fatex-artwork__image, .fatex-artwork img")).toBeVisible();
    });
});
