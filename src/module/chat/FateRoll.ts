// @ts-nocheck
import { FateRollDataModel } from "../data/FateRollDataModel";
import { SkillItemData } from "../item/ItemTypes";
import { ItemDataProperties } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";

export const ROLL_MODES = {
    "4dF": "4dF",
    "2d6": "1d6-1d6",
};

export class FateRoll extends FateRollDataModel {
    static createFromSkill(skill: SkillItemData & ItemDataProperties, { magic = false } = {}) {
        const options = { magic, actor: skill.actor };

        if (game.settings.get("fatex", "guildCodexMagicSystemEnabled") && magic) {
            options["magicCount"] = this.determineMagicCount(skill);

            if (options["magicCount"] === false) {
                return false;
            }
        }

        if (game.settings.get("fatex", "enable2d6RollMode") && !magic) {
            options["rollmode"] = ROLL_MODES["2d6"];
        }

        return new FateRoll({
            id: foundry.utils.randomID(),
            name: skill.name,
            rank: skill.system.rank,
            options,
        });
    }

    async roll(userId = "") {
        if (game.settings.get("fatex", "guildCodexMagicSystemEnabled")) {
            if (this.options.magic && this.options.magicCount > 0) {
                return this.rollMagic(userId, this.options.magicCount);
            }
        }

        const rollMode = this.options.rollmode ?? ROLL_MODES["4dF"];
        const rollThrough = new Roll(rollMode);
        const roll = await rollThrough.evaluate();

        if (this.is2d6Roll) {
            this.updateSource({
                faces: [...roll.terms[0].results, ...roll.terms[2].results].map((r) => r.count ?? r.result),
            });
        } else {
            this.updateSource({ faces: roll.terms[0].results.map((r) => r.count ?? r.result) });
        }

        if (game.modules.get("dice-so-nice")?.active) {
            const user = userId ? game.users.get(userId) : game.user;
            await game.dice3d.showForRoll(roll, user, true);
        }

        Hooks.callAll("fatex.roll", this);

        return this;
    }

    async rollMagic(userId = "", magicCount: number) {
        const rollThrough = new Roll(`${magicCount}dM + ${4 - magicCount}dF`);
        const roll = await rollThrough.evaluate();

        this.updateSource({
            faces: [...roll.terms[0].results, ...roll.terms[2].results].map((r) => r.count ?? r.result),
        });

        if (game.modules.get("dice-so-nice")?.active) {
            const user = userId ? game.users.get(userId) : game.user;
            await game.dice3d.showForRoll(roll, user, true);
        }

        Hooks.callAll("fatex.rollMagic", this);

        return this;
    }

    async reroll(userId = "", { shiftKey }: { shiftKey: boolean }) {
        const history = this.addHistoryEntry(userId, { type: "reroll", previousRoll: this.faces });
        await this.roll(userId);

        this.updateSource({ history: history });

        Hooks.callAll("fatex.reroll", this, { userId, shiftKey });

        return this;
    }

    increase(userId = "", { shiftKey }: { shiftKey: boolean }) {
        const history = this.addHistoryEntry(userId, { type: "increase" });

        this.updateSource({ bonus: this.bonus + 2, history: history });

        Hooks.callAll("fatex.increase", this, { userId, shiftKey });

        return this;
    }

    private addHistoryEntry(userId: string, data) {
        const history = foundry.utils.deepClone(this.history ?? []);
        const user = userId ? game.users.get(userId) : game.user;
        const entry = { user: user.name, ...data };

        history.push(entry);
        return history;
    }

    get total() {
        if (this.is2d6Roll) {
            return this.faces[0] - this.faces[1] + this.rank + this.bonus;
        }

        return this.faces.reduce((a, b) => a + b, 0) + this.rank + this.bonus;
    }

    get ladder() {
        const total = Math.clamp(this.total, -4, 8);
        const totalString = (total < 0 ? "-" : "+").concat(Math.abs(total).toString());

        return game.i18n.localize(`FAx.Global.Ladder.${totalString}`);
    }

    get totalString() {
        return (this.total < 0 ? "-" : "+").concat(Math.abs(this.total).toString());
    }

    get symbols() {
        if (this.is2d6Roll) {
            return this.faces;
        }

        return this.faces.map((f) => (f > 0 ? "+" : f < 0 ? "-" : "0"));
    }

    get is2d6Roll() {
        return this.options.rollmode === ROLL_MODES["2d6"];
    }

    get rankStatus() {
        return this.rank >= 0 ? "positive" : "negative";
    }

    async render() {
        const template = "systems/fatex/templates/chat/roll.hbs";

        return await foundry.applications.handlebars.renderTemplate(template, this);
    }

    static determineMagicCount(skill: SkillItemData & ItemDataProperties) {
        const magicSkills = skill.parent.items.filter((i) => i.type === "skill" && i.system.options.isMagicSkill);

        if (magicSkills.length === 0) {
            ui.notifications.error(game.i18n.localize("FAx.Item.Skill.Roll.NoMagicSkills"));
            return false;
        }

        if (magicSkills.length > 1) {
            ui.notifications.warn(
                game.i18n.format("FAx.Item.Skill.Roll.MultipleMagicSkills", {
                    skills: magicSkills.map((s) => s.name).join(", "),
                }),
            );
        }

        const magicRank = Math.clamped(Number(magicSkills[0].system.rank ?? 0), 0, 4);

        if (magicRank < 1) {
            ui.notifications.error(game.i18n.localize("FAx.Item.Skill.Roll.MagicSkillTooLow"));
            return false;
        }

        return magicRank;
    }
}
