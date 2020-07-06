/**
 * System specific helpers are registered here.
 * Includes mostly if/else helpers like ifnth, ifEquals, ifNotEquals etc.
 */
export class HandlebarsHelpers {
    static registerHelpers() {

        /**
         * If-Helper which checks if every nth-loop was reached using modulo
         */
        Handlebars.registerHelper('ifNth', function (nth, options) {
            const index = options.data.index + 1;

            return (index % nth === 0) ? options.fn(this) : options.inverse(this);
        });

        /**
         * If-Helper which checks if two values are the same
         */
        Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
        });

        /**
         * If-Helper which checks if two values are different
         */
        Handlebars.registerHelper('ifNotEquals', function (arg1, arg2, options) {
            return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
        });

        /**
         * If-Helper which checks if a given value is not an empty string
         */
        Handlebars.registerHelper('ifNotEmpty', function (arg1, options) {
            return (arg1 !== "") ? options.fn(this) : options.inverse(this);
        });

    }
}
