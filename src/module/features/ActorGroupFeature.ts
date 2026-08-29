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
            this.addCreateGroupButton($(html));
            this.styleGroupEntries($(html));
        });

        /**
         * Rerender all inline-sheets of updated actor (needed for synthetic actor token to circumvent patching the _onUpdateBaseActor method)
         */
        Hooks.on("updateActor", (entity, _data, _options, _userId) => {
            const openGroupSheets = GroupSheet.openSheets;

            for (const groupSheet of openGroupSheets) {
                const inlineSheetsOfUpdatedActor = groupSheet.inlineSheets.filter(
                    (sheet) => sheet.actor.uuid === entity.uuid,
                );

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

        for (const event of ["updateCombat", "createCombatant", "updateCombatant", "deleteCombatant"]) {
            Hooks.on(event, () => renderGroupSheetsByGroupType("encounter"));
        }
        for (const event of ["createToken", "deleteToken"]) {
            Hooks.on(event, () => {
                renderGroupSheetsByGroupType("scene");
                renderGroupSheetsByGroupType("manual");
            });
        }
        Hooks.on("deleteActor", () => {
            for (const sheet of GroupSheet.openSheets) void sheet.render();
        });
    }

    static addCreateGroupButton(html: JQuery<HTMLElement>) {
        if (!game.user?.isGM || !FateActor.canUserCreate(game.user)) {
            return;
        }

        // Add "Create Group" button
        const label = game.i18n.localize("FAx.ActorGroups.New");
        if (!html.find(".fatex-header-actions").length) {
            const button = $(
                '<button type="button" class="create-actor-group"><i class="fas fa-users" inert></i></button>',
            );
            button.append(document.createTextNode(` ${label}`));
            button.on("click", (event) => this._onClickCreateGroup(event as unknown as MouseEvent));
            html.find(".header-actions")
                .first()
                .after(
                    $('<div class="fatex-header-actions header-actions action-buttons flexrow"></div>').append(button),
                );
        }

        html.find(".folder").each((_i, element) => {
            const header = $(element).children(".folder-header");
            if (header.find(".create-folder-group").length) return;
            const button = $('<a class="create-folder-group"><i class="fas fa-user-friends fa-fw" inert></i></a>');
            button.attr({
                "data-folder": element.dataset.folderId,
                "data-groupname": header.find(".folder-name, h3").first().text(),
                "aria-label": label,
                title: label,
            });
            button.on("click", (event) => this._onClickCreateGroup(event as unknown as MouseEvent));
            header.append(button);
        });
    }

    static styleGroupEntries(html: JQuery<HTMLElement>) {
        const groupActors = game.actors?.filter((actor) => actor.type === "group") || [];

        groupActors.forEach((actor) => {
            // Add small group icon infront of each group name
            const group = html.find(`.directory-item[data-entry-id="${actor.id}"], .directory-item[data-document-id="${actor.id}"]`);
            group.addClass("fatex__actorDirectory__entry");
            if (!group.find(".fatex-group-icon").length) {
                group.find(".entry-name").after("<i class=\"fas fa-users fatex-group-icon\" inert></i>");
            }

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

        const newGroup = await FateActor.createGroup({
            name: target.dataset.groupname ?? game.i18n.localize("FAx.ActorGroups.New"),
            folder: target.dataset.folder ?? undefined,
        });
        if (!newGroup) return;

        const sheet = newGroup?.sheet as unknown as GroupSheet;

        if (target.dataset.folder) {
            await sheet._createActorReferencesFromFolder(target.dataset.folder);
        }
    }
}
