// @ts-nocheck
export class FateRollHistoryDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            type: new foundry.data.fields.StringField({
                required: true,
                blank: false,
                choices: ["reroll", "increase"],
            }),
        };
    }
}
