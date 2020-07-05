import { BaseComponent } from "../BaseComponent.js";

export class RangeSlider extends BaseComponent{

    static activateListeners(html, sheet) {
        html.find('.fatex__setting__range__value').change(this._onChangeRangeValue.bind(sheet));
        html.find('.fatex__setting__range__slider').on('input', this._onChangeRangeSlider.bind(sheet));
    }

    static _onChangeRangeSlider(e) {
        e.preventDefault();

        const valueInput = e.currentTarget.previousElementSibling;
        valueInput.value = e.currentTarget.value;
    }

    static _onChangeRangeValue(e) {
        e.preventDefault();

        const valueInput = e.currentTarget.nextElementSibling;
        valueInput.value = e.currentTarget.value;
    }

}
