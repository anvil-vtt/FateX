import { StuntItem } from "../stunt/StuntItem";
import { BaseItem } from "../BaseItem";
import { enrichHTML } from "../../applications/ApplicationV2";

export class ExtraItem extends StuntItem {
    static get documentName() {
        return "extra";
    }

    static activateActorSheetListeners(html, sheet) {
        // StuntItem already handles the collapse buttons of stunts and extras.
        BaseItem.activateActorSheetListeners.call(this, html, sheet);
    }

    static async getActorSheetData(sheetData, sheet) {
        for (const extra of sheetData.extras) {
            extra.system.description = await enrichHTML(extra.system.description, sheet?.actor);
        }

        return sheetData;
    }
}
