import { BaseItem } from "../BaseItem.js";

export class StuntItem extends BaseItem {
    static get entityName() {
        return "stunt";
    }

    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        // Check or uncheck a single box
        html.find(".fatex__item__collapse").click((e) => this._onCollapseToggle.call(this, e, sheet));
    }

    /*************************
     * EVENT HANDLER
     *************************/

    static async _onCollapseToggle(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(dataset.item);

        if (item) {
            await item.update({
                "data.collapsed": !item.data.data.collapsed,
            });
        }
    }
}
