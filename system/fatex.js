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

import { CharacterSheetFate } from "./module/actor/character.js";
import ActorFate from "./module/actor/entity.js";
import { NPCSheetFate } from "./module/actor/npc.js";
import { FATEx } from "./module/config.js";
import { preloadHandlebarsTemplates } from "./module/templates.js";

/* -------------------------------- */
/*	System initialization			*/
/* -------------------------------- */
Hooks.once('init', async function () {
    console.log(`FATEx | Initializing FATE extended game system`);

    // Initialise config
    CONFIG.FATEx = FATEx;
    CONFIG.Actor.entityClass = ActorFate;

    // Preload all needed templates
    await preloadHandlebarsTemplates();

    // Unregister Core sheets
    Actors.unregisterSheet('core', ActorSheet);

    // Register FATEx actor sheets
    Actors.registerSheet('FATEx', CharacterSheetFate, {
        types: ['character'],
        makeDefault: true,
    });

    Actors.registerSheet('FATEx', NPCSheetFate, {
        types: ['npc'],
        makeDefault: true,
    });
});
