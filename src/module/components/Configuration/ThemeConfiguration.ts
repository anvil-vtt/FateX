// @ts-nocheck

export class ThemeConfig extends FormApplication {
    currentStyles: {[key: string]: string | undefined};
    changesSaved: boolean;

    constructor() {
        super();
        this.currentStyles = $(":root").css(CONFIG.FateX.global.customProperties);
        this.changesSaved = false;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Theme Configuration",
            id: "themeConfig",
            template: "/systems/fatex/templates/apps/theme-config.hbs",
            width: 500,
            height: "auto",
            closeOnSubmit: true,
        } as BaseEntitySheet.Options)
    }

    async _updateObject(_: Event, formData: Record<string, unknown> | undefined): Promise<unknown> {
        const componentNames = Object.keys(CONFIG.FateX.global.defaultStyles);

        componentNames.forEach(async componentName => {
            await game.user.setFlag('fatex', componentName, getProperty(formData, componentName))
        })
    }

    activateListeners(html: JQuery<HTMLElement>) {
        super.activateListeners(html);

        html.find(`[type="color"]`).on("change", this.onChange.bind(this));
        html.find(`button[name="reset"]`).on("click", this.reset.bind(this));
        html.find(`button[name="submit"]`).on("click", this.saveChanges.bind(this));
        html.find(`button[name="cancel"]`).on("click", this.close.bind(this));
    }

    getData(options?: Application.RenderOptions): FormApplication.Data<Record<string, unknown>, FormApplication.Options> {
        const customPropertyValues = Object.values($(":root").css(CONFIG.FateX.global.customProperties));
        const componentNames = Object.keys(CONFIG.FateX.global.defaultStyles);

        // Create a new object where the custom property values are assigned to keys
        // matching the component names used in the templates and default styles config.
        const customProperties = Object.assign(
            ...componentNames.map(
                (componentName, i) => ({ [componentName]: customPropertyValues[i] })
            )
        );

        // Filter out any custom properties which are currently undefined.
        const definedCustomProperties = Object.fromEntries(
            Object.entries(customProperties).filter(([_, value]) => value !== undefined)
        );

        // Create a new object where the default styles fill in any values not defined
        // by CSS custom properties.
        const currentValues = mergeObject(
            CONFIG.FateX.global.defaultStyles,
            definedCustomProperties
        );

        return mergeObject(super.getData(options), currentValues);
    }

    onChange(event: JQuery.Event) {
        const newValue = event.currentTarget.value;
        const customProperty = $(event.currentTarget).data("property");

        // Update the custom property associated with the colour selector to the chosen value.
        $(":root").css(`--${customProperty}`, newValue);
    }

    reset() {
        // Loop over the custom properties in the config file and set each of them
        // to "unset". This will cause the fallback values to take effect, which
        // align with the system defaults.
        CONFIG.FateX.global.customProperties.forEach(customProperty => {
            $(":root").css(customProperty, "unset");
        })

        // Rerender the sheet so that the default styles will be applied due to the
        // lack of set custom properties.
        this.render();
    }

    saveChanges(_: JQuery.Event) {
        this.changesSaved = true;
    }

    async close(options?: FormApplication.CloseOptions): Promise<void> {
        if (!this.changesSaved) {
            // Loops over the user's original property values and undoes any changes
            // they've made. Exiting via the save button with prevent this reset.
            for (const [property, value] of Object.entries(this.currentStyles)) {
                $(":root").css(property, value ?? "unset");
            }
        }

        await super.close(options);
    }
}
