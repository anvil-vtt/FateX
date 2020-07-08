export class BaseItem {
    static prepareItemForActorSheet(item) {
        return item;
    }

    /**
     * Allows every item to register its own listeners for rendered actor sheets.
     * Implements base listeners for adding, configuring and deleting embedded items.
     *
     * @param html
     * @param sheet
     */
    static activateActorSheetListeners(html, sheet) {
        if(!this.entityName) {
            throw new Error("A subclass of the BaseItem must provide an entityName field or implement their own _onItemAdd() method.");
        }

        // Default listeners for adding, configuring and deleting embedded items
        html.find(`.fatex__${this.entityName}__add`).click((e) => this._onItemAdd.call(this, e, sheet));
        html.find(`.fatex__${this.entityName}__settings`).click((e) => this._onItemSettings.call(this, e, sheet));
        html.find(`.fatex__${this.entityName}__delete`).click((e) => this._onItemDelete.call(this, e, sheet));
    }

    static getSheetData(sheetData) {
        return sheetData;
    }

    static _createNewItem(itemData, sheet, render = true) {
        // Create item and render sheet afterwards
        sheet.actor.createOwnedItem(itemData).then((item) => {
            if(!render) return;

            // We have to reload the item for it to have a sheet
            const createdItem = sheet.actor.getOwnedItem(item._id);
            createdItem.sheet.render(true);
        });
    }


    /*************************
     * EVENT HANDLER
     *************************/

    static _onItemAdd(e, sheet) {
        e.preventDefault();

        if(!this.entityName) {
            throw new Error("A subclass of the BaseItem must provide an entityName field or implement their own _onItemAdd() method.");
        }

        const itemData = {
            name: this.defaultName ?? this.getDefaultName(),
            type: this.entityName,
        };

        this._createNewItem(itemData, sheet);
    }

    static _onItemSettings(e, sheet) {
        e.preventDefault();

        const data = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(data.item);

        if(item) {
            item.sheet.render(true);
        }
    }

    static _onItemDelete(e, sheet) {
        e.preventDefault();

        const data = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(data.item);

        (new Dialog({
            title: `Delete ${item.name}`,
            content: game.i18n.format('FATEx.Dialog.EntityDelete'),
            default: 'submit',
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

    static getDefaultName() {
        return this.entityName.charAt(0).toUpperCase() + this.entityName.slice(1);
    }
}
