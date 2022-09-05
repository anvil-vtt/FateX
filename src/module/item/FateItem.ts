import { FateItemData } from "./ItemTypes";

export class FateItem extends Item {
    prepareData() {
        super.prepareData();

        // Let every itemType prepare itself

        // @ts-ignore
        if (this.actor?.system) {
            if (CONFIG.FateX.itemClasses[this.type]) {
                CONFIG.FateX.itemClasses[this.type].prepareItemData(this, this);
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
        if (this.type === "extra") {
            // @ts-ignore
            return this.system.parentID !== "";
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
