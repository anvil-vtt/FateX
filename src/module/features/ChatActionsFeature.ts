// @ts-nocheck
import { FateChatCard } from "../chat/FateChatCard";

export class ChatActionsFeature {
    static hooks() {
        Hooks.on("renderChatLog", (_app, html, _data) => this.chatListeners(html));
        Hooks.on("renderChatPopout", (_app, html, _data) => this.chatListeners(html));

        Hooks.once("init", () => {
            game.socket.on("system.fatex", (data) => {
                if (data.type === "totalChanged") {
                    const { messageId, rollIndex } = data;
                    this.triggerTotalChangedAnimation(messageId, rollIndex, false);
                }

                if (data.type === "reroll") {
                    const { messageId, rollIndex } = data;
                    this.triggerRerollAnimation(messageId, rollIndex, false, true);
                }

                if (data.type === "chatAction") {
                    if (!game.user.isGM) return false;
                    const connectedGMs = game.users.filter((u) => u.isGM && u.active);
                    const isResponsibleGM = !connectedGMs.some((other) => other.id < game.user.id);
                    if (!isResponsibleGM) return;

                    const { action, messageId, rollIndex, shiftKey, userId } = data;
                    this.handleChatAction(action, messageId, rollIndex, shiftKey, userId);
                }
            });
        });
    }

    private static triggerChatAnimation(type, messageId, rollIndex, disable = false) {
        $("#chat-log")
            .find(`.message[data-message-id="${messageId}"]`)
            .find(`.fatex-chat__roll[data-roll-index="${rollIndex}"]`)
            .addClass(`fatex-chat__roll--${type}`);

        if (disable) {
            $("#chat-log").find(`.message[data-message-id="${messageId}"] button[data-action]`).prop("disabled", true);
        }
    }

    static chatListeners(html) {
        $(html).on("click", ".fatex-roll-actions button[data-action]", this._onChatCardAction.bind(this));
    }

    static async _onChatCardAction(event) {
        event.preventDefault();

        const button = event.currentTarget;
        const action = button.dataset.action;
        const messageId = button.closest(".message").dataset.messageId;
        const rollIndex = button.closest(".fatex-chat__roll").dataset.rollIndex;

        if (!game.user.isGM) {
            if (!game.users.filter((u) => u.isGM && u.active).length) {
                return ui.notifications.warn(game.i18n.localize("FAx.ChatCard.NoGMConnected"));
            }

            return game.socket.emit("system.fatex", {
                type: "chatAction",
                action,
                messageId,
                rollIndex,
                shiftKey: event.shiftKey,
                userId: game.user.id,
            });
        }

        return await this.handleChatAction(action, messageId, rollIndex, event.shiftKey);
    }

    static async handleChatAction(action, messageId, rollIndex, shiftKey, userId = game.user.id) {
        const message = game.messages?.get(messageId);

        const chatCardFlag = message?.getFlag("fatex", "chatCard") ?? false;
        if (!chatCardFlag) {
            return;
        }

        const chatCard = new FateChatCard(chatCardFlag);

        if (action === "reroll") {
            this.triggerRerollAnimation(messageId, rollIndex);
            await chatCard.rolls[rollIndex].reroll(userId, { shiftKey });
            await chatCard.updateMessage();
            this.triggerTotalChangedAnimation(messageId, rollIndex);
        }

        if (action === "increase") {
            await chatCard.rolls[rollIndex].increase(userId, { shiftKey });
            await chatCard.updateMessage();
            this.triggerTotalChangedAnimation(messageId, rollIndex);
        }
    }

    static triggerTotalChangedAnimation(messageId: string, rollIndex: string, sync = true, disable = false) {
        this.triggerChatAnimation("totalChanged", messageId, rollIndex, disable);

        if (sync) {
            game.socket.emit("system.fatex", { type: "totalChanged", messageId, rollIndex });
        }
    }

    static triggerRerollAnimation(messageId: string, rollIndex: string, sync = true, disable = true) {
        this.triggerChatAnimation("reroll", messageId, rollIndex, disable, disable);

        if (sync) {
            game.socket.emit("system.fatex", { type: "reroll", messageId, rollIndex });
        }
    }
}
