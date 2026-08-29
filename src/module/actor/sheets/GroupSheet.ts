import { InlineActorSheetFate } from "./InlineActorSheetFate";
import { getReferencesByGroupType, resolveReference } from "../../helper/ActorGroupHelper";
import { ActorSheetV2, confirmDeletion, FateSheetMixin } from "../../applications/ApplicationV2";
import Sortable, { SortableEvent } from "sortablejs";

export class GroupSheet extends FateSheetMixin(ActorSheetV2) {
    static openSheets = new Set<GroupSheet>();
    static DEFAULT_OPTIONS = {
        tag: "div",
        classes: ["fatex", "fatex-sheet", "actor_group_overview", "actor_group_overview--front"],
        position: { width: 1000, height: 700 },
        window: { resizable: true },
        sheetConfig: false,
        form: { submitOnChange: true, closeOnSubmit: false },
        actions: {
            createTokenReference: function (this: GroupSheet, _event, target) {
                return this._createTokenReference(target.dataset.tokenId, canvas.scene?.id ?? "");
            },
            groupNavigation: function (this: GroupSheet, _event, target) {
                this.element.classList.remove("actor_group_overview--front", "actor_group_overview--back");
                this.element.classList.add(`actor_group_overview--${target.dataset.show}`);
                for (const link of this.element.querySelectorAll(".fatex__actor_group__sheet__navigation a")) {
                    link.classList.toggle("active", link === target);
                }
            },
        },
    };
    static PARTS = {
        sheet: {
            template: "systems/fatex/templates/actor/group.hbs",
            scrollable: [".fatex-desk__content"],
        },
    };

    inlineSheets: InlineActorSheetFate[] = [];
    private sortable: Sortable | null = null;
    private groupScrollTop = 0;
    private removingReferences = new Set<string>();

    _configureRenderParts(options) {
        const parts = super._configureRenderParts(options);
        // The group form and the child actor forms are siblings, never nested.
        parts.sheet.forms = { ".fatex-group-form": this.options.form };
        return parts;
    }

    async _prepareContext(options) {
        const data = await super._prepareContext(options);
        const used = this.actor.items
            .filter((item) => item.type === "tokenReference" && item.system.scene === canvas.scene?.id)
            .map((item) => item.system.id);
        return Object.assign(data, {
            actor: this.actor.toObject(false),
            system: foundry.utils.deepClone(this.actor.system),
            availableTokens:
                this.actor.system.groupType === "manual"
                    ? canvas.scene?.tokens
                          .filter((token) => !token.isLinked && !!token.actor && !used.includes(token.id))
                          .map((token) => ({
                              _id: token.id,
                              name: token.name,
                              img: (token as any).texture.src,
                          })) ?? []
                    : [],
        });
    }

    _getHeaderControls() {
        return super
            ._getHeaderControls()
            .filter(
                (control) => !["configureToken", "configurePrototypeToken", "configureSheet"].includes(control.acti),
            );
    }

    async _onFirstRender(context, options) {
        await super._onFirstRender(context, options);
        GroupSheet.openSheets.add(this);
    }

    async _preRender(context, options) {
        this.groupScrollTop = this.element?.querySelector(".fatex-desk__content")?.scrollTop ?? 0;
        this.sortable?.destroy();
        this.sortable = null;
        await super._preRender(context, options);
    }

    async _onRender(context, options) {
        await super._onRender(context, options);
        // The group has a part form, rather than a top-level form.
        if (!this.isEditable) {
            for (const input of this.element.querySelectorAll(".fatex-group-form input")) input.disabled = true;
        }
    }

    async _postRender(context, options) {
        await super._postRender(context, options);
        await this.syncInlineSheets();
        const host = this.element.querySelector(".fatex-js-actor-group-sheets");
        host.scrollTop = this.groupScrollTop;
        if (this.actor.system.groupType === "manual" && this.isEditable) {
            this.sortable = Sortable.create(host, {
                animation: 150,
                removeOnSpill: true,
                onSpill: (event) => {
                    void this.spillInlineSheet(event);
                },
                handle: ".fatex__inline_sheet__headline",
                filter: "input, button, a",
                preventOnFilter: false,
                onEnd: (event) => {
                    void this.sortInlineSheets(event);
                },
            });
        }
    }

    async syncInlineSheets() {
        const previous = new Map(this.inlineSheets.map((sheet) => [sheet.options.referenceID, sheet]));
        const next: InlineActorSheetFate[] = [];
        const host = this.element.querySelector(".fatex-js-actor-group-sheets");
        for (const reference of getReferencesByGroupType(this.actor.system.groupType, this.actor)) {
            const resolved = resolveReference(reference);
            if (!resolved?.actor || !resolved.actor.testUserPermission(game.user, "LIMITED")) continue;
            if (resolved.combatant && !resolved.combatant.visible) continue;
            const referenceID = reference._id;
            let sheet = previous.get(referenceID);
            if (sheet && sheet.actor.uuid !== resolved.actor.uuid) {
                await sheet.close();
                sheet = undefined;
            }
            previous.delete(referenceID);
            if (!sheet) sheet = new InlineActorSheetFate({ document: resolved.actor, referenceID, group: this });
            sheet.combatant = resolved.combatant;
            if (sheet.element) host.append(sheet.element);
            await sheet.render({ force: true });
            next.push(sheet);
        }
        for (const sheet of previous.values()) await sheet.close();
        this.inlineSheets = next;
    }

    async _preClose(options) {
        await super._preClose(options);
        this.sortable?.destroy();
        this.sortable = null;
        const inlineSheets = this.inlineSheets;
        this.inlineSheets = [];
        // Inline sheets belong to this group rather than to separate windows. Close
        // them together without animation so every member cannot delay the group.
        await Promise.all(inlineSheets.map((sheet) => sheet.close({ animate: false })));
    }

    _onClose(options) {
        GroupSheet.openSheets.delete(this);
        super._onClose(options);
    }

    async sortInlineSheets(event: SortableEvent) {
        if (!this.isEditable || this.actor.system.groupType !== "manual") return;
        const ids = Array.from(event.to.children)
            .map((element) => (element as HTMLElement).dataset.id)
            .filter((id): id is string => !!id && this.actor.items.has(id));
        await this.actor.updateEmbeddedDocuments(
            "Item",
            ids.map((_id, index) => ({ _id, sort: 100000 + index })),
        );
    }

    canRemoveReference(referenceID: string): boolean {
        if (!this.isEditable || this.actor.system.groupType !== "manual") return false;
        const reference = this.actor.items.get(referenceID);
        return !!reference && ["actorReference", "tokenReference"].includes(reference.type);
    }

    async removeReference(referenceID: string): Promise<boolean> {
        if (!this.canRemoveReference(referenceID) || this.removingReferences.has(referenceID)) return false;
        const reference = this.actor.items.get(referenceID)!;
        this.removingReferences.add(referenceID);
        try {
            const confirmed = await confirmDeletion(
                game.i18n.localize("FAx.ActorGroups.RemoveTitle"),
                game.i18n.localize("FAx.ActorGroups.RemoveConfirmation"),
            );
            // The group can change while the confirmation is open.
            if (!confirmed || !this.canRemoveReference(referenceID) || this.actor.items.get(referenceID) !== reference)
                return false;
            // Delete only the group's reference, never the world Actor or scene Token.
            await reference.delete();
            await this.render();
            return true;
        } finally {
            this.removingReferences.delete(referenceID);
        }
    }

    async spillInlineSheet(event: SortableEvent) {
        const referenceID = event.item.dataset.id;
        if (!referenceID) return;
        if (!(await this.removeReference(referenceID))) await this.render();
    }

    async _createActorReference(actorUUID: string) {
        if (!this.isEditable) return;
        const actor: any = await fromUuid(actorUUID);
        if (!actor || actor.documentName !== "Actor" || actor.type !== "character" || actor.pack) return;
        if (this.actor.items.some((item) => item.type === "actorReference" && item.system.id === actor.id)) return;
        await this.actor.createEmbeddedDocuments("Item", [
            {
                name: `actorReference-${actor.id}`,
                type: "actorReference",
                system: { id: actor.id },
            },
        ]);
    }

    async _createActorReferencesFromFolder(folderUUID: string) {
        if (!this.isEditable) return;
        const folder: any = await fromUuid(folderUUID.startsWith("Folder.") ? folderUUID : `Folder.${folderUUID}`);
        if (folder?.documentName !== "Folder" || folder.type !== "Actor") return;
        // Sequential creation also prevents duplicate references on document updates.
        for (const actor of folder.contents) {
            if (actor.type === "character") await this._createActorReference(actor.uuid);
        }
    }

    async _createTokenReference(tokenID: string, sceneID: string) {
        if (!this.isEditable) return;
        const token = game.scenes?.get(sceneID)?.tokens.get(tokenID);
        if (!token?.actor) return;
        if (
            this.actor.items.some(
                (item) => item.type === "tokenReference" && item.system.id === tokenID && item.system.scene === sceneID,
            )
        )
            return;
        await this.actor.createEmbeddedDocuments("Item", [
            {
                name: `tokenReference-${sceneID}-${tokenID}`,
                type: "tokenReference",
                system: { id: tokenID, scene: sceneID },
            },
        ]);
    }

    async _onDropDocument(event, document) {
        if (!this.isEditable) return null;
        if (this.actor.system.groupType !== "manual") {
            ui.notifications?.error(game.i18n.localize("FAx.ActorGroups.Notifications.ManualOnly"));
            return null;
        }
        if (document.documentName === "Actor") return this._createActorReference(document.uuid);
        if (document.documentName === "Folder") return this._createActorReferencesFromFolder(document.uuid);
        if (document.documentName === "Token") return this._createTokenReference(document.id, document.parent.id);
        return super._onDropDocument(event, document);
    }
}
