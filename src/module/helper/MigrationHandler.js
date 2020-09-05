export class MigrationHandler {
    static hooks() {
        Hooks.once("init", async () => {
            game.settings.register("fatex", "systemMigrationVersion", {
                name: "System migration version",
                scope: "world",
                config: false,
                type: String,
                default: "0.0.0",
            });
        });
    }

    static checkMigrationStatus() {
        if (!game.user.isGM) return;

        const currentMigrationVersion = game.settings.get("fatex", "systemMigrationVersion");

        // Set current version after all migrations ran
        game.settings.get("fatex", "systemMigrationVersion", game.system.data.version);
    }
}
