// @ts-nocheck
import { FateRollDataModel } from "../data/FateRollDataModel";
import { SkillItemData } from "../item/ItemTypes";
import { ItemDataProperties } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";

export class FateRoll extends FateRollDataModel {
    static createFromSkill(skill: SkillItemData & ItemDataProperties, { magic = false } = {}) {
        const options = { magic };

        if (game.settings.get("fatex", "guildCodexMagicSystemEnabled") && magic) {
            options["magicCount"] = this.determineMagicCount(skill);

            if (options["magicCount"] === false) {
                return false;
            }
        }

        return new FateRoll({
            _id: foundry.utils.randomID(),
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

        const roll = new Roll(`4dF`).roll({ async: false });
        this.updateSource({ faces: roll.terms[0].results.map((r) => r.count ?? r.result) });

        if (game.modules.get("dice-so-nice")?.active) {
            const user = userId ? game.users.get(userId) : game.user;
            await game.dice3d.showForRoll(roll, user, true);
        }

        return this;
    }

    async rollMagic(userId = "", magicCount: number) {
        const magicRoll = new Roll(`${magicCount}dMe`).roll({ async: false });
        const normalRoll = new Roll(`${4 - magicCount}dF`).roll({ async: false });

        this.updateSource({
            faces: [...magicRoll.terms[0].results, ...normalRoll.terms[0].results].map((r) => r.count ?? r.result),
        });

        magicRoll.terms[0].options.sfx = {
            specialEffect: "PlayAnimationParticleSparkles",
        };

        if (game.modules.get("dice-so-nice")?.active) {
            const user = userId ? game.users.get(userId) : game.user;

            await Promise.all([
                game.dice3d.showForRoll(magicRoll, user, true),
                game.dice3d.showForRoll(normalRoll, user, true),
            ]);
        }

        return this;
    }

    async reroll(userId = "") {
        const history = this.addHistoryEntry(userId, { type: "reroll", previousRoll: this.faces });
        await this.roll(userId);

        this.updateSource({ history: history });

        return this;
    }

    increase(userId = "") {
        const history = this.addHistoryEntry(userId, { type: "increase" });

        this.updateSource({ bonus: this.bonus + 2, history: history });

        return this;
    }

    private addHistoryEntry(userId: string, data) {
        const history = foundry.utils.deepClone(this.history);
        const user = userId ? game.users.get(userId) : game.user;
        const entry = { user: user.name, ...data };

        history.push(entry);
        return history;
    }

    get total() {
        return this.faces.reduce((a, b) => a + b, 0) + this.rank + this.bonus;
    }

    get ladder() {
        const total = Math.clamped(this.total, -4, 8);
        const totalString = (total < 0 ? "-" : "+").concat(Math.abs(total).toString());

        return game.i18n.localize(`FAx.Global.Ladder.${totalString}`);
    }

    get totalString() {
        return (this.total < 0 ? "-" : "+").concat(Math.abs(this.total).toString());
    }

    get symbols() {
        return this.faces.map((f) => (f > 0 ? "+" : f < 0 ? "-" : "0"));
    }

    get rankStatus() {
        return this.rank >= 0 ? "positive" : "negative";
    }

    async render() {
        const template = "systems/fatex/templates/chat/roll.hbs";

        return await renderTemplate(template, this);
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
                })
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
