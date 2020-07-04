export class HandlebarsHelpers {
    static registerHelpers() {

        /**
         * If-Helper which checks if every nth-loop was reached using modulo
         */
        Handlebars.registerHelper('ifnth', function(options) {
            let index = options.data.index + 1,
                nth = options.hash.nth;

            if (index % nth === 0)
                return options.fn(this);
            else
                return options.inverse(this);
        });

        /**
         * Checks if two values are the same
         */
        Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
        });
    }
}
