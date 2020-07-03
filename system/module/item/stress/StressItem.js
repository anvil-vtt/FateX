export class StressItem {
    static prepareItem(item) {

        // Add renderable boxes
        item.boxes = [];

        // Convert to binary
        let base2 = (item.data.value).toString(2);

        // Add boxes with prepared data
        for (let i = 0; i < item.data.size; i++) {
            let box = [];

            box.isChecked = !!parseInt(base2[i]);
            box.label = (i).toString();

            item.boxes.push(box);
        }

        console.log(item.boxes);

        return item;
    }

}
