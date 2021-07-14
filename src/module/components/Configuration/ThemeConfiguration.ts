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
        return mergeObject(super.getData(options), CONFIG.FateX.global.defaultStyles);
    }

    async close(options?: FormApplication.CloseOptions): Promise<void> {
        await super.close(options);
    }
}
