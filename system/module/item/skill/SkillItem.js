import { BaseItem } from "../BaseItem.js";

export class SkillItem extends BaseItem {
    static entityName = 'skill';

    /**
     * Adds skill specifig actorsheet listeners.
     */
    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        // Check or uncheck a single box
        html.find('.fatex__skill').click((e) => this._onRollSkill.call(this, e, sheet));
    }

    /**
     * Adds skill specific actorsheet data
     * Determines if a filler-skill should be rendered.
     */
    static getActorSheetData(sheetData) {
        // Render skill in two columns if necessary
        sheetData.options.enableColumns = sheetData.skills.length >= 8;

        // If Skills are rendered in columns and need to be of even number
        sheetData.options.addSkillFiller = sheetData.options.enableColumns && !!(sheetData.skills.length % 2);

        return sheetData;
    }

    /**
     * Add a list of available ranks to the sheet
     */
    static getSheetData(sheetData) {
        sheetData.availableRanks = [];

        for(let i = 0; i <= 9; i++) {
            sheetData.availableRanks.push(i);
        }

        return sheetData;
    }

    /*************************
     * EVENT HANDLER
     *************************/

    static _onRollSkill(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const skill = sheet.actor.getOwnedItem(dataset.itemId);

        this.rollSkill(sheet, skill);
    }

    static async rollSkill(sheet, skill) {
        const template = 'systems/fatex/templates/chat/roll-skill.html';
        const rank = parseInt(skill.data.data.rank) || 0;
        const actor = sheet.actor;
        const roll = new Roll("4dF").roll();
        const dice = this.getDice(roll);
        const total = this.getTotalString(roll.total + rank);
        const ladder = this.getLadderLabel(roll.total + rank);

        let templateData = { skill, sheet, actor, rank, dice, total, ladder };

        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            sound: CONFIG.sounds.dice,
            flags: {
                templateVariables: templateData
            }
        };

        chatData.content = await renderTemplate(template, templateData);

        const chatMessage = await ChatMessage.create(chatData);
       /*console.log(chatMessage)
        chatMessage.update({"content": "Hallo"});*/
    }

    static getDice(roll) {
        const dice = [];

        roll.parts[0].rolls.forEach(rolledDie => {
            const die = {};
            die.value = rolledDie.roll;
            die.face = this.getDieFace(rolledDie.roll)

            dice.push(die);
        })

        return dice;
    }

    static getDieFace(die) {
        if(die > 0) return "+";
        if(die < 0) return "-";

        return "0";
    }

    static getLadderLabel(value) {
        if(value > 8) value = 8;
        if(value < -4) value = -4;

        return game.i18n.localize("FAx.Global.Ladder." + this.getTotalString(value))
    }

    static getLadderPrefix(value) {
        if(value < 0)
            return "-";

        return "+";
    }

    static getTotalString(total) {
        return this.getLadderPrefix(total).concat(Math.abs(total).toString());
    }
}
