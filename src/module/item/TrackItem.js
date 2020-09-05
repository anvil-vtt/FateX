import { BaseItem } from "./BaseItem";
import { Automation } from "../components/Automation/Automation";

export class TrackItem extends BaseItem {
    static prepareItemData(data, item) {
        let numberOfBoxes = parseInt(data.data.boxAmount) + Automation.getBoxAmountModifier(item);

        // Negative number of boxes is not allowed
        if (numberOfBoxes < 0) {
            numberOfBoxes = 0;
        }

        // Add boxes with prepared data
        data.boxes = [...Array(numberOfBoxes).keys()].map((i) => ({
            isChecked: data.data.boxValues & (2 ** i),
            label: this._getBoxLabel(data, i),
        }));

        // Add filler boxes if needed
        data.fillers = numberOfBoxes % 4 === 0 ? [] : [...Array(4 - (numberOfBoxes % 4)).keys()];

        if (item.isOwned) {
            data.isDisabled = numberOfBoxes <= 0 || Automation.getDisabledState(item);
        }

        return data;
    }
}
