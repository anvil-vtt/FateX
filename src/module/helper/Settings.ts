export class FateXSettings {
    static registerSettings() {
        game.settings.register("fatex", "enableAlphaFeatures", {
            name: "Enable alpha features",
            hint: "This setting enables FateX alpha features. Alpha features are subject to change.",
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
        });
    }
}
