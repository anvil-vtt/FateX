import { FateActor } from "../actor/FateActor";
import { GroupSheet } from "../actor/sheets/GroupSheet";
import { groupType } from "../actor/ActorTypes";

export interface GroupReference {
    _id: string;
    type: "actorReference" | "tokenReference" | "combatantReference";
    system: { id: string; scene?: string };
    sort?: number;
}

/** References stay as document data; resolving them never constructs or mutates a Token. */
export function getReferencesByGroupType(type: groupType = "manual", actor?: FateActor): GroupReference[] {
    switch (type) {
        case "scene":
            return (canvas.scene?.tokens.contents ?? [])
                .filter((token) => token.actor && (game.user?.isGM || !token.hidden))
                .map((token) => ({
                    _id: `tokenReference-${token.id}`,
                    type: "tokenReference",
                    system: { id: token.id!, scene: canvas.scene!.id! },
                }));
        case "encounter":
            return (game.combats?.active?.combatants.contents ?? [])
                .filter((combatant) => combatant.visible)
                .map((combatant) => ({
                    _id: `combatantReference-${combatant.id}`,
                    type: "combatantReference",
                    system: { id: combatant.id! },
                }));
        default:
            return (actor?.items.filter((item) => ["actorReference", "tokenReference"].includes(item.type)) ?? [])
                .map((item) => item.toObject(false) as unknown as GroupReference)
                .sort((a, b) => (a.sort || 0) - (b.sort || 0));
    }
}

export function resolveReference(reference: GroupReference): { actor: any; combatant?: any } | undefined {
    if (reference.type === "actorReference") return { actor: game.actors?.get(reference.system.id) };
    if (reference.type === "tokenReference") {
        const token = game.scenes?.get(reference.system.scene ?? "")?.tokens.get(reference.system.id);
        if (token?.hidden && !game.user?.isGM) return undefined;
        return { actor: token?.actor };
    }
    const combatant = game.combats?.active?.combatants.get(reference.system.id);
    return combatant ? { actor: combatant.actor, combatant } : undefined;
}

export function getImageFromReference(reference: GroupReference): string {
    const resolved = resolveReference(reference);
    if (!resolved?.actor?.testUserPermission(game.user, "LIMITED")) return CONST.DEFAULT_TOKEN;
    if (reference.type === "tokenReference") {
        return (game.scenes?.get(reference.system.scene ?? "")?.tokens.get(reference.system.id) as any)?.texture.src ?? CONST.DEFAULT_TOKEN;
    }
    return resolved.actor.img ?? CONST.DEFAULT_TOKEN;
}

export function renderGroupSheetsByGroupType(type: groupType) {
    for (const sheet of GroupSheet.openSheets) {
        if (sheet.actor.system.groupType === type) void sheet.render();
    }
}
