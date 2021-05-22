export class FateXSettings {
    static registerSettings() {
        game.settings.register("fatex", "enableAlphaFeatures", {
            name: game.i18n.localize("FAx.Settings.System.Alpha.Name"),
            hint: game.i18n.localize("FAx.Settings.System.Alpha.Hint"),
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
        });
    }
}
