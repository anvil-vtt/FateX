import { BaseComponent } from "../BaseComponent.js";

/**
 * Extends the input[type="range"] element with an additional input field.
 * The field and the range input are both synchronized.
 */
export class RangeSlider extends BaseComponent{

    /**
     * Adds event listeners to all fatex__setting__range components.
     * onChange for the input[type="text"] field and onInput for the input[type="range"].
     *
     * @param html
     * @param sheet
     */
    static activateListeners(html, sheet) {
        html.find('.fatex__setting__range__value').on('change', (e) => this._onChangeRangeValue.call(this, e, sheet));
        html.find('.fatex__setting__range__slider').on('input', (e) => this._onChangeRangeSlider.call(this, e, sheet));
    }

    /**
     * Updates the input[type="text"] with the range slider value while its being dragged.
     * This ensures both fields are in sync.
     *
     * This is likely to break as soon as one of the elements is wrapped.
     */
    static _onChangeRangeSlider(event, sheet) {
        event.preventDefault();

        const valueInput = event.currentTarget.previousElementSibling;
        valueInput.value = event.currentTarget.value;
    }

    /**
     * Updates the range slider when the input[type="text"] is changed manually.
     * This ensures both fields are in sync.
     *
     * This is likely to break as soon as one of the elements is wrapped.
     */
    static _onChangeRangeValue(event, sheet) {
        event.preventDefault();

        const valueInput = event.currentTarget.nextElementSibling;
        valueInput.value = event.currentTarget.value;
    }

}
