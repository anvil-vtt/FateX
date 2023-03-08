// @ts-nocheck

import { FateChatCard } from "../chat/FateChatCard";

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

        const button = event.currentTarget;
        const action = button.dataset.action;
        const messageId = button.closest(".message").dataset.messageId;
        const rollIndex = button.closest(".fatex-chat__roll").dataset.rollIndex;
        const message = game.messages?.get(messageId);

        const chatCardFlag = message?.getFlag("fatex", "chatCard") ?? false;
        if (!chatCardFlag) {
            return;
        }

        const chatCard = new FateChatCard(chatCardFlag);

        if (action === "reroll") {
            await chatCard.rolls[rollIndex].reroll();
        }

        if (action === "increase") {
            await chatCard.rolls[rollIndex].increase();
        }

        await chatCard.updateMessage();
    }
}
