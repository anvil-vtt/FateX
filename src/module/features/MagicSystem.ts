// @ts-nocheck

export class MagicSystem {
    static hooks() {
        Hooks.once("init", () => {
            game.settings.register("fatex", "guildCodexMagicSystemEnabled", {
                name: game.i18n.localize("FAx.Settings.magicSystemEnabled.Name"),
                hint: game.i18n.localize("FAx.Settings.magicSystemEnabled.Hint"),
                scope: "world",
                config: true,
                default: false,
                reload: true,
                type: Boolean,
            });
        });
    }
}
