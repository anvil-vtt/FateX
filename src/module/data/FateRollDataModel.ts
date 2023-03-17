// @ts-nocheck
import { FateRollHistoryDataModel } from "./FateRollHistoryDataModel";

export class FateRollDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            _id: new foundry.data.fields.StringField({ required: true, blank: false }),
            name: new foundry.data.fields.StringField({ required: true, blank: false }),
            rank: new foundry.data.fields.NumberField({ required: true, blank: false }),
            bonus: new foundry.data.fields.NumberField({ required: true, blank: false, default: 0 }),
            faces: new foundry.data.fields.ArrayField(
                new foundry.data.fields.NumberField({ required: true, blank: false }),
                { required: true, blank: false }
            ),
            history: new foundry.data.fields.ArrayField(
                new foundry.data.fields.EmbeddedDataField(FateRollHistoryDataModel),
                {
                    required: false,
                }
            ),
            options: new foundry.data.fields.ObjectField({ required: false, blank: false }),
        };
    }

    /*static migrateData(source) {
        if (!("_id" in source) || !source._id?.length) {
            source._id = foundry.utils.randomID();
        }

        return super.migrateData(source);
    }*/
}
