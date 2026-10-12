import { BaseItem } from "../BaseItem";
import { marked } from "marked";
import { enrichHTML } from "../../applications/ApplicationV2";

export class StuntItem extends BaseItem {
    static documentName = "stunt";

    static async getActorSheetData(sheetData, sheet) {
        for (const stunt of sheetData.stunts) {
            // Markdown is enriched like HTML, so secrets and links behave the same.
            const description = CONFIG.FateX.global.useMarkdown
                ? marked(stunt.system.description ?? "")
                : stunt.system.description;
            stunt.system.description = await enrichHTML(description, sheet?.actor);
        }

        return sheetData;
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
