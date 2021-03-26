/**
 * FateX base class for all actor sheets.
 * Defines what information on the actorsheet may be rendered.
 */
import { SheetSetup } from "../apps/sheet-setup/SheetSetup";
import { ActorFate } from "./ActorFate";

export class ActorSheetFate extends ActorSheet<any, ActorFate> {
    /**
     * Defines the default options for all FateX actor sheets.
     * This consists of things like css classes, the template to load and the tab configuration.
     *
     * @returns {Object}
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["fatex fatex__sheet"],
            template: "",
            tabs: [
                {
                    navSelector: ".fatex__tabs__navigation",
                    contentSelector: ".fatex__tabs__content",
                    initial: "skills",
                },
            ],
            scrollY: [".desk__content"],
            width: 900,
        } as BaseEntitySheet.Options);
    }

    get template() {
        if (!game.user?.isGM && this.actor.limited) {
            return "systems/fatex/templates/actor/limited.html";
        }

        return "systems/fatex/templates/actor/character.html";
    }

    /**
     * Activates DOM-listeners on elements to react to different events like "click" or "change".
     * ItemTypes and sheet components can activate their own listeners and receive the sheet as a reference.
     *
     * @param html
     *  The rendered html content of the created actor sheet.
     */
    activateListeners(html) {
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
    getData() {
        // Basic fields and flags
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any = {
            owner: this.actor.owner,
            options: this.options,
            editable: this.isEditable,
            isTemplateActor: this.actor.isTemplateActor,
            isEmptyActor: !this.actor.items.size,
            config: CONFIG.FateX,
        };

        // Add actor, actor data and item
        data.actor = duplicate(this.actor.data);
        data.data = data.actor.data;
        data.items = this.actor.items.map((i) => i.data).sort(this._sortItems);

        // Add filtered item lists for easier access
        data.stress = data.items.filter((item) => item.type === "stress");
        data.aspects = data.items.filter((item) => item.type === "aspect");
        data.skills = data.items.filter((item) => item.type === "skill");
        data.stunts = data.items.filter((item) => item.type === "stunt");
        data.extras = data.items.filter((item) => item.type === "extra");
        data.consequences = data.items.filter((item) => item.type === "consequence");

        // Allow every itemtype to add data to the actorsheet
        for (const itemType in CONFIG.FateX.itemClasses) {
            data = CONFIG.FateX.itemClasses[itemType].getActorSheetData(data, this);
        }

        return data;
    }

    /**
     * Adds FateX specific buttons to the sheets header bar.
     *
     * @returns {*}
     *   A list of buttons to be rendered.
     */
    _getHeaderButtons() {
        const buttons = super._getHeaderButtons();

        // Edit mode button to toggle which interactive elements are visible on the sheet.
        const canConfigure = game.user?.isGM || this.actor.owner;
        if (this.options.editable && canConfigure) {
            buttons.push(
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

    _sortItems(a, b) {
        return (a.sort || 0) - (b.sort || 0);
    }

    /**
     * OnClick handler for the previously declaried "Edit mode" button.
     * Toggles the 'fatex__helper--enable-editmode' class for the sheet container.
     */
    _onToggleEditMode(e): void {
        e.preventDefault();

        const target = $(e.currentTarget);
        const app = target.parents(".app");
        const html = app.find(".window-content");

        html.toggleClass("fatex__helper--enable-editmode");
    }

    /**
     * OnClick handler for the previously declaried "Sheet setup" button.
     * Opens a new sheet setup instance for this sheet.
     */
    _onOpenSheetSetup(e): void {
        e.preventDefault();

        const sheetSetup = new SheetSetup(this.actor, {});
        sheetSetup.render(true);
    }

    /** @override */
    async _onDrop(event) {
        // Try to extract the data
        let data;

        try {
            data = JSON.parse(event.dataTransfer.getData("text/plain"));
        } catch (err) {
            return;
        }

        if (data.type === "JournalEntry") {
            return this._onDropJournalEntry(data);
        }

        return super._onDrop(event);
    }

    async _onDropJournalEntry(data: JournalEntry) {
        const entry = await JournalEntry.fromDropData(data);
        const actor = this.actor;

        const extraData = {
            type: "extra",
            name: entry.data.name,
            data: {
                description: entry.data.content,
            },
        };

        // Create item and render sheet afterwards
        return await actor.createOwnedItem(extraData);
    }
}
