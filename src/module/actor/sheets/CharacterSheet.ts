import { SheetSetup } from "../../applications/sheet-setup/SheetSetup";
import { BaseItem } from "../../item/BaseItem";
import { ActorSheetV2, enrichHTML, FateSheetMixin } from "../../applications/ApplicationV2";

export class CharacterSheet extends FateSheetMixin(ActorSheetV2) {
    static DEFAULT_OPTIONS: any = {
        tag: "form",
        classes: ["fatex", "fatex-sheet"],
        position: { width: 905, height: 800 },
        window: { resizable: true },
        form: { submitOnChange: true, closeOnSubmit: false },
        actions: {
            toggleEditMode: CharacterSheet.onToggleEditMode,
            sheetSetup: CharacterSheet.onOpenSheetSetup,
        },
    };

    static PARTS = {
        sheet: { template: "systems/fatex/templates/actor/character.hbs", scrollable: [".fatex-desk__content"] },
    };

    static TABS = {
        primary: {
            initial: "skills",
            tabs: [{ id: "skills" }, { id: "extras" }, { id: "bio" }],
        },
    };

    private editMode = false;

    static onToggleEditMode(this: CharacterSheet) {
        if (!this.isEditable) return;
        this.editMode = !this.editMode;
        this.element.classList.toggle("fatex-js-edit-mode", this.editMode);
    }

    static onOpenSheetSetup(this: CharacterSheet) {
        if (this.isEditable) new SheetSetup({ document: this.actor }).render({ force: true });
    }

    _configureRenderParts(options) {
        const parts = super._configureRenderParts(options);
        if (!game.user?.isGM && this.actor.limited) {
            parts.sheet.template = "systems/fatex/templates/actor/limited.hbs";
        }
        return parts;
    }

    async _prepareContext(options) {
        let data = await super._prepareContext(options);
        const items = this.actor.items
            .map((item) => {
                const view = item.toObject(false);
                return CONFIG.FateX.itemClasses[item.type]?.prepareItemData(view, item) ?? view;
            })
            .sort((a, b) => (a.sort || 0) - (b.sort || 0));

        Object.assign(data, {
            owner: this.actor.isOwner,
            options: { ...this.options },
            actor: this.actor.toObject(false),
            system: foundry.utils.deepClone(this.actor.system),
            isTemplateActor: this.actor.isTemplateActor,
            isEmptyActor: !this.actor.items.size,
            isToken: !!this.token && !this.token.actorLink,
            config: CONFIG.FateX,
            items,
            enrichedBiography: await enrichHTML(this.actor.system.biography?.value, this.actor),
        });
        for (const [key, type] of Object.entries({
            stress: "stress",
            aspects: "aspect",
            skills: "skill",
            stunts: "stunt",
            extras: "extra",
            consequences: "consequence",
        })) {
            data[key] = items.filter((item) => item.type === type);
        }
        for (const itemType of Object.values(CONFIG.FateX.itemClasses)) {
            data = await itemType.getActorSheetData(data, this);
        }
        return data;
    }

    async _onRender(context, options) {
        await super._onRender(context, options);
        const html = $(this.element);
        for (const itemType of Object.values(CONFIG.FateX.itemClasses)) {
            itemType.activateActorSheetListeners(html, this);
        }
        for (const component of Object.values(CONFIG.FateX.sheetComponents.actor)) {
            if (this.isEditable) component.activateListeners(html, this);
        }
        html.find(".fatex-js-item-to-chat").on("click", (event) => BaseItem._onItemSendToChat(event, this));
        this.element.classList.toggle("fatex-js-edit-mode", this.editMode && this.isEditable);
    }

    _getHeaderControls() {
        const controls = super._getHeaderControls();
        if (this.isEditable)
            controls.unshift(
                { action: "toggleEditMode", label: "FAx.Sheet.Buttons.EditMode", icon: "fas fa-edit" },
                { action: "sheetSetup", label: "FAx.Sheet.Buttons.SheetSetup", icon: "fas fa-tools" },
            );
        return controls;
    }

    async _onDropDocument(event, document) {
        if (!this.isEditable) return null;
        if (document.documentName === "JournalEntry" || document.documentName === "JournalEntryPage") {
            return this._onDropJournalEntry(document);
        }
        return super._onDropDocument(event, document);
    }

    async _onDropJournalEntry(entry) {
        if (!this.isEditable) return null;
        const pages = entry.documentName === "JournalEntryPage" ? [entry] : entry.pages.contents;
        const description = pages
            .filter((page) => page.type === "text" && page.testUserPermission(game.user, "OBSERVER"))
            .map((page) => page.text.content ?? "")
            .join("\n");
        return this.actor.createEmbeddedDocuments("Item", [
            {
                type: "extra",
                name: entry.name,
                system: { description },
            },
        ]);
    }

    async _onDropFolder(_event, folder) {
        if (!this.isEditable || folder.type !== "Item") return null;
        const documents = await Promise.all(
            folder.contents.map(async (entry) => (entry.toObject ? entry : fromUuid(entry.uuid))),
        );
        const items = documents.filter((entry) => entry?.documentName === "Item").map((entry) => entry.toObject());
        await this.actor.createEmbeddedDocuments("Item", items);
        return folder;
    }
}
