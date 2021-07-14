// @ts-nocheck

export class ThemeConfig extends FormApplication {
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

    async _updateObject(event, formData) {
        return;
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
        )

        // Create a new object where the default styles fill in any values not defined
        // by CSS custom properties.
        const currentValues = mergeObject(
            CONFIG.FateX.global.defaultStyles,
            definedCustomProperties
        );

        return mergeObject(super.getData(options), currentValues);
    }

    async close(options?: FormApplication.CloseOptions): Promise<void> {
        await super.close(options);
    }
}
