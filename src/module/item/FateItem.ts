import { FateItemData } from "./ItemTypes";

export class FateItem extends Item {
    prepareData() {
        super.prepareData();

        // Let every itemType prepare itself
        if (this.actor?.data) {
            if (CONFIG.FateX.itemClasses[this.data.type]) {
                CONFIG.FateX.itemClasses[this.data.type].prepareItemData(this.data, this);
            }
        }
    }
}

declare global {
    interface DocumentClassConfig {
        Item: typeof FateItem;
    }

    interface DataConfig {
        Item: FateItemData;
    }
}
