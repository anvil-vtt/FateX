import { renderGroupSheetsByGroupType } from "../helper/ActorGroupHelper";

export class FateScene extends Scene {
    _onUpdateEmbeddedDocuments(embeddedName, documents, result, options, userId) {
        super._onUpdateEmbeddedDocuments(embeddedName, documents, result, options, userId);
        if (game.settings.get("fatex", "enableAlphaFeatures")) {
            if (embeddedName == "Token") {
                renderGroupSheetsByGroupType("scene");
                renderGroupSheetsByGroupType("manual");
            }
        }
    }
}
