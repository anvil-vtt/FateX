import { StuntItem } from "../stunt/StuntItem";

export class ExtraItem extends StuntItem {
    static get documentName() {
        return "extra";
    }

    static getActorSheetData(sheetData) {
        sheetData = StuntItem.getActorSheetData(sheetData);

        for (const extra of sheetData.extras) {
            // @ts-ignore
            extra.system.description = TextEditor.enrichHTML(extra.system.description, { async: false });
        }

        return sheetData;
    }

    static getSheetData(sheetData) {
        // @ts-ignore
        sheetData.enrichedDescription = TextEditor.enrichHTML(sheetData.system.description, { async: false });
    }
}
