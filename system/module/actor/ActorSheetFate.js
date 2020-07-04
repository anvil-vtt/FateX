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
            CONFIG.FATEx.itemTypes[itemType].activateListeners(html, this);
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
}
