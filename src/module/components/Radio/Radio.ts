import { BaseComponent } from "../BaseComponent";

/**
 * Radio component for actor- and itemsheets.
 * Allows the user to change between multiple choices.
 */
export class Radio extends BaseComponent {
    /**
     * Adds a click listener to every .fatex__setting__radio element.
     * The name of the field, the value of the field and more a loaded via datasets.
     *
     * @param html
     *   The html of the inner part of the rendered sheet.
     *
     * @param sheet
     *   The actor- or itemsheet to be referenced inside the handler.
     */
    static activateListeners(html, sheet) {
        html.find(".fatex__setting__radio").click((e) => this._onSettingsRadio.call(this, e, sheet));
    }

    /**
     * OnClick-Handler for radio setting components.
     * Updates the sheets referenced entity with a given name and value (via dataset).
     *
     * @param event
     *   The event that was fired on the sheet.
     *
     * @param sheet
     *   The sheet on which the event was fired.
     */
    static _onSettingsRadio(event, sheet) {
        event.preventDefault();

        const dataset = event.currentTarget.dataset;
        const dataKey = dataset.name;
        const sheetEntity = sheet.entity;

        // Sane default
        let value: number | string = "";

        // Check for numbers as only strings are passed in datasets
        if (dataset.dtype === "Number") {
            value = parseInt(dataset.value);
        } else {
            value = dataset.value;
        }

        sheetEntity.update({
            [dataKey]: value,
        });
    }
}
