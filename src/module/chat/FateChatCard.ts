// @ts-nocheck
import { FateActor } from "../actor/FateActor";
import { FateRoll } from "./FateRoll";
import { FateChatCardDataModel } from "../data/FateChatCardDataModel";

export class FateChatCard extends FateChatCardDataModel {
    static create(actor: FateActor, rolls: FateRoll[], options = {}) {
        const speaker = ChatMessage.getSpeaker({ actor });

        return new FateChatCard({
            speaker,
            rolls,
            options,
        });
    }

    async sendToChat() {
        const content = await this.render();

        const chatData = {
            user: game.user?.id,
            speaker: this.speaker,
            rollMode: game.settings.get("core", "rollMode"),
            content: content,
            flags: {
                fatex: {
                    chatCard: this.toObject(false),
                },
            },
        };

        ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"))
        const message = await ChatMessage.create(chatData);

        this.updateSource({ messageId: message.id });
        await this.updateMessage();
    }

    async updateMessage() {
        const message = this.getMessage();

        if (!message) {
            ui.notifications.warn(game.i18n.localize("FAx.ChatCard.MessageNotFound"));
            return;
        }

        const content = await this.render();
        return await message.update({ content, flags: { fatex: { chatCard: this.toObject(false) } } });
    }

    private getMessage() {
        return game.messages?.get(this.messageId);
    }

    async render() {
        const template = "systems/fatex/templates/chat/chat-card.hbs";
        const rolls = await Promise.all(this.rolls.map((roll) => roll.render()));

        return await foundry.applications.handlebars.renderTemplate(template, { rolls });
    }
}
