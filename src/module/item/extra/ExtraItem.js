import { StuntItem } from "../stunt/StuntItem.js";

export class ExtraItem extends StuntItem {
    static get entityName() {
        return 'extra';
    };

    /**
     * Adds extra specifig actorsheet listeners.
     */
    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        // Check or uncheck a single box
        html.find('.fatex__extra__toggle').click((e) => this._onToggleView.call(this, e, sheet));
    }

}
