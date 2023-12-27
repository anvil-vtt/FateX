import { BaseItem } from "../BaseItem";
import { marked } from "marked";

export class StuntItem extends BaseItem {
    static documentName = "stunt";

    static getActorSheetData(sheetData) {
        if (CONFIG.FateX.global.useMarkdown) {
            for (const stunt of sheetData.stunts) {
                stunt.system.markdown = marked(stunt.data.description);
            }
        }

        for (const stunt of sheetData.stunts) {
            // @ts-ignore
            stunt.system.description = TextEditor.enrichHTML(stunt.system.description, { async: false });
        }

        return sheetData;
    }

    static getSheetData(sheetData) {
        // @ts-ignore
        sheetData.enrichedDescription = TextEditor.enrichHTML(sheetData.system.description, { async: false });
    }

    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        html.find(".fatex-js-item-collapse").click((e) => this._onCollapseToggle.call(this, e, sheet));
        //For some reason this event bindes twice. So .unbind is a workaround.
        html.find(".fatex-js-send-to-chat").unbind().click((e) => this._send2chat.call(this, e, sheet));
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
                    "system.collapsed": !item.system.collapsed,
                },
                {},
            );
        }
    }

    static async _send2chat(e, sheet) : Promise<any> {
        e.preventDefault();
        e.stopPropagation();

        const stunt = sheet.actor.items.get(e.currentTarget.dataset.item);
        const content = await renderTemplate("systems/fatex/templates/chat/stunt.hbs", {stunt});
        
        const chatData = {
            speaker: {"actor" : sheet.actor._id},
            type: CONST.CHAT_MESSAGE_TYPES.IC,
            content: content
        };
        
        return await ChatMessage.create(chatData);
    }
}
