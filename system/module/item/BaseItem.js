export class BaseItem {
    static prepareItemForActorSheet(item) {
        return item;
    }

    static activateActorSheetListeners(html, sheet) {}

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
}
