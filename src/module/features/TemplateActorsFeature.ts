import { TemplateActorPicker } from "../applications/template-actors/TemplateActorPicker";
import { TemplateActorSettings } from "../applications/template-actors/TemplateActorSettings";

export class TemplateActorsFeature {
    static hooks() {
        Hooks.once("ready", async () => {
            // Initialize instances in config
            CONFIG.FateX.applications.templateSettings = new TemplateActorSettings({});
            CONFIG.FateX.applications.templatePicker = new TemplateActorPicker({});
        });

        // Add extra button to foundrys settings menu
        Hooks.on("renderSidebarTab", (app, html) => {
            console.log("DEREK: renderSidebarTab " + html);
            const $html = $(html);
            if (!(app instanceof Settings) || !game.user?.isGM) {
                return;
            }

            const configureButton = $html.find('button[data-action="configure"]');

            configureButton.before(`
                <button data-fatex="templates">
                    <i class="fas fa-file-medical"></i> ${game.i18n.localize("FAx.Settings.Templates.Button")}
                </button>
            `);

            $html.on("click", 'button[data-fatex="templates"]', () => {
                return CONFIG.FateX.applications.templateSettings?.render(true);
            });
        });
    }
}
