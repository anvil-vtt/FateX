import { ItemSheetFate } from "../ItemSheetFate";

export class SkillSheet extends ItemSheetFate {
    async getData(): Promise<any> {
        const data = await super.getData();
        const magicSystem = game.settings.get("fatex", "guildCodexMagicSystemEnabled");
        data.magicSystemEnabled = magicSystem

        return data;
    }
}
