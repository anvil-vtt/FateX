import { SkillItem } from "../item/skill/SkillItem";
import { FateChatCardModel, FateRoll } from "../data/FateRollDataModel";

export class ChatActionsFeature {
    static hooks() {
        Hooks.on("renderChatLog", (_app, html, _data) => this.chatListeners(html));
        Hooks.on("renderChatPopout", (_app, html, _data) => this.chatListeners(html));
    }

    static chatListeners(html) {
        html.on("click", ".fatex-roll-actions button[data-action]", this._onChatCardAction.bind(this));
    }

    static async _onChatCardAction(event) {
        event.preventDefault();

        // Extract card data
        const button = event.currentTarget;
        button.disabled = true;
        const messageId = button.closest(".message").dataset.messageId;
        const message = game.messages?.get(messageId);
        // const action = button.dataset.action;

        if (!message) {
            return;
        }

        const roll = new Roll(`4dF`).roll({ async: false });
        const content = await SkillItem.renderSkillMessage(null, 4, roll);

        //-----------------

        const dataFromFlag = message.getFlag("fatex", "cardData") ?? false;
        console.log("dataFromFlag", dataFromFlag);

        let data;

        if (dataFromFlag) {
            // @ts-ignore
            data = new FateChatCardModel(dataFromFlag);
            console.log("existing data", data);
            data.rolls[0].test2 = foundry.utils.randomID();

            const newRoll = FateRoll.create("4dF");

            data.rolls.push(newRoll);
        } else {
            // @ts-ignore
            data = new FateChatCardModel({
                rolls: [{ test2: foundry.utils.randomID() }],
            });
            console.log("new data", data);
        }

        console.log("setFlagData", data.toObject(false));
        // @ts-ignore
        message.setFlag("fatex", "cardData", data.toObject(false));

        message.update({ content });
    }

    static async _getChatCardActor(card) {
        // Case 1 - a synthetic actor from a Token
        if (card.dataset.tokenId) {
            const token = await fromUuid(card.dataset.tokenId);
            if (!token) return null;

            // @ts-ignore
            return token.actor;
        }

        // Case 2 - use Actor ID directory
        const actorId = card.dataset.actorId;
        return game.actors?.get(actorId) || null;
    }
}
