/**
 * The FATE extended game system for FoundryVTT
 *
 * Author: Patrick Bauer (Daddi#2333)
 * Repository: https://github.com/anvil-vtt/FATEx
 * Software License: GNU GPLv3
 * Content License:
 *      This work is based on Fate Core System and Fate Accelerated Edition (found at http://www.faterpg.com/),
 *      products of Evil Hat Productions, LLC, developed, authored, and edited by Leonard Balsera, Brian Engard,
 *      Jeremy Keller, Ryan Macklin, Mike Olson, Clark Valentine, Amanda Valentine, Fred Hicks, and Rob Donoghue,
 *      and licensed for our use under the Creative Commons Attribution 3.0 Unported license
 *      (http://creativecommons.org/licenses/by/3.0/).
 */

import { FATEx } from "./config.js";
import { ActorFate } from "./module/actor/ActorFate.js";
import { CharacterSheet } from "./module/actor/character/CharacterSheet.js";
import { HandlebarsHelpers } from "./module/helper/HandlebarsHelpers.js";
import { TemplatePreloader } from "./module/helper/TemplatePreloader.js";
import { AspectSheet } from "./module/item/aspect/AspectSheet.js";
import { ConsequenceSheet } from "./module/item/consequence/ConsequenceSheet.js";
import { ItemFate } from "./module/item/ItemFate.js";
import { SkillSheet } from "./module/item/skill/SkillSheet.js";
import { StressSheet } from "./module/item/stress/StressSheet.js";
import { TemplateActors } from "./module/settings/template-actors.js";

/* -------------------------------- */
/*	System initialization			*/
/* -------------------------------- */
Hooks.once('init', async function () {
    console.log(`FATEx | Initializing FATE extended game system`);

    // Initialise config
    CONFIG.FATEx = FATEx;
    CONFIG.Actor.entityClass = ActorFate;
    CONFIG.Item.entityClass = ItemFate;

    // Preload all needed templates
    await TemplatePreloader.preloadHandlebarsTemplates();

    // Register HandlebarsHelpers
    HandlebarsHelpers.registerHelpers();

    // Unregister Core sheets
    Actors.unregisterSheet('core', ActorSheet);
    Items.unregisterSheet('core', ItemSheet);

    // Register FATEx actor sheets
    Actors.registerSheet('FATEx', CharacterSheet, {
        types: ['character'],
        makeDefault: true
    });

    // Register FATEx item sheets
    Items.registerSheet('FATEx', StressSheet, {
        types: ['stress'],
        makeDefault: true
    });

    Items.registerSheet('FATEx', AspectSheet, {
        types: ['aspect'],
        makeDefault: true
    });

    Items.registerSheet('FATEx', ConsequenceSheet, {
        types: ['consequence'],
        makeDefault: true
    });

    Items.registerSheet('FATEx', SkillSheet, {
        types: ['skill'],
        makeDefault: true
    });

    // Register FATEx system settings
    game.settings.registerMenu("fatex", "templateActors", {
        name: game.i18n.localize("FAx.Settings.Templates.Title"),
        hint: game.i18n.localize("FAx.Settings.Templates.Hint"),
        label: game.i18n.localize("FAx.Settings.Templates.Button"),
        scope: "world",
        config: true,
        type: TemplateActors,
        restricted: true
    });

    game.settings.register("fatex", "templateActors", {
       scope: "world",
       config: false,
    });
});
