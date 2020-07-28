import { Automation } from "../../components/Automation/Automation.js";
import { BaseItem } from "../BaseItem.js";

export class ConsequenceItem extends BaseItem {
    static entityName = 'consequence';

    static TYPE_CONSEQUENCE = 0;
    static TYPE_CONDITION = 1;

    static prepareItemData(data, item) {
        data.isConsequence = data.data.type === ConsequenceItem.TYPE_CONSEQUENCE;
        data.isCondition = data.data.type === ConsequenceItem.TYPE_CONDITION;

        if(item.isOwned) {
            data.isDisabled = this.getDisabledState(item);
        }

        return data;
    }

    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        // Check or uncheck a single box
        html.find('.fatex__consequence__box').click((e) => this._onToggleCondition.call(this, e, sheet));

        // Change consequence text
        html.find('.fatex__consequence__input').on('blur', (e) => this._onConsequenceTextChange.call(this, e, sheet));
    }


    /*************************
     * EVENT HANDLER
     *************************/

    static _onToggleCondition(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(dataset.item);

        if(item) {
            item.update({
                "data.active": !item.data.data.active
            });
        }
    }

    static _onConsequenceTextChange(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(dataset.itemId);
        const input = $(e.currentTarget).html();

        // Check if the value of the input field changed
        if(item.data.data.value === input) {
            return;
        }

        if(item) {
            item.update({
                "data.value": input
            });
        }
    }

    /*************************
     * HELPER FUNCTIONS
     *************************/

    static getDisabledState(item) {
        let disabled = false;
        const skillReferences = Automation.getSkillReferences(item);
        const conjunction = Automation.getReferenceSetting(item, 'conjunction', Automation.CONJUNCTIONS.OR);

        // Disable by default if automation was enabled
        if(conjunction === Automation.CONJUNCTIONS.OR && skillReferences.length) {
            disabled = true;
        }

        // Not disabled if one of the skillReferences conditions is met
        for (const reference of skillReferences) {
            const skill = Automation.getActorSkillById(item.actor, reference.skill);
            const isConditionMet = skill === undefined ? false : Automation.checkSkillCondition(skill, reference.condition, reference.operator);

            if(conjunction === Automation.CONJUNCTIONS.OR && isConditionMet) {
                return false;
            }

            if(conjunction === Automation.CONJUNCTIONS.AND && !isConditionMet) {
                return true;
            }
        }

        return disabled;
    }
}
