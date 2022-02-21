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

    // Unregister Core sheets
    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);

    // Register FateX actor sheets
    Actors.registerSheet("FateX", CharacterSheet, {
        types: ["character"],
        makeDefault: true,
    });

    Actors.registerSheet("FateX", GroupSheet, {
        types: ["group"],
        makeDefault: true,
    });

    // Register FateX item sheets
    Items.registerSheet("FateX", StressSheet, {
        types: ["stress"],
        makeDefault: true,
    });

    Items.registerSheet("FateX", AspectSheet, {
        types: ["aspect"],
        makeDefault: true,
    });

    Items.registerSheet("FateX", ConsequenceSheet, {
        types: ["consequence"],
        makeDefault: true,
    });

    Items.registerSheet("FateX", SkillSheet, {
        types: ["skill"],
        makeDefault: true,
    });

    Items.registerSheet("FateX", StuntSheet, {
        types: ["stunt"],
        makeDefault: true,
    });

    Items.registerSheet("FateX", ExtraSheet, {
        types: ["extra"],
        makeDefault: true,
    });

    Items.registerSheet("FateX", ReferenceSheet, {
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

/* -------------------------------- */
/*	Webpack HMR                     */
/* -------------------------------- */
if (module.hot) {
    module.hot.accept();

    if (module.hot.status() === "apply") {
        for (const template in _templateCache) {
            if (Object.prototype.hasOwnProperty.call(_templateCache, template)) {
                delete _templateCache[template];
            }
        }

        TemplatePreloader.preloadHandlebarsTemplates().then(() => {
            for (const application in ui.windows) {
                if (Object.prototype.hasOwnProperty.call(ui.windows, application)) {
                    ui.windows[application].render(true);
                }
            }
        });
    }
}

Hooks.once("ready", async () => {
    globalThis.ownedItem = game.actors?.getName("Bjorn Battleborn")?.items.contents.filter((item) => item.type === "extra")[0];
});
