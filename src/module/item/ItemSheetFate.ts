export class ItemSheetFate extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["fatex", "fatex-sheet", "fatex-sheet--item", "sheet"],
            scrollY: [".desk__content"],
            width: 575,
        } as BaseEntitySheet.Options);
    }

    getData() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any = super.getData();

        // enforce data to ensure compatability between 0.7 and 0.8
        data.data = this.entity.data.data;

        // Set owner name if possible
        data.isOwnedBy = this.actor ? this.actor.name : false;

        // Let every item type manipulate its own sheet data
        data = CONFIG.FateX.itemClasses[this.item.type]?.getSheetData(data, this) || data;

        // Let every component manipulate an items sheet data
        for (const sheetComponent in CONFIG.FateX.sheetComponents.item) {
            if (Object.prototype.hasOwnProperty.call(CONFIG.FateX.sheetComponents.item, sheetComponent)) {
                data = CONFIG.FateX.sheetComponents.item[sheetComponent].getSheetData(data, this);
            }
        }

        return data;
    }

    get template() {
        return `systems/fatex/templates/item/${this.item.data.type}-sheet.hbs`;
    }

    activateListeners(html) {
        super.activateListeners(html);

        for (const sheetComponent in CONFIG.FateX.sheetComponents.item) {
            if (Object.prototype.hasOwnProperty.call(CONFIG.FateX.sheetComponents.item, sheetComponent)) {
                CONFIG.FateX.sheetComponents.item[sheetComponent].activateListeners(html, this);
            }
        }

        // Let every item type add its own sheet listeners
        CONFIG.FateX.itemClasses[this.item.type]?.activateListeners(html, this);
    }
}
