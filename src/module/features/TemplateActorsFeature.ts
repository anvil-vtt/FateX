import { TemplateActorPicker } from "../applications/template-actors/TemplateActorPicker";
import { TemplateActorSettings } from "../applications/template-actors/TemplateActorSettings";
import { ApplicationV2 } from "../applications/ApplicationV2";

/**
 * Foundry creates a new instance for each settings menu click.
 * This proxy opens the shared settings window instead, so it is refreshed together with the picker.
 */
class TemplateActorSettingsMenu extends ApplicationV2 {
    async render() {
        return CONFIG.FateX.applications.templateSettings?.render({ force: true });
    }
}

export class TemplateActorsFeature {
    static hooks() {
        Hooks.once("init", () => {
            game.settings.registerMenu("fatex", "templates", {
                name: "FAx.Settings.Templates.Title",
                label: "FAx.Settings.Templates.Button",
                hint: "FAx.Settings.Templates.Hint",
                icon: "fas fa-file-medical",
                type: TemplateActorSettingsMenu as any,
                restricted: true,
            });
        });

        Hooks.once("ready", async () => {
            // Initialize instances in config
            CONFIG.FateX.applications.templateSettings = new TemplateActorSettings();
            CONFIG.FateX.applications.templatePicker = new TemplateActorPicker();
        });
    }
}
