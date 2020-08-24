export class ItemFate extends Item {
    prepareData() {
        super.prepareData();
        const data = this.data;

        // Let every itemType prepare itself
        CONFIG.FateX.itemClasses[data.type].prepareItemData(data, this);
    }
}
