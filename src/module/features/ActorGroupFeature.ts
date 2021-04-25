import { FateActor } from "../actor/FateActor";
import { GroupSheet } from "../actor/sheets/GroupSheet";
import { renderGroupSheet } from "../helper/ActorGroupHelper";

/**
 * Represents the actor group panel containing multiple actor groups.
 * Is displayed inside the actor sidebar tab by default.
 */
export class ActorGroupFeature {
    static hooks() {
        Hooks.on("renderActorDirectory", (_app, html) => {
            if (!game.user?.isGM || html.find(".fatex-header-actions").length) {
                return;
            }

            html.find(".header-actions").after(`
                <div class="fatex-header-actions header-actions action-buttons flexrow">
                    <button class="create-actor-group"><i class="fas fa-users"></i> ${game.i18n.localize("FAx.ActorGroups.New")}</button>
                </div>
            `);

            html.on("click", "button.create-actor-group", () => this._onClickCreateGroup.call(this));
        });

        /**
         * Rerender all inline-sheets of updated actor (needed for synthetic actor token to circumvent patching the _onUpdateBaseActor method)
         */
        Hooks.on("updateActor", (entity, _data, _options, _userId) => {
            const openGroupSheets = Object.values(ui.windows).filter<GroupSheet>((app): app is GroupSheet => app instanceof GroupSheet);

            for (const groupSheet of openGroupSheets) {
                const inlineSheetsOfUpdatedActor = groupSheet.inlineSheets.filter((sheet) => sheet.actor.id === entity.id);

                for (const inlineSheet of inlineSheetsOfUpdatedActor) {
                    inlineSheet.render();
                }
            }
        });

        /**
         * Rerender groupsheets of type scene whenever the viewed scene changes to another scene
         */
        Hooks.on("canvasReady", (_entity, _data, _options, _userId) => {
            renderGroupSheet("scene");
        });

        /**
         * Rerender groupsheets of type encounter whenever
         */
        Hooks.on("renderCombatTracker", (_entity, _data, _options, _userId) => {
            //renderGroupSheet("encounter");
        });
    }

    /*************************
     * EVENT HANDLER
     *************************/

    /**
     * Creates a new group actor and renders it immediately (inside the group panel)
     */
    static _onClickCreateGroup() {
        const actorData = {
            name: game.i18n.localize("FAx.ActorGroups.New"),
            type: "group",
        };

        return FateActor._create(actorData, { renderSheet: true });
    }
}
