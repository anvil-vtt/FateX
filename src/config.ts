import { Automation } from "./module/components/Automation/Automation";
import { Configuration } from "./module/components/Configuration/Configuration";
import { Radio } from "./module/components/Radio/Radio";
import { RangeSlider } from "./module/components/RangeSlider/RangeSlider";
import { Sortable } from "./module/components/Sortable/Sortable";
import { AspectItem } from "./module/item/aspect/AspectItem";
import { ConsequenceItem } from "./module/item/consequence/ConsequenceItem";
import { ExtraItem } from "./module/item/extra/ExtraItem";
import { SkillItem } from "./module/item/skill/SkillItem";
import { StressItem } from "./module/item/stress/StressItem";
import { StuntItem } from "./module/item/stunt/StuntItem";
import { BaseItem } from "./module/item/BaseItem";
import { BaseComponent } from "./module/components/BaseComponent";
import { TemplateActorPicker } from "./module/applications/template-actors/TemplateActorPicker";
import { TemplateActorSettings } from "./module/applications/template-actors/TemplateActorSettings";
import { TokenReferenceItem } from "./module/item/references/TokenReferenceItem";
import { ActorReferenceItem } from "./module/item/references/ActorReferenceItem";

export interface FatexConfig {
    itemClasses: {
        [key: string]: typeof BaseItem;
        [key: number]: typeof BaseItem;
    };

    sheetComponents: {
        actor: {
            [key: string]: typeof BaseComponent;
            [key: number]: typeof BaseComponent;
        };
        item: {
            [key: string]: typeof BaseComponent;
            [key: number]: typeof BaseComponent;
        };
    };

    applications: {
        templatePicker: TemplateActorPicker | null;
        templateSettings: TemplateActorSettings | null;
        [key: string]: Application | null;
        [key: number]: Application | null;
    };

    global: {
        useMarkdown: boolean;
        defaultStyles: {
            [key: string]: string;
        };
        customProperties: string[]
    };
}

export const FateX: FatexConfig = {
    itemClasses: {
        stress: StressItem,
        aspect: AspectItem,
        consequence: ConsequenceItem,
        skill: SkillItem,
        stunt: StuntItem,
        extra: ExtraItem,
        tokenRefernce: TokenReferenceItem,
        actorReference: ActorReferenceItem,
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
        defaultStyles: {
            headerBackgroundColor: "#2f3542",
            headerTextColor: "#ffffff",
            primarySheetColor: "#2f3542",
            scrollbarColor: "#2f3542",
            sheetBackgroundColor: "#f1f2f6"
        },
        customProperties: [
            "--fatex-header-color",
            "--fatex-header-text-color",
            "--fatex-primary-color",
            "--fatex-scrollbar-color",
            "--fatex-sheet-background-color"
        ]
    }
};
