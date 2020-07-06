import { BaseItem } from "../BaseItem.js";

export class AspectItem extends BaseItem {

    static activateActorSheetListeners(html, sheet) {
        // Add new aspect
        html.find('.fatex__aspect__add').click((e) => this._onAspectAdd.call(this, e, sheet));
    }

    /*************************
     * EVENT HANDLER
     *************************/

    static _onAspectAdd(e, sheet) {
        e.preventDefault();

        const itemData = {
            name: 'Aspect',
            type: 'aspect',
        };

        this._createNewItem(itemData, sheet);
    }

}
