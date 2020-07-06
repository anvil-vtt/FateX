import { Radio } from "./module/components/Radio/Radio.js";
import { RangeSlider } from "./module/components/RangeSlider/RangeSlider.js";
import { AspectItem } from "./module/item/aspect/AspectItem.js";
import { StressItem } from "./module/item/stress/StressItem.js";

export const FATEx = {
    "itemTypes": {
        "stress": StressItem,
        "aspect": AspectItem,
    },
    "sheetComponents": {
        "radio": Radio,
        "rangeSlider": RangeSlider
    }
};
