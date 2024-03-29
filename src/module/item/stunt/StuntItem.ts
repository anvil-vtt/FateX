import { BaseItem } from "../BaseItem";
import { marked } from "marked";

export class StuntItem extends BaseItem {
    static documentName = "stunt";

    static getActorSheetData(sheetData) {
        if (CONFIG.FateX.global.useMarkdown) {
            for (const stunt of sheetData.stunts) {
                stunt.system.markdown = marked(stunt.data.description);
            }
        }

        for (const stunt of sheetData.stunts) {
            // @ts-ignore
            stunt.system.description = TextEditor.enrichHTML(stunt.system.description, { async: false });
        }

        return sheetData;
    }

    static getSheetData(sheetData) {
        // @ts-ignore
        sheetData.enrichedDescription = TextEditor.enrichHTML(sheetData.system.description, { async: false });
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
