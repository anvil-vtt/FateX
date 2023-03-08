// @ts-nocheck

export class FateRollsArrayField extends foundry.data.fields.ArrayField {
    _validateSpecial(value) {
        super._validateSpecial(value);

        if (value.length === 0) {
            throw new Error("Rolls array must contain at least one roll");
        }
    }
}
