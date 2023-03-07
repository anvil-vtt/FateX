/**
 * FateX base class for all actor sheets.
 * Defines what information on the actor's sheet may be rendered.
 */
import { SheetSetup } from "../../applications/sheet-setup/SheetSetup";
import { GroupSheet } from "./GroupSheet";
import { ItemData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import { DropData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/abstract/client-document";

export interface CharacterSheetOptions extends ActorSheet.Options {
    type?: string;
    combatant?: Combatant;
    referenceID?: string;
    group?: GroupSheet;
}

export class CharacterSheet extends ActorSheet<CharacterSheetOptions> {
    /**
     * Defines the default options for all FateX actor sheets.
     * This consists of things like css classes, the sheet type and the tab configuration.
     */
    static get defaultOptions() {
        const sheetOptions: Partial<CharacterSheetOptions> = {
            classes: ["fatex", "fatex-sheet", "sheet"],
            tabs: [
                {
                    navSelector: ".fatex-js-tabs-navigation",
                    contentSelector: ".fatex-js-tab-content",
                    initial: "skills",
                },
            ],
            scrollY: [".fatex-desk__content"],
            width: 900,
            type: "full",
        };

        // @ts-ignore
        return mergeObject(super.defaultOptions, sheetOptions);
    }

    get template(): string {
        if (!game.user?.isGM && this.actor.limited) {
            return "systems/fatex/templates/actor/limited.hbs";
        }

        return "systems/fatex/templates/actor/character.hbs";
    }

    /**
     * Activates DOM-listeners on elements to react to different events like "click" or "change".
     * ItemTypes and sheet components can activate their own listeners and receive the sheet as a reference.
     *
     * @param html
     *  The rendered html content of the created actor sheet.
     */
    activateListeners(html: JQuery) {
        super.activateListeners(html);

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
     * Returns all data that is needed to render the sheet.
     * All variables are available inside the handelbar templates.
     *
     * Items are split into their categories for easier access.
     *
     * returns {Object}
     */
    async getData() {
        // Basic fields and flags
        let data: any = {
            owner: this.actor.isOwner,
            options: this.options,
            editable: this.isEditable,
            isTemplateActor: this.actor.isTemplateActor,
            isEmptyActor: !this.actor.items.size,
            // @ts-ignore
            isToken: this.token && !this.token.actorLink,
            config: CONFIG.FateX,
        };

        // Add actor, actor data and item
        // @ts-ignore
        data.actor = duplicate(this.actor);
        data.data = data.actor.system;
        data.items = this.actor.items.map((item) => item);
        data.items.sort((a: ItemData, b: ItemData) => (a.sort || 0) - (b.sort || 0));

        // Add filtered item lists for easier access
        data.stress = data.items.filter((item: ItemData) => item.type === "stress");
        data.aspects = data.items.filter((item: ItemData) => item.type === "aspect");
        data.skills = data.items.filter((item: ItemData) => item.type === "skill");
        data.stunts = data.items.filter((item: ItemData) => item.type === "stunt");
        data.extras = data.items.filter((item: ItemData) => item.type === "extra");
        data.consequences = data.items.filter((item: ItemData) => item.type === "consequence");

        // @ts-ignore
        data.enrichedBiography = await TextEditor.enrichHTML(this.object.system.biography.value, { async: true });

        // Allow every item type to add data to the actorsheet
        for (const itemType in CONFIG.FateX.itemClasses) {
            data = CONFIG.FateX.itemClasses[itemType].getActorSheetData(data, this);
        }

        return data;
    }

    /**
     * Adds FateX specific buttons to the sheets header bar.
     *
     * @returns Application.HeaderButton[]
     *   A list of buttons to be rendered.
     */
    _getHeaderButtons() {
        const buttons = super._getHeaderButtons();

        // Edit mode button to toggle which interactive elements are visible on the sheet.
        const canConfigure = game.user?.isGM || this.actor.isOwner;

        if (this.options.editable && canConfigure) {
            // noinspection JSUnusedGlobalSymbols
            buttons.unshift(
                {
                    class: "fatex-toggle-edit-mode",
                    label: game.i18n.localize("FAx.Sheet.Buttons.EditMode"),
                    icon: "fas fa-edit",
                    onclick: (e: JQuery.ClickEvent) => this._onToggleEditMode(e),
                },
                {
                    class: "fatex-open-sheet-manager",
                    label: game.i18n.localize("FAx.Sheet.Buttons.SheetSetup"),
                    icon: "fas fa-tools",
                    onclick: (e: JQuery.ClickEvent) => this._onOpenSheetSetup(e),
                }
            );
        }

        return buttons;
    }

    /**
     * OnClick handler for the previously declaried "Edit mode" button.
     * Toggles the 'fatex-js-edit-mode' class for the sheet container.
     */
    _onToggleEditMode(e: JQuery.ClickEvent): void {
        e.preventDefault();

        const target = $(e.currentTarget);
        const app = target.parents(".app");
        const html = app.find(".window-content");

        html.toggleClass("fatex-js-edit-mode");
    }

    /**
     * OnClick handler for the previously declaried "Sheet setup" button.
     * Opens a new sheet setup instance for this sheet.
     */
    _onOpenSheetSetup(e: JQuery.ClickEvent): void {
        e.preventDefault();

        const sheetSetup = new SheetSetup(this.actor, {});
        sheetSetup.render(true);
    }

    /** @override */
    async _onDrop(event: DragEvent) {
        let data;

        try {
            data = JSON.parse(event.dataTransfer?.getData("text/plain") ?? "");
        } catch (err) {
            return;
        }

        if (data.type === "JournalEntry") {
            return this._onDropJournalEntry(data);
        }

        return super._onDrop(event);
    }

    async _onDropJournalEntry(data: DropData<JournalEntry>) {
        const entry = await JournalEntry.fromDropData(data);
        const actor = this.actor;

        const extraData: DeepPartial<ItemData> = {
            type: "extra",
            document: null,
            name: entry?.data.name ?? "",
            data: {
                description: entry?.data.content || "",
            },
        };

        return await actor.createEmbeddedDocuments("Item", [extraData]);
    }

    /**
     * Saves and restores the focus of a child element
     * This is needed because FVTT only handles this for inputs that belong to the form itself
     *
     * @param force
     * @param options
     */
    async _render(force, options) {
        // Identify the focused element and save its caret position
        const focusedElement: string = this.element.find(":focus").data("focus-id");
        const selection = window.getSelection();
        const position = selection?.focusOffset ?? 0;

        // Render the application
        await super._render(force, options);

        // Restore focus and caret position
        if (focusedElement) {
            const element = this.element.find(`[data-focus-id=${focusedElement}]`)[0];
            const range = document.createRange();
            range.setStart(element.childNodes[0], position);
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
            element.focus();
        }
    }
}
