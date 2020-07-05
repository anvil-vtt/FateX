import { BaseItem } from "../BaseItem.js";

export class StressItem extends BaseItem {
    static LABEL_TYPE_CORE = 0;
    static LABEL_TYPE_CONDENSED = 1;
    static LABEL_TYPE_CUSTOM = 2;

    static activateActorSheetListeners(html, sheet) {
        // Add new stress track
        html.find('.fatex__stress__add').click(this._onStressTrackAdd.bind(sheet));

        // Configure single stress track
        html.find('.fatex__stress__settings').click(this._onStressTrackSettings.bind(sheet));

        // Check or uncheck a single box
        html.find('.fatex__stress__track__item__box').click(this._onStressBoxToggle.bind(sheet));

        // Delete a stress track
        html.find('.fatex__stress__delete').click(this._onStressTrackDelete.bind(sheet));
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

    static _onStressTrackAdd(e) {
        e.preventDefault();

        const itemData = {
            name: 'Stress',
            type: 'stress',
            data: {
                size: 4
            }
        };

        // Create item and render sheet afterwards
        this.actor.createOwnedItem(itemData).then((item) => {
            // We have to reload the item for it to have a sheet
            const createdItem = this.actor.getOwnedItem(item._id);
            createdItem.sheet.render(true);
        });
    }

    static _onStressTrackDelete(e) {
        e.preventDefault();

        const data = e.currentTarget.dataset;
        const item = this.actor.getOwnedItem(data.item);

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
                        this.actor.deleteOwnedItem(data.item);
                    }
                }
            }
        }, {
            classes: ['fatex', 'fatex__dialog'],
        })).render(true);
    }

    static _onStressTrackSettings(e) {
        e.preventDefault();

        const data = e.currentTarget.dataset;
        const item = this.actor.getOwnedItem(data.item);

        item.sheet.render(true);
    }

    static _onStressBoxToggle(e) {
        e.preventDefault();

        const data = e.currentTarget.dataset;
        const item = this.actor.getOwnedItem(data.item);
        const index = data.index;

        if(item) {
            let updatedItem = duplicate(item);
            updatedItem.data.value = StressItem._getToggledStressValue(updatedItem.data.value, index);

            this.actor.updateOwnedItem(updatedItem);
        }
    }
}
