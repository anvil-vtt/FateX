import { renderGroupSheet } from "../helper/ActorGroupHelper";

export class FateScene extends Scene {
    _onModifyEmbeddedEntity(embeddedName: string, changes: any[], options: any, userId: string, context?: any) {
        super._onModifyEmbeddedEntity(embeddedName, changes, options, userId, context);

        if (embeddedName == "Token") {
            renderGroupSheet("scene");
        }
    }
}
