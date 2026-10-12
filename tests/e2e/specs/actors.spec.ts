/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, type Foundry } from "../fixtures";
import { app, confirmDialog, createCharacter, createItems, dialog, getItems, headerControl, openSheet } from "../helpers";

async function openSetup(foundry: Foundry, actorUuid: string) {
    const sheet = await openSheet(foundry, actorUuid);
    await headerControl(foundry, sheet, "sheetSetup");
    await expect.poll(() => app(foundry, "SheetSetup")).toBeTruthy();
    return foundry.page.locator(`[id="${await app(foundry, "SheetSetup")}"]`);
}

function itemNames(foundry: Foundry, actorId: string, type?: string) {
    return getItems(foundry, actorId, type).then((items) => items.map((item: any) => item.name).sort());
}

function templateActors(foundry: Foundry): Promise<{ id: string; name: string; items: number }[]> {
    return foundry.eval(() =>
        window.game.actors
            .filter((actor: any) => actor.getFlag("fatex", "isTemplateActor"))
            .map((actor: any) => ({ id: actor.id, name: actor.name, items: actor.items.size })),
    );
}

async function openActorDirectory(foundry: Foundry) {
    await foundry.eval(async () => {
        window.ui.sidebar.toggleExpanded(true);
        await window.ui.actors.activate();
    });
    return foundry.page.locator("#actors");
}

test.describe("sheet setup", () => {
    test("adds the selected entries of a preset", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Setup");
        const setup = await openSetup(gm, actor.uuid);
        // Opening it again brings the same window to the front.
        await gm.eval((id) => {
            const sheet = window.game.actors.get(id).sheet;
            return sheet.constructor.onOpenSheetSetup.call(sheet);
        }, actor.id);
        const setups = await gm.eval(
            () => [...window.foundry.applications.instances.values()].filter((a: any) => a.constructor.name === "SheetSetup").length,
        );
        expect(setups).toBe(1);
        await expect(gm.page.locator(".fatex-sheet--app", { hasText: "Sheet Setup" })).toHaveCount(1);

        await expect(setup.locator(".fatex-vertical-tabs-navigation__item")).toHaveText(["Core", "Accelerated", "Condensed"]);
        const core = setup.locator('.tab[data-tab="core"]');
        await expect(core).toHaveClass(/active/);

        // Pick two aspects by hand.
        const aspects = core.locator(".fatex-sheet-setup__section").first();
        await aspects.locator(".fatex-sheet-setup__option", { hasText: "High Concept" }).click();
        await aspects.locator(".fatex-sheet-setup__option", { hasText: "Trouble" }).click();
        await aspects.locator('[data-action="addSelection"]').click();
        await expect.poll(() => itemNames(gm, actor.id, "aspect")).toEqual(["High Concept", "Trouble"]);

        // Toggle all skills of the section and add them.
        const skills = core.locator(".fatex-sheet-setup__section", { hasText: "Athletics" });
        await skills.locator('header [data-action="toggleSelection"]').click();
        await expect(skills.locator("input:checked")).toHaveCount(18);
        await skills.locator('[data-action="addSelection"]').click();
        await expect.poll(() => getItems(gm, actor.id, "skill").then((items) => items.length)).toBe(18);

        // A second preset has its own entries.
        await setup.locator('.fatex-vertical-tabs-navigation__item[data-tab="accelerated"]').click();
        const accelerated = setup.locator('.tab[data-tab="accelerated"]');
        await expect(accelerated).toHaveClass(/active/);
        await expect(core).not.toHaveClass(/active/);
        await expect(accelerated.locator(".fatex-sheet-setup__option", { hasText: "Careful" })).toBeVisible();
    });

    test("clear buttons ask first and remove only their type", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Setup");
        await createItems(gm, actor.id, [
            { name: "Aspect", type: "aspect" },
            { name: "Skill", type: "skill" },
            { name: "Stress", type: "stress" },
            { name: "Consequence", type: "consequence" },
            { name: "Stunt", type: "stunt" },
        ]);
        const setup = await openSetup(gm, actor.uuid);
        const actions = setup.locator(".fatex-setup-actions");

        await actions.locator('[data-action="clearSkills"]').click();
        await confirmDialog(gm, false);
        expect(await itemNames(gm, actor.id, "skill")).toEqual(["Skill"]);

        await actions.locator('[data-action="clearSkills"]').click();
        await confirmDialog(gm);
        await expect.poll(() => itemNames(gm, actor.id, "skill")).toEqual([]);
        await expect(actions.locator('[data-action="clearSkills"]')).toHaveClass(/fatex-u-disabled/);

        for (const [action, type] of [
            ["clearAspects", "aspect"],
            ["clearStress", "stress"],
            ["clearConsequences", "consequence"],
        ]) {
            await actions.locator(`[data-action="${action}"]`).click();
            await confirmDialog(gm);
            await expect.poll(() => itemNames(gm, actor.id, type)).toEqual([]);
        }
        expect(await itemNames(gm, actor.id)).toEqual(["Stunt"]);

        await actions.locator('[data-action="clearAll"]').click();
        await confirmDialog(gm);
        await expect.poll(() => itemNames(gm, actor.id)).toEqual([]);
        await expect(actions.locator('[data-action="clearAll"]')).toHaveClass(/fatex-u-disabled/);
    });
});

test.describe("templates", () => {
    test("are managed from the system settings", async ({ gm }) => {
        await gm.eval(() => new window.foundry.applications.settings.SettingsConfig().render({ force: true }));
        const settings = gm.page.locator("#settings-config");
        await settings.locator('[data-tab="system"]').first().click();
        await settings.locator('button[data-key="fatex.templates"]').click();

        const manager = gm.page.locator("#template-actors");
        await expect(manager).toBeVisible();
        await expect(manager.locator(".fatex-template")).toHaveCount(0);

        // Creating a template opens its sheet and the sheet setup.
        // The empty list repeats the create button in its help text.
        await manager.locator('[data-action="createTemplate"]').first().click();
        await expect.poll(() => templateActors(gm).then((t) => t.length)).toBe(1);
        const [template] = await templateActors(gm);
        expect(template.name).toBe("New template");
        await expect.poll(() => app(gm, "SheetSetup")).toBeTruthy();
        await createItems(gm, template.id, [
            { name: "High Concept", type: "aspect" },
            { name: "Fight", type: "skill" },
            { name: "Notice", type: "skill" },
        ]);
        const card = manager.locator(".fatex-template", { hasText: "New template" });
        await expect(card.locator(".fatex-template__information-value")).toHaveText(["1", "0", "2", "0"]);

        // Templates are not listed in the actor directory.
        const directory = await openActorDirectory(gm);
        await expect(directory.locator(".directory-item", { hasText: "New template" })).toHaveCount(0);

        await gm.closeWindows();
        await gm.eval(() => window.CONFIG.FateX.applications.templateSettings.render({ force: true }));
        await manager.locator(`[data-action="configureTemplate"][data-template="${template.id}"]`).click();
        await expect.poll(() => gm.eval((id) => window.game.actors.get(id).sheet.rendered, template.id)).toBe(true);
        await gm.eval((id) => window.game.actors.get(id).sheet.close(), template.id);

        await manager.locator(`[data-action="duplicateTemplate"][data-template="${template.id}"]`).click();
        await expect.poll(() => templateActors(gm).then((t) => t.map((a) => a.name).sort())).toEqual([
            "New template",
            "New template (Copy)",
        ]);
        await expect(manager.locator(".fatex-template")).toHaveCount(2);
        expect((await templateActors(gm)).every((t) => t.items === 3)).toBe(true);
        // The copy opens its sheet over the manager.
        await expect.poll(() => gm.eval(() => window.game.actors.getName("New template (Copy)").sheet.rendered)).toBe(true);
        await gm.eval(() => window.game.actors.getName("New template (Copy)").sheet.close());

        await manager.locator(`[data-action="deleteTemplate"][data-template="${template.id}"]`).click();
        await confirmDialog(gm, false);
        expect(await templateActors(gm)).toHaveLength(2);
        await manager.locator(`[data-action="deleteTemplate"][data-template="${template.id}"]`).click();
        await confirmDialog(gm);
        await expect.poll(() => templateActors(gm).then((t) => t.map((a) => a.name))).toEqual(["New template (Copy)"]);
        await expect(manager.locator(".fatex-template")).toHaveCount(1);
    });

    test("the picker creates empty actors, actors from a template and groups", async ({ gm }) => {
        const template = await createCharacter(gm, "E2E Template", { flags: { fatex: { isTemplateActor: true } } });
        await createItems(gm, template.id, [
            { name: "High Concept", type: "aspect" },
            { name: "Fight", type: "skill", system: { rank: 2 } },
        ]);

        // The create button of the actor directory opens the picker.
        const directory = await openActorDirectory(gm);
        await directory.locator('[data-action="createEntry"]').first().click();
        const picker = gm.page.locator("#template-actor-picker");
        await expect(picker).toBeVisible();
        await expect(picker.locator(".fatex-template")).toHaveCount(2);

        await picker.locator(`[data-action="chooseTemplate"][data-template="${template.id}"]`).click();
        await expect(picker).toBeHidden();
        const fromTemplate = await gm.eval((templateId) => {
            const actor = window.game.actors.find((a: any) => a.getFlag("fatex", "templateActor") === templateId);
            return actor && {
                id: actor.id,
                isTemplate: actor.getFlag("fatex", "isTemplateActor") ?? false,
                items: actor.items.map((i: any) => i.name).sort(),
                sheet: actor.sheet.rendered,
            };
        }, template.id);
        expect(fromTemplate).toMatchObject({ isTemplate: false, items: ["Fight", "High Concept"], sheet: true });
        await expect(directory.locator(".directory-item", { hasText: "E2E Template" })).toHaveCount(1);
        await gm.closeWindows();

        await gm.eval(() => window.Actor.implementation.createDialog());
        await picker.locator('[data-action="emptyTemplate"]').click();
        await expect(picker).toBeHidden();
        await expect.poll(() => gm.eval(() => window.game.actors.getName("Empty actor")?.items.size)).toBe(0);
        // An empty actor starts in the sheet setup.
        await expect.poll(() => app(gm, "SheetSetup")).toBeTruthy();
        await gm.closeWindows();

        await gm.eval(() => window.Actor.implementation.createDialog());
        await picker.locator('[data-action="createGroup"]').click();
        await expect(picker).toBeHidden();
        await expect.poll(() => gm.eval(() => window.game.actors.getName("New group")?.type)).toBe("group");
    });

    test("actors in compendiums are created with Foundry's dialog", async ({ gm }) => {
        const pack = await gm.eval(async () => {
            const { CompendiumCollection } = window.foundry.documents.collections;
            // A failed earlier run may have left the pack behind.
            await window.game.packs.get("world.e2e-pack")?.deleteCompendium();
            const pack = await CompendiumCollection.createCompendium({ type: "Actor", label: "E2E Pack", name: "e2e-pack" });
            return pack.collection as string;
        });
        try {
            // The dialog resolves only once it is submitted, so do not wait for it here.
            await gm.eval((pack) => void window.Actor.implementation.createDialog({}, { pack }), pack);
            await expect(gm.page.locator("#template-actor-picker")).toHaveCount(0);
            const create = gm.page.locator('.application:has(select[name="type"])');
            await create.locator('input[name="name"]').fill("E2E Packed");
            await create.locator('button[type="submit"]').click();
            await expect
                .poll(() => gm.eval((pack) => window.game.packs.get(pack).getIndex().then((i: any) => i.map((e: any) => e.name)), pack))
                .toEqual(["E2E Packed"]);
            expect(await gm.eval(() => window.game.actors.getName("E2E Packed") ?? null)).toBeNull();
        } finally {
            await gm.eval((pack) => window.game.packs.get(pack)?.deleteCompendium(), pack);
        }
    });

    test("players without permission to create actors cannot open them", async ({ gm, player }) => {
        const canCreate = await gm.eval(() => window.game.settings.get("core", "permissions").ACTOR_CREATE);
        expect(canCreate).not.toContain(1);

        for (const name of ["templatePicker", "templateSettings"]) {
            await player.eval((name) => window.CONFIG.FateX.applications[name].render({ force: true }).catch(() => {}), name);
            await expect(player.page.locator("#notifications .notification").last()).toContainText(
                /permission/i,
            );
            await expect(player.page.locator("#template-actor-picker, #template-actors")).toHaveCount(0);
        }
        player.takeErrors(/permission/i);
    });

    test("players who may create actors get the picker without configuration", async ({ gm, player }) => {
        const permissions = await gm.eval(() => window.game.settings.get("core", "permissions"));
        await gm.setSetting("core.permissions", { ...permissions, ACTOR_CREATE: [1, 2, 3, 4] });
        await expect.poll(() => player.eval(() => window.game.user.can("ACTOR_CREATE"))).toBe(true);

        await player.eval(() => window.CONFIG.FateX.applications.templatePicker.render({ force: true }));
        const picker = player.page.locator("#template-actor-picker");
        await expect(picker.locator('[data-action="emptyTemplate"]')).toBeVisible();
        await expect(picker.locator('[data-action="templateSettings"]')).toHaveCount(0);
        await expect(picker.locator('[data-action="createGroup"]')).toHaveCount(0);
        await player.eval(() => window.CONFIG.FateX.applications.templatePicker.close());
    });
});

test.describe("actor directory", () => {
    test("creates groups from the header and from folders", async ({ gm }) => {
        const directory = await openActorDirectory(gm);
        await directory.locator("button.create-actor-group").click();
        await expect.poll(() => gm.eval(() => window.game.actors.getName("New group")?.type)).toBe("group");
        await expect(directory.locator(".directory-item.fatex__actorDirectory__entry", { hasText: "New group" })).toBeVisible();
        await expect(
            directory.locator(".directory-item", { hasText: "New group" }).locator(".fatex-group-icon"),
        ).toHaveCount(1);
        await gm.closeWindows();

        const folder = await gm.eval(async () => {
            const folder = await window.Folder.implementation.create({ name: "E2E Party", type: "Actor" });
            return folder.id;
        });
        const members = [await createCharacter(gm, "E2E Ann", { folder }), await createCharacter(gm, "E2E Bob", { folder })];
        await directory.locator(`.folder[data-folder-id="${folder}"] .create-folder-group`).click();
        await expect
            .poll(() =>
                gm.eval(() =>
                    window.game.actors
                        .getName("E2E Party")
                        ?.items.map((i: any) => i.system.id)
                        .sort(),
                ),
            )
            .toEqual(members.map((m) => m.id).sort());
        expect(await gm.eval(() => window.game.actors.getName("E2E Party").folder?.id)).toBe(folder);
    });

    test("new actors get a linked token with sight", async ({ gm }) => {
        await gm.eval(() => window.Actor.implementation.createDialog({ name: "E2E Linked" }));
        await gm.page.locator('#template-actor-picker [data-action="emptyTemplate"]').click();
        await expect
            .poll(() => gm.eval(() => window.game.actors.getName("E2E Linked")?.prototypeToken.toObject()))
            .toMatchObject({ actorLink: true, disposition: 1, sight: { enabled: true, range: 30 } });
    });
});

test.describe("token names", () => {
    test("follow the actor name while they match", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Named", { prototypeToken: { name: "E2E Named" } });
        const rename = (name: string) => gm.eval(({ id, name }) => window.game.actors.get(id).update({ name }), { id: actor.id, name });
        const tokenName = () => gm.eval((id) => window.game.actors.get(id).prototypeToken.name, actor.id);

        await rename("E2E Renamed");
        expect(await tokenName()).toBe("E2E Renamed");

        // A token with its own name keeps it.
        await gm.eval((id) => window.game.actors.get(id).update({ "prototypeToken.name": "Custom" }), actor.id);
        await rename("E2E Again");
        expect(await tokenName()).toBe("Custom");

        await gm.eval((id) => window.game.actors.get(id).update({ "prototypeToken.name": "E2E Again" }), actor.id);
        await gm.setSetting("fatex.autoUpdateTokenName", false);
        await rename("E2E Off");
        expect(await tokenName()).toBe("E2E Again");
    });
});

test.describe("combat", () => {
    test("initiative can be rolled", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Fighter");
        const result = await gm.eval(async (id) => {
            const combat = await window.Combat.implementation.create({});
            const [combatant] = await combat.createEmbeddedDocuments("Combatant", [{ actorId: id, name: "E2E Fighter" }]);
            await combat.rollInitiative([combatant.id]);
            return combat.combatants.get(combatant.id).initiative;
        }, actor.id);
        // Fate dice, so between -4 and +4.
        expect(result).toBeGreaterThanOrEqual(-4);
        expect(result).toBeLessThanOrEqual(4);
    });
});

// Shown last so a failed dialog does not block other tests.
test.afterEach(async ({ gm }) => {
    if (await dialog(gm).locator('button[data-action="no"]').count()) await confirmDialog(gm, false);
});
