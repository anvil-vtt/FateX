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
        styles: {
            name: string;
            customProperty: string;
            defaultValue: string;
        }[];
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
        styles: [
            {
                name: "buttonShadowColor",
                customProperty: "--fatex-button-shadow-color",
                defaultValue: "#a0a0a0"
            },
            {
                name: "headerBackgroundColor",
                customProperty: "--fatex-header-color",
                defaultValue: "#2f3542"
            },
            {
                name: "headerTextColor",
                customProperty: "--fatex-header-text-color",
                defaultValue: "#ffffff"
            },
            {
                name: "mainShadowColor",
                customProperty: "--fatex-main-shadow-color",
                defaultValue: "#2f3542"
            },
            {
                name: "primarySheetColor",
                customProperty: "--fatex-primary-color",
                defaultValue: "#2f3542"
            },
            {
                name: "scrollbarColor",
                customProperty: "--fatex-scrollbar-color",
                defaultValue: "#2f3542"
            },
            {
                name: "sheetBackgroundColor",
                customProperty: "--fatex-sheet-background-color",
                defaultValue: "#f1f2f6"
            },
            {
                name: "textColor1",
                customProperty: "--fatex-text-color-1",
                defaultValue: "#191813"
            },
            {
                name: "textColor2",
                customProperty: "--fatex-text-color-2",
                defaultValue: "#ffffff"
            }
        ]
    }
};
