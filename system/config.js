import { Radio } from "./module/components/Radio/Radio.js";
import { RangeSlider } from "./module/components/RangeSlider/RangeSlider.js";
import { Sortable } from "./module/components/Sortable/Sortable.js";
import { AspectItem } from "./module/item/aspect/AspectItem.js";
import { ConsequenceItem } from "./module/item/consequence/ConsequenceItem.js";
import { SkillItem } from "./module/item/skill/SkillItem.js";
import { StressItem } from "./module/item/stress/StressItem.js";

export const FATEx = {
    "itemTypes": {
        "stress": StressItem,
        "aspect": AspectItem,
        "consequence": ConsequenceItem,
        "skill": SkillItem,
    },
    "sheetComponents": {
        "radio": Radio,
        "rangeSlider": RangeSlider,
        "sortable": Sortable
    }
};
