import { BaseItem } from "./BaseItem";

export class ItemFate extends Item {
    /** @override */
    prepareData() {
        super.prepareData();
        const data = this.data;

        // Let every itemType prepare itselt
        const item = CONFIG.FateX.itemTypes[data.type] as typeof BaseItem;
        item.prepareItemData(data, this);
    }
}
