import { StuntItem } from "../stunt/StuntItem";
import { enrichHTML } from "../../applications/ApplicationV2";

export class ExtraItem extends StuntItem {
    static get documentName() {
        return "extra";
    }

    static async getActorSheetData(sheetData) {
        sheetData = await StuntItem.getActorSheetData(sheetData);

        for (const extra of sheetData.extras) {
            extra.system.description = await enrichHTML(extra.system.description);
        }

        return sheetData;
    }

    static async getSheetData(sheetData) {
        sheetData.enrichedDescription = await enrichHTML(sheetData.system.description);
    }
}
