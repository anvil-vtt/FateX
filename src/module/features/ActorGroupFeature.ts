import { FateActor } from "../actor/FateActor";
import { GroupSheet } from "../actor/sheets/GroupSheet";
import { renderGroupSheetsByGroupType } from "../helper/ActorGroupHelper";

/**
 * Represents the actor group panel containing multiple actor groups.
 * Is displayed inside the actor sidebar tab by default.
 */
export class ActorGroupFeature {
    static hooks() {
        Hooks.on("renderActorDirectory", (_app, html) => {
            this.addCreateGroupButton(html);
            this.styleGroupEntries(html);
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
            renderGroupSheetsByGroupType("scene");
        });
    }

    static addCreateGroupButton(html) {
        if (!game.user?.isGM || html.find(".fatex-header-actions").length) {
            return;
        }

        // Add "Create Group" button
        html.find(".header-actions").after(`
                <div class="fatex-header-actions header-actions action-buttons flexrow">
                    <button class="create-actor-group"><i class="fas fa-users"></i> ${game.i18n.localize("FAx.ActorGroups.New")}</button>
                </div>
        `);

        html.find(".folder").each((_i, element) => {
            const folder = $(element).data("folder-id");
            const name = $(element).find("h3").first().text();

            $(element)
                .find(".folder-header")
                .append(`<a class="create-folder-group" data-folder="${folder}" data-groupname="${name}"> <i class="fas fa-user-friends fa-fw"></i></a>`);
        });

        // Bind click event listener
        html.on("click", "button.create-actor-group, a.create-folder-group", (e: MouseEvent) => this._onClickCreateGroup.call(this, e));
    }

    static styleGroupEntries(html: JQuery<HTMLElement>) {
        const groupActors = game.actors?.filter((actor) => (actor as FateActor).data.type === "group") || [];

        groupActors.forEach((actor) => {
            // Add small group icon infront of each group name
            const group = html.find(`.entity[data-entity-id=${actor.id}]`);
            group.addClass("fatex__actorDirectory__entry").find(".entity-name").after(`<i class="fas fa-users"></i> `);

            // Add tiled images instead of actor img
            /*group.find("img").replaceWith(`<div class="actor_group_panel__group__images"></div>`);
            (actor as FateActor).images.forEach((image: string) => {
                group.find(".actor_group_panel__group__images").append(`<img class="actor_group_panel__group__image" src="${image}" alt="" />`);
            });*/
        });
    }

    /*************************
     * EVENT HANDLER
     *************************/

    /**
     * Creates a new group actor and renders it immediately (inside the group panel)
     */
    static async _onClickCreateGroup(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const target = event.currentTarget as HTMLElement;

        const actorData: any = {
            name: target.dataset.groupname ?? game.i18n.localize("FAx.ActorGroups.New"),
            type: "group",
            img: "/systems/fatex/assets/icons/group.svg",
            folder: target.dataset.folder ?? undefined,
        };

        const newGroup = await FateActor._create(actorData, { renderSheet: true });
        const sheet = newGroup?.sheet as GroupSheet;

        if (target.dataset.folder) {
            sheet._createActorReferencesFromFolder(target.dataset.folder);
        }
    }
}
