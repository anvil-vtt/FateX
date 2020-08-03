import { TemplateActorPicker } from "./TemplateActorPicker.js";
import { TemplateActorSettings } from "./TemplateActorSettings.js";

export class TemplateActors {
    static ready() {
        // Initialize instances in config
        CONFIG.FateX.applications.templateSettings = new TemplateActorSettings();
        CONFIG.FateX.applications.templatePicker = new TemplateActorPicker();
    }

    static hooks() {
        // Add extra button to foundrys settings menu
        Hooks.on("renderSidebarTab", (app, html) => {
            if (!(app instanceof Settings) || !game.user.isGM) {
                return;
            }

            const configureButton = html.find('button[data-action="configure"]');

            configureButton.before(`
                <button data-fatex="templates">
                    <i class="fas fa-file-medical"></i> ${game.i18n.localize("FAx.Settings.Templates.Button")}
                </button>
            `);

            html.on('click', 'button[data-fatex="templates"]', () => {
                return CONFIG.FateX.applications.templateSettings.render(true);
            });
        });
    }
}
