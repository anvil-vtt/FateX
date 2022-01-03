import { renderGroupSheetsByGroupType } from "../helper/ActorGroupHelper";

export class FateCombat extends Combat {
    //Todo: Exchange with new method

    // _onModifyEmbeddedEntity(embeddedName: string, changes: any[], options: any, userId: string, context?: any) {
    //     super._onModifyEmbeddedEntity(embeddedName, changes, options, userId, context);
    //
    //     if (game.settings.get("fatex", "enableAlphaFeatures")) {
    //         if (embeddedName === "Combatant") {
    //             renderGroupSheetsByGroupType("encounter");
    //         }
    //     }
    // }

    _onDelete(options, userId) {
        super._onDelete(options, userId);

        if (game.settings.get("fatex", "enableAlphaFeatures")) {
            renderGroupSheetsByGroupType("encounter");
        }
    }
}
