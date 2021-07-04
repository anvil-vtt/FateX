import { InlineActorSheetFate } from "./InlineActorSheetFate";
import { getReferencesByGroupType } from "../../helper/ActorGroupHelper";
import { CharacterSheetOptions } from "./CharacterSheet";
import { FateActor } from "../FateActor";
import { ActorReferenceItemData, CombatantReferenceItemData, TokenReferenceItemData } from "../../item/ItemTypes";
import { FateItem } from "../../item/FateItem";
import { SortableEvent } from "sortablejs";
import Sortable from "sortablejs/modular/sortable.complete.esm.js";

/**
 * Represents a single actor group
 */
export class GroupSheet extends ActorSheet<ActorSheet.Data<FateActor>> {
    public inlineSheets: InlineActorSheetFate[];

    /**
     * Initialize inlineSheets as an empty array of sheets
     */
    constructor(object, options) {
        super(object, options);

        /**
         * Inline sheets that are rendered by this actor group instance
         */
        this.inlineSheets = [];
    }

    /**
     * Sets the default options for every actor group sheet
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["fatex fatex-sheet sheet actor_group_overview actor_group_overview--front"],
            resizable: true,
            template: "/systems/fatex/templates/actor/group.hbs",
            dragDrop: [{ dropSelector: null }],
            scrollY: [".fatex-desk__content"],
        } as CharacterSheetOptions);
    }

    getData() {
        // Basic fields and flags
        const data: any = {
            owner: this.actor.owner,
            options: this.options,
            editable: this.isEditable,
            isTemplateActor: this.actor.isTemplateActor,
            isEmptyActor: !this.actor.items.size,
            isToken: this.token && !this.token.data.actorLink,
            config: CONFIG.FateX,
        };

        // Add actor, actor data and item
        data.actor = duplicate(this.actor.data);
        data.data = data.actor.data;
        data.items = this.actor.items.map((i) => i.data);
        data.items.sort((a, b) => (a.sort || 0) - (b.sort || 0));

        // Create list of available tokens in the current scene for manual groups
        if (this.actor.data.type == "group" && this.actor.data.data.groupType == "manual") {
            const usedTokenReferences = this.actor.items.filter((i) => i.data.type === "tokenReference" && i.data.data.scene === game.scenes?.active.id);
            const usedTokenReferencesMap: string[] = usedTokenReferences.map((token: FateItem) => {
                return token.data.type === "tokenReference" ? token.data.data.id : "";
            });

            if (canvas instanceof Canvas && canvas.scene) {
                data.availableTokens = canvas.scene.data.tokens.filter((token) => !token.actorLink && !usedTokenReferencesMap.includes(token._id));
            }
        }

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(`.fatex__actor_group__createToken`).on("click", (e) => this._onCreateTokenReference.call(this, e));
        html.find(`.fatex__actor_group__sheet__navigation a`).on("click", (e) => this._onChangeGroupNavigation.call(this, e));

        // Custom sheet listeners for every ItemType
        for (const itemType in CONFIG.FateX.itemClasses) {
            CONFIG.FateX.itemClasses[itemType]?.activateActorSheetListeners(html, this);
        }

        // Custom sheet listeners for every SheetComponent
        for (const sheetComponent in CONFIG.FateX.sheetComponents.actor) {
            CONFIG.FateX.sheetComponents.actor[sheetComponent].activateListeners(html, this);
        }
    }

    /**
     * Adds sortableJS handlers to groups.
     *
     * Saves manual group order by sorting embedded entities.
     * Saves scene/encounter group order by using sortables integrated localstorage sorting
     */
    addSortableJSHandler(html) {
        if (this.actor.data.type != "group" || !html.find(".fatex-eb-actor-group-sheets").length) return;

        if (this.actor.data.data.groupType == "manual") {
            return Sortable.create(html.find(".fatex-eb-actor-group-sheets")[0], {
                animation: 150,
                removeOnSpill: true,
                onEnd: (e: SortableEvent) => this.sortInlineSheets.call(this, e),
                onSpill: (e: SortableEvent) => this.spillInlineSheet.call(this, e),
            });
        }

        Sortable.create(html.find(".fatex-eb-actor-group-sheets")[0], {
            group: ["groupSort", this.actor.id].join("-"),
            animation: 150,
            store: {
                get: (sortable) => (localStorage.getItem(sortable.options.group.name) ? localStorage.getItem(sortable.options.group.name)?.split("|") : []),
                set: (sortable) => localStorage.setItem(sortable.options.group.name, sortable.toArray().join("|")),
            },
        });
    }

    async spillInlineSheet(event: SortableEvent) {
        if (event.item.dataset.id) {
            await this.actor.deleteEmbeddedEntity("OwnedItem", event.item.dataset.id);
        }
    }

    async sortInlineSheets(event: SortableEvent) {
        const itemIDs: string[] = Array.from(event.to.children).map((e) => (e as HTMLElement).dataset.id ?? "");

        const updateData = itemIDs.map((id, index) => ({
            _id: id,
            sort: 100000 + index,
        }));

        await this.actor.updateOwnedItem(updateData);
    }

    /**
     * Remove some of the default header buttons for group sheets
     */
    _getHeaderButtons() {
        const buttons = super._getHeaderButtons();

        return buttons.filter((b) => !["configure-token", "configure-sheet"].includes(b.class));
    }

    /**
     * Delete all inline sheets that were created by this instance before closing the window
     */
    async close(options = {}) {
        for (const inlineSheet of this.inlineSheets) {
            delete inlineSheet.actor.apps[inlineSheet.appId];
        }

        return super.close(options);
    }

    /**
     * Render InlineActorSheets after
     * @param force
     * @param options
     */
    async _render(force = false, options = {}) {
        await super._render(force, options);

        if (this.actor.data.type !== "group") {
            return;
        }

        const references = getReferencesByGroupType(this.actor.data.data.groupType, this.actor);

        for (const reference of references) {
            if (reference.type === "actorReference") {
                await this.renderInlineActor(reference);
            } else if (reference.type === "tokenReference") {
                await this.renderInlineToken(reference);
            } else if (reference.type === "combatantReference") {
                await this.renderInlineCombatant(reference);
            }
        }

        if (this.element && this._scrollPositions && this._scrollPositions[".window-content"]) {
            this.element.find(".window-content")[0].scrollTop = this._scrollPositions[".window-content"];
        }

        // Add sortable handler after rendering for all sub-sheets is finished
        this.addSortableJSHandler(this.element.find(".window-content"));
    }

    /**
     * Creates and renders a new InlineActorSheet based on an actor reference.
     * An actor is referenced by his actor id
     */
    async renderInlineActor(reference: DeepPartial<ActorReferenceItemData>) {
        const actor = game.actors?.find((actor) => actor.id === reference.data?.id && (actor as FateActor).isVisibleByPermission);

        if (!actor) {
            return;
        }

        const actorSheet = new InlineActorSheetFate(actor as FateActor, { referenceID: reference._id } as CharacterSheetOptions);
        // @ts-ignore
        await actorSheet._render(true, { group: this } as Application.RenderOptions);

        this.inlineSheets.push(actorSheet);
    }

    /**
     * Creates and renders a new InlineActorSheet based on a token reference.
     * A token is referenced by a combination of the scene where its placed and its token id
     */
    async renderInlineToken(reference: DeepPartial<TokenReferenceItemData>) {
        const scene: any = game.scenes?.find((scene) => scene.id === reference.data?.scene);
        const tokenData = scene?.data.tokens.find((token) => token._id === reference.data?.id);

        if (!tokenData) {
            return;
        }

        const token = new Token(tokenData, scene);

        const tokenSheet = new InlineActorSheetFate(token.actor as FateActor, { referenceID: reference._id } as CharacterSheetOptions);
        // @ts-ignore
        await tokenSheet._render(true, { token: token, group: this } as Application.RenderOptions);

        this.inlineSheets.push(tokenSheet);
    }

    /**
     * Creates and renders a new InlineActorSheet based on a combatant reference.
     */
    async renderInlineCombatant(reference: DeepPartial<CombatantReferenceItemData>) {
        if (!game.combats || !game.combats.active) {
            return;
        }

        const scene: any = game.scenes?.find((scene) => scene.id === game.combats?.active?.data.scene);
        const combatant = game.combats.active.combatants.find((combatant) => combatant._id === reference.data?.id);
        const tokenData = scene?.data.tokens.find((token) => token._id === combatant?.tokenId);

        if (!tokenData || !combatant || !combatant.visible) {
            return;
        }

        delete combatant.actor;

        const token = new Token(tokenData, scene);
        const tokenSheet = new InlineActorSheetFate(token.actor as FateActor, { combatant: combatant, referenceID: reference._id } as CharacterSheetOptions);
        // @ts-ignore
        await tokenSheet._render(true, { token: token, group: this } as Application.RenderOptions);

        this.inlineSheets.push(tokenSheet);
    }

    /**
     * Create a new ownedItem of type ActorReference based on a given actorID
     * @param actorID
     */
    _createActorReference(actorID: string) {
        // Check if character is already present
        if (this.actor.items.find((i) => i.data.type === "actorReference" && i.data.data.id === actorID)) {
            return;
        }

        // Only allow character-type actors to be referenced
        if (game.actors?.get(actorID)?.data.type !== "character") {
            return;
        }

        const itemData: Partial<ActorReferenceItemData> = {
            name: ["actorReference", actorID].join("-"),
            type: "actorReference",
            data: {
                id: actorID,
            },
        };

        return this.actor.createOwnedItem(itemData);
    }

    _createActorReferencesFromFolder(folder: string) {
        const actors = game.folders?.get(folder)?.entities.filter((actor) => actor.data.type === "character") || [];

        actors.forEach((actor) => {
            this._createActorReference(actor.id);
        });
    }

    /**
     * Create a new ownedItem of type tokenReference based on a given sceneID and tokenID
     */
    _createTokenReference(tokenID: string, sceneID: string): void {
        if (this.actor.items.find((i) => i.data.type === "tokenReference" && i.data.data.id === tokenID && i.data.data.scene === sceneID)) {
            return;
        }

        const itemData: Partial<TokenReferenceItemData> = {
            name: ["tokenReference", sceneID, tokenID].join("-"),
            type: "tokenReference",
            data: {
                id: tokenID,
                scene: sceneID,
            },
        };

        this.entity.createOwnedItem(itemData);
    }

    /*************************
     * EVENT HANDLER
     *************************/

    _onChangeGroupNavigation(e) {
        e.preventDefault();
        e.stopPropagation();

        const target = $(e.currentTarget);
        const app = target.parents(".app");

        // Re-set application classes to represent different group states
        app.removeClass(["actor_group_overview--front", "actor_group_overview--back", "actor_group_overview--settings"]);
        app.addClass(`actor_group_overview--${e.currentTarget.dataset.show}`);

        // Re-set active classes on navigation
        app.find(".fatex__actor_group__sheet__navigation a").removeClass("active");
        app.find(`.fatex__actor_group__sheet__navigation--${e.currentTarget.dataset.show}`).addClass("active");
    }

    _onCreateTokenReference(e) {
        e.preventDefault();
        e.stopPropagation();

        const dataset = e.currentTarget.dataset;

        if (!game.actors) {
            return;
        }

        const tokens = game.actors.tokens;
        const tokenActor = Object.values(tokens).find((t) => t.token?.id === dataset.tokenId);

        if (!tokenActor) {
            return;
        }

        if (game.scenes) {
            this._createTokenReference(dataset.tokenId, game.scenes.active.id);
        }
    }

    /**
     * Override of the default drop handler.
     * Handles the ability to drop actors from the sidebar into an actor group
     */
    // @ts-ignore
    async _onDrop(event) {
        let data;

        try {
            data = JSON.parse(event.dataTransfer.getData("text/plain"));
        } catch (err) {
            return false;
        }

        if (this.actor.data.type != "group" || this.actor.data.data.groupType != "manual") {
            ui.notifications?.error(game.i18n.localize("FAx.ActorGroups.Notifications.ManualOnly"));
            return false;
        }

        switch (data.type) {
            case "Actor":
                return this._createActorReference(data.id);
            case "Folder":
                return this._createActorReferencesFromFolder(data.id);
            case "Item":
                return this._onDropItem(event, data);
        }
    }
}
