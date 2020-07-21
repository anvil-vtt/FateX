export class ItemFate extends Item {

    /** @override */
    prepareData() {
        super.prepareData();
        let item = this.data;

        // Let every itemType prepare itselt
        CONFIG.FateX.itemTypes[item.type].prepareItemForActorSheet(item);
    }

    get isEmbeddedItem() {
        return !!this.getFlag('fatex', 'isEmbeddedItem');
    }

    get visible() {
        if(this.isEmbeddedItem) {
            return false;
        }

        return super.visible;
    }
}
