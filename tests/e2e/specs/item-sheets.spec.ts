/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, type Foundry } from "../fixtures";
import { confirmDialog, createCharacter, createItems, getDocument, openSheet, setInput } from "../helpers";

function system(foundry: Foundry, uuid: string) {
    return getDocument(foundry, uuid).then((item: any) => item.system);
}

function references(foundry: Foundry, uuid: string) {
    return getDocument(foundry, uuid).then((item: any) => item.flags?.fatex?.skillReferences ?? []);
}

/** The stress track of an item on the character sheet. */
function stressTrack(sheet: ReturnType<Foundry["page"]["locator"]>, itemId: string) {
    return sheet.locator(`.fatex-stress-track`).filter({ has: sheet.page().locator(`[data-item="${itemId}"]`) });
}

test.describe("item sheets", () => {
    test("stress: name, size, box labels and description", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Stress");
        const [stress] = await createItems(gm, actor.id, [{ name: "Physical", type: "stress", system: { size: 2 } }]);
        const actorSheet = await openSheet(gm, actor.uuid);
        const track = stressTrack(actorSheet, stress.id);
        await expect(track.locator(".fatex-checkbox__label")).toHaveText(["1", "2"]);

        const sheet = await openSheet(gm, stress.uuid);
        await setInput(sheet.locator('input[name="name"]'), "Body");
        await expect.poll(() => getDocument(gm, stress.uuid).then((item: any) => item.name)).toBe("Body");

        // The text field and the slider set the same size.
        await setInput(sheet.locator(".fatex-js-setting-range-value"), "4");
        await expect.poll(() => system(gm, stress.uuid).then((s) => s.size)).toBe(4);
        await expect(sheet.locator(".fatex-js-setting-range-slider")).toHaveValue("4");
        await sheet.locator(".fatex-js-setting-range-slider").fill("3");
        await expect.poll(() => system(gm, stress.uuid).then((s) => s.size)).toBe(3);
        await expect(sheet.locator(".fatex-js-setting-range-value")).toHaveValue("3");
        await expect(track.locator(".fatex-checkbox__label")).toHaveText(["1", "2", "3"]);
        // A track is filled up to four boxes.
        await expect(track.locator(".fatex-checkbox--filler")).toHaveCount(1);

        const custom = sheet.locator(".fatex-setting", { has: gm.page.locator('input[name="system.customLabel"]') });
        await expect(custom).toHaveClass(/fatex-u-disabled/);
        await sheet.locator('[data-name="system.labelType"][data-value="1"]').click();
        await expect.poll(() => system(gm, stress.uuid).then((s) => s.labelType)).toBe(1);
        await expect(track.locator(".fatex-checkbox__label")).toHaveText(["1", "1", "1"]);
        await expect(sheet.locator('[data-name="system.labelType"][data-value="1"]')).toHaveClass(/fatex-radio-button--active/);

        await sheet.locator('[data-name="system.labelType"][data-value="2"]').click();
        await expect(custom).not.toHaveClass(/fatex-u-disabled/);
        await setInput(sheet.locator('input[name="system.customLabel"]'), "A B C");
        await expect(track.locator(".fatex-checkbox__label")).toHaveText(["A", "B", "C"]);

        await setInput(sheet.locator('input[name="system.description"]'), "Hits and bruises");
        await expect(actorSheet.locator(".fatex-item-description", { hasText: "Hits and bruises" })).toBeVisible();
        await expect(actorSheet.locator(".fatex-headline__text", { hasText: "Body" })).toBeVisible();
    });

    test("stress: automation disables the track and adds boxes by skill rank", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Automation");
        const [stress, physique] = await createItems(gm, actor.id, [
            { name: "Physical", type: "stress", system: { size: 2 } },
            { name: "Physique", type: "skill", system: { rank: 1 } },
        ]);
        const actorSheet = await openSheet(gm, actor.uuid);
        const sheet = await openSheet(gm, stress.uuid);

        // Disabled until Physique is at least +2.
        await sheet.locator(".fatex-js-create-skill-reference").click();
        await expect.poll(() => references(gm, stress.uuid).then((r) => r.length)).toBe(1);
        const status = sheet.locator(".automation-list__item").first();
        await status.locator('[data-field="skill"]').selectOption("Physique");
        await status.locator('[data-field="condition"]').selectOption("2");
        await expect
            .poll(() => references(gm, stress.uuid))
            .toEqual([expect.objectContaining({ type: 0, skill: "Physique", condition: 2, operator: 4 })]);
        const track = actorSheet.locator(`[data-item-id="${stress.id}"]`).filter({ has: gm.page.locator(".fatex-stress-track") });
        await expect(track).toHaveClass(/fatex-u-disabled/);

        const rank = (value: number) =>
            gm.eval(({ a, i, value }) => window.game.actors.get(a).items.get(i).update({ "system.rank": value }), {
                a: actor.id,
                i: physique.id,
                value,
            });
        await rank(2);
        await expect(track).not.toHaveClass(/fatex-u-disabled/);

        // Two more boxes while Physique is at least +3.
        await sheet.locator(".fatex-js-create-skill-reference-boxes").click();
        await expect.poll(() => references(gm, stress.uuid).then((r) => r.length)).toBe(2);
        const boxes = sheet.locator(".automation-list__item").nth(1);
        await boxes.locator('[data-field="argument"]').selectOption("2");
        await boxes.locator('[data-field="skill"]').selectOption("Physique");
        await boxes.locator('[data-field="condition"]').selectOption("3");
        await expect.poll(() => references(gm, stress.uuid).then((r) => r[1])).toMatchObject({
            type: 1,
            argument: 2,
            skill: "Physique",
            condition: 3,
        });
        const labels = track.locator(".fatex-checkbox__label");
        await expect(labels).toHaveCount(2);
        await rank(3);
        await expect(labels).toHaveCount(4);

        // Removing a reference asks first.
        await status.locator(".fatex-js-remove-skill-reference").click();
        await confirmDialog(gm, false);
        expect(await references(gm, stress.uuid)).toHaveLength(2);
        await status.locator(".fatex-js-remove-skill-reference").click();
        await confirmDialog(gm);
        await expect.poll(() => references(gm, stress.uuid).then((r) => r.map((ref: any) => ref.type))).toEqual([1]);
    });

    test("consequence: label, type and automation", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Consequence");
        const [consequence] = await createItems(gm, actor.id, [
            { name: "Mild", type: "consequence", system: { label: "2" } },
            { name: "Will", type: "skill", system: { rank: 0 } },
        ]);
        const actorSheet = await openSheet(gm, actor.uuid);
        const sheet = await openSheet(gm, consequence.uuid);

        await setInput(sheet.locator('input[name="system.label"]'), "4");
        await expect.poll(() => system(gm, consequence.uuid).then((s) => s.label)).toBe("4");
        await setInput(sheet.locator('input[name="system.value"]'), "Broken arm");
        await expect.poll(() => system(gm, consequence.uuid)).toMatchObject({ label: "4", value: "Broken arm" });

        await sheet.locator('[data-name="system.type"][data-value="1"]').click();
        await expect.poll(() => system(gm, consequence.uuid).then((s) => s.type)).toBe(1);
        await expect(sheet.locator('[data-name="system.type"][data-value="1"]')).toHaveClass(/fatex-radio-button--active/);

        await sheet.locator(".fatex-js-create-skill-reference").click();
        const reference = sheet.locator(".automation-list__item").first();
        await reference.locator('[data-field="skill"]').selectOption("Will");
        await reference.locator('[data-field="condition"]').selectOption("1");
        await expect.poll(() => references(gm, consequence.uuid).then((r) => r[0]?.condition)).toBe(1);
        const entry = actorSheet.locator(`.fatex-item[data-item-id="${consequence.id}"]`);
        await expect(entry).toHaveClass(/fatex-u-disabled/);
        await expect(entry).toHaveClass(/fatex-item--condition/);
        await expect(entry.locator(".fatex-js-consequence-input")).toHaveText("Broken arm");
        await expect(entry.locator(".fatex-text-input__label")).toHaveText("4");
    });

    test("skill: name, rank and description", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Skill");
        const [skill] = await createItems(gm, actor.id, [{ name: "Fight", type: "skill", system: { rank: 0 } }]);
        const actorSheet = await openSheet(gm, actor.uuid);
        const sheet = await openSheet(gm, skill.uuid);

        await setInput(sheet.locator('input[name="name"]'), "Brawl");
        await sheet.locator('[data-name="system.rank"][data-value="3"]').click();
        await expect.poll(() => getDocument(gm, skill.uuid)).toMatchObject({ name: "Brawl", system: { rank: 3 } });
        await expect(sheet.locator('[data-name="system.rank"][data-value="3"]')).toHaveClass(/fatex-radio-rank--active/);
        await expect(actorSheet.locator(".fatex-js-skill", { hasText: "Brawl" })).toContainText("+3");

        await sheet.locator('[data-name="system.rank"][data-value="-1"]').click();
        await expect.poll(() => system(gm, skill.uuid).then((s) => s.rank)).toBe(-1);

        await sheet.locator("prose-mirror").hover();
        await sheet.locator("prose-mirror button.toggle").click();
        await sheet.locator("prose-mirror .editor-content").fill("Punches and kicks");
        await sheet.locator('prose-mirror button[data-action="save"], prose-mirror button.toggle').first().click();
        await expect.poll(() => system(gm, skill.uuid).then((s) => s.description)).toContain("Punches and kicks");
    });

    test("stunt and extra: name and short description", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Stunts");
        const [stunt, extra] = await createItems(gm, actor.id, [
            { name: "Stunt", type: "stunt" },
            { name: "Extra", type: "extra" },
        ]);
        const actorSheet = await openSheet(gm, actor.uuid);

        for (const [item, name] of [
            [stunt, "Killer Move"],
            [extra, "Magic Sword"],
        ] as const) {
            const sheet = await openSheet(gm, item.uuid);
            await setInput(sheet.locator('input[name="name"]'), name);
            await expect.poll(() => getDocument(gm, item.uuid).then((i: any) => i.name)).toBe(name);
            await setInput(sheet.locator('input[name="system.shortDescription"]'), `${name} summary`);
            await expect.poll(() => getDocument(gm, item.uuid)).toMatchObject({
                name,
                system: { shortDescription: `${name} summary` },
            });
            await expect(actorSheet).toContainText(name);
            await gm.eval((uuid) => window.foundry.utils.fromUuidSync(uuid).sheet.close(), item.uuid);
        }
    });

    test("aspect: label and value", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Aspect");
        const [aspect] = await createItems(gm, actor.id, [{ name: "High Concept", type: "aspect" }]);
        const actorSheet = await openSheet(gm, actor.uuid);
        const sheet = await openSheet(gm, aspect.uuid);

        // Aspects show a label and a value, not their name.
        // Each change saves and renders the sheet again, so wait for it before the next field.
        await setInput(sheet.locator('input[name="system.label"]'), "Trouble");
        await expect.poll(() => system(gm, aspect.uuid).then((s) => s.label)).toBe("Trouble");
        await setInput(sheet.locator('input[name="system.value"]'), "Owes the mob");
        await expect.poll(() => system(gm, aspect.uuid)).toMatchObject({ label: "Trouble", value: "Owes the mob" });
        const entry = actorSheet.locator(`.fatex-item[data-item-id="${aspect.id}"]`);
        await expect(entry.locator(".fatex-js-aspect-input")).toHaveText("Owes the mob");
        await expect(entry.locator(".fatex-text-input__label")).toHaveText("Trouble");
    });

    test("item sheets are read-only without owner permission", async ({ gm, player }) => {
        const actor = await createCharacter(gm, "E2E Observed", {
            ownership: { default: 2 },
        });
        const [stress] = await createItems(gm, actor.id, [{ name: "Physical", type: "stress" }]);
        const sheet = await openSheet(player, stress.uuid);
        await expect(sheet.locator('input[name="name"]')).toBeDisabled();
        await sheet.locator('[data-name="system.labelType"][data-value="1"]').click({ force: true });
        await expect(sheet.locator(".fatex-js-create-skill-reference")).toBeVisible();
        await sheet.locator(".fatex-js-create-skill-reference").click({ force: true });
        await player.page.waitForTimeout(500);
        expect(await system(gm, stress.uuid).then((s) => s.labelType)).toBe(0);
        expect(await references(gm, stress.uuid)).toEqual([]);
    });
});
