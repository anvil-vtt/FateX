import { BaseItem } from "../BaseItem.js";

export class StressItem extends BaseItem {
    static LABEL_TYPE_CORE = 0;
    static LABEL_TYPE_CONDENSED = 1;
    static LABEL_TYPE_CUSTOM = 2;

    static activateActorSheetListeners(html, sheet) {
        // Add new stress track
        html.find('.fatex__stress__add').click((e) => this._onStressTrackAdd.call(this, e, sheet));

        // Configure single stress track
        html.find('.fatex__stress__settings').click((e) => this._onStressTrackSettings.call(this, e, sheet));

        // Check or uncheck a single box
        html.find('.fatex__stress__track__item__box').click((e) => this._onStressBoxToggle.call(this, e, sheet));

        // Delete a stress track
        html.find('.fatex__stress__delete').click((e) => this._onStressTrackDelete.call(this, e, sheet));
    }

    static prepareItemForActorSheet(item) {
        // Add renderable boxes
        item.boxes = [];
        item.fillers = [];

        // Add boxes with prepared data
        for (let i = 0; i < item.data.size; i++) {
            let box = [];

            box.isChecked = item.data.value & Math.pow(2, i);
            box.label = this._getBoxLabel(item,i);

            item.boxes[i] = box;
        }

        if(item.data.size % 4 !== 0) {
            for (let i = (4 - (item.data.size % 4)); i > 0; i--) {
                item.fillers[i] = i;
            }
        }

        return item;
    }

     static _getBoxLabel(item, i) {
        if(item.data.labelType === StressItem.LABEL_TYPE_CONDENSED) {
            return 1;
        }

        if(item.data.labelType === StressItem.LABEL_TYPE_CUSTOM) {
            return (item.data.customLabel).split(" ")[i];
        }

        return i+1;
    }

    static _getToggledStressValue(currentStressTrackValue, boxIndexToToggle) {
        return currentStressTrackValue ^ Math.pow(2, boxIndexToToggle);
    }

    /*************************
     * EVENT HANDLER
     *************************/

    static _onStressTrackAdd(e, sheet) {
        e.preventDefault();

        const itemData = {
            name: 'Stress',
            type: 'stress',
            data: {
                size: 4
            }
        };

        this._createNewItem(itemData, sheet);
    }

    static _onStressTrackDelete(e, sheet) {
        e.preventDefault();

        const data = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(data.item);

        (new Dialog({
            title: `Delete ${item.name}`,
            content: game.i18n.format('FATEx.Dialog.EntityDelete'),
            buttons: {
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("FATEx.Dialog.Cancel"),
                    callback: () => null
                },
                submit: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("FATEx.Dialog.Confirm"),
                    callback: () => {
                        sheet.actor.deleteOwnedItem(data.item);
                    }
                }
            }
        }, {
            classes: ['fatex', 'fatex__dialog'],
        })).render(true);
    }

    static _onStressTrackSettings(e, sheet) {
        e.preventDefault();

        const data = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(data.item);

        item.sheet.render(true);
    }

    static _onStressBoxToggle(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(dataset.item);
        const index = dataset.index;

        if(item) {
            const newValue = StressItem._getToggledStressValue(item.data.data.value, index);

            item.update({
                "data.value": newValue
            });
        }
    }
}
