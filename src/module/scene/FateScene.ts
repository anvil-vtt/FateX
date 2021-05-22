import { renderGroupSheetsByGroupType } from "../helper/ActorGroupHelper";

export class FateScene extends Scene {
    _onModifyEmbeddedEntity(embeddedName: string, changes: any[], options: any, userId: string, context?: any) {
        super._onModifyEmbeddedEntity(embeddedName, changes, options, userId, context);

        if (game.settings.get("fatex", "enableAlphaFeatures")) {
            if (embeddedName == "Token") {
                renderGroupSheetsByGroupType("scene");
                renderGroupSheetsByGroupType("manual");
            }
        }
    }
}
