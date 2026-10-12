/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, type Foundry } from "../fixtures";
import { createCharacter, createItems, openSheet } from "../helpers";

const PLUS = 0.99;
const MINUS = 0.01;

function lastCard(foundry: Foundry) {
    return foundry.eval(() => {
        const message = window.game.messages.contents.at(-1);
        return { id: message.id, whisper: message.whisper, card: message.getFlag("fatex", "chatCard") };
    });
}

async function rollFromSheet(foundry: Foundry, actorUuid: string, skill: string, { shift = false } = {}) {
    const sheet = await openSheet(foundry, actorUuid);
    const before = await foundry.eval(() => window.game.messages.size);
    await sheet
        .locator(".fatex-js-skill .fatex-headline__text", { hasText: skill })
        .click({ modifiers: shift ? ["Shift"] : [] });
    await expect.poll(() => foundry.eval(() => window.game.messages.size)).toBe(before + 1);
    // The card is created, then updated once with its message id.
    await expect.poll(() => lastCard(foundry).then((m) => m.card?.messageId)).toBeTruthy();
    return foundry.page.locator(".chat-log .chat-message").last();
}

// Cards are clicked in the chat log, so show it. Collapsing the sidebar moves new messages to the notifications.
function showChat(foundry: Foundry) {
    return foundry.eval(() => {
        window.ui.sidebar.toggleExpanded(true);
        window.ui.chat.activate();
    });
}

test.beforeEach(({ gm }) => showChat(gm));

test.describe("skill rolls", () => {
    test("post a card with skill, dice, total and ladder", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Roller");
        await createItems(gm, actor.id, [{ name: "Fight", type: "skill", system: { rank: 2 } }]);
        await gm.fixDice([PLUS]);

        const card = await rollFromSheet(gm, actor.uuid, "Fight");
        await expect(card.locator(".fatex-headline__text")).toHaveText("Fight");
        await expect(card.locator(".fatex-dice > div")).toHaveText(["+", "+", "+", "+"]);
        await expect(card.locator(".fatex-roll__total")).toHaveText("+6");
        await expect(card.locator(".fatex-roll__ladder")).toHaveText("Fantastic");

        const { card: data } = await lastCard(gm);
        expect(data.rolls[0]).toMatchObject({ name: "Fight", rank: 2, bonus: 0, faces: [1, 1, 1, 1] });
        expect(data.speaker.actor).toBe(actor.id);
    });

    test("can be rerolled and increased by the GM, with a history", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Roller");
        await createItems(gm, actor.id, [{ name: "Fight", type: "skill", system: { rank: 2 } }]);
        await gm.fixDice([PLUS]);
        await rollFromSheet(gm, actor.uuid, "Fight");

        await gm.fixDice([MINUS]);
        const card = gm.page.locator(".chat-log .chat-message").last();
        await card.locator('button[data-action="reroll"]').click();
        await expect(card.locator(".fatex-roll__total")).toHaveText("-2");
        await expect(card.locator(".fatex-roll__history__entry")).toHaveText(["Gamemaster rerolled (was +4)"]);

        await card.locator('button[data-action="increase"]').click();
        await expect(card.locator(".fatex-roll__total")).toHaveText("+0");
        await expect(card.locator(".fatex-roll__history__entry").last()).toHaveText("Gamemaster added +2");
        expect((await lastCard(gm)).card.rolls[0]).toMatchObject({ bonus: 2, faces: [-1, -1, -1, -1] });
    });

    test("players change their roll through the GM", async ({ gm, player }) => {
        const actor = await createCharacter(gm, "E2E Player Hero");
        await createItems(gm, actor.id, [{ name: "Notice", type: "skill", system: { rank: 1 } }]);
        await gm.eval(
            ({ id, user }) =>
                window.game.actors.get(id).update({
                    [`ownership.${window.game.users.getName(user).id}`]: window.CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
                }),
            { id: actor.id, user: player.user },
        );
        await player.fixDice([0.5]);
        await showChat(player);

        const card = await rollFromSheet(player, actor.uuid, "Notice");
        await expect(card.locator(".fatex-roll__total")).toHaveText("+1");
        await card.locator('button[data-action="increase"]').click();
        await expect(card.locator(".fatex-roll__total")).toHaveText("+3");
        await expect(card.locator(".fatex-roll__history__entry")).toHaveText(["E2E Player added +2"]);
        await player.resetDice();
    });

    test("players cannot change rolls of others", async ({ gm, player }) => {
        const actor = await createCharacter(gm, "E2E Roller");
        await createItems(gm, actor.id, [{ name: "Fight", type: "skill", system: { rank: 1 } }]);
        await rollFromSheet(gm, actor.uuid, "Fight");
        const { id } = await lastCard(gm);

        await showChat(player);
        const card = player.page.locator(`#chat .chat-log .chat-message[data-message-id="${id}"]`);
        await card.locator('button[data-action="increase"]').click();
        await player.page.waitForTimeout(1000);
        expect((await lastCard(gm)).card.rolls[0].bonus).toBe(0);
    });

    test("work from the chat notifications while the sidebar is collapsed", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Roller");
        await createItems(gm, actor.id, [{ name: "Fight", type: "skill", system: { rank: 0 } }]);
        await gm.fixDice([0.5]);
        await gm.eval(() => window.ui.sidebar.toggleExpanded(false));
        try {
            await gm.eval(async (id) => {
                const actor = window.game.actors.get(id);
                await window.CONFIG.FateX.itemClasses.skill.rollSkill(actor.sheet, actor.items.getName("Fight"), {});
            }, actor.id);
            const notification = gm.page.locator("#chat-notifications .chat-message").last();
            await notification.locator('button[data-action="increase"]').click();
            await expect.poll(() => lastCard(gm).then((m) => m.card.rolls[0].bonus)).toBe(2);
        } finally {
            await gm.eval(() => window.ui.sidebar.toggleExpanded(true));
        }
    });

    test("follow the selected roll mode", async ({ gm }) => {
        const actor = await createCharacter(gm, "E2E Roller");
        await createItems(gm, actor.id, [{ name: "Stealth", type: "skill", system: { rank: 3 } }]);
        const v14 = await gm.eval(() => window.game.release.generation >= 14);
        if (v14) await gm.setSetting("core.messageMode", "gm");
        else await gm.setSetting("core.rollMode", "gmroll");

        await rollFromSheet(gm, actor.uuid, "Stealth");
        const { whisper } = await lastCard(gm);
        const gmIds = await gm.eval(() => window.game.users.filter((u: any) => u.isGM).map((u: any) => u.id));
        expect(whisper.sort()).toEqual(gmIds.sort());
    });
});

test.describe("2d6 roll mode", () => {
    test("rolls two six-sided dice and subtracts the second", async ({ gm }) => {
        await gm.setSetting("fatex.enable2d6RollMode", true);
        const actor = await createCharacter(gm, "E2E Roller");
        await createItems(gm, actor.id, [{ name: "Fight", type: "skill", system: { rank: 1 } }]);
        await gm.fixDice([PLUS, MINUS]);

        const card = await rollFromSheet(gm, actor.uuid, "Fight");
        await expect(card.locator(".fatex-dice")).toHaveClass(/fatex-dice--2d6-roll/);
        // Foundry does not promise which die is rolled first, so read the faces back.
        const [first, second] = (await lastCard(gm)).card.rolls[0].faces;
        expect([first, second].sort()).toEqual([1, 6]);
        const sign = (n: number) => (n < 0 ? `${n}` : `+${n}`);
        await expect(card.locator(".fatex-dice > div")).toHaveText([`${first}`, `${second}`]);
        await expect(card.locator(".fatex-roll__total")).toHaveText(sign(first - second + 1));

        await gm.fixDice([0.5]);
        await card.locator('button[data-action="reroll"]').click();
        // 3 - 3 + 1
        await expect(card.locator(".fatex-roll__total")).toHaveText("+1");
        await expect(card.locator(".fatex-roll__history__entry")).toHaveText([
            `Gamemaster rerolled (was ${sign(first - second)})`,
        ]);
    });
});

test.describe("magic system", () => {
    test("shift-click rolls magic dice from the magic skill", async ({ gm }) => {
        await gm.setSetting("fatex.guildCodexMagicSystemEnabled", true, { reload: true });
        const actor = await createCharacter(gm, "E2E Mage");
        await createItems(gm, actor.id, [
            { name: "Lore", type: "skill", system: { rank: 1 } },
            { name: "Arcana", type: "skill", system: { rank: 2, options: { isMagicSkill: true } } },
        ]);
        await gm.fixDice([PLUS]);

        const card = await rollFromSheet(gm, actor.uuid, "Lore", { shift: true });
        await expect(card.locator(".fatex-dice__magic_die")).toHaveCount(2);
        // A magic + counts twice: 2 + 2 + 1 + 1, plus the rank.
        await expect(card.locator(".fatex-roll__total")).toHaveText("+7");

        // Without shift it is a normal roll.
        const normal = await rollFromSheet(gm, actor.uuid, "Lore");
        await expect(normal.locator(".fatex-dice__magic_die")).toHaveCount(0);
        await expect(normal.locator(".fatex-roll__total")).toHaveText("+5");
    });

    test("the skill sheet marks magic skills, and rolls need one", async ({ gm }) => {
        await gm.setSetting("fatex.guildCodexMagicSystemEnabled", true, { reload: true });
        const actor = await createCharacter(gm, "E2E Mage");
        const [lore] = await createItems(gm, actor.id, [{ name: "Lore", type: "skill", system: { rank: 1 } }]);

        const sheet = await openSheet(gm, actor.uuid);
        const before = await gm.eval(() => window.game.messages.size);
        await sheet.locator(".fatex-js-skill .fatex-headline__text", { hasText: "Lore" }).click({ modifiers: ["Shift"] });
        await expect(gm.page.locator("#notifications .notification")).toContainText("No magic skill found");
        expect(await gm.eval(() => window.game.messages.size)).toBe(before);
        // Error notifications are logged to the console too.
        expect(gm.takeErrors(/No magic skill found/)).toHaveLength(1);

        const skillSheet = await openSheet(gm, lore.uuid);
        await skillSheet.locator('input[name="system.options.isMagicSkill"]').check();
        await expect
            .poll(() =>
                gm.eval(({ a, i }) => window.game.actors.get(a).items.get(i).system.options.isMagicSkill, { a: actor.id, i: lore.id }),
            )
            .toBe(true);
    });
});
