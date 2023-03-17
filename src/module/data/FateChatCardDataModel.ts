// @ts-nocheck
import { FateRollsArrayField } from "./fields/FateRollsArrayField";
import { FateRoll } from "../chat/FateRoll";

export class FateChatCardDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            messageId: new foundry.data.fields.StringField({ required: false, blank: true }),
            speaker: new foundry.data.fields.ObjectField({ required: true, blank: false }),
            rolls: new FateRollsArrayField(
                new foundry.data.fields.EmbeddedDataField(FateRoll, {
                    required: true,
                    nullable: false,
                }),
                {
                    required: true,
                    nullable: false,
                    // @ts-ignore
                    initial: [],
                }
            ),
            options: new foundry.data.fields.ObjectField({
                required: false,
                nullable: true,
            }),
        };
    }

    static migrateData(source) {
        const schema = this.schema;

        for (const [name, value] of Object.entries(source)) {
            const field = schema.get(name);

            if (!field) continue;

            if (field instanceof foundry.data.fields.EmbeddedDataField) {
                // @ts-ignore
                source[name] = field.model.migrateDataSafe(value || {});
            } else if (
                field instanceof foundry.data.fields.ArrayField &&
                field.element instanceof foundry.data.fields.EmbeddedDataField
            ) {
                // @ts-ignore
                (value || []).forEach((d) => field.element.model.migrateDataSafe(d));
            }
        }

        return source;
    }
}
