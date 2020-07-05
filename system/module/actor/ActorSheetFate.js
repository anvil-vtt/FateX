export class ActorSheetFate extends ActorSheet {
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

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        for (let itemType in CONFIG.FATEx.itemTypes) {
            CONFIG.FATEx.itemTypes[itemType].activateActorSheetListeners(html, this);
        }

        for (let sheetComponent in CONFIG.FATEx.sheetComponents) {
            CONFIG.FATEx.sheetComponents[sheetComponent].activateListeners(html, this);
        }
    }

    /** @override */
    getData() {
        let isOwner = this.actor.owner;

        const data = {
            owner: isOwner,
            options: this.options,
            editable: this.isEditable,
            cssClass: isOwner ? "editable" : "locked",
            isCharacter: this.entity.data.type === "character",
            isNPC: this.entity.data.type === "npc",
            config: CONFIG.FATEx,
        };

        data.actor = duplicate(this.actor.data);
        data.data = data.actor.data;
        data.items = this.actor.items;

        // Add filtered item lists
        data.stress = data.items.filter(item => item.type === 'stress');

        return data;
    }

    /** @override */
    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();

        // Token Configuration
        const canConfigure = game.user.isGM || (this.actor.owner && game.user.can("TOKEN_CONFIGURE"));
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

    _onToggleEditMode(e) {
        e.preventDefault();

        // This will break with future updates
        e.currentTarget.parentElement.parentElement.classList.toggle("fatex__helper--enable-edit-mode")
    }
}
