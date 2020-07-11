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
        // Skills are rendered in columns and need to be of even number
        sheetData.options.addSkillFiller = !!(sheetData.skills.length % 2)

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
        const rank = parseInt(skill.data.data.rank) || 0;

        let r = new Roll("4dF4 + " + rank).roll();
        r.toMessage();
    }
}
