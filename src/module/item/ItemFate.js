export class ItemFate extends Item {
    /** @override */
    prepareData() {
        super.prepareData();
        let data = this.data;

        // Let every itemType prepare itselt
        CONFIG.FateX.itemTypes[data.type].prepareItemData(data, this);
    }
}
