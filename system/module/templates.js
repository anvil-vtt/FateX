/**
 * Preload a set of templates to compile and cache them for
 * fast access during rendering
 */
export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
        'systems/fate_extended/templates/parts/general_information.html',
    ];

    return loadTemplates(templatePaths);
};
