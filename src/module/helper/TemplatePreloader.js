export class TemplatePreloader {

    /**
     * Preload a set of templates to compile and cache them for fast access during rendering
     */
    static async preloadHandlebarsTemplates () {
        const templatePaths = [
            'systems/fatex/templates/actor/parts/header.html',
            'systems/fatex/templates/actor/parts/config.html',
            'systems/fatex/templates/actor/parts/copyright.html',

            'systems/fatex/templates/actor/parts/sidebar/artwork.html',
            'systems/fatex/templates/actor/parts/sidebar/stress.html',

            'systems/fatex/templates/actor/parts/tabloid/messages.html',
            'systems/fatex/templates/actor/parts/tabloid/aspects.html',
            'systems/fatex/templates/actor/parts/tabloid/consequences.html',
            'systems/fatex/templates/actor/parts/tabloid/conditions.html',

            'systems/fatex/templates/actor/parts/tabs/skills.html',
            'systems/fatex/templates/actor/parts/tabs/stunts.html',
            'systems/fatex/templates/actor/parts/tabs/extras.html',
            'systems/fatex/templates/actor/parts/tabs/bio.html',

            'systems/fatex/templates/item/parts/layout/item-header.html',
            'systems/fatex/templates/item/parts/layout/item-footer.html',

            'systems/fatex/templates/item/parts/settings/setting-input.html',
            'systems/fatex/templates/item/parts/settings/setting-text.html',
            'systems/fatex/templates/item/parts/settings/setting-rank.html',
            'systems/fatex/templates/item/parts/settings/setting-editor.html',
            'systems/fatex/templates/item/parts/settings/setting-automation-skill-enable.html',

            'systems/fatex/templates/apps/parts/layout/app-header.html',
            'systems/fatex/templates/apps/parts/layout/app-footer.html',
        ];

        return loadTemplates(templatePaths);
    };
}
