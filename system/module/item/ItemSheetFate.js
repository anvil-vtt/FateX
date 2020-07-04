export class ItemSheetFate extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            classes: options.classes.concat([
                'fatex fatex__item_sheet',
            ]),
            width: 500,
            height: 450
        });

        return options;
    }

    getData() {
        let data = super.getData();
        const type = data.item.type;

        data = CONFIG.FATEx.itemTypes[type].getSheetData(data);

        return data;
    }

    /** @override */
    get template() {
        return `systems/fatex/templates/item/${this.item.data.type}/${this.item.data.type}-sheet.html`;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        html.find('.fatex__setting__radio').click(this._onSettingsRadio.bind(this));
    }

    _onSettingsRadio(e) {
        e.preventDefault();

        const data = e.currentTarget.dataset;
        const item = this.entity;

        let value  = data.value;

        if(data.type === "number") {
            value = parseInt(value);
        }

        if(item && this.actor) {
            let updatedItem = duplicate(item);
            updatedItem.data[data.name] = value;
            this.actor.updateOwnedItem(updatedItem);
        }
    }
}
