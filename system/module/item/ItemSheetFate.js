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
        const type = data.item.type;

        data = CONFIG.FATEx.itemTypes[type].getSheetData(data);

        return data;
    }

    /** @override */
    get template() {
        return `systems/fatex/templates/item/${this.item.data.type}-sheet.html`;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        for (let sheetComponent in CONFIG.FATEx.sheetComponents) {
            CONFIG.FATEx.sheetComponents[sheetComponent].activateListeners(html, this);
        }
    }
}
