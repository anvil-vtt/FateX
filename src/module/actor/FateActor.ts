/**
 * FateActor is the default entity class for actors inside the FateX system.
 * Adds custom features based on the system.
 */
import { getImageFromReference, getReferencesByGroupType } from "../helper/ActorGroupHelper";
import { ActorDataFate } from "./ActorTypes";
import { ActorDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";
import { ConstructorDataType } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";

export class FateActor extends Actor {
    /**
     * Open template picker instead of directly creating a new actor
     */
    static async create(data: ConstructorDataType<FateActor["data"]>, options = {}) {
        //static async create(data: ActorDataConstructorData, options = {}) {
        // Fallback for manual actor duplication
        if (data._id || Object.prototype.hasOwnProperty.call(data, "data") || data.flags?.cf !== undefined) {
            return super.create(data, options);
        }

        return CONFIG.FateX.applications.templatePicker?.render(true);
    }

    /**
     * Open template picker instead of showing creation dialog
     */
    static async createDialog(data?: DeepPartial<ActorDataConstructorData>, _options = {}): Promise<any> {
        if (CONFIG.FateX.applications.templatePicker) {
            CONFIG.FateX.applications.templatePicker.options.folder = data?.folder;
        }

        return CONFIG.FateX.applications.templatePicker?.render(true);
    }

    /**
     * Provide basic token configuration for newly created actors.
     * Automatically links new tokens to the actor.
     */
    static async _create(data: any, options = {}) {
        data.token = data.token || {};

        // Set basic token data for newly created actors.
        mergeObject(
            data.token,
            {
                vision: true,
                dimSight: 30,
                brightSight: 0,
                actorLink: true,
                disposition: 1,
            },
            { overwrite: false }
        );

        // Overwrite specific token data (used for template actors)
        mergeObject(
            data.token,
            {
                img: CONST.DEFAULT_TOKEN,
            },
            { overwrite: true }
        );

        return super.create(data, options);
    }

    /**
     * Re-render all open FateX applications as soon a single actor is updated (used for TemplateActorSettings and TemplateActorPicker)
     */
    render(force = false, options: Application.RenderOptions) {
        super.render(force, options);

        for (const app in CONFIG.FateX.applications) {
            CONFIG.FateX.applications[app]?.render();
        }
    }

    /**
     * Returns true if the current actor is an actor template
     */
    get isTemplateActor() {
        return !!this.getFlag("fatex", "isTemplateActor");
    }

    /**
     * Hides some actors from the sidebar directory list
     */
    get visible() {
        if (this.isTemplateActor) {
            return false;
        }

        return super.visible;
    }

    /**
     * Helper method to only test for visibility based on permissions
     */
    get isVisibleByPermission() {
        return super.visible;
    }

    get images(): string[] {
        if (this.data.type !== "group") {
            return [];
        }

        const images: string[] = [];
        const actorReferences = getReferencesByGroupType(this.data.data.groupType, this);

        for (let i = 0; i < 4; i++) {
            images.push(actorReferences[i] ? getImageFromReference(actorReferences[i]) : CONST.DEFAULT_TOKEN);
        }

        return images;
    }
}

declare global {
    interface DocumentClassConfig {
        Actor: typeof FateActor;
    }

    interface DataConfig {
        Actor: ActorDataFate;
    }
}
