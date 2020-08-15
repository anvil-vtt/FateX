/**
 * Base class for multiple sheet components.
 * Ensures that not every method has be implemented by every component.
 */
export class BaseComponent {
    static activateListeners(_html, _sheet) {
        // Do nothing by default
    }

    /**
     * Allows each component to add data to sheets.
     */
    static getSheetData(sheetData, _sheet) {
        return sheetData;
    }
}
