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

    get visible(): boolean {
        if (this.isSubitem()) {
            return false;
        }

        return super.visible;
    }

    private isSubitem() {
        console.log("Item data", this.data);

        if (this.data.type === "extra") {
            return this.data.data.parentID !== "";
        }

        return false;
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
