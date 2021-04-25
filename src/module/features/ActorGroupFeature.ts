import { ActorFate } from "../actor/ActorFate";
import { GroupSheet } from "../actor/sheets/GroupSheet";

/**
 * Represents the actor group panel containing multiple actor groups.
 * Is displayed inside the actor sidebar tab by default.
 */
export class ActorGroupFeature {
    static hooks() {
        Hooks.on("renderActorDirectory", (_app, html) => {
            html.find(".header-actions").after(`
                <div class="header-actions action-buttons flexrow">
                    <button class="create-actor-group"><i class="fas fa-users"></i> ${game.i18n.localize("FAx.ActorGroups.New")}</button>
                </div>
            `);

            html.on("click", "button.create-actor-group", () => this._onClickCreateGroup.call(this));
        });

        /**
         * Rerender all inline-sheets of updated actor (needed for synthetic actor token to circumvent patching the _onUpdateBaseActor method)
         */
        Hooks.on("updateActor", (entity, _data, _options, _userId) => {
            const openGroupSheets = Object.values(ui.windows).filter((app) => app instanceof GroupSheet) as GroupSheet[];

            for (const groupSheet of openGroupSheets) {
                const inlineSheetsOfUpdatedActor = groupSheet.inlineSheets.filter((sheet) => sheet.actor.id === entity.id);

                for (const inlineSheet of inlineSheetsOfUpdatedActor) {
                    inlineSheet.render();
                }
            }
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

        return ActorFate._create(actorData, { renderSheet: true });
    }
}
