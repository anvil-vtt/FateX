import "../../../system/templates/**/*.hbs";
import { applications } from "../applications/ApplicationV2";

export class TemplatePreloader {
    /**
     * Preload a set of templates to compile and cache them for fast access during rendering
     */
    static async preloadHandlebarsTemplates() {
        const templatePaths = ["__ALL_TEMPLATES__"];

        return applications.handlebars.loadTemplates(templatePaths);
    }
}
