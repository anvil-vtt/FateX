import { BaseItem } from "../BaseItem";
import { Automation } from "../../components/Automation/Automation";

export const CONSEQUENCE_TYPES = {
    CONSEQUENCE: 0,
    CONDITION: 1,
};

export class ConsequenceItem extends BaseItem {
    static documentName = "consequence";

    static prepareItemData(data, item) {
        data.isConsequence = data.system.type === CONSEQUENCE_TYPES.CONSEQUENCE;
        data.isCondition = data.system.type === CONSEQUENCE_TYPES.CONDITION;

        if (item.isOwned) {
            data.isDisabled = Automation.getDisabledState(item);
        }

        return data;
    }

    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        // Check or uncheck a single box
        html.find(".fatex-js-consequence-checkbox").click((e) => this._onToggleCondition.call(this, e, sheet));

        // Change consequence text
        html.find(".fatex-js-consequence-input").on("blur", (e) => this._onConsequenceTextChange.call(this, e, sheet));
    }

    /*************************
     * EVENT HANDLER
     *************************/

    static _onToggleCondition(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.items.get(dataset.item);

        if (item) {
            item.update(
                {
                    "system.active": !item.system.active,
                },
                {}
            );
        }
    }

    static _onConsequenceTextChange(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.items.get(dataset.itemId);
        const input = $(e.currentTarget).html();

        // Check if the value of the input field changed
        if (item.system.value === input) {
            return;
        }

        if (item) {
            item.update(
                {
                    "system.value": input,
                },
                {}
            );
        }
    }
}
