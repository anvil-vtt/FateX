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

    static rollSkill(sheet, skill) {
        const template = 'systems/fatex/templates/chat/roll-skill.html';
        const rank = parseInt(skill.data.data.rank) || 0;
        const actor = sheet.actor;

        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: actor })
        };

        let templateData = {};

        renderTemplate(template, templateData).then(content => {
            chatData.content = content;
            ChatMessage.create(chatData);
        });

        // let r = new Roll("4dF4 + " + rank).roll();
        // r.toMessage();
    }
}
