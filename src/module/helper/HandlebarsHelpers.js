/**
 * System specific helpers are registered here.
 * Includes mostly if/else helpers like ifnth, ifEquals, ifNotEquals etc.
 */
export class HandlebarsHelpers {
    static registerHelpers() {
        /**
         * Converts an object into a json string
         */
        Handlebars.registerHelper("stringify", function (arg1) {
            return JSON.stringify(arg1);
        });

        /**
         * If-Helper which checks if every nth-loop was reached using modulo
         */
        Handlebars.registerHelper("ifNth", function (nth, options) {
            const index = options.data.index + 1;

            return index % nth === 0 ? options.fn(this) : options.inverse(this);
        });

        /**
         * If-Helper which checks if two values are the same
         */
        Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
            return arg1 === arg2 ? options.fn(this) : options.inverse(this);
        });

        /**
         * If-Helper which checks if a number value is bigger than zero
         */
        Handlebars.registerHelper("ifBiggerNull", function (arg1, options) {
            return parseInt(arg1) > 0 ? options.fn(this) : options.inverse(this);
        });

        /**
         * If-Helper which checks if two values are different
         */
        Handlebars.registerHelper("ifNotEquals", function (arg1, arg2, options) {
            return arg1 !== arg2 ? options.fn(this) : options.inverse(this);
        });

        /**
         * If-Helper which checks if a given value is not an empty string
         */
        Handlebars.registerHelper("ifNotEmpty", function (arg1, options) {
            return arg1 !== "" ? options.fn(this) : options.inverse(this);
        });

        /**
         * Checks if the length of an array is of a certain number
         */
        Handlebars.registerHelper("checkLength", function (arg1, arg2, options) {
            return arg1.length >= Number(arg2) ? options.fn(this) : options.inverse(this);
        });

        /**
         * Helper which prints an argument or a default if it the argument is an empty string
         */
        Handlebars.registerHelper("default", function (value, defaultValue) {
            if (!value || value === "") {
                return new Handlebars.SafeString(defaultValue);
            }

            return value;
        });
    }
}
