/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/fatex.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/*! exports provided: FateX */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FateX\", function() { return FateX; });\n/* harmony import */ var _module_components_Automation_Automation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module/components/Automation/Automation.js */ \"./src/module/components/Automation/Automation.js\");\n/* harmony import */ var _module_components_Configuration_Configuration_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module/components/Configuration/Configuration.js */ \"./src/module/components/Configuration/Configuration.js\");\n/* harmony import */ var _module_components_Radio_Radio_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./module/components/Radio/Radio.js */ \"./src/module/components/Radio/Radio.js\");\n/* harmony import */ var _module_components_RangeSlider_RangeSlider_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./module/components/RangeSlider/RangeSlider.js */ \"./src/module/components/RangeSlider/RangeSlider.js\");\n/* harmony import */ var _module_components_Sortable_Sortable_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./module/components/Sortable/Sortable.js */ \"./src/module/components/Sortable/Sortable.js\");\n/* harmony import */ var _module_item_aspect_AspectItem_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./module/item/aspect/AspectItem.js */ \"./src/module/item/aspect/AspectItem.js\");\n/* harmony import */ var _module_item_consequence_ConsequenceItem_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./module/item/consequence/ConsequenceItem.js */ \"./src/module/item/consequence/ConsequenceItem.js\");\n/* harmony import */ var _module_item_extra_ExtraItem_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./module/item/extra/ExtraItem.js */ \"./src/module/item/extra/ExtraItem.js\");\n/* harmony import */ var _module_item_skill_SkillItem_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./module/item/skill/SkillItem.js */ \"./src/module/item/skill/SkillItem.js\");\n/* harmony import */ var _module_item_stress_StressItem_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./module/item/stress/StressItem.js */ \"./src/module/item/stress/StressItem.js\");\n/* harmony import */ var _module_item_stunt_StuntItem_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./module/item/stunt/StuntItem.js */ \"./src/module/item/stunt/StuntItem.js\");\n\n\n\n\n\n\n\n\n\n\n\n\nconst FateX = {\n    \"itemTypes\": {\n        \"stress\": _module_item_stress_StressItem_js__WEBPACK_IMPORTED_MODULE_9__[\"StressItem\"],\n        \"aspect\": _module_item_aspect_AspectItem_js__WEBPACK_IMPORTED_MODULE_5__[\"AspectItem\"],\n        \"consequence\": _module_item_consequence_ConsequenceItem_js__WEBPACK_IMPORTED_MODULE_6__[\"ConsequenceItem\"],\n        \"skill\": _module_item_skill_SkillItem_js__WEBPACK_IMPORTED_MODULE_8__[\"SkillItem\"],\n        \"stunt\": _module_item_stunt_StuntItem_js__WEBPACK_IMPORTED_MODULE_10__[\"StuntItem\"],\n        \"extra\": _module_item_extra_ExtraItem_js__WEBPACK_IMPORTED_MODULE_7__[\"ExtraItem\"],\n    },\n    \"sheetComponents\": {\n        \"actor\": {\n            \"sortable\": _module_components_Sortable_Sortable_js__WEBPACK_IMPORTED_MODULE_4__[\"Sortable\"],\n            \"configuration\": _module_components_Configuration_Configuration_js__WEBPACK_IMPORTED_MODULE_1__[\"Configuration\"]\n        },\n        \"item\": {\n            \"radio\": _module_components_Radio_Radio_js__WEBPACK_IMPORTED_MODULE_2__[\"Radio\"],\n            \"rangeSlider\": _module_components_RangeSlider_RangeSlider_js__WEBPACK_IMPORTED_MODULE_3__[\"RangeSlider\"],\n            \"automation\": _module_components_Automation_Automation_js__WEBPACK_IMPORTED_MODULE_0__[\"Automation\"],\n        }\n    },\n    \"applications\": {\n        'templateSettings': null,\n        'templatePicker': null,\n    }\n};\n\n\n//# sourceURL=webpack:///./src/config.js?");

/***/ }),

/***/ "./src/fatex.js":
/*!**********************!*\
  !*** ./src/fatex.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ \"./src/config.js\");\n/* harmony import */ var _module_actor_ActorFate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module/actor/ActorFate.js */ \"./src/module/actor/ActorFate.js\");\n/* harmony import */ var _module_actor_character_CharacterSheet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./module/actor/character/CharacterSheet.js */ \"./src/module/actor/character/CharacterSheet.js\");\n/* harmony import */ var _module_helper_HandlebarsHelpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./module/helper/HandlebarsHelpers.js */ \"./src/module/helper/HandlebarsHelpers.js\");\n/* harmony import */ var _module_helper_TemplatePreloader_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./module/helper/TemplatePreloader.js */ \"./src/module/helper/TemplatePreloader.js\");\n/* harmony import */ var _module_item_aspect_AspectSheet_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./module/item/aspect/AspectSheet.js */ \"./src/module/item/aspect/AspectSheet.js\");\n/* harmony import */ var _module_item_consequence_ConsequenceSheet_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./module/item/consequence/ConsequenceSheet.js */ \"./src/module/item/consequence/ConsequenceSheet.js\");\n/* harmony import */ var _module_item_extra_ExtraSheet_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./module/item/extra/ExtraSheet.js */ \"./src/module/item/extra/ExtraSheet.js\");\n/* harmony import */ var _module_item_ItemFate_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./module/item/ItemFate.js */ \"./src/module/item/ItemFate.js\");\n/* harmony import */ var _module_item_skill_SkillSheet_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./module/item/skill/SkillSheet.js */ \"./src/module/item/skill/SkillSheet.js\");\n/* harmony import */ var _module_item_stress_StressSheet_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./module/item/stress/StressSheet.js */ \"./src/module/item/stress/StressSheet.js\");\n/* harmony import */ var _module_item_stunt_StuntSheet_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./module/item/stunt/StuntSheet.js */ \"./src/module/item/stunt/StuntSheet.js\");\n/* harmony import */ var _module_settings_TemplateActors_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./module/settings/TemplateActors.js */ \"./src/module/settings/TemplateActors.js\");\n/**\n * The Fate extended game system for FoundryVTT\n *\n * Author: Patrick Bauer (Daddi#2333)\n * Repository: https://github.com/anvil-vtt/FateX\n * Software License: MIT\n * Content License:\n *      This work is based on Fate Core System and Fate Accelerated Edition (found at http://www.faterpg.com/),\n *      products of Evil Hat Productions, LLC, developed, authored, and edited by Leonard Balsera, Brian Engard,\n *      Jeremy Keller, Ryan Macklin, Mike Olson, Clark Valentine, Amanda Valentine, Fred Hicks, and Rob Donoghue,\n *      and licensed for our use under the Creative Commons Attribution 3.0 Unported license\n *      (http://creativecommons.org/licenses/by/3.0/).\n */\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* -------------------------------- */\n/*\tSystem initialization\t\t\t*/\n/* -------------------------------- */\nHooks.once('init', async function () {\n    console.log(`FateX | Initializing Fate extended game system`);\n\n    // Initialise config\n    CONFIG.FateX = _config_js__WEBPACK_IMPORTED_MODULE_0__[\"FateX\"];\n    CONFIG.Actor.entityClass = _module_actor_ActorFate_js__WEBPACK_IMPORTED_MODULE_1__[\"ActorFate\"];\n    CONFIG.Item.entityClass = _module_item_ItemFate_js__WEBPACK_IMPORTED_MODULE_8__[\"ItemFate\"];\n\n    // Preload all needed templates\n    await _module_helper_TemplatePreloader_js__WEBPACK_IMPORTED_MODULE_4__[\"TemplatePreloader\"].preloadHandlebarsTemplates();\n\n    // Register HandlebarsHelpers\n    _module_helper_HandlebarsHelpers_js__WEBPACK_IMPORTED_MODULE_3__[\"HandlebarsHelpers\"].registerHelpers();\n\n    // Unregister Core sheets\n    Actors.unregisterSheet('core', ActorSheet);\n    Items.unregisterSheet('core', ItemSheet);\n\n    // Register FateX actor sheets\n    Actors.registerSheet('FateX', _module_actor_character_CharacterSheet_js__WEBPACK_IMPORTED_MODULE_2__[\"CharacterSheet\"], {\n        types: ['character'],\n        makeDefault: true\n    });\n\n    // Register FateX item sheets\n    Items.registerSheet('FateX', _module_item_stress_StressSheet_js__WEBPACK_IMPORTED_MODULE_10__[\"StressSheet\"], {\n        types: ['stress'],\n        makeDefault: true\n    });\n\n    Items.registerSheet('FateX', _module_item_aspect_AspectSheet_js__WEBPACK_IMPORTED_MODULE_5__[\"AspectSheet\"], {\n        types: ['aspect'],\n        makeDefault: true\n    });\n\n    Items.registerSheet('FateX', _module_item_consequence_ConsequenceSheet_js__WEBPACK_IMPORTED_MODULE_6__[\"ConsequenceSheet\"], {\n        types: ['consequence'],\n        makeDefault: true\n    });\n\n    Items.registerSheet('FateX', _module_item_skill_SkillSheet_js__WEBPACK_IMPORTED_MODULE_9__[\"SkillSheet\"], {\n        types: ['skill'],\n        makeDefault: true\n    });\n\n    Items.registerSheet('FateX', _module_item_stunt_StuntSheet_js__WEBPACK_IMPORTED_MODULE_11__[\"StuntSheet\"], {\n        types: ['stunt'],\n        makeDefault: true\n    });\n\n    Items.registerSheet('FateX', _module_item_extra_ExtraSheet_js__WEBPACK_IMPORTED_MODULE_7__[\"ExtraSheet\"], {\n        types: ['extra'],\n        makeDefault: true\n    });\n});\n\nHooks.once('ready', async function () {\n    // Initialize TemplateActors\n    _module_settings_TemplateActors_js__WEBPACK_IMPORTED_MODULE_12__[\"TemplateActors\"].ready();\n});\n\n_module_settings_TemplateActors_js__WEBPACK_IMPORTED_MODULE_12__[\"TemplateActors\"].hooks();\n\n\n//# sourceURL=webpack:///./src/fatex.js?");

/***/ }),

/***/ "./src/module/actor/ActorFate.js":
/*!***************************************!*\
  !*** ./src/module/actor/ActorFate.js ***!
  \***************************************/
/*! exports provided: ActorFate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ActorFate\", function() { return ActorFate; });\n/* harmony import */ var _settings_TemplateActorPicker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../settings/TemplateActorPicker.js */ \"./src/module/settings/TemplateActorPicker.js\");\n/* harmony import */ var _template_TemplateActorSheetFate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./template/TemplateActorSheetFate.js */ \"./src/module/actor/template/TemplateActorSheetFate.js\");\n/**\n * ActorFate is the default entity class for actors inside the FateX system.\n * Adds custom features based on the system.\n */\n\n\n\nclass ActorFate extends Actor {\n\n    /**\n     * Open template picker instead of directly creating a new actor\n     */\n    static async create(data, options = {}) {\n        // Fallback for manual actor duplication\n        if(data._id) {\n            return super.create(data, options);\n        }\n\n        CONFIG.FateX.applications.templatePicker.render(true);\n    }\n\n    /**\n     * Provide basic token configuration for newly created actors.\n     * Automatically links new tokens to the actor.\n     */\n    static async _create(data, options = {}) {\n        if(options.actorTemplate) {\n            mergeObject(data, options.actorTemplate);\n        }\n\n        data.token = data.token || {};\n\n        // Set basic token data for newly created actors.\n        mergeObject(data.token, {\n            vision: true,\n            dimSight: 30,\n            brightSight: 0,\n            actorLink: true,\n            disposition: 1\n        }, {overwrite: false});\n\n        return super.create(data, options);\n    }\n\n    render(force=false, options={}) {\n        super.render(force, options);\n\n        for (let app in CONFIG.FateX.applications) {\n            CONFIG.FateX.applications[app].render();\n        }\n    }\n\n    get _sheetClass() {\n        if (this.isTemplateActor) {\n            return _template_TemplateActorSheetFate_js__WEBPACK_IMPORTED_MODULE_1__[\"TemplateActorSheetFate\"];\n        }\n\n        return super._sheetClass;\n    }\n\n    get isTemplateActor() {\n        return !!this.getFlag('fatex', 'isTemplateActor');\n    }\n\n    get visible() {\n        if(this.isTemplateActor) {\n            return false;\n        }\n\n        return super.visible;\n    }\n\n    /**\n     * Re-prepare the data for all owned items when owned items are deleted.\n     * This ensures, that items that reference the deleted item get updated.\n     */\n    _onModifyEmbeddedEntity(embeddedName, changes, options, userId, context = {}) {\n        super._onModifyEmbeddedEntity(embeddedName, changes, options, userId, context);\n\n        if(embeddedName === 'OwnedItem') {\n            this.items.forEach((item) => item.prepareData());\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/module/actor/ActorFate.js?");

/***/ }),

/***/ "./src/module/actor/ActorSheetFate.js":
/*!********************************************!*\
  !*** ./src/module/actor/ActorSheetFate.js ***!
  \********************************************/
/*! exports provided: ActorSheetFate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ActorSheetFate\", function() { return ActorSheetFate; });\n/**\n * FateX base class for all actor sheets.\n * Defines what information on the actorsheet may be rendered.\n */\nclass ActorSheetFate extends ActorSheet {\n\n    /**\n     * Defines the default options for all FateX actor sheets.\n     * This consists of things like css classes, the template to load and the tab configuration.\n     *\n     * @returns {Object}\n     */\n    static get defaultOptions() {\n        const options = super.defaultOptions;\n\n        mergeObject(options, {\n            classes: options.classes.concat([\n                'fatex fatex__sheet',\n            ]),\n            template: \"systems/fatex/templates/actor/character.html\",\n            tabs: [{navSelector: \".fatex__tabs__navigation\", contentSelector: \".fatex__tabs__content\", initial: \"skills\"}],\n            scrollY: [\".desk__content\"],\n            width: 860,\n        });\n\n        return options;\n    }\n\n    /**\n     * Activates DOM-listeners on elements to react to different events like \"click\" or \"change\".\n     * ItemTypes and sheet components can activate their own listeners and receive the sheet as a reference.\n     *\n     * @param html\n     *  The rendered html content of the created actor sheet.\n     */\n    activateListeners(html) {\n        super.activateListeners(html);\n\n        // Custom sheet listeners for every ItemType\n        for (let itemType in CONFIG.FateX.itemTypes) {\n            CONFIG.FateX.itemTypes[itemType].activateActorSheetListeners(html, this);\n        }\n\n        // Custom sheet listeners for every SheetComponent\n        for (let sheetComponent in CONFIG.FateX.sheetComponents.actor) {\n            CONFIG.FateX.sheetComponents.actor[sheetComponent].activateListeners(html, this);\n        }\n    }\n\n    /**\n     * Returns all data that is needed to render the sheet.\n     * All variables are available inside the handelbar templates.\n     *\n     * Items are split into their categories for easier access.\n     *\n     * returns {Object}\n     */\n    getData() {\n        // Basic fields and flags\n        let data = {\n            owner: this.actor.owner,\n            options: this.options,\n            editable: this.isEditable,\n            isTemplateActor: this.actor.isTemplateActor,\n            isEmptyActor: !this.actor.items.size,\n            config: CONFIG.FateX,\n        };\n\n        // Add actor, actor data and item\n        data.actor = duplicate(this.actor.data);\n        data.data = data.actor.data;\n        data.items = this.actor.items.map(i => i.data).sort(this._sortItems)\n\n        // Add filtered item lists for easier access\n        data.stress = data.items.filter(item => item.type === 'stress');\n        data.aspects = data.items.filter(item => item.type === 'aspect');\n        data.skills = data.items.filter(item => item.type === 'skill');\n        data.stunts = data.items.filter(item => item.type === 'stunt');\n        data.extras = data.items.filter(item => item.type === 'extra');\n        data.consequences = data.items.filter(item => item.type === 'consequence');\n\n        // Allow every itemtype to add data to the actorsheet\n        for (let itemType in CONFIG.FateX.itemTypes) {\n            data = CONFIG.FateX.itemTypes[itemType].getActorSheetData(data, this);\n        }\n\n        return data;\n    }\n\n    /**\n     * Adds FateX specific buttons to the sheets header bar.\n     *\n     * @returns {*}\n     *   A list of buttons to be rendered.\n     */\n    _getHeaderButtons() {\n        let buttons = super._getHeaderButtons();\n\n        // Edit mode button to toggle which interactive elements are visible on the sheet.\n        const canConfigure = game.user.isGM || this.actor.owner;\n        if (this.options.editable && canConfigure) {\n            buttons = [\n                {\n                    label: \"Edit mode\",\n                    class: \"fatex-toggle-edit-mode\",\n                    icon: \"fas fa-edit\",\n                    onclick: ev => this._onToggleEditMode(ev)\n                }\n            ].concat(buttons);\n        }\n\n        return buttons\n    }\n\n    _sortItems(a,b) {\n        return (a.sort || 0) - (b.sort || 0);\n    }\n\n    /**\n     * OnClick handler for the previously declaried \"Edit mode\" button.\n     * Toggles the 'fatex__helper--enable-editmode' class for the sheet container.\n     */\n    _onToggleEditMode(e) {\n        e.preventDefault();\n\n        const target = $(e.currentTarget);\n        const app = target.parents('.app');\n        const html = app.find('.window-content');\n\n        app.toggleClass(\"fatex__helper--enable-editmode\")\n    }\n}\n\n\n//# sourceURL=webpack:///./src/module/actor/ActorSheetFate.js?");

/***/ }),

/***/ "./src/module/actor/character/CharacterSheet.js":
/*!******************************************************!*\
  !*** ./src/module/actor/character/CharacterSheet.js ***!
  \******************************************************/
/*! exports provided: CharacterSheet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CharacterSheet\", function() { return CharacterSheet; });\n/* harmony import */ var _ActorSheetFate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ActorSheetFate.js */ \"./src/module/actor/ActorSheetFate.js\");\n\n\n/**\n * Class to define character specific changes for the actor sheets.\n */\nclass CharacterSheet extends _ActorSheetFate_js__WEBPACK_IMPORTED_MODULE_0__[\"ActorSheetFate\"] {}\n\n\n//# sourceURL=webpack:///./src/module/actor/character/CharacterSheet.js?");

/***/ }),

/***/ "./src/module/actor/template/TemplateActorSheetFate.js":
/*!*************************************************************!*\
  !*** ./src/module/actor/template/TemplateActorSheetFate.js ***!
  \*************************************************************/
/*! exports provided: TemplateActorSheetFate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TemplateActorSheetFate\", function() { return TemplateActorSheetFate; });\n/* harmony import */ var _ActorSheetFate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ActorSheetFate.js */ \"./src/module/actor/ActorSheetFate.js\");\n\n\nclass TemplateActorSheetFate extends _ActorSheetFate_js__WEBPACK_IMPORTED_MODULE_0__[\"ActorSheetFate\"] {}\n\n\n//# sourceURL=webpack:///./src/module/actor/template/TemplateActorSheetFate.js?");

/***/ }),

/***/ "./src/module/components/Automation/Automation.js":
/*!********************************************************!*\
  !*** ./src/module/components/Automation/Automation.js ***!
  \********************************************************/
/*! exports provided: OPERATORS, CONJUNCTIONS, Automation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"OPERATORS\", function() { return OPERATORS; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CONJUNCTIONS\", function() { return CONJUNCTIONS; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Automation\", function() { return Automation; });\n/* harmony import */ var _BaseComponent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseComponent.js */ \"./src/module/components/BaseComponent.js\");\n\n\nconst OPERATORS = {\n    OPERATOR_EQUALS: 0,\n    OPERATOR_NOT_EQUALS: 1,\n    OPERATOR_GT: 2,\n    OPERATOR_LT: 3,\n    OPERATOR_GTE: 4,\n    OPERATOR_LTE: 5,\n};\n\nconst CONJUNCTIONS = {\n    OR: 0,\n    AND: 1\n};\n\nclass Automation extends _BaseComponent_js__WEBPACK_IMPORTED_MODULE_0__[\"BaseComponent\"] {\n    static activateListeners(html, sheet) {\n        html.find('.fatex__skill__reference__create').on('click', (e) => this._onAddReference.call(this, e, sheet));\n        html.find('.fatex__skill__reference__change').on('change', (e) => this._onChangeReference.call(this, e, sheet));\n        html.find('.fatex__skill__reference__remove').on('click', (e) => this._onRemoveReference.call(this, e, sheet));\n        html.find('.fatex__skill__reference__setting').on('change', (e) => this._onChangeSetting.call(this, e, sheet));\n    }\n\n    static async getSheetData(sheetData, sheet) {\n        sheetData.skillReferences = this.getSkillReferences(sheet.entity);\n        sheetData.skillReferenceSettings = this.getSkillReferenceSettings(sheet.entity);\n        sheetData.availableSkillLevels = this.getAvailableSkillLevels();\n        sheetData.availableOperators = this.getAvailableOperators();\n        sheetData.availableConjunctions = this.getAvailableConjunctions();\n\n        // Only items owned by actors can read the actors skill list\n        if(sheet.entity.isOwned) {\n            sheetData.availableActorSkills = this.getSkillsByActor(sheet.actor);\n        }\n\n        return sheetData;\n    }\n\n    /*************************\n     * EVENT HANDLER\n     *************************/\n\n    static async _onAddReference(e, sheet) {\n        e.preventDefault();\n\n        const entity = sheet.entity;\n        await this.addSkillReference(entity);\n    }\n\n    static async _onChangeReference(e, sheet) {\n        e.preventDefault();\n\n        let value = e.currentTarget.value;\n        const dataset = e.currentTarget.dataset;\n        const entity = sheet.entity;\n        const index = dataset.index;\n        const field = dataset.field;\n\n        // Check for numbers as only strings are passed\n        if(dataset.dtype === \"Number\") {\n            value = parseInt(value);\n        }\n\n        // Return early of no index or field was provided\n        if(index === undefined || field === undefined) {\n            return;\n        }\n\n        await this.changeSkillReference(entity, index, field, value)\n    }\n\n    static async _onChangeSetting(e, sheet) {\n        e.preventDefault();\n\n        let value = e.currentTarget.value;\n        const dataset = e.currentTarget.dataset;\n        const entity = sheet.entity;\n        const setting = dataset.setting;\n\n        // Check for numbers as only strings are passed\n        if(dataset.dtype === \"Number\") {\n            value = parseInt(value);\n        }\n\n        // Return early of no setting\n        if(setting === undefined) {\n            return;\n        }\n\n        await this.setReferenceSetting(entity, setting, value)\n    }\n\n    static async _onRemoveReference(e, sheet) {\n        e.preventDefault();\n\n        const dataset = e.currentTarget.dataset;\n        const entity = sheet.entity;\n        const index = dataset.index;\n\n        // Return early of no index was provided\n        if(index === undefined) {\n            return;\n        }\n\n        (new Dialog({\n            title: game.i18n.localize('FAx.Dialog.ReferenceRemove'),\n            content: game.i18n.format('FAx.Dialog.ReferenceRemoveText'),\n            default: 'submit',\n            buttons: {\n                cancel: {\n                    icon: '<i class=\"fas fa-times\"></i>',\n                    label: game.i18n.localize(\"FAx.Dialog.Cancel\"),\n                    callback: () => null\n                },\n                submit: {\n                    icon: '<i class=\"fas fa-check\"></i>',\n                    label: game.i18n.localize(\"FAx.Dialog.Confirm\"),\n                    callback: async () => {\n                        await this.removeSkillReference(entity, index);\n                    }\n                }\n            }\n        }, {\n            classes: ['fatex', 'fatex__dialog'],\n        })).render(true);\n    }\n\n    /*************************\n     * HELPER FUNCTIONS\n     *************************/\n\n    /**\n     * Adds a new skill reference to a given entity\n     *\n     * @param entity\n     *  The entity for the skill reference to be added\n     */\n    static async addSkillReference(entity) {\n        const currentReferences = this.getSkillReferences(entity);\n        const references = duplicate(currentReferences);\n\n        references.push({\n            \"skill\": \"\",\n            \"condition\": 0,\n            \"operator\": OPERATORS.OPERATOR_GTE,\n            \"default\": 0,\n            \"action\": 0,\n            \"argument\": 0,\n            \"argument2\": 0,\n            \"argument3\": 0\n        });\n\n        await entity.setFlag('fatex', 'skillReferences', references);\n    }\n\n    static async changeSkillReference(entity, index, field, value) {\n        const currentReferences = this.getSkillReferences(entity);\n        const references = duplicate(currentReferences);\n        const reference = references[index];\n\n        // Change field on reference to new value\n        reference[field] = value;\n\n        // Replace one reference at the provided index\n        references.splice(index, 1, reference);\n\n        await entity.setFlag('fatex', 'skillReferences', references);\n    }\n\n    static async removeSkillReference(entity, index) {\n        const currentReferences = this.getSkillReferences(entity);\n        const references = duplicate(currentReferences);\n\n        // Remove one reference at the provided index\n        references.splice(index, 1);\n\n        await entity.setFlag('fatex', 'skillReferences', references);\n    }\n\n    static async setReferenceSetting(entity, setting, value) {\n        await entity.setFlag('fatex', `skillReferenceSettings.${setting}`, value);\n    }\n\n    static getReferenceSetting(entity, setting, defaultValue) {\n        const flag = entity.getFlag('fatex', `skillReferenceSettings.${setting}`);\n\n        if (flag === undefined) {\n            return defaultValue;\n        }\n\n        return flag;\n    }\n\n    static getSkillReferences(entity) {\n        return entity.getFlag('fatex', 'skillReferences') || [];\n    }\n\n    static getSkillsByActor(actor, sort = true) {\n        const actorData = duplicate(actor);\n        const items = actorData.items;\n\n        // Get list of all skill items and extract the data\n        const skills = items.filter(item => item.type === 'skill');\n        const skillData = skills.map((skill) => duplicate(skill));\n\n        // Sort alphabetically\n        if (sort) {\n            skillData.sort((a, b) => b.name - a.name);\n        }\n\n        return skillData;\n    }\n\n    static getActorSkillById(actor, skillId) {\n        const actorData = duplicate(actor);\n        const items = actorData.items;\n\n        // Filter single actors skills by id\n        const skills = items.filter(item => item._id === skillId);\n\n        if(!skills) {\n            return undefined;\n        }\n\n        return skills[0];\n    }\n\n    static getAvailableSkillLevels() {\n        const skillLevels = [];\n\n        for(let i = 0; i <= 20; i++) {\n            const skillLevel = [];\n\n            skillLevel.value = i;\n            skillLevel.label = `+${i}`;\n\n            skillLevels.push(skillLevel);\n        }\n\n        return skillLevels;\n    }\n\n    static getAvailableOperators() {\n        const operators = [];\n\n        for(let operator in OPERATORS) {\n            const availableOperator = [];\n\n            availableOperator.value = OPERATORS[operator];\n            availableOperator.label = game.i18n.localize(`FAx.Item.Automation.Operators.${operator}`);\n\n            operators.push(availableOperator);\n        }\n\n        return operators;\n    }\n    \n    static getAvailableConjunctions() {\n        const conjunctions = [];\n\n        for(let conjunction in CONJUNCTIONS) {\n            const availableConjunction = [];\n\n            availableConjunction.value = CONJUNCTIONS[conjunction];\n            availableConjunction.label = game.i18n.localize(`FAx.Item.Automation.Conjunctions.${conjunction}`);\n\n            conjunctions.push(availableConjunction);\n        }\n\n        return conjunctions;\n    }\n\n    static checkSkillCondition(skill, condition, operator = OPERATORS.OPERATOR_GTE) {\n        const rank = skill.data.rank;\n\n        switch (operator) {\n            case OPERATORS.OPERATOR_EQUALS:\n                return rank === condition;\n            case OPERATORS.OPERATOR_NOT_EQUALS:\n                return rank !== condition;\n            case OPERATORS.OPERATOR_GTE:\n                return rank >= condition;\n            case OPERATORS.OPERATOR_GT:\n                return rank > condition;\n            case OPERATORS.OPERATOR_LTE:\n                return rank <= condition;\n            case OPERATORS.OPERATOR_LT:\n                return rank < condition;\n        }\n\n        return false;\n    }\n\n    static getSkillReferenceSettings(entity) {\n        const skillReferenceSettings = {};\n\n        skillReferenceSettings.conjunction = this.getReferenceSetting(entity, 'conjunction', CONJUNCTIONS.OR);\n\n        return skillReferenceSettings;\n    }\n}\n\n\n//# sourceURL=webpack:///./src/module/components/Automation/Automation.js?");

/***/ }),

/***/ "./src/module/components/BaseComponent.js":
/*!************************************************!*\
  !*** ./src/module/components/BaseComponent.js ***!
  \************************************************/
/*! exports provided: BaseComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BaseComponent\", function() { return BaseComponent; });\n/**\n * Base class for multiple sheet components.\n * Ensures that not every method has be implemented by every component.\n */\nclass BaseComponent {\n    static activateListeners(html, sheet) {}\n\n    /**\n     * Allows each component to add data to sheets.\n     */\n    static getSheetData(sheetData, sheet) {\n        return sheetData;\n    }\n}\n\n\n//# sourceURL=webpack:///./src/module/components/BaseComponent.js?");

/***/ }),

/***/ "./src/module/components/Configuration/Configuration.js":
/*!**************************************************************!*\
  !*** ./src/module/components/Configuration/Configuration.js ***!
  \**************************************************************/
/*! exports provided: Configuration */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Configuration\", function() { return Configuration; });\n/* harmony import */ var _BaseComponent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseComponent.js */ \"./src/module/components/BaseComponent.js\");\n\n\nclass Configuration extends _BaseComponent_js__WEBPACK_IMPORTED_MODULE_0__[\"BaseComponent\"] {\n\n\n    static activateListeners(html, sheet) {\n        html.find('.fatex__sheet__action--import-core').click((e) => this._onImport.call(this, e, sheet, 'core'));\n        html.find('.fatex__sheet__action--import-condensed').click((e) => this._onImport.call(this, e, sheet, 'condensed'));\n        html.find('.fatex__sheet__action--import-accelerated').click((e) => this._onImport.call(this, e, sheet, 'accelerated'));\n    }\n\n\n    static async _onImport(event, sheet, name) {\n        event.preventDefault();\n\n        const actor = sheet.actor;\n        const pack = game.packs.find(p => p.collection === `fatex.fate-${name}`);\n        const packItems = await pack.getContent();\n\n        let itemData = duplicate(packItems);\n        itemData.sort((a,b) => a.flags.fatex.importSort - b.flags.fatex.importSort)\n\n        await actor.createOwnedItem(itemData);\n    }\n\n}\n\n\n//# sourceURL=webpack:///./src/module/components/Configuration/Configuration.js?");

/***/ }),

/***/ "./src/module/components/Radio/Radio.js":
/*!**********************************************!*\
  !*** ./src/module/components/Radio/Radio.js ***!
  \**********************************************/
/*! exports provided: Radio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Radio\", function() { return Radio; });\n/* harmony import */ var _BaseComponent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseComponent.js */ \"./src/module/components/BaseComponent.js\");\n\n\n/**\n * Radio component for actor- and itemsheets.\n * Allows the user to change between multiple choices.\n */\nclass Radio extends _BaseComponent_js__WEBPACK_IMPORTED_MODULE_0__[\"BaseComponent\"] {\n\n    /**\n     * Adds a click listener to every .fatex__setting__radio element.\n     * The name of the field, the value of the field and more a loaded via datasets.\n     *\n     * @param html\n     *   The html of the inner part of the rendered sheet.\n     *\n     * @param sheet\n     *   The actor- or itemsheet to be referenced inside the handler.\n     */\n    static activateListeners(html, sheet) {\n        html.find('.fatex__setting__radio').click((e) => this._onSettingsRadio.call(this, e, sheet));\n    }\n\n    /**\n     * OnClick-Handler for radio setting components.\n     * Updates the sheets referenced entity with a given name and value (via dataset).\n     *\n     * @param event\n     *   The event that was fired on the sheet.\n     *\n     * @param sheet\n     *   The sheet on which the event was fired.\n     */\n    static _onSettingsRadio(event, sheet) {\n        event.preventDefault();\n\n        const dataset = event.currentTarget.dataset;\n        const dataKey = dataset.name;\n        const sheetEntity = sheet.entity;\n\n        // Sane default\n        let value = \"\";\n\n        // Check for numbers as only strings are passed in datasets\n        if(dataset.dtype === \"Number\") {\n            value = parseInt(dataset.value);\n        } else {\n            value = dataset.value;\n        }\n\n        sheetEntity.update({\n            [dataKey]: value\n        });\n    }\n\n}\n\n\n//# sourceURL=webpack:///./src/module/components/Radio/Radio.js?");

/***/ }),

/***/ "./src/module/components/RangeSlider/RangeSlider.js":
/*!**********************************************************!*\
  !*** ./src/module/components/RangeSlider/RangeSlider.js ***!
  \**********************************************************/
/*! exports provided: RangeSlider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RangeSlider\", function() { return RangeSlider; });\n/* harmony import */ var _BaseComponent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseComponent.js */ \"./src/module/components/BaseComponent.js\");\n\n\n/**\n * Extends the input[type=\"range\"] element with an additional input field.\n * The field and the range input are both synchronized.\n */\nclass RangeSlider extends _BaseComponent_js__WEBPACK_IMPORTED_MODULE_0__[\"BaseComponent\"]{\n\n    /**\n     * Adds event listeners to all fatex__setting__range components.\n     * onChange for the input[type=\"text\"] field and onInput for the input[type=\"range\"].\n     *\n     * @param html\n     * @param sheet\n     */\n    static activateListeners(html, sheet) {\n        html.find('.fatex__setting__range__value').on('change', (e) => this._onChangeRangeValue.call(this, e, sheet));\n        html.find('.fatex__setting__range__slider').on('input', (e) => this._onChangeRangeSlider.call(this, e, sheet));\n    }\n\n    /**\n     * Updates the input[type=\"text\"] with the range slider value while its being dragged.\n     * This ensures both fields are in sync.\n     *\n     * This is likely to break as soon as one of the elements is wrapped.\n     */\n    static _onChangeRangeSlider(event, sheet) {\n        event.preventDefault();\n\n        const valueInput = event.currentTarget.previousElementSibling;\n        valueInput.value = event.currentTarget.value;\n    }\n\n    /**\n     * Updates the range slider when the input[type=\"text\"] is changed manually.\n     * This ensures both fields are in sync.\n     *\n     * This is likely to break as soon as one of the elements is wrapped.\n     */\n    static _onChangeRangeValue(event, sheet) {\n        event.preventDefault();\n\n        const valueInput = event.currentTarget.nextElementSibling;\n        valueInput.value = event.currentTarget.value;\n    }\n\n}\n\n\n//# sourceURL=webpack:///./src/module/components/RangeSlider/RangeSlider.js?");

/***/ }),

/***/ "./src/module/components/Sortable/Sortable.js":
/*!****************************************************!*\
  !*** ./src/module/components/Sortable/Sortable.js ***!
  \****************************************************/
/*! exports provided: Sortable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Sortable\", function() { return Sortable; });\n/* harmony import */ var _BaseComponent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseComponent.js */ \"./src/module/components/BaseComponent.js\");\n\n\n/**\n * Allows all items on the sheet to be sorted.\n * Implements a simple drag-handler to allow dragging to start.\n */\nclass Sortable extends _BaseComponent_js__WEBPACK_IMPORTED_MODULE_0__[\"BaseComponent\"]{\n\n    /**\n     * Adds event listeners to all fatex__sortable components.\n     *\n     * @param html\n     * @param sheet\n     */\n    static activateListeners(html, sheet) {\n        // We have to use standard event listeners here, because Items _onDrop() does not support jQuery events.\n        html.find('.fatex__sortable').each((i, sortable) => {\n            sortable.addEventListener(\"dragstart\", (e) => sheet._onDragStart.call(sheet, e), false);\n        });\n\n        // Only allow dragging when using the sort-handle\n        html.find('.fatex__item__sort').mousedown((e) => this._onDragHandlerMouseDown.call(this, e));\n        html.find('.fatex__item__sort').mouseup((e) => this._onDragHandlerMouseUp.call(this, e));\n    }\n\n    static _onDragHandlerMouseDown(e) {\n        $(e.currentTarget).parents('.fatex__sortable').get(0).setAttribute('draggable', 'true');\n    }\n\n    static _onDragHandlerMouseUp(e) {\n        $(e.currentTarget).parents('.fatex__sortable').get(0).setAttribute('draggable', 'false')\n    }\n\n}\n\n\n//# sourceURL=webpack:///./src/module/components/Sortable/Sortable.js?");

/***/ }),

/***/ "./src/module/helper/HandlebarsHelpers.js":
/*!************************************************!*\
  !*** ./src/module/helper/HandlebarsHelpers.js ***!
  \************************************************/
/*! exports provided: HandlebarsHelpers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"HandlebarsHelpers\", function() { return HandlebarsHelpers; });\n/**\n * System specific helpers are registered here.\n * Includes mostly if/else helpers like ifnth, ifEquals, ifNotEquals etc.\n */\nclass HandlebarsHelpers {\n    static registerHelpers() {\n\n        /**\n         * If-Helper which checks if every nth-loop was reached using modulo\n         */\n        Handlebars.registerHelper('ifNth', function (nth, options) {\n            const index = options.data.index + 1;\n\n            return (index % nth === 0) ? options.fn(this) : options.inverse(this);\n        });\n\n        /**\n         * If-Helper which checks if two values are the same\n         */\n        Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {\n            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);\n        });\n\n        /**\n         * If-Helper which checks if a number value is bigger than zero\n         */\n        Handlebars.registerHelper('ifBiggerNull', function (arg1, options) {\n            return (parseInt(arg1) > 0) ? options.fn(this) : options.inverse(this);\n        });\n\n        /**\n         * If-Helper which checks if two values are different\n         */\n        Handlebars.registerHelper('ifNotEquals', function (arg1, arg2, options) {\n            return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);\n        });\n\n        /**\n         * If-Helper which checks if a given value is not an empty string\n         */\n        Handlebars.registerHelper('ifNotEmpty', function (arg1, options) {\n            return (arg1 !== \"\") ? options.fn(this) : options.inverse(this);\n        });\n\n        /**\n         * Checks if the length of an array is of a certain number\n         */\n        Handlebars.registerHelper('checkLength', function (arg1, arg2, options) {\n            return (arg1.length >= Number(arg2)) ? options.fn(this) : options.inverse(this);\n        });\n\n        /**\n         * Helper which prints an argument or a default if it the argument is an empty string\n         */\n        Handlebars.registerHelper('default', function (value, defaultValue) {\n            if (!value || value === '') {\n                return new Handlebars.SafeString(defaultValue);\n            }\n\n            return value;\n        });\n    }\n}\n\n\n//# sourceURL=webpack:///./src/module/helper/HandlebarsHelpers.js?");

/***/ }),

/***/ "./src/module/helper/TemplatePreloader.js":
/*!************************************************!*\
  !*** ./src/module/helper/TemplatePreloader.js ***!
  \************************************************/
/*! exports provided: TemplatePreloader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TemplatePreloader\", function() { return TemplatePreloader; });\nclass TemplatePreloader {\n\n    /**\n     * Preload a set of templates to compile and cache them for fast access during rendering\n     */\n    static async preloadHandlebarsTemplates () {\n        const templatePaths = [\n            'systems/fatex/templates/actor/parts/header.html',\n            'systems/fatex/templates/actor/parts/config.html',\n            'systems/fatex/templates/actor/parts/copyright.html',\n\n            'systems/fatex/templates/actor/parts/sidebar/artwork.html',\n            'systems/fatex/templates/actor/parts/sidebar/stress.html',\n\n            'systems/fatex/templates/actor/parts/tabloid/messages.html',\n            'systems/fatex/templates/actor/parts/tabloid/aspects.html',\n            'systems/fatex/templates/actor/parts/tabloid/consequences.html',\n            'systems/fatex/templates/actor/parts/tabloid/conditions.html',\n\n            'systems/fatex/templates/actor/parts/tabs/skills.html',\n            'systems/fatex/templates/actor/parts/tabs/stunts.html',\n            'systems/fatex/templates/actor/parts/tabs/extras.html',\n            'systems/fatex/templates/actor/parts/tabs/bio.html',\n\n            'systems/fatex/templates/item/parts/layout/item-header.html',\n            'systems/fatex/templates/item/parts/layout/item-footer.html',\n\n            'systems/fatex/templates/item/parts/settings/setting-input.html',\n            'systems/fatex/templates/item/parts/settings/setting-text.html',\n            'systems/fatex/templates/item/parts/settings/setting-rank.html',\n            'systems/fatex/templates/item/parts/settings/setting-editor.html',\n            'systems/fatex/templates/item/parts/settings/setting-automation-skill-enable.html',\n\n            'systems/fatex/templates/settings/parts/layout/settings-header.html',\n            'systems/fatex/templates/settings/parts/layout/settings-footer.html',\n        ];\n\n        return loadTemplates(templatePaths);\n    };\n}\n\n\n//# sourceURL=webpack:///./src/module/helper/TemplatePreloader.js?");

/***/ }),

/***/ "./src/module/item/BaseItem.js":
/*!*************************************!*\
  !*** ./src/module/item/BaseItem.js ***!
  \*************************************/
/*! exports provided: BaseItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BaseItem\", function() { return BaseItem; });\nclass BaseItem {\n    static get entityName() {\n        return false;\n    };\n\n    /**\n     * Allows each item to prepare its data before its rendered.\n     * This can be used to add additional information right before rendering.\n     */\n    static prepareItemData(item, entity) {\n        return item;\n    }\n\n    /**\n     * Allows every item to register its own listeners for rendered actor sheets.\n     * Implements base listeners for adding, configuring and deleting embedded items.\n     */\n    static activateActorSheetListeners(html, sheet) {\n        if (!this.entityName) {\n            throw new Error(\"A subclass of the BaseItem must provide an entityName field or implement their own _onItemAdd() method.\");\n        }\n\n        // Default listeners for adding, configuring and deleting embedded items\n        html.find(`.fatex__${this.entityName}__add`).click((e) => this._onItemAdd.call(this, e, sheet));\n        html.find(`.fatex__${this.entityName}__settings`).click((e) => this._onItemSettings.call(this, e, sheet));\n        html.find(`.fatex__${this.entityName}__delete`).click((e) => this._onItemDelete.call(this, e, sheet));\n    }\n\n    /**\n     * Allows each item to add data to its own sheet.\n     */\n    static getSheetData(sheetData, sheet) {\n        return sheetData;\n    }\n\n    /**\n     * Allows each item to add data to its owners actorsheet.\n     */\n    static getActorSheetData(sheetData) {\n        return sheetData;\n    }\n\n    /**\n     * Allows each item to add listeners to its sheet\n     */\n    static activateListeners(html, sheet) {\n    }\n\n    /*************************\n     * EVENT HANDLER\n     *************************/\n\n    /**\n     * Itemtype agnostic handler for creating new items via event.\n     */\n    static async _onItemAdd(e, sheet) {\n        e.preventDefault();\n        e.stopPropagation();\n\n        if (!this.entityName) {\n            throw new Error(\"A subclass of the BaseItem must provide an entityName field or implement their own _onItemAdd() method.\");\n        }\n\n        const itemData = {\n            name: this.defaultName,\n            type: this.entityName,\n        };\n\n        await this.createNewItem(itemData, sheet);\n    }\n\n    /**\n     * Itemtype agnostic handler for opening an items sheet via event.\n     */\n    static _onItemSettings(e, sheet) {\n        e.preventDefault();\n        e.stopPropagation();\n\n        const data = e.currentTarget.dataset;\n        const item = sheet.actor.getOwnedItem(data.item);\n\n        if (item) {\n            item.sheet.render(true);\n        }\n    }\n\n    /**\n     * Itemtype agnostic handler for deleting an item via event.\n     */\n    static _onItemDelete(e, sheet) {\n        e.preventDefault();\n        e.stopPropagation();\n\n        const data = e.currentTarget.dataset;\n        const item = sheet.actor.getOwnedItem(data.item);\n\n        (new Dialog({\n            title: `${game.i18n.format('FAx.Dialog.EntityDelete')} ${item.name}`,\n            content: game.i18n.format('FAx.Dialog.EntityDeleteText'),\n            default: 'submit',\n            buttons: {\n                cancel: {\n                    icon: '<i class=\"fas fa-times\"></i>',\n                    label: game.i18n.localize(\"FAx.Dialog.Cancel\"),\n                    callback: () => null\n                },\n                submit: {\n                    icon: '<i class=\"fas fa-check\"></i>',\n                    label: game.i18n.localize(\"FAx.Dialog.Confirm\"),\n                    callback: async () => {\n                        await sheet.actor.deleteOwnedItem(data.item);\n                    }\n                }\n            }\n        }, {\n            classes: ['fatex', 'fatex__dialog'],\n        })).render(true);\n    }\n\n\n    /*************************\n     * HELPER FUNCTIONS\n     *************************/\n\n\n    /**\n     * Helper function to create a new item.\n     * Render parameter determines if the items sheet should be rendered.\n     */\n    static async createNewItem(itemData, sheet, render = true) {\n        // Create item and render sheet afterwards\n        const newItem = await sheet.actor.createOwnedItem(itemData);\n\n        // Tokens don't return the new item\n        if (!render || sheet.actor.isToken) return;\n\n        // We have to reload the item for it to have a sheet\n        const createdItem = sheet.actor.getOwnedItem(newItem._id);\n        createdItem.sheet.render(true);\n    }\n\n    /**\n     * Helper function to determine a new items name.\n     * Defaults to the entityName with the first letter capitalized.\n     */\n    static get defaultName() {\n        return this.entityName.charAt(0).toUpperCase() + this.entityName.slice(1);\n    };\n}\n\n\n//# sourceURL=webpack:///./src/module/item/BaseItem.js?");

/***/ }),

/***/ "./src/module/item/ItemFate.js":
/*!*************************************!*\
  !*** ./src/module/item/ItemFate.js ***!
  \*************************************/
/*! exports provided: ItemFate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ItemFate\", function() { return ItemFate; });\nclass ItemFate extends Item {\n\n    /** @override */\n    prepareData() {\n        super.prepareData();\n        let data = this.data;\n\n        // Let every itemType prepare itselt\n        CONFIG.FateX.itemTypes[data.type].prepareItemData(data, this);\n    }\n\n}\n\n\n//# sourceURL=webpack:///./src/module/item/ItemFate.js?");

/***/ }),

/***/ "./src/module/item/ItemSheetFate.js":
/*!******************************************!*\
  !*** ./src/module/item/ItemSheetFate.js ***!
  \******************************************/
/*! exports provided: ItemSheetFate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ItemSheetFate\", function() { return ItemSheetFate; });\nclass ItemSheetFate extends ItemSheet {\n\n    /** @override */\n    static get defaultOptions() {\n        const options = super.defaultOptions;\n\n        mergeObject(options, {\n            classes: options.classes.concat([\n                'fatex fatex__item_sheet',\n            ]),\n            scrollY: [\".desk__content\"],\n        });\n\n        return options;\n    }\n\n    getData() {\n        let data = super.getData();\n\n        // Set owner name if possible\n        data.isOwnedBy = this.actor ? this.actor.name : false;\n\n        // Let every item type manipulate its own sheet data\n        data = CONFIG.FateX.itemTypes[data.item.type].getSheetData(data, this);\n\n        // Let every component manipulate an items sheet data\n        for (let sheetComponent in CONFIG.FateX.sheetComponents.item) {\n            data = CONFIG.FateX.sheetComponents.item[sheetComponent].getSheetData(data, this);\n        }\n\n        return data;\n    }\n\n    /** @override */\n    get template() {\n        return `systems/fatex/templates/item/${this.item.data.type}-sheet.html`;\n    }\n\n    /** @override */\n    activateListeners(html) {\n        super.activateListeners(html);\n\n        for (let sheetComponent in CONFIG.FateX.sheetComponents.item) {\n            CONFIG.FateX.sheetComponents.item[sheetComponent].activateListeners(html, this);\n        }\n\n        // Let every item type add its own sheet listeners\n        CONFIG.FateX.itemTypes[this.entity.type].activateListeners(html, this);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/module/item/ItemSheetFate.js?");

/***/ }),

/***/ "./src/module/item/aspect/AspectItem.js":
/*!**********************************************!*\
  !*** ./src/module/item/aspect/AspectItem.js ***!
  \**********************************************/
/*! exports provided: AspectItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AspectItem\", function() { return AspectItem; });\n/* harmony import */ var _BaseItem_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseItem.js */ \"./src/module/item/BaseItem.js\");\n\n\nclass AspectItem extends _BaseItem_js__WEBPACK_IMPORTED_MODULE_0__[\"BaseItem\"] {\n    static get entityName() {\n        return 'aspect';\n    };\n\n    static activateActorSheetListeners(html, sheet) {\n        super.activateActorSheetListeners(html, sheet);\n\n        // Check or uncheck a single box\n        html.find('.fatex__aspect__input').on('blur', (e) => this._onAspectTextChange.call(this, e, sheet));\n    }\n\n    /*************************\n     * EVENT HANDLER\n     *************************/\n\n    static _onAspectTextChange(e, sheet) {\n        e.preventDefault();\n\n        const dataset = e.currentTarget.dataset;\n        const item = sheet.actor.getOwnedItem(dataset.itemId);\n        const input = $(e.currentTarget).html();\n\n        // Check if the value of the input field changed\n        if(item.data.data.value === input) {\n            return;\n        }\n\n        if(item) {\n            item.update({\n                \"data.value\": input\n            });\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/module/item/aspect/AspectItem.js?");

/***/ }),

/***/ "./src/module/item/aspect/AspectSheet.js":
/*!***********************************************!*\
  !*** ./src/module/item/aspect/AspectSheet.js ***!
  \***********************************************/
/*! exports provided: AspectSheet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AspectSheet\", function() { return AspectSheet; });\n/* harmony import */ var _ItemSheetFate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ItemSheetFate.js */ \"./src/module/item/ItemSheetFate.js\");\n\n\nclass AspectSheet extends _ItemSheetFate_js__WEBPACK_IMPORTED_MODULE_0__[\"ItemSheetFate\"] {\n\n}\n\n\n//# sourceURL=webpack:///./src/module/item/aspect/AspectSheet.js?");

/***/ }),

/***/ "./src/module/item/consequence/ConsequenceItem.js":
/*!********************************************************!*\
  !*** ./src/module/item/consequence/ConsequenceItem.js ***!
  \********************************************************/
/*! exports provided: CONSEQUENCE_TYPES, ConsequenceItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CONSEQUENCE_TYPES\", function() { return CONSEQUENCE_TYPES; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ConsequenceItem\", function() { return ConsequenceItem; });\n/* harmony import */ var _components_Automation_Automation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/Automation/Automation.js */ \"./src/module/components/Automation/Automation.js\");\n/* harmony import */ var _BaseItem_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../BaseItem.js */ \"./src/module/item/BaseItem.js\");\n\n\n\nconst CONSEQUENCE_TYPES = {\n    CONSEQUENCE: 0,\n    CONDITION: 1,\n};\n\nclass ConsequenceItem extends _BaseItem_js__WEBPACK_IMPORTED_MODULE_1__[\"BaseItem\"] {\n    static get entityName() {\n        return 'consequence';\n    };\n\n    static prepareItemData(data, item) {\n        data.isConsequence = data.data.type === CONSEQUENCE_TYPES.CONSEQUENCE;\n        data.isCondition = data.data.type === CONSEQUENCE_TYPES.CONDITION;\n\n        if(item.isOwned) {\n            data.isDisabled = this.getDisabledState(item);\n        }\n\n        return data;\n    }\n\n    static activateActorSheetListeners(html, sheet) {\n        super.activateActorSheetListeners(html, sheet);\n\n        // Check or uncheck a single box\n        html.find('.fatex__consequence__box').click((e) => this._onToggleCondition.call(this, e, sheet));\n\n        // Change consequence text\n        html.find('.fatex__consequence__input').on('blur', (e) => this._onConsequenceTextChange.call(this, e, sheet));\n    }\n\n\n    /*************************\n     * EVENT HANDLER\n     *************************/\n\n    static _onToggleCondition(e, sheet) {\n        e.preventDefault();\n\n        const dataset = e.currentTarget.dataset;\n        const item = sheet.actor.getOwnedItem(dataset.item);\n\n        if(item) {\n            item.update({\n                \"data.active\": !item.data.data.active\n            });\n        }\n    }\n\n    static _onConsequenceTextChange(e, sheet) {\n        e.preventDefault();\n\n        const dataset = e.currentTarget.dataset;\n        const item = sheet.actor.getOwnedItem(dataset.itemId);\n        const input = $(e.currentTarget).html();\n\n        // Check if the value of the input field changed\n        if(item.data.data.value === input) {\n            return;\n        }\n\n        if(item) {\n            item.update({\n                \"data.value\": input\n            });\n        }\n    }\n\n    /*************************\n     * HELPER FUNCTIONS\n     *************************/\n\n    static getDisabledState(item) {\n        let disabled = false;\n        const skillReferences = _components_Automation_Automation_js__WEBPACK_IMPORTED_MODULE_0__[\"Automation\"].getSkillReferences(item);\n        const conjunction = _components_Automation_Automation_js__WEBPACK_IMPORTED_MODULE_0__[\"Automation\"].getReferenceSetting(item, 'conjunction', _components_Automation_Automation_js__WEBPACK_IMPORTED_MODULE_0__[\"CONJUNCTIONS\"].OR);\n\n        // Disable by default if automation was enabled\n        if(conjunction === _components_Automation_Automation_js__WEBPACK_IMPORTED_MODULE_0__[\"CONJUNCTIONS\"].OR && skillReferences.length) {\n            disabled = true;\n        }\n\n        // Not disabled if one of the skillReferences conditions is met\n        for (const reference of skillReferences) {\n            const skill = _components_Automation_Automation_js__WEBPACK_IMPORTED_MODULE_0__[\"Automation\"].getActorSkillById(item.actor, reference.skill);\n            const isConditionMet = skill === undefined ? false : _components_Automation_Automation_js__WEBPACK_IMPORTED_MODULE_0__[\"Automation\"].checkSkillCondition(skill, reference.condition, reference.operator);\n\n            if(conjunction === _components_Automation_Automation_js__WEBPACK_IMPORTED_MODULE_0__[\"CONJUNCTIONS\"].OR && isConditionMet) {\n                return false;\n            }\n\n            if(conjunction === _components_Automation_Automation_js__WEBPACK_IMPORTED_MODULE_0__[\"CONJUNCTIONS\"].AND && !isConditionMet) {\n                return true;\n            }\n        }\n\n        return disabled;\n    }\n}\n\n\n//# sourceURL=webpack:///./src/module/item/consequence/ConsequenceItem.js?");

/***/ }),

/***/ "./src/module/item/consequence/ConsequenceSheet.js":
/*!*********************************************************!*\
  !*** ./src/module/item/consequence/ConsequenceSheet.js ***!
  \*********************************************************/
/*! exports provided: ConsequenceSheet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ConsequenceSheet\", function() { return ConsequenceSheet; });\n/* harmony import */ var _ItemSheetFate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ItemSheetFate.js */ \"./src/module/item/ItemSheetFate.js\");\n\n\nclass ConsequenceSheet extends _ItemSheetFate_js__WEBPACK_IMPORTED_MODULE_0__[\"ItemSheetFate\"] {\n\n}\n\n\n//# sourceURL=webpack:///./src/module/item/consequence/ConsequenceSheet.js?");

/***/ }),

/***/ "./src/module/item/extra/ExtraItem.js":
/*!********************************************!*\
  !*** ./src/module/item/extra/ExtraItem.js ***!
  \********************************************/
/*! exports provided: ExtraItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ExtraItem\", function() { return ExtraItem; });\n/* harmony import */ var _stunt_StuntItem_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../stunt/StuntItem.js */ \"./src/module/item/stunt/StuntItem.js\");\n\n\nclass ExtraItem extends _stunt_StuntItem_js__WEBPACK_IMPORTED_MODULE_0__[\"StuntItem\"] {\n    static get entityName() {\n        return 'extra';\n    };\n\n    /**\n     * Adds extra specifig actorsheet listeners.\n     */\n    static activateActorSheetListeners(html, sheet) {\n        super.activateActorSheetListeners(html, sheet);\n\n        // Check or uncheck a single box\n        html.find('.fatex__extra__toggle').click((e) => this._onToggleView.call(this, e, sheet));\n    }\n\n}\n\n\n//# sourceURL=webpack:///./src/module/item/extra/ExtraItem.js?");

/***/ }),

/***/ "./src/module/item/extra/ExtraSheet.js":
/*!*********************************************!*\
  !*** ./src/module/item/extra/ExtraSheet.js ***!
  \*********************************************/
/*! exports provided: ExtraSheet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ExtraSheet\", function() { return ExtraSheet; });\n/* harmony import */ var _ItemSheetFate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ItemSheetFate.js */ \"./src/module/item/ItemSheetFate.js\");\n\n\nclass ExtraSheet extends _ItemSheetFate_js__WEBPACK_IMPORTED_MODULE_0__[\"ItemSheetFate\"] {\n\n}\n\n\n//# sourceURL=webpack:///./src/module/item/extra/ExtraSheet.js?");

/***/ }),

/***/ "./src/module/item/skill/SkillItem.js":
/*!********************************************!*\
  !*** ./src/module/item/skill/SkillItem.js ***!
  \********************************************/
/*! exports provided: SkillItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SkillItem\", function() { return SkillItem; });\n/* harmony import */ var _BaseItem_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseItem.js */ \"./src/module/item/BaseItem.js\");\n\n\nclass SkillItem extends _BaseItem_js__WEBPACK_IMPORTED_MODULE_0__[\"BaseItem\"] {\n    static get entityName() {\n        return 'skill';\n    };\n\n    /**\n     * Adds skill specifig actorsheet listeners.\n     */\n    static activateActorSheetListeners(html, sheet) {\n        super.activateActorSheetListeners(html, sheet);\n\n        // Check or uncheck a single box\n        html.find('.fatex__skill').click((e) => this._onRollSkill.call(this, e, sheet));\n        html.find('.fatex__skill__increment').click((e) => this._onSkillChangeRank.call(this, e, sheet, true));\n        html.find('.fatex__skill__decrement').click((e) => this._onSkillChangeRank.call(this, e, sheet, false));\n    }\n\n    /**\n     * Adds skill specific actorsheet data\n     * Determines if a filler-skill should be rendered.\n     */\n    static getActorSheetData(sheetData) {\n        // Render skill in two columns if necessary\n        sheetData.options.enableColumns = sheetData.skills.length >= 8;\n\n        // If Skills are rendered in columns and need to be of even number\n        sheetData.options.addSkillFiller = sheetData.options.enableColumns && !!(sheetData.skills.length % 2);\n\n        return sheetData;\n    }\n\n\n    static prepareItemData(item, entity) {\n        item.data.isNegative = item.data.rank < 0;\n        item.data.isPositive = item.data.rank >= 0;\n        item.data.isNeutral = item.data.rank === 0;\n\n        return item;\n    }\n\n    /**\n     * Add a list of available ranks to the sheet\n     */\n    static getSheetData(sheetData) {\n        sheetData.availableRanks = [];\n\n        for(let i = 0; i <= 9; i++) {\n            sheetData.availableRanks.push(i);\n        }\n\n        return sheetData;\n    }\n\n    /*************************\n     * EVENT HANDLER\n     *************************/\n\n    static _onSkillChangeRank(e, sheet, doIncrement) {\n        e.preventDefault();\n        e.stopPropagation();\n\n        const dataset = e.currentTarget.dataset;\n        const skill = sheet.actor.getOwnedItem(dataset.item);\n\n        if(skill) {\n            const rank = skill.data.data.rank;\n            let newRank = 0;\n\n            if(doIncrement) {\n                newRank = (rank >= 9 ) ? 9 : rank + 1;\n            } else {\n                newRank = (rank <= -9 ) ? -9 : rank - 1;\n            }\n\n            skill.update({\n                \"data.rank\": newRank\n            });\n        }\n    }\n\n    static _onRollSkill(e, sheet) {\n        e.preventDefault();\n\n        const dataset = e.currentTarget.dataset;\n        const skill = sheet.actor.getOwnedItem(dataset.itemId);\n\n        if(skill) {\n            this.rollSkill(sheet, skill);\n        }\n    }\n\n    static async rollSkill(sheet, item) {\n        const skill = this.prepareItemData(duplicate(item), item);\n        const template = 'systems/fatex/templates/chat/roll-skill.html';\n        const rank = parseInt(skill.data.rank) || 0;\n        const actor = sheet.actor;\n        const roll = new Roll(\"4dF\").roll();\n        const dice = this.getDice(roll);\n        const total = this.getTotalString(roll.total + rank);\n        const ladder = this.getLadderLabel(roll.total + rank);\n\n        // Prepare skill item\n        let templateData = { skill, rank, dice, total, ladder };\n\n        let chatData = {\n            user: game.user._id,\n            speaker: ChatMessage.getSpeaker({ actor: actor }),\n            sound: CONFIG.sounds.dice,\n            flags: {\n                templateVariables: templateData\n            }\n        };\n\n        chatData.content = await renderTemplate(template, templateData);\n        await ChatMessage.create(chatData);\n    }\n\n    //Todo: Remove parts of this when breaking BC\n    static getDice(roll) {\n        const dice = [];\n\n        if(roll.parts[0].rolls) {\n            roll.parts[0].rolls.forEach(rolledDie => {\n                const die = {};\n                die.value = rolledDie.roll;\n                die.face = this.getDieFace(rolledDie.roll)\n\n                dice.push(die);\n            })\n        }\n\n        if(roll.terms) {\n            roll.terms[0].results.forEach(rolledDie => {\n                const die = {};\n                die.value = rolledDie.result;\n                die.face = this.getDieFace(rolledDie.result)\n\n                dice.push(die);\n            })\n        }\n\n        return dice;\n    }\n\n    static getDieFace(die) {\n        if(die > 0) return \"+\";\n        if(die < 0) return \"-\";\n\n        return \"0\";\n    }\n\n    static getLadderLabel(value) {\n        if(value > 8) value = 8;\n        if(value < -4) value = -4;\n\n        return game.i18n.localize(\"FAx.Global.Ladder.\" + this.getTotalString(value))\n    }\n\n    static getLadderPrefix(value) {\n        if(value < 0)\n            return \"-\";\n\n        return \"+\";\n    }\n\n    static getTotalString(total) {\n        return this.getLadderPrefix(total).concat(Math.abs(total).toString());\n    }\n}\n\n\n//# sourceURL=webpack:///./src/module/item/skill/SkillItem.js?");

/***/ }),

/***/ "./src/module/item/skill/SkillSheet.js":
/*!*********************************************!*\
  !*** ./src/module/item/skill/SkillSheet.js ***!
  \*********************************************/
/*! exports provided: SkillSheet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SkillSheet\", function() { return SkillSheet; });\n/* harmony import */ var _ItemSheetFate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ItemSheetFate.js */ \"./src/module/item/ItemSheetFate.js\");\n\n\nclass SkillSheet extends _ItemSheetFate_js__WEBPACK_IMPORTED_MODULE_0__[\"ItemSheetFate\"] {\n\n}\n\n\n//# sourceURL=webpack:///./src/module/item/skill/SkillSheet.js?");

/***/ }),

/***/ "./src/module/item/stress/StressItem.js":
/*!**********************************************!*\
  !*** ./src/module/item/stress/StressItem.js ***!
  \**********************************************/
/*! exports provided: StressItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"StressItem\", function() { return StressItem; });\n/* harmony import */ var _BaseItem_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseItem.js */ \"./src/module/item/BaseItem.js\");\n\n\nconst STRESS_LABEL_TYPES = {\n    CORE: 0,\n    CONDENSED: 1,\n    CUSTOM: 2\n};\n\nclass StressItem extends _BaseItem_js__WEBPACK_IMPORTED_MODULE_0__[\"BaseItem\"] {\n    static get entityName() {\n        return 'stress';\n    };\n\n    static activateActorSheetListeners(html, sheet) {\n        super.activateActorSheetListeners(html, sheet);\n\n        // Check or uncheck a single box\n        html.find('.fatex__stress__track__item__box').click((e) => this._onStressBoxToggle.call(this, e, sheet));\n    }\n\n    static prepareItemData(item, entity) {\n        const numberOfBoxes = parseInt(item.data.size);\n\n        // Add boxes with prepared data\n        item.boxes = [...Array(numberOfBoxes).keys()].map((i) => {\n            const box = {};\n\n            box.isChecked = item.data.value & (2 ** i);\n            box.label = this._getBoxLabel(item,i);\n\n            return box;\n        });\n\n        // Add filler boxes if needed\n        item.fillers = numberOfBoxes % 4 === 0 ? [] : [...Array(4 - (item.data.size % 4)).keys()];\n\n        return item;\n    }\n\n     static _getBoxLabel(item, i) {\n        if(item.data.labelType === STRESS_LABEL_TYPES.CONDENSED) {\n            return \"1\";\n        }\n\n        if(item.data.labelType === STRESS_LABEL_TYPES.CUSTOM) {\n            return (item.data.customLabel).split(\" \")[i];\n        }\n\n        return i+1;\n    }\n\n    static _getToggledStressValue(currentStressTrackValue, boxIndexToToggle) {\n        return currentStressTrackValue ^ (2 ** boxIndexToToggle);\n    }\n\n    /*************************\n     * EVENT HANDLER\n     *************************/\n\n    static _onStressBoxToggle(e, sheet) {\n        e.preventDefault();\n\n        const dataset = e.currentTarget.dataset;\n        const item = sheet.actor.getOwnedItem(dataset.item);\n        const index = dataset.index;\n\n        if(item) {\n            const newValue = StressItem._getToggledStressValue(item.data.data.value, index);\n\n            item.update({\n                \"data.value\": newValue\n            });\n        }\n    }\n\n}\n\n\n//# sourceURL=webpack:///./src/module/item/stress/StressItem.js?");

/***/ }),

/***/ "./src/module/item/stress/StressSheet.js":
/*!***********************************************!*\
  !*** ./src/module/item/stress/StressSheet.js ***!
  \***********************************************/
/*! exports provided: StressSheet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"StressSheet\", function() { return StressSheet; });\n/* harmony import */ var _ItemSheetFate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ItemSheetFate.js */ \"./src/module/item/ItemSheetFate.js\");\n\n\nclass StressSheet extends _ItemSheetFate_js__WEBPACK_IMPORTED_MODULE_0__[\"ItemSheetFate\"] {\n\n}\n\n\n//# sourceURL=webpack:///./src/module/item/stress/StressSheet.js?");

/***/ }),

/***/ "./src/module/item/stunt/StuntItem.js":
/*!********************************************!*\
  !*** ./src/module/item/stunt/StuntItem.js ***!
  \********************************************/
/*! exports provided: StuntItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"StuntItem\", function() { return StuntItem; });\n/* harmony import */ var _BaseItem_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseItem.js */ \"./src/module/item/BaseItem.js\");\n\n\nclass StuntItem extends _BaseItem_js__WEBPACK_IMPORTED_MODULE_0__[\"BaseItem\"] {\n    static get entityName() {\n        return 'stunt';\n    };\n\n    /**\n     * Adds stunt specifig actorsheet listeners.\n     */\n    static activateActorSheetListeners(html, sheet) {\n        super.activateActorSheetListeners(html, sheet);\n\n        // Check or uncheck a single box\n        html.find('.fatex__stunt__toggle').click((e) => this._onToggleView.call(this, e, sheet));\n    }\n\n\n    /*************************\n     * EVENT HANDLER\n     *************************/\n\n    static _onToggleView(e, sheet) {\n        e.preventDefault();\n        e.stopPropagation();\n    }\n\n}\n\n\n//# sourceURL=webpack:///./src/module/item/stunt/StuntItem.js?");

/***/ }),

/***/ "./src/module/item/stunt/StuntSheet.js":
/*!*********************************************!*\
  !*** ./src/module/item/stunt/StuntSheet.js ***!
  \*********************************************/
/*! exports provided: StuntSheet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"StuntSheet\", function() { return StuntSheet; });\n/* harmony import */ var _ItemSheetFate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ItemSheetFate.js */ \"./src/module/item/ItemSheetFate.js\");\n\n\nclass StuntSheet extends _ItemSheetFate_js__WEBPACK_IMPORTED_MODULE_0__[\"ItemSheetFate\"] {\n\n}\n\n\n//# sourceURL=webpack:///./src/module/item/stunt/StuntSheet.js?");

/***/ }),

/***/ "./src/module/settings/TemplateActorPicker.js":
/*!****************************************************!*\
  !*** ./src/module/settings/TemplateActorPicker.js ***!
  \****************************************************/
/*! exports provided: TemplateActorPicker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TemplateActorPicker\", function() { return TemplateActorPicker; });\n/* harmony import */ var _actor_ActorFate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actor/ActorFate.js */ \"./src/module/actor/ActorFate.js\");\n/* harmony import */ var _TemplateActorSettings_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TemplateActorSettings.js */ \"./src/module/settings/TemplateActorSettings.js\");\n\n\n\nclass TemplateActorPicker extends _TemplateActorSettings_js__WEBPACK_IMPORTED_MODULE_1__[\"TemplateActorSettings\"] {\n\n    static get defaultOptions() {\n        const options = super.defaultOptions;\n\n        mergeObject(options, {\n            title: game.i18n.localize(\"ACTOR.Create\"),\n            template: \"/systems/fatex/templates/settings/template-actors-picker.html\",\n            id: 'template-actor-picker',\n            resizable: true,\n            classes: options.classes.concat([\n                'fatex fatex__settings_sheet',\n            ]),\n            width: 1000,\n            height: 430,\n        });\n\n        return options;\n    }\n\n    activateListeners(html) {\n        super.activateListeners(html);\n\n        html.find('.fatex__template__choose').click((e) => this._chooseTemplate.call(this, e));\n        html.find('.fatex__template__empty').click((e) => this._emptyTemplate.call(this, e));\n        html.find('.fatex__template__header__settings').click((e) => this._openSettings.call(this, e));\n    }\n\n    /*************************\n     * EVENT HANDLER\n     *************************/\n\n    async _openSettings() {\n        CONFIG.FateX.applications.templateSettings.render(true);\n    }\n\n    async _emptyTemplate(e) {\n        e.preventDefault();\n        e.stopPropagation();\n\n        const data = {\n            'name': game.i18n.localize('FAx.Template.Picker.Empty'),\n            'type': 'character',\n        }\n\n        // Create actor without template data\n        _actor_ActorFate_js__WEBPACK_IMPORTED_MODULE_0__[\"ActorFate\"]._create(data, { renderSheet: true });\n        this.close();\n    }\n\n    async _chooseTemplate(e) {\n        e.preventDefault();\n        e.stopPropagation();\n\n        const data = e.currentTarget.dataset;\n        const template = duplicate(game.actors.get(data.template));\n\n        // Add current template as a flag for later use\n        template.flags.fatex.templateActor = template._id;\n\n        // Delete id and flags\n        delete template._id;\n        delete template.flags.fatex.isTemplateActor;\n\n\n        // Create the real actor\n        _actor_ActorFate_js__WEBPACK_IMPORTED_MODULE_0__[\"ActorFate\"]._create(template, { renderSheet: true });\n        this.close();\n    }\n\n    async _updateObject(event, formData) {\n        // Do nothing\n    }\n}\n\n\n//# sourceURL=webpack:///./src/module/settings/TemplateActorPicker.js?");

/***/ }),

/***/ "./src/module/settings/TemplateActorSettings.js":
/*!******************************************************!*\
  !*** ./src/module/settings/TemplateActorSettings.js ***!
  \******************************************************/
/*! exports provided: TemplateActorSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TemplateActorSettings\", function() { return TemplateActorSettings; });\n/* harmony import */ var _actor_ActorFate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actor/ActorFate.js */ \"./src/module/actor/ActorFate.js\");\n\n\nclass TemplateActorSettings extends FormApplication {\n\n    static get defaultOptions() {\n        const options = super.defaultOptions;\n\n        mergeObject(options, {\n            title: game.i18n.localize(\"FAx.Settings.Templates.App.Title\"),\n            template: \"/systems/fatex/templates/settings/template-actors.html\",\n            id: 'template-actors',\n            resizable: true,\n            classes: options.classes.concat([\n                'fatex fatex__settings_sheet',\n            ]),\n            width: 920,\n            height: 500,\n        });\n\n        return options;\n    }\n\n    getData(options = {}) {\n        let filteredActors = duplicate(game.actors.filter(actor => actor.isTemplateActor));\n\n        filteredActors.forEach(actor => {\n            actor.stress = actor.items.filter(item => item.type === 'stress');\n            actor.aspects = actor.items.filter(item => item.type === 'aspect');\n            actor.skills = actor.items.filter(item => item.type === 'skill');\n            actor.consequences = actor.items.filter(item => item.type === 'consequence');\n        });\n\n        return {\n            options: this.options,\n            templateActors: filteredActors\n        };\n    }\n\n    activateListeners(html) {\n        super.activateListeners(html);\n\n        html.find('.fatex__template__create').click((e) => this._createTemplate.call(this, e));\n        html.find('.fatex__template__delete').click((e) => this._deleteTemplate.call(this, e));\n        html.find('.fatex__template__configure').click((e) => this._configureTemplate.call(this, e));\n        html.find('.fatex__template__duplicate').click((e) => this._duplicateTemplate.call(this, e));\n    }\n\n    /*************************\n     * EVENT HANDLER\n     *************************/\n\n    async _configureTemplate(e) {\n        e.preventDefault();\n        e.stopPropagation();\n\n        const data = e.currentTarget.dataset;\n        const template = game.actors.get(data.template);\n\n        if(!template) {\n            return;\n        }\n\n        template.sheet.render(true);\n    }\n\n    async _deleteTemplate(e) {\n        e.preventDefault();\n        e.stopPropagation();\n\n        const data = e.currentTarget.dataset;\n        const template = game.actors.get(data.template);\n\n        if(!template) {\n            return;\n        }\n\n        (new Dialog({\n            title: `${game.i18n.format('FAx.Dialog.EntityDelete')} ${template.name}`,\n            content: game.i18n.format('FAx.Dialog.EntityDeleteText'),\n            default: 'submit',\n            buttons: {\n                cancel: {\n                    icon: '<i class=\"fas fa-times\"></i>',\n                    label: game.i18n.localize(\"FAx.Dialog.Cancel\"),\n                    callback: () => null\n                },\n                submit: {\n                    icon: '<i class=\"fas fa-check\"></i>',\n                    label: game.i18n.localize(\"FAx.Dialog.Confirm\"),\n                    callback: async () => {\n                        await template.delete();\n\n                        // Re-render this settings window and the picker if open\n                        this.render(true);\n                        CONFIG.FateX.applications.templatePicker.render();\n                    }\n                }\n            }\n        }, {\n            classes: ['fatex', 'fatex__dialog'],\n        })).render(true);\n    }\n\n    async _createTemplate(e) {\n        e.preventDefault();\n\n        const createData = {\n            name: game.i18n.localize('FAx.Settings.Templates.New'),\n            type: 'character',\n            flags: {\n                fatex: {\n                    isTemplateActor: true\n                }\n            }\n        };\n\n        await _actor_ActorFate_js__WEBPACK_IMPORTED_MODULE_0__[\"ActorFate\"]._create(createData, {renderSheet: true});\n\n        // Re-render this settings window and the picker if open\n        this.render(true);\n        CONFIG.FateX.applications.templatePicker.render();\n    }\n\n    async _duplicateTemplate(e) {\n        e.preventDefault();\n        e.stopPropagation();\n\n        const data = e.currentTarget.dataset;\n        const template = duplicate(game.actors.get(data.template));\n\n        if(!template) {\n            return;\n        }\n\n        // Delete id\n        delete template._id;\n\n        // Change name\n        template.name = template.name + ` (${game.i18n.localize(\"FAx.Settings.Templates.Copy\")})`;\n\n        // Create new duplicate\n        await Actor.create(template, {renderSheet: true});\n\n        // Re-render this settings window and the picker if open\n        this.render(true);\n        CONFIG.FateX.applications.templatePicker.render();\n    }\n\n    async _updateObject(event, formData) {\n        // Do nothing\n    }\n}\n\n\n//# sourceURL=webpack:///./src/module/settings/TemplateActorSettings.js?");

/***/ }),

/***/ "./src/module/settings/TemplateActors.js":
/*!***********************************************!*\
  !*** ./src/module/settings/TemplateActors.js ***!
  \***********************************************/
/*! exports provided: TemplateActors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TemplateActors\", function() { return TemplateActors; });\n/* harmony import */ var _TemplateActorPicker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TemplateActorPicker.js */ \"./src/module/settings/TemplateActorPicker.js\");\n/* harmony import */ var _TemplateActorSettings_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TemplateActorSettings.js */ \"./src/module/settings/TemplateActorSettings.js\");\n\n\n\nclass TemplateActors {\n    static ready() {\n        // Initialize instances in config\n        CONFIG.FateX.applications.templateSettings = new _TemplateActorSettings_js__WEBPACK_IMPORTED_MODULE_1__[\"TemplateActorSettings\"]();\n        CONFIG.FateX.applications.templatePicker = new _TemplateActorPicker_js__WEBPACK_IMPORTED_MODULE_0__[\"TemplateActorPicker\"]();\n    }\n\n    static hooks() {\n        // Add extra button to foundrys settings menu\n        Hooks.on(\"renderSidebarTab\", (app, html, data) => {\n            if (!(app instanceof Settings) || !game.user.isGM) {\n                return;\n            }\n\n            const configureButton = html.find('button[data-action=\"configure\"]');\n\n            configureButton.before(`\n                <button data-fatex=\"templates\">\n                    <i class=\"fas fa-file-medical\"></i> ${game.i18n.localize(\"FAx.Settings.Templates.Button\")}\n                </button>\n            `);\n\n            html.on('click', 'button[data-fatex=\"templates\"]', () => {\n                return CONFIG.FateX.applications.templateSettings.render(true);\n            });\n        });\n    }\n}\n\n\n//# sourceURL=webpack:///./src/module/settings/TemplateActors.js?");

/***/ })

/******/ });