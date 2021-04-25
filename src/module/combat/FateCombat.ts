import { renderGroupSheetsByGroupType } from "../helper/ActorGroupHelper";

export class FateCombat extends Combat {
    _onModifyEmbeddedEntity(embeddedName: string, changes: any[], options: any, userId: string, context?: any) {
        super._onModifyEmbeddedEntity(embeddedName, changes, options, userId, context);

        if (embeddedName == "Combatant") {
            renderGroupSheetsByGroupType("encounter");
        }
    }
}
