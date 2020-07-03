export class HandlebarsHelpers {
    static registerHelpers() {

        Handlebars.registerHelper('ifnth', function(options) {
            let index = options.data.index + 1,
                nth = options.hash.nth;

            if (index % nth === 0)
                return options.fn(this);
            else
                return options.inverse(this);
        });

    }
}
