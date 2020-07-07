/**
 * FATEx base class for all actor sheets.
 * Defines what information on the actorsheet may be rendered.
 */
export class ActorSheetFate extends ActorSheet {

    /**
     * Defines the default options for all FATEx actor sheets.
     * This consists of things like css classes, the template to load and the tab configuration.
     *
     * @returns {Object}
     */
    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            classes: options.classes.concat([
                'fatex fatex__sheet',
            ]),
            template: "systems/fatex/templates/actor/character.html",
            tabs: [{navSelector: ".fatex_tabs__navigation", contentSelector: ".fatex__tabs__content", initial: "skills"}],
            scrollY: [".desk__content"],
        });

        return options;
    }

    /**
     * Activates DOM-listeners on elements to react to different events like "click" or "change".
     * ItemTypes and sheet components can activate their own listeners and receive the sheet as a reference.
     *
     * @param html
     *  The rendered html content of the created actor sheet.
     */
    activateListeners(html) {
        super.activateListeners(html);

        // Custom sheet listeners for every ItemType
        for (let itemType in CONFIG.FATEx.itemTypes) {
            CONFIG.FATEx.itemTypes[itemType].activateActorSheetListeners(html, this);
        }

        // Custom sheet listeners for every SheetComponent
        for (let sheetComponent in CONFIG.FATEx.sheetComponents) {
            CONFIG.FATEx.sheetComponents[sheetComponent].activateListeners(html, this);
        }
    }

    /**
     * Returns all data that is needed to render the sheet.
     * All variables are available inside the handelbar templates.
     *
     * Items are split into their categories for easier access.
     *
     * returns {Object}
     */
    getData() {
        let isOwner = this.actor.owner;

        // Basic fields and flags
        const data = {
            owner: isOwner,
            options: this.options,
            editable: this.isEditable,
            isCharacter: this.entity.data.type === "character",
            isNPC: this.entity.data.type === "npc",
            config: CONFIG.FATEx,
        };

        // Add actor, actor data and item
        data.actor = duplicate(this.actor.data);
        data.data = data.actor.data;
        data.items = this.actor.items.map(i => i.data).sort(this._sortItems)

        // Add filtered item lists for easier access
        data.stress = data.items.filter(item => item.type === 'stress');
        data.aspects = data.items.filter(item => item.type === 'aspect');
        data.skills = data.items.filter(item => item.type === 'skill');
        data.stunts = data.items.filter(item => item.type === 'stunt');
        data.extras = data.items.filter(item => item.type === 'extra');
        data.consequences = data.items.filter(item => item.type === 'consequence');

        return data;
    }

    /**
     * Adds FATEx specific buttons to the sheets header bar.
     *
     * @returns {*}
     *   A list of buttons to be rendered.
     */
    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();

        // Edit mode button to toggle which interactive elements are visible on the sheet.
        const canConfigure = game.user.isGM || this.actor.owner;
        if (this.options.editable && canConfigure) {
            buttons = [
                {
                    label: "Edit mode",
                    class: "fatex-toggle-edit-mode",
                    icon: "fas fa-edit",
                    onclick: ev => this._onToggleEditMode(ev)
                }
            ].concat(buttons);
        }

        return buttons
    }

    _sortItems(a,b) {
        return (a.sort || 0) - (b.sort || 0);
    }

    /**
     * OnClick handler for the previously declaried "Edit mode" button.
     * Toggles the 'fatex__helper--enable-editmode' class for the sheet container.
     */
    _onToggleEditMode(e) {
        e.preventDefault();

        // This will break with future updates
        e.currentTarget.parentElement.parentElement.classList.toggle("fatex__helper--enable-editmode")
    }
}
