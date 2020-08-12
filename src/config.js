import { Automation } from "./module/components/Automation/Automation.js";
import { Configuration } from "./module/components/Configuration/Configuration.js";
import { Radio } from "./module/components/Radio/Radio.js";
import { RangeSlider } from "./module/components/RangeSlider/RangeSlider.js";
import { Sortable } from "./module/components/Sortable/Sortable.js";
import { AspectItem } from "./module/item/aspect/AspectItem.js";
import { ConsequenceItem } from "./module/item/consequence/ConsequenceItem.js";
import { ExtraItem } from "./module/item/extra/ExtraItem.js";
import { SkillItem } from "./module/item/skill/SkillItem.js";
import { StressItem } from "./module/item/stress/StressItem.js";
import { StuntItem } from "./module/item/stunt/StuntItem.js";

export const FateX = {
    itemTypes: {
        stress: StressItem,
        aspect: AspectItem,
        consequence: ConsequenceItem,
        skill: SkillItem,
        stunt: StuntItem,
        extra: ExtraItem,
    },
    sheetComponents: {
        actor: {
            sortable: Sortable,
            configuration: Configuration,
        },
        item: {
            radio: Radio,
            rangeSlider: RangeSlider,
            automation: Automation,
        },
    },
    applications: {
        templateSettings: null,
        templatePicker: null,
    },
    global: {
        useMarkdown: false,
    },
};
