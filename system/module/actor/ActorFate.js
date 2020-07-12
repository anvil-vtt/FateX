/**
 * ActorFate is the default entity class for actors inside the FATEx system.
 * Adds custom features based on the system.
 */
import { TemplateActorPicker } from "../settings/TemplateActorPicker.js";
import { TemplateActorSheetFate } from "./template/TemplateActorSheetFate.js";

export class ActorFate extends Actor {

    /**
     * Open template picker instead of directly creating a new actor
     */
    static async create(data, options = {}) {
        // Fallback for manual actor duplication
        if(data._id) {
            return super.create(data, options);
        }

        let templatePicker = new TemplateActorPicker();
        templatePicker.render(true);
    }

    /**
     * Provide basic token configuration for newly created actors.
     * Automatically links new tokens to the actor.
     */
    static async _create(data, options = {}) {
        data.token = data.token || {};

        if(options.actorTemplate) {
            mergeObject(data, options.actorTemplate);
        }

        // Set basic token data for newly created actors.
        mergeObject(data.token, {
            vision: true,
            dimSight: 30,
            brightSight: 0,
            actorLink: true,
            disposition: 1
        }, {overwrite: false});

        return super.create(data, options);
    }

    get _sheetClass() {
        if (this.isTemplateActor) {
            return TemplateActorSheetFate;
        }

        return super._sheetClass;
    }

    get isTemplateActor() {
        return !!this.getFlag('fatex', 'isTemplateActor');
    }

    get visible() {
        if(this.isTemplateActor) {
            return false;
        }

        return super.visible;
    }
}
