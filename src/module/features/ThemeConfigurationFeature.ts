export class ThemeConfigurationFeature {
    static hooks() {
        Hooks.once("ready", () => {
            // Set user defined CSS custom properties
            CONFIG.FateX.global.styles.forEach(({ name, customProperty }) => {
                // Retrieve the value stored in a user flag is there is one.
                const value = game?.user?.getFlag("fatex", name) as string | undefined;
        
                $(":root").css(customProperty, value ?? "unset");
            })
        });
    }
}
