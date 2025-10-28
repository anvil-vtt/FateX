import { BaseItem } from "../BaseItem";
import { marked } from "marked";

export class StuntItem extends BaseItem {
    static documentName = "stunt";

    static async getActorSheetData(sheetData) {
        if (CONFIG.FateX.global.useMarkdown) {
            for (const stunt of sheetData.stunts) {
                stunt.system.markdown = marked(stunt.data.description);
            }
        }

        for (const stunt of sheetData.stunts) {
            // @ts-ignore
            stunt.system.description = await TextEditor.enrichHTML(stunt.system.description, { async: true });
        }

        return sheetData;
    }

    static async getSheetData(sheetData) {
        // @ts-ignore
        sheetData.enrichedDescription = await TextEditor.enrichHTML(sheetData.system.description, { async: true });
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
