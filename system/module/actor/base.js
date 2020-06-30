export class ActorSheetFate extends ActorSheet {
    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            classes: options.classes.concat([
                'fatex',
            ]),
            template: "systems/fatex/templates/actors/character-sheet.html",
            tabs: [{navSelector: ".fatex_tabs__navigation", contentSelector: ".fatex__tabs__content", initial: "skills"}]
        });

        return options;
    }
}
