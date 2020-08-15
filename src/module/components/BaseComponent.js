/**
 * Base class for multiple sheet components.
 * Ensures that not every method has be implemented by every component.
 */
export class BaseComponent {
    static activateListeners() {
        // Do nothing by default
    }

    /**
     * Allows each component to add data to sheets.
     */
    static getSheetData(sheetData) {
        return sheetData;
    }
}
