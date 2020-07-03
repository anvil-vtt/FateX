export class ActorSheetFate extends ActorSheet {
    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            classes: options.classes.concat([
                'fatex',
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

        // Add new stress track
        html.find('.fatex__stress__button--add').click(this._onStressCreate.bind(this));

        // Configure single stress track
        html.find('.fatex__stress__settings').click(this._onStressSettings.bind(this));
    }

    /** @override */
    async getData() {
        const sheet = super.getData();

        // Add filtered item lists
        sheet.actor.stress = this._getItemsByType(sheet.actor, 'stress');

        return sheet;
    }

    _getItemsByType(actor, type) {
        return actor.items.filter(item => item.type === type);
    }

    _onStressCreate(e) {
        e.preventDefault();

        const itemData = {
            name: 'Stress',
            type: 'stress',
        };

        this.actor.createOwnedItem(itemData);
    }

    _onStressSettings(e) {
        e.preventDefault();

        const data = e.currentTarget.dataset;
        const item = this.actor.getOwnedItem(data.item);

        item.sheet.render(true);
    }
}
