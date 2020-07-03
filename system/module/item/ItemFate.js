import { StressItem } from "./stress/StressItem.js";

export class ItemFate extends Item {

    /** @override */
    prepareData() {
        super.prepareData();

        let item = this.data;
        console.log(item);

        if (item.type === 'stress') {
            item = StressItem.prepareItem(item);
        }
    }
}
