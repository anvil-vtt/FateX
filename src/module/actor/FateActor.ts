/**
 * FateActor is the default entity class for actors inside the FateX system.
 * Adds custom features based on the system.
 */
import { getImageFromReference, getReferencesByGroupType } from "../helper/ActorGroupHelper";
import { ActorDataFate } from "./ActorTypes";
import { FateItem } from "../item/FateItem";

export class FateActor extends Actor {
    /**
     * Open template picker instead of directly creating a new actor
     */
    static async create(data, options = {}) {
        // Fallback for manual actor duplication
        if (data._id || Object.prototype.hasOwnProperty.call(data, "data") || data?.flags?.cf !== undefined) {
            return super.create(data, options);
        }

        return CONFIG.FateX.applications.templatePicker?.render(true);
    }

    /**
     * Open template picker instead of showing creation dialog
     */
    static async createDialog(data, _options = {}): Promise<any> {
        if (CONFIG.FateX.applications.templatePicker) {
            CONFIG.FateX.applications.templatePicker.options.folder = data.folder;
        }

        return CONFIG.FateX.applications.templatePicker?.render(true);
    }

    /**
     * Provide basic token configuration for newly created actors.
     * Automatically links new tokens to the actor.
     */
    static async _create(data, options = {}) {
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
    render(force = false, options) {
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
        if (this.data.type != "group") {
            return [];
        }

        const images: string[] = [];
        const actorReferences = getReferencesByGroupType(this.data.data.groupType, this);

        for (let i = 0; i < 4; i++) {
            images.push(actorReferences[i] ? getImageFromReference(actorReferences[i]) : DEFAULT_TOKEN);
        }

        return images;
    }

    /**
     * Re-prepare the data for all owned items when owned items are deleted.
     * This ensures, that items that reference the deleted item get updated.
     *
     * Also rerenders the actor group panel if necessary
     */
    _onModifyEmbeddedEntity(embeddedName, changes, options, userId, context = {}) {
        super._onModifyEmbeddedEntity(embeddedName, changes, options, userId, context);

        if (embeddedName === "OwnedItem") {
            this.items.forEach((item) => item.prepareData());
        }
    }
}
