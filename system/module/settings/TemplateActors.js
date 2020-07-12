import { TemplateActorSettings } from "./TemplateActorSettings.js";

export class TemplateActors {
    static init() {
        // Register FATEx system settings
        game.settings.registerMenu("fatex", "templateActors", {
            name: game.i18n.localize("FAx.Settings.Templates.Title"),
            hint: game.i18n.localize("FAx.Settings.Templates.Hint"),
            label: game.i18n.localize("FAx.Settings.Templates.Button"),
            scope: "world",
            config: true,
            type: TemplateActorSettings,
            restricted: true
        });
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
                const app = new TemplateActorSettings();
                return app.render(true);
            });

        });
    }
}
