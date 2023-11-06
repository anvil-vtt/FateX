export class Roll2d6Feature {
    static hooks() {
        Hooks.once("init", () => {
            game.settings.register("fatex", "enable2d6RollMode", {
                name: game.i18n.localize("FAx.Settings.enable2d6RollMode.Name"),
                hint: game.i18n.localize("FAx.Settings.enable2d6RollMode.Hint"),
                scope: "world",
                config: true,
                default: false,
                type: Boolean,
            });
        });
    }
}
