import { ThemeConfig } from "../components/Configuration/ThemeConfiguration";

export class FateXSettings {
    static registerSettings() {
        game.settings.registerMenu("fatex", "theme", {
            name: "Theme Settings",
            label: "Configure Theme",
            hint: "Allows a user to select custom color schemes for the FateX interface.",
            icon: "fas fa-cog",
            type: ThemeConfig,
            restricted: false
        });

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