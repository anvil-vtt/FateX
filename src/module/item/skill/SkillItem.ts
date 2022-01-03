import { BaseItem } from "../BaseItem";

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
        html.find(`.fatex-js-${this.documentName}-sort-reverse`).click(() => this._onSkillSort.call(this, sheet, "reverse"));
    }

    /**
     * Adds skill specific actorsheet data
     * Determines if a filler-skill should be rendered.
     */
    static getActorSheetData(sheetData) {
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
        data.data.isNegative = data.data.rank < 0;
        data.data.isPositive = data.data.rank >= 0;
        data.data.isNeutral = data.data.rank === 0;

        return data;
    }

    /**
     * Add a list of available ranks to the sheet
     */
    static getSheetData(sheetData, _item) {
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
            skills.sort((a, b) => a.data.name.localeCompare(b.data.name));
        } else if (sortBy === "rank") {
            skills.sort((a, b) => a.data.data.rank - b.data.data.rank).reverse();
        } else if (sortBy === "reverse") {
            skills.sort((a, b) => a.data.sort - b.data.sort).reverse();
        }

        let i = 0;

        const updates = skills.map((skill) => ({
            _id: skill._id,
            sort: 10000 + i++,
        }));

        sheet.actor.updateOwnedItem(updates);
    }

    static async _onSkillChangeRank(e, sheet, doIncrement) {
        e.preventDefault();
        e.stopPropagation();

        const dataset = e.currentTarget.dataset;
        const skill = sheet.actor.items.get(dataset.item);

        if (skill) {
            const rank = skill.data.data.rank;
            let newRank;

            if (doIncrement) {
                newRank = rank >= 9 ? 9 : rank + 1;
            } else {
                newRank = rank <= -9 ? -9 : rank - 1;
            }

            await skill.update(
                {
                    "data.rank": newRank,
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
            await this.rollSkill(sheet, skill);
        }
    }

    static async rollSkill(sheet, item) {
        const skill = this.prepareItemData(duplicate(item.data), item);
        const template = "systems/fatex/templates/chat/roll-skill.hbs";
        const rank = parseInt(skill.data.rank) || 0;
        const actor = sheet.actor;
        // @ts-ignore
        const roll = new Roll("4dF").roll({ async: false });
        const dice = this.getDice(roll);
        const total = this.getTotalString((roll.total || 0) + rank);
        const ladder = this.getLadderLabel((roll.total || 0) + rank);

        // Prepare skill item
        const templateData = { skill, rank, dice, total, ladder };

        const chatData = {
            user: game.user?.id,
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            sound: CONFIG.sounds.dice,
            roll: roll,
            rollMode: game.settings.get("core", "rollMode") as string,
            content: await renderTemplate(template, templateData),

            flags: {
                templateVariables: templateData,
            },
        };

        await ChatMessage.create(chatData);
    }

    static getDice(roll) {
        const rolls = roll.terms[0].results;

        return rolls.map((rolledDie) => ({
            value: rolledDie.roll,
            face: this.getDieFace(rolledDie.result),
        }));
    }

    static getDieFace(die) {
        if (die > 0) return "+";
        if (die < 0) return "-";

        return "0";
    }

    static getLadderLabel(value) {
        if (value > 8) value = 8;
        if (value < -4) value = -4;

        return game.i18n.localize("FAx.Global.Ladder." + this.getTotalString(value));
    }

    static getLadderPrefix(value) {
        if (value < 0) return "-";

        return "+";
    }

    static getTotalString(total) {
        return this.getLadderPrefix(total).concat(Math.abs(total).toString());
    }
}
