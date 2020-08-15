import { BaseComponent } from "../BaseComponent";

export const OPERATORS = {
    OPERATOR_EQUALS: 0,
    OPERATOR_NOT_EQUALS: 1,
    OPERATOR_GT: 2,
    OPERATOR_LT: 3,
    OPERATOR_GTE: 4,
    OPERATOR_LTE: 5,
};

export const CONJUNCTIONS = {
    OR: 0,
    AND: 1,
};

export class Automation extends BaseComponent {
    static activateListeners(html, sheet) {
        html.find(".fatex__skill__reference__create").on("click", (e) => this._onAddReference.call(this, e, sheet));
        html.find(".fatex__skill__reference__change").on("change", (e) => this._onChangeReference.call(this, e, sheet));
        html.find(".fatex__skill__reference__remove").on("click", (e) => this._onRemoveReference.call(this, e, sheet));
        html.find(".fatex__skill__reference__setting").on("change", (e) => this._onChangeSetting.call(this, e, sheet));
    }

    static async getSheetData(sheetData, sheet) {
        sheetData.skillReferences = this.getSkillReferences(sheet.entity);
        sheetData.skillReferenceSettings = this.getSkillReferenceSettings(sheet.entity);
        sheetData.availableSkillLevels = this.getAvailableSkillLevels();
        sheetData.availableOperators = this.getAvailableOperators();
        sheetData.availableConjunctions = this.getAvailableConjunctions();
        sheetData.availableSkills = this.getAllAvailableSkills();

        return sheetData;
    }

    /*************************
     * EVENT HANDLER
     *************************/

    static async _onAddReference(e, sheet) {
        e.preventDefault();

        const entity = sheet.entity;
        await this.addSkillReference(entity);
    }

    static async _onChangeReference(e, sheet) {
        e.preventDefault();

        let value = e.currentTarget.value;
        const dataset = e.currentTarget.dataset;
        const entity = sheet.entity;
        const index = dataset.index;
        const field = dataset.field;

        // Check for numbers as only strings are passed
        if (dataset.dtype === "Number") {
            value = parseInt(value);
        }

        // Return early of no index or field was provided
        if (index === undefined || field === undefined) {
            return;
        }

        await this.changeSkillReference(entity, index, field, value);
    }

    static async _onChangeSetting(e, sheet) {
        e.preventDefault();

        let value = e.currentTarget.value;
        const dataset = e.currentTarget.dataset;
        const entity = sheet.entity;
        const setting = dataset.setting;

        // Check for numbers as only strings are passed
        if (dataset.dtype === "Number") {
            value = parseInt(value);
        }

        // Return early of no setting
        if (setting === undefined) {
            return;
        }

        await this.setReferenceSetting(entity, setting, value);
    }

    static async _onRemoveReference(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const entity = sheet.entity;
        const index = dataset.index;

        // Return early of no index was provided
        if (index === undefined) {
            return;
        }

        new Dialog(
            {
                title: game.i18n.localize("FAx.Dialog.ReferenceRemove"),
                content: game.i18n.localize("FAx.Dialog.ReferenceRemoveText"),
                default: "submit",
                buttons: {
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: game.i18n.localize("FAx.Dialog.Cancel"),
                        callback: () => null,
                    },
                    submit: {
                        icon: '<i class="fas fa-check"></i>',
                        label: game.i18n.localize("FAx.Dialog.Confirm"),
                        callback: async () => {
                            await this.removeSkillReference(entity, index);
                        },
                    },
                },
            },
            {
                classes: ["fatex", "fatex__dialog"],
            }
        ).render(true);
    }

    /*************************
     * HELPER FUNCTIONS
     *************************/

    /**
     * Adds a new skill reference to a given entity
     *
     * @param entity
     *  The entity for the skill reference to be added
     */
    static async addSkillReference(entity) {
        const currentReferences = this.getSkillReferences(entity);
        const references = duplicate(currentReferences);

        references.push({
            skill: "",
            condition: 0,
            operator: OPERATORS.OPERATOR_GTE,
            default: 0,
            action: 0,
            argument: 0,
            argument2: 0,
            argument3: 0,
        });

        await entity.setFlag("fatex", "skillReferences", references);
    }

    static async changeSkillReference(entity, index, field, value) {
        const currentReferences = this.getSkillReferences(entity);
        const references = duplicate(currentReferences);
        const reference = references[index];

        // Change field on reference to new value
        reference[field] = value;

        // Replace one reference at the provided index
        references.splice(index, 1, reference);

        await entity.setFlag("fatex", "skillReferences", references);
    }

    static async removeSkillReference(entity, index) {
        const currentReferences = this.getSkillReferences(entity);
        const references = duplicate(currentReferences);

        // Remove one reference at the provided index
        references.splice(index, 1);

        await entity.setFlag("fatex", "skillReferences", references);
    }

    static async setReferenceSetting(entity, setting, value) {
        await entity.setFlag("fatex", `skillReferenceSettings.${setting}`, value);
    }

    static getReferenceSetting(entity, setting, defaultValue) {
        const flag = entity.getFlag("fatex", `skillReferenceSettings.${setting}`);

        if (flag === undefined) {
            return defaultValue;
        }

        return flag;
    }

    static getSkillReferences(entity) {
        return entity.getFlag("fatex", "skillReferences") || [];
    }

    static getAllAvailableSkills(sort = true) {
        // Get all actors skills in a unique list of names
        const skills = [
            ...new Set(
                game.actors.map((actor) => actor.items.entries.filter((item) => item.type === "skill").map((item) => item.name)).flat()
            ),
        ];

        // Sort alphabetically
        if (sort) {
            skills.sort((a, b) => b - a);
        }

        return skills;
    }

    static getActorSkillByName(actor, skillId) {
        const actorData = duplicate(actor);
        const items = actorData.items;

        // Filter single actors skills by id
        const skills = items.filter((item) => item.name === skillId);

        if (!skills) {
            return undefined;
        }

        return skills[0];
    }

    static getAvailableSkillLevels() {
        return [...Array(21).keys()].map((i) => ({
            value: i,
            label: `+${i}`,
        }));
    }

    static getAvailableOperators() {
        return Object.keys(OPERATORS).map((operator) => ({
            value: OPERATORS[operator],
            label: game.i18n.localize(`FAx.Item.Automation.Operators.${operator}`),
        }));
    }

    static getAvailableConjunctions() {
        return Object.keys(CONJUNCTIONS).map((conjunction) => ({
            value: CONJUNCTIONS[conjunction],
            label: game.i18n.localize(`FAx.Item.Automation.Conjunctions.${conjunction}`),
        }));
    }

    static checkSkillCondition(skill, condition, operator = OPERATORS.OPERATOR_GTE) {
        const rank = skill.data.rank;

        switch (operator) {
            case OPERATORS.OPERATOR_EQUALS:
                return rank === condition;
            case OPERATORS.OPERATOR_NOT_EQUALS:
                return rank !== condition;
            case OPERATORS.OPERATOR_GTE:
                return rank >= condition;
            case OPERATORS.OPERATOR_GT:
                return rank > condition;
            case OPERATORS.OPERATOR_LTE:
                return rank <= condition;
            case OPERATORS.OPERATOR_LT:
                return rank < condition;
        }

        return false;
    }

    static getSkillReferenceSettings(entity) {
        return {
            conjunction: this.getReferenceSetting(entity, "conjunction", CONJUNCTIONS.OR),
        };
    }
}
