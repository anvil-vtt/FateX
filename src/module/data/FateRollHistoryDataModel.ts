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

    get previousRollTotal() {
        const total = this.previousRoll.reduce((a, b) => a + b, 0);
        return total >= 0 ? `+${total}` : total;
    }

    get message() {
        switch (this.type) {
            case "reroll":
                return game.i18n.format("FAx.ChatCard.History.Reroll", { previous: this.previousRollTotal });
            case "increase":
                return game.i18n.localize("FAx.ChatCard.History.Increase");
        }
    }
}
