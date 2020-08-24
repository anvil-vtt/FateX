/**
 * Item type holding the reference to an actor or a token in a scene
 */
import { ActorFate } from "../actor/ActorFate";

export interface ReferenceItem {
    type: "actorReference" | "tokenReference";
    data: {
        id: string;
        scene?: string;
    };
}

/**
 * Returns all references of actors or tokens to be rendered as inlineSheeds based on a given groupType
 * Defaults to type "manual" which consists of manually added actors and tokens
 */
export function getReferencesByGroupType(groupType: any = "manual", actor?: ActorFate): ReferenceItem[] {
    switch (groupType) {
        case "scene":
            return this.getReferencesFromCurrentScene();
        case "encounter":
            return this.getReferencesFromCurrentEncounter();
        default:
            return actor?.items.map((i) => i.data).sort((a, b) => (a.sort || 0) - (b.sort || 0)) || [];
    }
}

/**
 * Returns all references to tokens which are visible on the current scene
 */
export function getReferencesFromCurrentScene(): ReferenceItem[] {
    return [];
}

/**
 * Returns all references to tokens which are enlisted in the currenctly active encounter
 */
export function getReferencesFromCurrentEncounter(): ReferenceItem[] {
    return [];
}

export function getImageFromReference(reference: ReferenceItem): string {
    if (reference.type === "actorReference") {
        const actor = game.actors.find((actor) => actor.id === reference.data.id);

        // @ts-ignore
        return actor?.data.img ?? DEFAULT_TOKEN;
    }

    if (reference.type === "tokenReference") {
        const scene = game.scenes.find((scene) => scene.id === reference.data.scene);
        const tokenData = scene?.data?.tokens.find((token) => token._id === reference.data.id);

        // @ts-ignore
        return tokenData?.img ?? DEFAULT_TOKEN;
    }

    // @ts-ignore
    return DEFAULT_TOKEN;
}
