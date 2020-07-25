/**
 * Base class for multiple sheet components.
 * Ensures that not every method has be implemented by every component.
 */
export class BaseComponent {
    static activateListeners(html, sheet) {}

    /**
     * Allows each component to add data to sheets.
     */
    static getSheetData(sheetData, sheet) {
        return sheetData;
    }
}
