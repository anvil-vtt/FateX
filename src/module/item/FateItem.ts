import { FateItemData } from "./ItemTypes";

export class FateItem extends Item<FateItemData> {
    prepareData() {
        super.prepareData();
        const data = this.data;

        // Let every itemType prepare itself
        if (CONFIG.FateX.itemClasses[data.type]) {
            CONFIG.FateX.itemClasses[data.type].prepareItemData(data, this);
        }
    }
}
