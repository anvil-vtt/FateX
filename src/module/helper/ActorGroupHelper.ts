/**
 * Item type holding the reference to an actor or a token in a scene
 */
import { FateActor } from "../actor/FateActor";
import { ReferenceItemData } from "../item/ItemTypes";
import { GroupSheet } from "../actor/sheets/GroupSheet";

/**
 * Returns all references of actors or tokens to be rendered as inlineSheeds based on a given groupType
 * Defaults to type "manual" which consists of manually added actors and tokens
 */
export function getReferencesByGroupType(groupType: any = "manual", actor?: FateActor): DeepPartial<ReferenceItemData>[] {
    switch (groupType) {
        case "scene":
            return getReferencesFromCurrentScene();
        case "encounter":
            return getReferencesFromCurrentEncounter();
        default: {
            const items = actor?.items.filter((i) => ["actorReference", "tokenReference"].includes(i.type)).map((i) => i.data) as ReferenceItemData[];
            return items.sort((a, b) => (a.sort || 0) - (b.sort || 0));
        }
    }
}

/**
 * Returns all references to tokens which are visible on the current scene
 */
export function getReferencesFromCurrentScene(): DeepPartial<ReferenceItemData>[] {
    if (!(canvas instanceof Canvas)) {
        return [];
    }

    return canvas.tokens.placeables.map((token) => {
        if (!(canvas instanceof Canvas)) {
            return {};
        }

        if (token.actor.token) {
            return {
                _id: ["token", canvas?.scene?.id, token.id].join("-"),
                type: "tokenReference",
                data: {
                    id: token.id,
                    scene: canvas?.scene?.id,
                },
            };
        }

        return {
            _id: ["actor", token.actor.id].join("-"),
            type: "actorReference",
            data: {
                id: token.actor.id,
            },
        };
    });
}

/**
 * Returns all references to tokens which are enlisted in the currenctly active encounter
 */
export function getReferencesFromCurrentEncounter(): DeepPartial<ReferenceItemData>[] {
    if (!game.combats) {
        return [];
    }

    game.combats.active;

    return [];
}

export function getImageFromReference(reference: DeepPartial<ReferenceItemData>): string {
    if (reference.type === "actorReference") {
        const actor = game.actors?.find((actor) => actor.id === reference.data?.id);

        return actor?.data.img ?? DEFAULT_TOKEN;
    }

    if (reference.type === "tokenReference") {
        const scene = game.scenes?.find((scene) => scene.id === reference.data?.scene);
        const tokenData = scene?.data?.tokens.find((token) => token._id === reference.data?.id);

        return tokenData?.img ?? DEFAULT_TOKEN;
    }

    return DEFAULT_TOKEN;
}

export function renderGroupSheet(groupType: string) {
    const openGroupSheets = Object.values(ui.windows).filter<GroupSheet>((app): app is GroupSheet => app instanceof GroupSheet);

    for (const groupSheet of openGroupSheets) {
        if (groupSheet.actor.data.type != "group") {
            continue;
        }

        if (groupSheet.actor.data.data.groupType == groupType) {
            groupSheet.render();
        }
    }
}
