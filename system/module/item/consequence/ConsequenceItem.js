import { BaseItem } from "../BaseItem.js";

export class ConsequenceItem extends BaseItem {
    static entityName = 'consequence';

    static TYPE_CONSEQUENCE = 0;
    static TYPE_CONDITION = 1;

    static prepareItemForActorSheet(item) {
        item.isConsequence = item.data.type === ConsequenceItem.TYPE_CONSEQUENCE;
        item.isCondition = item.data.type === ConsequenceItem.TYPE_CONDITION;

        return item;
    }

    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        // Check or uncheck a single box
        html.find('.fatex__consequence__box').click((e) => this._onToggleCondition.call(this, e, sheet));

        // Change consequence text
        html.find('.fatex__consequence__input').on('blur', (e) => this._onConsequenceTextChange.call(this, e, sheet));
    }


    /*************************
     * EVENT HANDLER
     *************************/

    static _onToggleCondition(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(dataset.item);

        if(item) {
            item.update({
                "data.active": !item.data.data.active
            });
        }
    }

    static _onConsequenceTextChange(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(dataset.itemId);
        const input = $(e.currentTarget).html();

        // Check if the value of the input field changed
        if(item.data.data.value === input) {
            return;
        }

        if(item) {
            item.update({
                "data.value": input
            });
        }
    }
}
