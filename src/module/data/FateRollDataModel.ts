// @ts-nocheck
export class FateRollDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            _id: new foundry.data.fields.StringField({ required: true, blank: false }),
            test2: new foundry.data.fields.StringField({ required: true, blank: false }),
        };
    }

    static migrateData(source) {
        if (!("_id" in source) || !source._id?.length) {
            source._id = foundry.utils.randomID();
        }

        return super.migrateData(source);
    }
}

export class FateRoll extends FateRollDataModel {
    static create(_formula) {
        return new FateRoll({ test2: foundry.utils.randomID() });
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
            rolls: new FateRollsArrayField(
                new foundry.data.fields.EmbeddedDataField(FateRoll, {
                    required: true,
                    nullable: false,
                }),
                {
                    required: true,
                    blank: false,
                    nullable: false,
                }
            ),
        };
    }

    static migrateData(source) {
        const schema = this.schema;
        for (const [name, value] of Object.entries(source)) {
            const field = schema.get(name);
            if (!field) continue;
            if (field instanceof foundry.data.fields.EmbeddedDataField) {
                source[name] = field.model.migrateDataSafe(value || {});
            } else if (field instanceof foundry.data.fields.EmbeddedCollectionField) {
                (value || []).forEach((d) => field.model.migrateDataSafe(d));
            } else if (
                field instanceof foundry.data.fields.ArrayField &&
                field.element instanceof foundry.data.fields.EmbeddedDataField
            ) {
                (value || []).forEach((d) => field.element.model.migrateDataSafe(d));
            } else if (field instanceof SystemDataField) {
                const cls = field.getModelForType(source.type);
                if (cls) source[name] = cls.migrateDataSafe(value);
            }
        }
        return source;
    }
}
