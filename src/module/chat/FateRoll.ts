// @ts-nocheck

import { FateRollDataModel } from "../data/FateRollDataModel";
import { SkillItemData } from "../item/ItemTypes";
import { ItemDataProperties } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";

export class FateRoll extends FateRollDataModel {
    static createFromSkill(skill: SkillItemData & ItemDataProperties, { magic = false } = {}) {
        const options = { magic };

        return new FateRoll({
            _id: foundry.utils.randomID(),
            name: skill.name,
            rank: skill.system.rank,
            options,
        });
    }

    async roll(_options = {}) {
        const roll = new Roll(`4dF${this.options.magic && "m"}`).roll({ async: false });
        this.updateSource({ faces: roll.terms[0].results.map((r) => r.result) });

        if (game.modules.get("dice-so-nice")?.active) {
            await game.dice3d.showForRoll(roll, game.user, true);
        }

        return this;
    }

    async reroll(_options = {}) {
        await this.roll();

        const history = foundry.utils.deepClone(this.history);
        history.push({ type: "reroll" });

        this.updateSource({ history: history });

        return this;
    }

    increase(_options = {}) {
        const history = foundry.utils.deepClone(this.history);
        history.push({ type: "increase" });

        this.updateSource({ bonus: this.bonus + 2, history: history });

        return this;
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

    async render(_options = {}) {
        const template = "systems/fatex/templates/chat/roll.hbs";

        return await renderTemplate(template, this);
    }
}
