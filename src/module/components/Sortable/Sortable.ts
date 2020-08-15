import { BaseComponent } from "../BaseComponent";

/**
 * Allows all items on the sheet to be sorted.
 * Implements a simple drag-handler to allow dragging to start.
 */
export class Sortable extends BaseComponent {
    /**
     * Adds event listeners to all fatex__sortable components.
     *
     * @param html
     * @param sheet
     */
    static activateListeners(html, sheet) {
        // We have to use standard event listeners here, because Items _onDrop() does not support jQuery events.
        html.find(".fatex__sortable").each((_i, sortable) => {
            sortable.addEventListener("dragstart", (e) => sheet._onDragStart.call(sheet, e), false);
        });

        // Only allow dragging when using the sort-handle
        html.find(".fatex__item__sort").mousedown((e) => this._onDragHandlerMouseDown.call(this, e));
        html.find(".fatex__item__sort").mouseup((e) => this._onDragHandlerMouseUp.call(this, e));
    }

    static _onDragHandlerMouseDown(e) {
        $(e.currentTarget).parents(".fatex__sortable").get(0).setAttribute("draggable", "true");
    }

    static _onDragHandlerMouseUp(e) {
        $(e.currentTarget).parents(".fatex__sortable").get(0).setAttribute("draggable", "false");
    }
}
