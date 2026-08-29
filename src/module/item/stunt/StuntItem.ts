import { BaseItem } from "../BaseItem";
import { marked } from "marked";
import { enrichHTML } from "../../applications/ApplicationV2";

export class StuntItem extends BaseItem {
    static documentName = "stunt";

    static async getActorSheetData(sheetData) {
        if (CONFIG.FateX.global.useMarkdown) {
            for (const stunt of sheetData.stunts) {
                stunt.system.markdown = marked(stunt.data.description);
            }
        }

        for (const stunt of sheetData.stunts) {
            stunt.system.description = await enrichHTML(stunt.system.description);
        }

        return sheetData;
    }

    static async getSheetData(sheetData) {
        sheetData.enrichedDescription = await enrichHTML(sheetData.system.description);
    }

    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        html.find(".fatex-js-item-collapse").click((e) => this._onCollapseToggle.call(this, e, sheet));
    }

    /*************************
     * EVENT HANDLER
     *************************/

    static async _onCollapseToggle(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.items.get(dataset.item);

        if (item) {
            await item.update(
                {
                    "system.collapsed": !item.system.collapsed,
                },
                {},
            );
        }
    }
}
