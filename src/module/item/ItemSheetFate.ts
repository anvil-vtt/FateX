import { enrichHTML, FateSheetMixin, ItemSheetV2 } from "../applications/ApplicationV2";

export class ItemSheetFate extends FateSheetMixin(ItemSheetV2) {
    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["fatex", "fatex-sheet", "fatex-sheet--item"],
        position: { width: 575, height: 650 },
        window: { resizable: true },
        form: { submitOnChange: true, closeOnSubmit: false },
    };

    static PARTS = { sheet: { template: "", scrollable: [".fatex-desk__content"] } };

    _configureRenderParts(options) {
        const parts = super._configureRenderParts(options);
        parts.sheet.template = `systems/fatex/templates/item/${this.item.type}-sheet.hbs`;
        return parts;
    }

    async _prepareContext(options) {
        let data = await super._prepareContext(options);
        Object.assign(data, {
            item: this.item.toObject(false),
            system: foundry.utils.deepClone(this.item.system),
            isOwnedBy: this.actor?.name ?? false,
            enrichedDescription: await enrichHTML(this.item.system.description, this.item),
        });
        data = (await CONFIG.FateX.itemClasses[this.item.type]?.getSheetData(data, this)) ?? data;
        for (const component of Object.values(CONFIG.FateX.sheetComponents.item)) {
            data = await component.getSheetData(data, this);
        }
        return data;
    }

    async _onRender(context, options) {
        await super._onRender(context, options);
        if (!this.isEditable) return;
        const html = $(this.element);
        for (const component of Object.values(CONFIG.FateX.sheetComponents.item))
            component.activateListeners(html, this);
        CONFIG.FateX.itemClasses[this.item.type]?.activateListeners(html, this);
    }
}
