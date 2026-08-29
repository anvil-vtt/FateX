import { getImageFromReference, getReferencesByGroupType } from "../helper/ActorGroupHelper";
import { ActorDataFate } from "./ActorTypes";
import { ActorDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";

export class FateActor extends Actor {
    get images(): string[] {
        if (this.type !== "group") {
            return [];
        }

        const images: string[] = [];
        // @ts-ignore
        const actorReferences = getReferencesByGroupType(this.system.groupType, this);

        for (let i = 0; i < 4; i++) {
            images.push(actorReferences[i] ? getImageFromReference(actorReferences[i]) : CONST.DEFAULT_TOKEN);
        }

        return images;
    }

    /**
     * Open template picker instead of showing creation dialog
     */
    static async createDialog(data?: DeepPartial<ActorDataConstructorData>, _options = {}): Promise<any> {
        if (data?.type === "group") return this.createGroup(data);

        if (CONFIG.FateX.applications.templatePicker) {
            CONFIG.FateX.applications.templatePicker.creationData = foundry.utils.deepClone(data ?? {});
        }

        return CONFIG.FateX.applications.templatePicker?.render({ force: true });
    }

    /** Create a group without showing the character template or setup dialogs. */
    static async createGroup(data: Record<string, any> = {}) {
        if (!game.user?.isGM || !this.canUserCreate(game.user)) return;
        return this._create(
            {
                ...data,
                name: data.name ?? game.i18n.localize("FAx.ActorGroups.New"),
                type: "group",
                img: data.img ?? "systems/fatex/assets/icons/group.svg",
            },
            { renderSheet: true },
        );
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

    /**
     * Provide basic token configuration for newly created actors.
     * Automatically links new tokens to the actor.
     */
    static async _create(data: any, options = {}) {
        const actorData = foundry.utils.deepClone(data);
        actorData.prototypeToken ??= {};
        foundry.utils.mergeObject(
            actorData.prototypeToken,
            {
                sight: { enabled: true, range: 30 },
                actorLink: true,
                disposition: 1,
            },
            { overwrite: false },
        );
        // Preserve the original default-token behavior for templates and new actors.
        actorData.prototypeToken.texture ??= {};
        actorData.prototypeToken.texture.src = CONST.DEFAULT_TOKEN;
        return super.create(actorData, options);
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
