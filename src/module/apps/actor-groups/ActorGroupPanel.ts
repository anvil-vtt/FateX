import { ActorFate } from "../../actor/ActorFate";
import { ActorGroupSheet } from "../../actor/ActorGroupSheet";

/**
 * Represents the actor group panel containing multiple actor groups.
 * Is displayed inside the actor sidebar tab by default.
 */
export class ActorGroupPanel extends Application {
    /**
     * Set default options like popOut and template
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            popOut: false,
            template: `/systems/fatex/templates/apps/actor-group-panel.html`,
        } as Application.Options);
    }

    /**
     * Injects itself into the panel wrapper instead of the body element
     * The panel wrapper is injected via hook into the actor sidebar
     *
     * @param html
     * @param _options
     */
    _injectHTML(html, _options) {
        $(`#actor_group_panel_wrapper`).append(html);
        this._element = html;
    }

    /**
     * Removes the _element reference before rendering if necessary
     *
     * @param force
     * @param options
     */
    render(force = false, options = {}) {
        if (this._element && !document.contains(this._element[0])) {
            this._element = null;
        }

        return super.render(force, options);
    }

    /**
     * Data thats needed for rendering.
     * Consists of a multiple actors of type "group" sorted by name.
     */
    getData() {
        const data: {
            groups?: Actor[];
        } = {};

        data.groups = game.actors?.filter((actor) => actor.data.type === "group" && (actor as ActorFate).isVisibleByPermission);
        data.groups?.sort((a, b) => a.name.localeCompare(b.name));

        return data;
    }

    /**
     * Activates the click listeners on every group inside the group panel
     */
    activateListeners(html) {
        super.activateListeners(html);

        // Entry-level events
        html.on("click", ".entity-name", this._onClickEntityName.bind(this));
    }

    static hooks() {
        /**
         * Injects the actor group panel wrapper inside the actors sidebar
         * Actor group panel sits above the actor directory.
         */
        Hooks.on("renderActorDirectory", (app, html) => {
            if (app.options.popOut || html.find(".actor_group_panel_wrapper").length) {
                return;
            }

            html.find(".directory-list").before(`
                <div id="actor_group_panel_wrapper" class="actor_group_panel_wrapper"></div>
            `);

            html.find(".header-actions").after(`
                <div class="header-actions action-buttons flexrow">
                    <button class="create-actor-group"><i class="fas fa-users"></i> ${game.i18n.localize("FAx.ActorGroups.New")}</button>
                </div>
            `);

            html.on("click", "button.create-actor-group", () => this._onClickCreateGroup.call(this));

            // If sidebar is re-rendered (not available on first invocation)
            if (game.ready) {
                CONFIG.FateX.instances.actorGroupsPanel?.render(true);
            }
        });

        /**
         * Ready Hook
         * Renders the actor group panel as soon as the application has fully initialized
         */
        Hooks.on("ready", (_app, _html) => {
            CONFIG.FateX.instances.actorGroupsPanel = new ActorGroupPanel();
            CONFIG.FateX.instances.actorGroupsPanel.render(true);
        });

        /**
         * Rerender all inline-sheets of updated actor (needed for synthetic actor token to circumvent patching the _onUpdateBaseActor method)
         */
        Hooks.on("updateActor", (entity, _data, _options, _userId) => {
            const openGroupSheetApps = Object.values(ui.windows).filter((app) => app instanceof ActorGroupSheet);
            const openGroupSheets = openGroupSheetApps as ActorGroupSheet[];

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
     * Handle clicking on an group name in the sidebar directory
     * Opens the character sheet for this entity
     */
    _onClickEntityName(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const entityId = element.parentElement.dataset.entityId;
        const entity = game.actors?.get(entityId);
        const sheet = entity?.sheet;

        if (sheet?.rendered) {
            sheet.maximize();
            // @ts-ignore
            sheet.bringToTop();
        } else {
            sheet?.render(true);
        }
    }

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
