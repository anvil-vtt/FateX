import { BaseItem } from "./BaseItem";

export class ItemFate extends Item {
    /** @override */
    prepareData() {
        super.prepareData();
        const data = this.data;

        // Let every itemType prepare itself
        const item = CONFIG.FateX.itemClasses[data.type] as typeof BaseItem;
        item.prepareItemData(data, this);
    }
}
