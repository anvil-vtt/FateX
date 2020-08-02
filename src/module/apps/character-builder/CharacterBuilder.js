import { ActorFate } from "../../actor/ActorFate.js";

export class CharacterBuilder extends FormApplication {



    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            title: game.i18n.localize("FAx.Apps.Builder.Title"),
            template: "/systems/fatex/templates/apps/character-builder.html",
            resizable: true,
            classes: options.classes.concat([
                'fatex fatex__app_sheet',
            ]),
            width: 500,
            height: 600,
        });

        return options;
    }

    get actor() {
        return this.object;
    }

    getData(options = {}) {
        return {
            options: this.options,
            isOwnedBy: this.actor ? this.actor.name : false
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.fatex__character_builder--import-core').click((e) => this._onImport.call(this, e, 'core'));
        html.find('.fatex__character_builder--import-condensed').click((e) => this._onImport.call(this, e, 'condensed'));
        html.find('.fatex__character_builder--import-accelerated').click((e) => this._onImport.call(this, e, 'accelerated'));

        html.find('.fatex__character_builder--clear-all').click((e) => this._onClearAll.call(this, e));
    }


    /*************************
     * EVENT HANDLER
     *************************/

    async _onImport(event, name) {
        event.preventDefault();

        const pack = game.packs.find(p => p.collection === `fatex.fate-${name}`);
        const packItems = await pack.getContent();

        let itemData = duplicate(packItems);
        itemData.sort((a,b) => a.flags.fatex.importSort - b.flags.fatex.importSort)

        await this.actor.createOwnedItem(itemData);
    }

    async _onClearAll(event, name) {
        event.preventDefault();

        const items = this.actor.data.items; //.filter(i => i.type === "aspect");
        const deletions = items.map(i => i._id);

        await this.actor.deleteOwnedItem(deletions);
    }

    async _updateObject(event, formData) {
        // Do nothing
    }
}
