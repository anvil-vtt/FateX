export class ItemSheetFate extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            classes: options.classes.concat([
                'fatex fatex__item_sheet',
            ])
        });

        return options;
    }

    getData() {
        let data = super.getData();

        // Set owner name if possible
        data.isOwnedBy = this.actor ? this.actor.name : false;

        // Let every item type manipulate its own sheet data
        data = CONFIG.FateX.itemTypes[data.item.type].getSheetData(data);

        return data;
    }

    /** @override */
    get template() {
        return `systems/fatex/templates/item/${this.item.data.type}-sheet.html`;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        for (let sheetComponent in CONFIG.FateX.sheetComponents) {
            CONFIG.FateX.sheetComponents[sheetComponent].activateListeners(html, this);
        }
    }
}
