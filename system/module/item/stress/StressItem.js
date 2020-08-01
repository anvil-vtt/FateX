import { BaseItem } from "../BaseItem.js";

export class StressItem extends BaseItem {
    static entityName = 'stress';

    static LABEL_TYPE = {
        CORE: 0,
        CONDENSED: 1,
        CUSTOM: 2
    }

    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        // Check or uncheck a single box
        html.find('.fatex__stress__track__item__box').click((e) => this._onStressBoxToggle.call(this, e, sheet));
    }

    static prepareItemData(item, entity) {
        const numberOfBoxes = parseInt(item.data.size);

        // Add boxes with prepared data
        item.boxes = [...Array(numberOfBoxes).keys()].map((i) => {
            const box = {};

            box.isChecked = item.data.value & (2 ** i);
            box.label = this._getBoxLabel(item,i);

            return box;
        });

        // Add filler boxes if needed
        item.fillers = numberOfBoxes % 4 === 0 ? [] : [...Array(4 - (item.data.size % 4)).keys()];

        return item;
    }

     static _getBoxLabel(item, i) {
        if(item.data.labelType === StressItem.LABEL_TYPE.CONDENSED) {
            return "1";
        }

        if(item.data.labelType === StressItem.LABEL_TYPE.CUSTOM) {
            return (item.data.customLabel).split(" ")[i];
        }

        return i+1;
    }

    static _getToggledStressValue(currentStressTrackValue, boxIndexToToggle) {
        return currentStressTrackValue ^ (2 ** boxIndexToToggle);
    }

    /*************************
     * EVENT HANDLER
     *************************/

    static _onStressBoxToggle(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(dataset.item);
        const index = dataset.index;

        if(item) {
            const newValue = StressItem._getToggledStressValue(item.data.data.value, index);

            item.update({
                "data.value": newValue
            });
        }
    }

}
