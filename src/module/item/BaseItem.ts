import { FateItem } from "./FateItem";

export abstract class BaseItem {
    static documentName = "";

    /**
     * Allows each item to prepare its data before its rendered.
     * This can be used to add additional information right before rendering.
     */
    static prepareItemData(itemData, _itemDocument) {
        return itemData;
    }

    /**
     * Allows every item to register its own listeners for rendered actor sheets.
     * Implements base listeners for adding, configuring and deleting embedded items.
     */
    static activateActorSheetListeners(html, sheet) {
        if (!this.documentName) {
            throw new Error("A subclass of the BaseItem must provide an documentName field or implement their own _onItemAdd() method.");
        }

        html.find(`.fatex-js-${this.documentName}-add`).click((e) => this._onItemAdd.call(this, e, sheet));
        html.find(`.fatex-js-${this.documentName}-settings`).click((e) => this._onItemSettings.call(this, e, sheet));
        html.find(`.fatex-js-${this.documentName}-delete`).click((e) => this._onItemDelete.call(this, e, sheet));
    }

    /**
     * Allows each item to add data to its own sheet.
     */
    static async getSheetData(sheetData, _item) {
        return sheetData;
    }

    /**
     * Allows each item to add data to its owners actorsheet.
     */
    static async getActorSheetData(sheetData, _actor) {
        return sheetData;
    }

    /**
     * Allows each item to add listeners to its sheet
     */
    static activateListeners(_html, _item) {
        // Do nothing by default
    }

    /*************************
     * EVENT HANDLER
     *************************/

    /**
     * Itemtype agnostic handler for creating new items via event.
     */
    static async _onItemAdd(e, sheet) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.documentName) {
            throw new Error("A subclass of the BaseItem must provide an documentName field or implement their own _onItemAdd() method.");
        }

        const itemData = {
            name: this.defaultName,
            type: this.documentName,
            sort: 9000000,
        };

        await this.createNewItem(itemData, sheet);
    }

    /**
     * Itemtype agnostic handler for opening an items sheet via event.
     */
    static _onItemSettings(e, sheet) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        sheet.actor.items.map((item) => {
            console.log("SHEET ITEMS" + item)
        })
        const item = sheet.actor.items.get(data.item);

        if (item) {
            item.sheet.render(true);
        }
    }

    /**
     * Itemtype agnostic handler for deleting an item via event.
     */
    static _onItemDelete(e, sheet) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const item = sheet.actor.items.get(data.item);

        new Dialog(
            {
                title: `${game.i18n.localize("FAx.Dialog.DocumentDelete")} ${item.name}`,
                content: game.i18n.localize("FAx.Dialog.DocumentDeleteText"),
                default: "submit",
                buttons: {
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: game.i18n.localize("FAx.Dialog.Cancel"),
                        callback: () => null,
                    },
                    submit: {
                        icon: '<i class="fas fa-check"></i>',
                        label: game.i18n.localize("FAx.Dialog.Confirm"),
                        callback: async () => {
                            item.delete();
                        },
                    },
                },
            },
            {
                classes: ["fatex", "fatex-dialog"],
            }
        ).render(true);
    }

    /**
     * Handler to send an object to chat.
     * @protected
     */
    static _onItemSendToChat(e, sheet) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const item = sheet.actor.items.get(data.item);

        if (item) {
            this.sendToChat(item);
        }
    }

    /*************************
     * HELPER FUNCTIONS
     *************************/

    /**
     * Helper function to create a new item.
     * renderSheet parameter determines if the items' sheet should be rendered.
     */
    static async createNewItem(itemData, sheet: ActorSheet, renderSheet = true) {
        // Create item and render sheet afterwards
        await sheet.actor.createEmbeddedDocuments("Item", [itemData], { renderSheet: renderSheet });
    }

    /**
     * Helper function to determine a new items name.
     * Defaults to the documentName with the first letter capitalized.
     */
    static get defaultName() {
        return this.documentName.charAt(0).toUpperCase() + this.documentName.slice(1);
    }

    protected static isEditMode(e): boolean {
        const element = jQuery(e.currentTarget);

        return !!element.closest(".fatex-js-edit-mode").length;
    }
/**
 * Create a card in the chat for a given object.
 * @param {FateItem} item The item to display.
 * @private
 */
static async sendToChat(item: FateItem) {
    if (!item.actor) {
        ui.notifications.warn("Impossible to send a non-owned item to chat.");
        return;
    }

    const itemAsAny = item as any;

    let nameSource = "";
    let descriptionSource = "";

    if (item.type === 'aspect') {
        nameSource = itemAsAny.system.label || "Aspect";
        descriptionSource = itemAsAny.system.value || "";
    } else {
        nameSource = item.name ?? "Unnamed Item";
        descriptionSource = itemAsAny.system.description || "";
    }


    // @ts-ignore
    const enrichedName = await TextEditor.enrichHTML(nameSource, { async: true });
    // @ts-ignore
    const enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(descriptionSource, { async: true });

    const templateData = {
        item: {
            name: enrichedName,
            img: item.img,
            system: {
                enrichedDescription: enrichedDescription
            }
        },
        speaker: ChatMessage.getSpeaker({ actor: item.actor ?? undefined }),
    };

    // @ts-ignore
    const content = await foundry.applications.handlebars.renderTemplate("systems/fatex/templates/chat/item-card.hbs", templateData);

    await ChatMessage.create({
        speaker: templateData.speaker,
        content: content,
        user: game.user?.id,
    });
}
}