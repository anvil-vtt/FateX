import { BaseItem } from "../BaseItem";

export class SkillItem extends BaseItem {
    static get entityName() {
        return "skill";
    }

    /**
     * Adds skill specifig actorsheet listeners.
     */
    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        // Check or uncheck a single box
        html.find(".fatex__skill").click((e) => this._onRollSkill.call(this, e, sheet));
        html.find(".fatex__skill__increment").click((e) => this._onSkillChangeRank.call(this, e, sheet, true));
        html.find(".fatex__skill__decrement").click((e) => this._onSkillChangeRank.call(this, e, sheet, false));
    }

    /**
     * Adds skill specific actorsheet data
     * Determines if a filler-skill should be rendered.
     */
    static getActorSheetData(sheetData) {
        // Render skill in two columns if necessary
        sheetData.options.enableColumns = sheetData.skills.length >= 8;
        sheetData.options.numberRows = Math.ceil(sheetData.skills.length / 2);

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

        for (let i = 0; i <= 9; i++) {
            sheetData.availableRanks.push(i);
        }

        return sheetData;
    }

    /*************************
     * EVENT HANDLER
     *************************/

    static async _onSkillChangeRank(e, sheet, doIncrement) {
        e.preventDefault();
        e.stopPropagation();

        const dataset = e.currentTarget.dataset;
        const skill = sheet.actor.getOwnedItem(dataset.item);

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

        const dataset = e.currentTarget.dataset;
        const skill = sheet.actor.getOwnedItem(dataset.itemId);

        if (skill) {
            await this.rollSkill(sheet, skill);
        }
    }

    static async rollSkill(sheet, item) {
        const skill = this.prepareItemData(duplicate(item), item);
        const template = "systems/fatex/templates/chat/roll-skill.html";
        const rank = parseInt(skill.data.rank) || 0;
        const actor = sheet.actor;
        const roll = new Roll("4dF").roll();
        const dice = this.getDice(roll);
        const total = this.getTotalString(roll.total + rank);
        const ladder = this.getLadderLabel(roll.total + rank);

        // Prepare skill item
        const templateData = { skill, rank, dice, total, ladder };

        const chatData: {
            user: string;
            speaker: unknown;
            sound: string;
            flags: {
                templateVariables: unknown;
            };
            content?: HTMLElement;
        } = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            sound: CONFIG.sounds.dice,
            flags: {
                templateVariables: templateData,
            },
        };

        chatData.content = await renderTemplate(template, templateData);
        await ChatMessage.create(chatData);
    }

    static getDice(roll) {
        const useOldRollApi = isNewerVersion("0.7.0", game.data.version);
        const rolls = useOldRollApi ? roll.parts[0].rolls : roll.terms[0].results;

        return rolls.map((rolledDie) => ({
            value: rolledDie.roll,
            face: this.getDieFace(rolledDie.roll),
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
