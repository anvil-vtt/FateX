// @ts-nocheck
export class FateRollDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            test2: new foundry.data.fields.StringField({ required: true, blank: false }),
        };
    }
}

export class FateRollsArrayField extends foundry.data.fields.ArrayField {
    _validateSpecial(value) {
        super._validateSpecial(value);

        if (value.length === 0) {
            throw new Error("Rolls array must contain at least one roll");
        }
    }
}

export class FateChatCardModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            rolls: new FateRollsArrayField(new foundry.data.fields.EmbeddedDataField(FateRollDataModel, { required: true, nullable: false }), {
                required: true,
                blank: false,
                nullable: false,
            }),
            //test: new foundry.data.fields.StringField({ required: true, blank: false }),
        };
    }
}
