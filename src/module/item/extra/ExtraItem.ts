import { StuntItem } from "../stunt/StuntItem";
import { enrichHTML } from "../../applications/ApplicationV2";

export class ExtraItem extends StuntItem {
    static get documentName() {
        return "extra";
    }

    static async getActorSheetData(sheetData, sheet) {
        for (const extra of sheetData.extras) {
            extra.system.description = await enrichHTML(extra.system.description, sheet?.actor);
        }

        return sheetData;
    }
}
