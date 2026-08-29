import { DataManager } from "./DataManager";
import { applications, confirmDeletion, FateSheetMixin } from "../ApplicationV2";

const CLEAR = { EVERYTHING: 0, ASPECTS: 1, CONSEQUENCES: 2, SKILLS: 3, STRESS: 4 };
const TYPES = { 1: "aspect", 2: "consequence", 3: "skill", 4: "stress" };

export class SheetSetup extends FateSheetMixin(applications.api.DocumentSheetV2) {
    static DEFAULT_OPTIONS = {
        tag: "div",
        sheetConfig: false,
        classes: ["fatex", "fatex-sheet", "fatex-sheet--app"],
        position: { width: 600, height: 700 },
        window: { resizable: true },
        actions: {
            clearAll: function (this: SheetSetup) {
                return this._onClear(CLEAR.EVERYTHING);
            },
            clearStress: function (this: SheetSetup) {
                return this._onClear(CLEAR.STRESS);
            },
            clearSkills: function (this: SheetSetup) {
                return this._onClear(CLEAR.SKILLS);
            },
            clearConsequences: function (this: SheetSetup) {
                return this._onClear(CLEAR.CONSEQUENCES);
            },
            clearAspects: function (this: SheetSetup) {
                return this._onClear(CLEAR.ASPECTS);
            },
            addSelection: function (this: SheetSetup, _event, target) {
                return this._onSetupType(target);
            },
            toggleSelection: function (this: SheetSetup, _event, target) {
                return this._onToggleType(target);
            },
        },
    };

    static PARTS = {
        sheet: {
            template: "systems/fatex/templates/apps/sheet-setup.hbs",
            scrollable: [".fatex-desk__content"],
        },
    };
    tabGroups: Record<string, string | null> = { setup: null };

    get actor() {
        return this.document;
    }

    get title() {
        return game.i18n.localize("FAx.Apps.Setup.Title");
    }

    async _prepareContext(options) {
        const data = await super._prepareContext(options);
        const systems = await new DataManager().getSystems();
        this.tabGroups.setup ??= systems[0]?.identifier ?? null;
        return Object.assign(data, {
            options: this.options,
            isOwnedBy: this.actor.name,
            hasAspects: this.actor.items.some((i) => i.type === "aspect"),
            hasSkills: this.actor.items.some((i) => i.type === "skill"),
            hasConsequences: this.actor.items.some((i) => i.type === "consequence"),
            hasStress: this.actor.items.some((i) => i.type === "stress"),
            hasAny: !!this.actor.items.size,
            systems,
        });
    }

    async _onRender(context, options) {
        await super._onRender(context, options);
        if (this.tabGroups.setup) this.changeTab(this.tabGroups.setup, "setup", { force: true, updatePosition: false });
    }

    async _onSetupType(target: HTMLElement) {
        if (!this.isEditable) return;
        const section = target.closest(".fatex-sheet-setup__section");
        const entries = Array.from(section?.querySelectorAll<HTMLInputElement>("input:checked[data-document]") ?? []);
        const itemData = entries.map((entry) => {
            const item = JSON.parse(entry.dataset.document!);
            item.system ??= item.data;
            delete item.data;
            return item;
        });
        if (itemData.length) await this.actor.createEmbeddedDocuments("Item", itemData);
    }

    _onToggleType(target: HTMLElement) {
        if (!this.isEditable) return;
        const section = target.closest(".fatex-sheet-setup__section, .fatex-sheet-setup__group");
        const inputs = Array.from(section?.querySelectorAll<HTMLInputElement>("input[type=checkbox]") ?? []);
        const checked = !inputs[0]?.checked;
        inputs.forEach((input) => {
            input.checked = checked;
        });
    }

    async _onClear(type: number) {
        if (!this.isEditable || !Object.values(CLEAR).includes(type)) return;
        if (
            await confirmDeletion(
                game.i18n.localize("FAx.Dialog.ActorClear"),
                game.i18n.localize("FAx.Dialog.ActorClearText"),
            )
        ) {
            await this._doClear(type);
        }
    }

    async _doClear(type: number) {
        if (!this.isEditable || !Object.values(CLEAR).includes(type)) return;
        const items = this.actor.items.filter((item) => type === CLEAR.EVERYTHING || item.type === TYPES[type]);
        await this.actor.deleteEmbeddedDocuments(
            "Item",
            items.map((item) => item.id),
        );
    }
}
