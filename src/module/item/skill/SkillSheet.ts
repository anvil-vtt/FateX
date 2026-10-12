import { ItemSheetFate } from "../ItemSheetFate";

export class SkillSheet extends ItemSheetFate {
    async _prepareContext(options) {
        const data = await super._prepareContext(options);
        data.magicSystemEnabled = game.settings.get("fatex", "guildCodexMagicSystemEnabled");

        return data;
    }
}
