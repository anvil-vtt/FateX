// @ts-nocheck

import { FateChatCard } from "../chat/FateChatCard";

export class ChatActionsFeature {
    static hooks() {
        Hooks.on("renderChatLog", (_app, html, _data) => this.chatListeners(html));
        Hooks.on("renderChatPopout", (_app, html, _data) => this.chatListeners(html));

        Hooks.once("init", async () => {
            game.socket.on("system.fatex", (data) => {
                if (data.type === "rollInrease") {
                    const { messageId, rollIndex } = data;
                    this.triggerChatAnimation("increased", messageId, rollIndex);
                }
            });
        });
    }

    private static triggerChatAnimation(type, messageId, rollIndex) {
        $("#chat-log")
            .find(`.message[data-message-id="${messageId}"]`)
            .find(`.fatex-chat__roll[data-roll-index="${rollIndex}"]`)
            .addClass(`fatex-chat__roll--${type}`);
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
            await chatCard.updateMessage();
        }

        if (action === "increase") {
            await chatCard.rolls[rollIndex].increase();
            await chatCard.updateMessage();

            this.triggerChatAnimation("increased", messageId, rollIndex);
            await SocketInterface.dispatch("system.fatex", { type: "rollInrease", messageId, rollIndex });
        }
    }
}
