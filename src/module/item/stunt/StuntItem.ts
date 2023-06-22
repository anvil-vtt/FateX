import { BaseItem } from "../BaseItem";
import { marked } from "marked";

export class StuntItem extends BaseItem {
    static documentName = "stunt";

    static getActorSheetData(sheetData) {
        if (CONFIG.FateX.global.useMarkdown) {
            for (const stunt of sheetData.stunts) {
                stunt.data.markdown = marked(stunt.data.description);
            }
        }

        for (const stunt of sheetData.stunts) {
            stunt.system.description = TextEditor.enrichHTML(stunt.system.description, {});
        }

        return sheetData;
    }

    static activateActorSheetListeners(html, sheet) {
        super.activateActorSheetListeners(html, sheet);

        html.find(".fatex-js-item-collapse").click((e) => this._onCollapseToggle.call(this, e, sheet));
        //For some reason this event bindes twice. So .unbind is a workaround.
        html.find(".fatex-js-stunt-chat").unbind().click((e) => this._stunt2chat.call(this, e, sheet));
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
                    "data.collapsed": !item.system.collapsed,
                },
                {}
            );
        }
    }

    static async _stunt2chat(e, sheet){
        e.preventDefault();
        e.stopPropagation();
        const stunt = sheet.actor.items.get(e.currentTarget.dataset.item);

        const content = `<h3>${stunt.name}</h3><br>
                <strong>${stunt.system.shortDescription}</strong><br>
                ${stunt.system.description}`;

        const chatData = {
            speaker: {"actor" : sheet.actor._id},
            type: CONST.CHAT_MESSAGE_TYPES.IC,
            content: content
        };
        await ChatMessage.create(chatData);
    }
}
