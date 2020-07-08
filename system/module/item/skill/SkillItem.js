import { BaseItem } from "../BaseItem.js";

export class SkillItem extends BaseItem {
    static entityName = 'skill';

    // Force people to choose a name.
    static defaultName = ' ';

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

    /*************************
     * EVENT HANDLER
     *************************/

    static _onRollSkill(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const skill = sheet.actor.getOwnedItem(dataset.itemId);
        const level = parseInt(skill.data.data.level);

        let r = new Roll("4dF4 + " + level).roll();
        r.toMessage();
    }
}
