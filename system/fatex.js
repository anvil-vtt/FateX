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

import { ActorFate } from "./module/actor/ActorFate.js";
import { CharacterSheet } from "./module/actor/character/CharacterSheet.js";
import { NPCSheet } from "./module/actor/npc/NPCSheet.js";
import { FATEx } from "./module/helper/config.js";
import { HandlebarsHelpers } from "./module/helper/handlebars.js";
import { preloadHandlebarsTemplates } from "./module/helper/templates.js";
import { ItemFate } from "./module/item/ItemFate.js";
import { StressSheet } from "./module/item/stress/StressSheet.js";

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
    await preloadHandlebarsTemplates();

    // Register HandlebarsHelpers
    HandlebarsHelpers.registerHelpers();

    // Unregister Core sheets
    Actors.unregisterSheet('core', ActorSheet);

    // Register FATEx actor sheets
    Actors.registerSheet('FATEx', CharacterSheet, {
        types: ['character'],
        makeDefault: true,
    });

    Actors.registerSheet('FATEx', NPCSheet, {
        types: ['npc'],
    });

    // Register FATEx item sheets
    Items.registerSheet('FATEx', StressSheet, {
        types: ['stress'],
    });
});
