/**
 * Preload a set of templates to compile and cache them for
 * fast access during rendering
 */
export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
        'systems/fatex/templates/actors/parts/sidebar/artwork.html',
        'systems/fatex/templates/actors/parts/sidebar/stress.html',
        'systems/fatex/templates/actors/parts/tabs/skills.html',
        'systems/fatex/templates/actors/parts/tabs/stunts.html',
        'systems/fatex/templates/actors/parts/tabloid/aspects.html',
        'systems/fatex/templates/actors/parts/tabloid/consequences.html',
        'systems/fatex/templates/actors/parts/tabloid/conditions.html',
        'systems/fatex/templates/actors/parts/header.html',
        'systems/fatex/templates/actors/parts/footer.html',
    ];

    return loadTemplates(templatePaths);
};
