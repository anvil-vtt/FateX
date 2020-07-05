export class ItemFate extends Item {

    /** @override */
    prepareData() {
        super.prepareData();
        let item = this.data;

        // Let every itemType prepare itselt
        CONFIG.FATEx.itemTypes[item.type].prepareItemForActorSheet(item);
    }
}
