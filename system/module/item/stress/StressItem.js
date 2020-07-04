import { BaseItem } from "../BaseItem.js";

export class StressItem extends BaseItem {
    static prepareItem(item) {
        // Add renderable boxes
        item.boxes = [];

        // Add boxes with prepared data
        for (let i = 0; i < item.data.size; i++) {
            let box = [];

            box.isChecked = item.data.value & Math.pow(2, i);
            box.label = this.getBoxLabel(item,i);

            item.boxes[i] = box;
        }

        return item;
    }

    static getBoxLabel(item, i) {
        if(item.data.labelType === 1) {
            return 1;
        }

        if(item.data.labelType === 2) {
            return (item.data.customLabel).split(" ")[i];
        }

        return i+1;
    }

    static toggleStressValue(stressValue, boxIndex) {
        return stressValue ^= Math.pow(2, boxIndex);
    }

    static activateListeners(html, sheet) {
        // Add new stress track
        html.find('.fatex__stress__add').click(this.onStressCreate.bind(sheet));

        // Configure single stress track
        html.find('.fatex__stress__settings').click(this.onStressSettings.bind(sheet));

        // Check or uncheck a single box
        html.find('.fatex__stress__track__item__box').click(this.onStressToggle.bind(sheet));

        // Delete a stress track
        html.find('.fatex__stress__delete').click(this.onStressDelete.bind(sheet));
    }

    static onStressCreate(e) {
        e.preventDefault();

        const itemData = {
            name: 'Stress',
            type: 'stress',
            data: {
                size: 4
            }
        };

        this.actor.createOwnedItem(itemData);
    }

    static onStressDelete(e) {
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

    static onStressSettings(e) {
        e.preventDefault();

        const data = e.currentTarget.dataset;
        const item = this.actor.getOwnedItem(data.item);

        item.sheet.render(true);
    }

    static onStressToggle(e) {
        e.preventDefault();

        const data = e.currentTarget.dataset;
        const item = this.actor.getOwnedItem(data.item);
        const index = data.index;

        if(item) {
            let updatedItem = duplicate(item);
            updatedItem.data.value = StressItem.toggleStressValue(updatedItem.data.value, index);

            this.actor.updateOwnedItem(updatedItem);
        }
    }
}
