// @ts-nocheck

import { FateChatCardModel, FateRollDataModel, FateRollHistoryDataModel } from "../data/FateRollDataModel";
import { FateActor } from "../actor/FateActor";
import { SkillItemData } from "../item/ItemTypes";

export class FateRoll extends FateRollDataModel {
    static createFromSkill(skill: SkillItemData, { magic = false } = {}) {
        const options = { magic };

        return new FateRoll({
            _id: foundry.utils.randomID(),
            name: skill.name,
            rank: skill.system.rank,
            options,
        });
    }

    async roll(_options = {}) {
        const roll = new Roll(`4dF${this.options.magic && "m"}`).roll({ async: false });
        this.updateSource({ faces: roll.terms[0].results.map((r) => r.result) });

        if (game.modules.get("dice-so-nice")?.active) {
            await game.dice3d.showForRoll(roll, game.user, true);
        }

        return this;
    }

    async reroll(_options = {}) {
        await this.roll();

        const history = foundry.utils.deepClone(this.history);
        history.push({ type: "reroll" });

        this.updateSource({ history: history });

        return this;
    }

    increase(_options = {}) {
        const history = foundry.utils.deepClone(this.history);
        history.push({ type: "increase" });

        this.updateSource({ bonus: this.bonus + 2, history: history });

        return this;
    }

    get total() {
        return this.faces.reduce((a, b) => a + b, 0) + this.rank + this.bonus;
    }

    get ladder() {
        const total = Math.clamped(this.total, -4, 8);
        const totalString = (total < 0 ? "-" : "+").concat(Math.abs(total).toString());

        return game.i18n.localize(`FAx.Global.Ladder.${totalString}`);
    }

    get totalString() {
        return (this.total < 0 ? "-" : "+").concat(Math.abs(this.total).toString());
    }

    get symbols() {
        return this.faces.map((f) => (f > 0 ? "+" : f < 0 ? "-" : "0"));
    }

    get rankStatus() {
        return this.rank >= 0 ? "positive" : "negative";
    }

    async render(_options = {}) {
        const template = "systems/fatex/templates/chat/roll.hbs";

        return await renderTemplate(template, this);
    }
}

export class FateRollHistory extends FateRollHistoryDataModel {}

export class FateChatCard extends FateChatCardModel {
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
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            rollMode: game.settings.get("core", "rollMode"),
            content: content,
            flags: {
                fatex: {
                    chatCard: this.toObject(false),
                },
            },
        };

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

        return await renderTemplate(template, { rolls });
    }
}
