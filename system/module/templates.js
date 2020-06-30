/**
 * Preload a set of templates to compile and cache them for
 * fast access during rendering
 */
export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
        'systems/fatex/templates/actors/parts/information.html',
        'systems/fatex/templates/actors/parts/artwork.html',
        'systems/fatex/templates/actors/parts/header.html',
        'systems/fatex/templates/actors/parts/footer.html',
        'systems/fatex/templates/actors/parts/skills.html',
        'systems/fatex/templates/actors/parts/stress.html',
    ];

    return loadTemplates(templatePaths);
};
