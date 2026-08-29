/**
 * The Fate extended game system for FoundryVTT
 *
 * Author: Patrick Bauer (Daddi#2333)
 * Repository: https://github.com/anvil-vtt/FateX
 * Software License: MIT
 * Content License:
 *      This work is based on Fate Core System and Fate Accelerated Edition (found at http://www.faterpg.com/),
 *      products of Evil Hat Productions, LLC, developed, authored, and edited by Leonard Balsera, Brian Engard,
 *      Jeremy Keller, Ryan Macklin, Mike Olson, Clark Valentine, Amanda Valentine, Fred Hicks, and Rob Donoghue,
 *      and licensed for our use under the Creative Commons Attribution 3.0 Unported license
 *      (http://creativecommons.org/licenses/by/3.0/).
 */

import "./styles/fatex.scss";
import { applications } from "./module/applications/ApplicationV2";

import { FateX } from "./config";
import { FateActor } from "./module/actor/FateActor";
import { CharacterSheet } from "./module/actor/sheets/CharacterSheet";
import { HandlebarsHelpers } from "./module/helper/HandlebarsHelpers";
import { TemplatePreloader } from "./module/helper/TemplatePreloader";
import { AspectSheet } from "./module/item/aspect/AspectSheet";
import { ConsequenceSheet } from "./module/item/consequence/ConsequenceSheet";
import { ExtraSheet } from "./module/item/extra/ExtraSheet";
import { FateItem } from "./module/item/FateItem";
import { SkillSheet } from "./module/item/skill/SkillSheet";
import { StressSheet } from "./module/item/stress/StressSheet";
import { StuntSheet } from "./module/item/stunt/StuntSheet";
import { TemplateActorsFeature } from "./module/features/TemplateActorsFeature";
import { GroupSheet } from "./module/actor/sheets/GroupSheet";
import { ActorGroupFeature } from "./module/features/ActorGroupFeature";
import { ReferenceSheet } from "./module/item/references/ReferenceSheet";
import { FateScene } from "./module/scene/FateScene";
import { FateCombat } from "./module/combat/FateCombat";
import { FateXSettings } from "./module/helper/Settings";
import { ChatActionsFeature } from "./module/features/ChatActionsFeature";
import { PrototypeTokenNameSyncFeature } from "./module/features/PrototypeTokenNameSyncFeature";
import { MagicSystem } from "./module/features/MagicSystem";
import { Roll2d6Feature } from "./module/features/Roll2d6Feature";

/* -------------------------------- */
/*	System initialization			*/
/* -------------------------------- */
Hooks.once("init", async () => {
    console.log(`FateX | Initializing Fate extended game system`);

    // Initialise config
    CONFIG.FateX = FateX;

    CONFIG.Actor.documentClass = FateActor;
    CONFIG.Item.documentClass = FateItem;
    CONFIG.Scene.documentClass = FateScene;
    CONFIG.Combat.documentClass = FateCombat;

    CONFIG.FateX.global.useMarkdown = !![...game.modules.values()].filter((module) => {
        return module.id === "markdown-editor" && module.active;
    }).length;

    // Register generic system settings
    FateXSettings.registerSettings();

    // Register HandlebarsHelpers
    HandlebarsHelpers.registerHelpers();

    // Keep existing sheet IDs so saved sheet selections continue to resolve.
    const sheetConfig = applications.apps.DocumentSheetConfig;

    // Register FateX actor sheets
    sheetConfig.registerSheet(Actor, "FateX", CharacterSheet, {
        types: ["character"],
        makeDefault: true,
    });

    sheetConfig.registerSheet(Actor, "FateX", GroupSheet, {
        types: ["group"],
        makeDefault: true,
        label: "TYPES.Actor.group",
    });

    // Register FateX item sheets
    sheetConfig.registerSheet(Item, "FateX", StressSheet, {
        types: ["stress"],
        makeDefault: true,
    });

    sheetConfig.registerSheet(Item, "FateX", AspectSheet, {
        types: ["aspect"],
        makeDefault: true,
    });

    sheetConfig.registerSheet(Item, "FateX", ConsequenceSheet, {
        types: ["consequence"],
        makeDefault: true,
    });

    sheetConfig.registerSheet(Item, "FateX", SkillSheet, {
        types: ["skill"],
        makeDefault: true,
    });

    sheetConfig.registerSheet(Item, "FateX", StuntSheet, {
        types: ["stunt"],
        makeDefault: true,
    });

    sheetConfig.registerSheet(Item, "FateX", ExtraSheet, {
        types: ["extra"],
        makeDefault: true,
    });

    sheetConfig.registerSheet(Item, "FateX", ReferenceSheet, {
        types: ["actorReference", "tokenReference"],
        makeDefault: true,
        label: "FAx.Sheets.Reference",
    });

    // Preload all needed templates
    await TemplatePreloader.preloadHandlebarsTemplates();
});

/* -------------------------------- */
/*	Register hooks      			*/
/* -------------------------------- */
TemplateActorsFeature.hooks();
ActorGroupFeature.hooks();
ChatActionsFeature.hooks();
PrototypeTokenNameSyncFeature.hooks();
MagicSystem.hooks();
Roll2d6Feature.hooks();

/* -------------------------------- */
/*	Webpack HMR                     */
/* -------------------------------- */
if (module.hot) {
    module.hot.accept();

    if (module.hot.status() === "apply") {
        for (const template of Object.keys(Handlebars.partials)) {
            if (template.startsWith("systems/fatex/")) delete Handlebars.partials[template];
        }

        TemplatePreloader.preloadHandlebarsTemplates().then(() => {
            for (const application of applications.instances.values()) {
                if (application.options.classes.includes("fatex")) application.render({ force: true });
            }
        });
    }
}
