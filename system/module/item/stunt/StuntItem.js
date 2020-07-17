import { BaseItem } from "../BaseItem.js";

export class StuntItem extends BaseItem {
    static entityName = 'stunt';

    /**
     * Adds stunt specifig actorsheet listeners.
     */
    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        // Check or uncheck a single box
        html.find('.fatex__stunt__toggle').click((e) => this._onToggleView.call(this, e, sheet));
    }


    /*************************
     * EVENT HANDLER
     *************************/

    static _onToggleView(e, sheet) {
        e.preventDefault();
        e.stopPropagation();
    }

}
