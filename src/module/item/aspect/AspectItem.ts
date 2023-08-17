import { BaseItem } from "../BaseItem";

export class AspectItem extends BaseItem {
    static documentName = "aspect";

    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        // Check or uncheck a single box
        html.find(".fatex-js-aspect-input").on("blur", (e) => this._onAspectTextChange.call(this, e, sheet));
    }

    /*************************
     * EVENT HANDLER
     *************************/

    static _onAspectTextChange(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.items.get(dataset.itemId);
        const input = $(e.currentTarget).html();

        // Check if the value of the input field changed
        if (item.system.value === input) {
            return;
        }

        if (item) {
            item.update({
                "system.value": input,
            });
        }
    }
}
