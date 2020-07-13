import { TemplateActorPicker } from "./TemplateActorPicker.js";
import { TemplateActorSettings } from "./TemplateActorSettings.js";

export class TemplateActors {
    static init() {
        // Initialize instances in config
        CONFIG.FATEx.applications.templateSettings = new TemplateActorSettings();
        CONFIG.FATEx.applications.templatePicker = new TemplateActorPicker();
    }

    static hooks() {
        // Add extra button to foundrys settings menu
        Hooks.on("renderSidebarTab", (app, html, data) => {
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
                return CONFIG.FATEx.applications.templateSettings.render(true);
            });
        });
    }
}
