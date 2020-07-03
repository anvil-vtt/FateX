export class ItemSheetFate extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            classes: options.classes.concat([
                'fatex',
            ]),
        });

        return options;
    }

    /** @override */
    get template() {
        return `systems/fatex/templates/item/${this.item.data.type}/${this.item.data.type}-sheet.html`;
    }

}
