/**
 * System specific helpers are registered here.
 */
export class HandlebarsHelpers {
    static registerHelpers() {
        /**
         * Converts an object into a json string
         */
        Handlebars.registerHelper("JSONstringify", function (arg1) {
            return JSON.stringify(arg1);
        });
    }
}
