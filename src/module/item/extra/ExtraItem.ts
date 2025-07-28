import { StuntItem } from "../stunt/StuntItem";

export class ExtraItem extends StuntItem {
    static get documentName() {
        return "extra";
    }

    static async getActorSheetData(sheetData) {
        sheetData = await StuntItem.getActorSheetData(sheetData);

        for (const extra of sheetData.extras) {
            // @ts-ignore
            extra.system.description = await foundry.applications.ux.TextEditor.implementation.enrichHTML(extra.system.description, { async: true });
        }

        return sheetData;
    }

    static async getSheetData(sheetData) {
        // @ts-ignore
        sheetData.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(sheetData.system.description, { async: true });
    }
    
}
