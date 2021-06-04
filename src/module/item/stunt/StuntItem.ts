import { BaseItem } from "../BaseItem";
import * as marked from "marked";

export class StuntItem extends BaseItem {
    static entityName = "stunt";

    static getActorSheetData(sheetData) {
        if (CONFIG.FateX.global.useMarkdown) {
            for (const stunt of sheetData.stunts) {
                stunt.data.markdown = marked(stunt.data.description);
            }
        }

        return sheetData;
    }

    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        html.find(".fatex__stunt > .fatex__headline").off().click((e) => {
            if ($(e.target).is(".fatex__stunt__collapse--toggle")) {
                e.preventDefault();
                return;
            }

            this._onActiveStunt.call(this, e, sheet);
        });

        html.find(".fatex__item__collapse").click((e) => this._onCollapseToggle.call(this, e, sheet));
    }

    /*************************
     * EVENT HANDLER
     *************************/

    static async _onCollapseToggle(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const item = sheet.actor.items.get(dataset.item);

        if (item) {
            await item.update(
                {
                    "data.collapsed": !item.data.data.collapsed,
                },
                {}
            );
        }
    }

    static async _onActiveStunt(e, sheet) {
        e.preventDefault();

        if (this.isEditMode(e)) {
            return;
        }

        const dataset = e.currentTarget.dataset;
        const stunt = sheet.actor.items.get(dataset.itemId);

        if (stunt) {
            await this.activateStunt(sheet, stunt);
        }
    }

    static async activateStunt(sheet, item) {
        const stunt = this.prepareItemData(duplicate(item.data), item);
        const template = "systems/fatex/templates/chat/display-stunt.hbs";
        const actor = sheet.actor;

        const chatData = {
            user: game.user?.id,
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            sound: CONFIG.sounds.notification,
            content: await renderTemplate(template, { stunt }),

            flags: {
                templateVariables: { stunt },
            },
        };

        await ChatMessage.create(chatData);
    }
}
