import { BaseComponent } from "../BaseComponent.js";

export class Configuration extends BaseComponent {


    static activateListeners(html, sheet) {
        html.find('.fatex__sheet__action--import-core').click((e) => this._onImport.call(this, e, sheet, 'core'));
        html.find('.fatex__sheet__action--import-condensed').click((e) => this._onImport.call(this, e, sheet, 'condensed'));
        html.find('.fatex__sheet__action--import-accelerated').click((e) => this._onImport.call(this, e, sheet, 'accelerated'));
    }


    static async _onImport(event, sheet, name) {
        event.preventDefault();

        const actor = sheet.actor;
        const pack = game.packs.find(p => p.collection === `fatex.fate-${name}`);
        const packItems = await pack.getContent();

        let itemData = duplicate(packItems);
        itemData.sort((a,b) => a.flags.fatex.importSort - b.flags.fatex.importSort)

        await actor.createOwnedItem(itemData);
    }

}
