/**
 * Preload a set of templates to compile and cache them for
 * fast access during rendering
 */
export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
        'systems/fatex/templates/actors/parts/information.html',
        'systems/fatex/templates/actors/parts/artwork.html',
    ];

    return loadTemplates(templatePaths);
};
