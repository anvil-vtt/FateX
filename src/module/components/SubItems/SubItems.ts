import { BaseComponent } from "../BaseComponent";
import { FateItem } from "../../item/FateItem";

export class SubItems extends BaseComponent {
    static activateListeners(html, _sheet) {
        console.log("Sub item component activated", _sheet);

        html.find("#create-sub-item").click((e) => this._onCreateSubItem.call(this, e, _sheet));
        html.find(".fatex-js-subitem-delete").click((e) => this._onItemDelete.call(this, e, _sheet));
    }

    /**
     * Itemtype agnostic handler for deleting an item via event.
     */
    static _onItemDelete(e, _sheet) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const item = game.items?.get(data.item);

        item?.delete().then(() => {
            _sheet.render();
        });
    }

    static getSheetData(sheetData, _sheet) {
        sheetData.subItems = game.items?.contents.filter((item) => item.data.type == "extra" && item.data.data.parentID == _sheet.document.id);
        console.log(sheetData);
        return sheetData;
    }

    static _onCreateSubItem(_event, sheet) {
        const extraData = {
            type: "extra",
            name: "Test-Sub-Item",
            data: {
                description: "",
                parentID: sheet.document.id,
            },
        };

        console.log("Create new sub item");

        FateItem.create(extraData).then(() => sheet.render());
    }
}
