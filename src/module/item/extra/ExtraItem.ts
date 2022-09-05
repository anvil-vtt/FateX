import { StuntItem } from "../stunt/StuntItem";

export class ExtraItem extends StuntItem {
    static get documentName() {
        return "extra";
    }

    static getActorSheetData(sheetData) {
        sheetData = StuntItem.getActorSheetData(sheetData);

        for (const extra of sheetData.extras) {
            extra.system.description = TextEditor.enrichHTML(extra.system.description, {});
        }

        return sheetData;
    }
}
