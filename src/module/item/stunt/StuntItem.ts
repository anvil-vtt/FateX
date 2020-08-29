import { BaseItem } from "../BaseItem";
import * as marked from "marked";

export class StuntItem extends BaseItem {
    static entityName = "stunt";

    static getActorSheetData(sheetData) {
        if (CONFIG.FateX.global.useMarkdown) {
            for (const stunt of sheetData.stunts) {
                stunt.data.markdown = marked(stunt.data.description);
            }
        }

        return sheetData;
    }

    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        html.find(".fatex__item__collapse").click((e) => this._onCollapseToggle.call(this, e, sheet));
    }

    /*************************
     * EVENT HANDLER
     *************************/

    static async _onCollapseToggle(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(dataset.item);

        if (item) {
            await item.update(
                {
                    "data.collapsed": !item.data.data.collapsed,
                },
                {}
            );
        }
    }
}
