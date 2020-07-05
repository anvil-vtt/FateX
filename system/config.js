import { Radio } from "./module/components/Radio/Radio.js";
import { RangeSlider } from "./module/components/RangeSlider/RangeSlider.js";
import { StressItem } from "./module/item/stress/StressItem.js";

export const FATEx = {
    "itemTypes": {
        "stress": StressItem,
    },
    "sheetComponents": {
        "radio": Radio,
        "rangeSlider": RangeSlider
    }
};
