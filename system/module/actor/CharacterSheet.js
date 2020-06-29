export class ActorSheetFATEx extends ActorSheet {
    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            classes: options.classes.concat([
                'fatex',
            ]),
            template: "templates/actors/character-sheet.html",
        });

        return options;
    }
}
