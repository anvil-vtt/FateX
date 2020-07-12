import { ActorSheetFate } from "../ActorSheetFate.js";

export class TemplateActorSheetFate extends ActorSheetFate {

    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            classes: options.classes.concat([
                'fatex__helper--enable-editmode',
            ]),
        });

        return options;
    }

}
