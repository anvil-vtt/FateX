// @ts-nocheck
export class FateRollHistoryDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            user: new foundry.data.fields.StringField({ required: true, blank: false }),
            type: new foundry.data.fields.StringField({
                required: true,
                blank: false,
                choices: ["reroll", "increase"],
            }),
            timestamp: new foundry.data.fields.NumberField({ required: true, nullable: false, initial: Date.now }),
            previousRoll: new foundry.data.fields.ArrayField(
                new foundry.data.fields.NumberField({ required: true, blank: false }),
                { required: false, blank: false }
            ),
        };
    }
}
