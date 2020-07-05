import { BaseComponent } from "../BaseComponent.js";

export class Radio extends BaseComponent {

    static activateListeners(html, sheet) {
        html.find('.fatex__setting__radio').click(this._onSettingsRadio.bind(sheet));
    }

    static _onSettingsRadio(e) {
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
