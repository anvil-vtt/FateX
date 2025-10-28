import { StuntItem } from "../stunt/StuntItem";

export class ExtraItem extends StuntItem {
    static get documentName() {
        return "extra";
    }

    static async getActorSheetData(sheetData) {
        sheetData = await StuntItem.getActorSheetData(sheetData);

        for (const extra of sheetData.extras) {
            // @ts-ignore
            extra.system.description = await TextEditor.enrichHTML(extra.system.description, { async: true });
        }

        return sheetData;
    }

    static async getSheetData(sheetData) {
        // @ts-ignore
        sheetData.enrichedDescription = await TextEditor.enrichHTML(sheetData.system.description, { async: true });
    }
    
}
