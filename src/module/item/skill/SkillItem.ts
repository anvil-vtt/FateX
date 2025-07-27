import { BaseItem } from "../BaseItem";
import { FateChatCard } from "../../chat/FateChatCard";
import { FateRoll } from "../../chat/FateRoll";

type sortBy = "name" | "rank" | "reverse";

export class SkillItem extends BaseItem {
    static get documentName() {
        return "skill";
    }

    /**
     * Adds skill specifig actorsheet listeners.
     */
    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        // Check or uncheck a single box
        html.find(".fatex-js-skill").click((e) => this._onRollSkill.call(this, e, sheet));
        html.find(".fatex-js-skill-increment").click((e) => this._onSkillChangeRank.call(this, e, sheet, true));
        html.find(".fatex-js-skill-decrement").click((e) => this._onSkillChangeRank.call(this, e, sheet, false));

        html.find(`.fatex-js-${this.documentName}-sort-rank`).click(() => this._onSkillSort.call(this, sheet, "rank"));
        html.find(`.fatex-js-${this.documentName}-sort-name`).click(() => this._onSkillSort.call(this, sheet, "name"));
        html.find(`.fatex-js-${this.documentName}-sort-reverse`).click(() =>
            this._onSkillSort.call(this, sheet, "reverse")
        );
    }

    /**
     * Adds skill specific actorsheet data
     * Determines if a filler-skill should be rendered.
     */
    static async getActorSheetData(sheetData) {
        // Render skill in two columns if necessary
        sheetData.options.enableColumns = sheetData.skills.length >= 8;

        if (sheetData.options.enableColumns) {
            // @ts-ignore
            const interleave = ([x, ...xs], ys = []) => (x === undefined ? ys : [x, ...interleave(ys, xs)]);
            const threshold = Math.ceil(sheetData.skills.length / 2);

            sheetData.skills = interleave(sheetData.skills.slice(0, threshold), sheetData.skills.slice(threshold));
        }

        return sheetData;
    }

    static prepareItemData(data, _item) {
        data.system.isNegative = data.system.rank < 0;
        data.system.isPositive = data.system.rank >= 0;
        data.system.isNeutral = data.system.rank === 0;

        return data;
    }

    /**
     * Add a list of available ranks to the sheet
     */
    static async getSheetData(sheetData, _item) {
        sheetData.availableRanks = [];

        for (let i = -2; i <= 7; i++) {
            sheetData.availableRanks.push(i);
        }

        return sheetData;
    }

    /*************************
     * EVENT HANDLER
     *************************/

    /**
     * Sorts all skills by rank
     */
    static async _onSkillSort(sheet, sortBy: sortBy) {
        const skills = sheet.actor.items.filter((item) => item.type == "skill");

        if (sortBy === "name") {
            skills.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "rank") {
            skills.sort((a, b) => a.system.rank - b.system.rank).reverse();
        } else if (sortBy === "reverse") {
            skills.sort((a, b) => a.sort - b.sort).reverse();
        }

        let i = 0;

        const updates = skills.map((skill) => ({
            _id: skill.id,
            sort: 10000 + i++,
        }));

        sheet.actor.updateEmbeddedDocuments("Item", updates);
    }

    static async _onSkillChangeRank(e, sheet, doIncrement) {
        e.preventDefault();
        e.stopPropagation();

        const dataset = e.currentTarget.dataset;
        const skill = sheet.actor.items.get(dataset.item);

        if (skill) {
            const rank = skill.system.rank;

            await skill.update(
                {
                    "system.rank": doIncrement ? rank + 1 : rank - 1,
                },
                {}
            );
        }
    }

    static async _onRollSkill(e, sheet) {
        e.preventDefault();

        if (this.isEditMode(e)) {
            return;
        }

        const dataset = e.currentTarget.dataset;
        const skill = sheet.actor.items.get(dataset.itemId);

        if (skill) {
            await this.rollSkill(sheet, skill, e);
        }
    }

    static async rollSkill(sheet, skill, event) {
        const actor = sheet.actor;

        const fateRoll = FateRoll.createFromSkill(skill, {
            magic: event.shiftKey,
        });

        if (!fateRoll) {
            return;
        }

        await fateRoll.roll();

        const fateChatCard = FateChatCard.create(actor, [fateRoll]);
        await fateChatCard.sendToChat();
    }
}
