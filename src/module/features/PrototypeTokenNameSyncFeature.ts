// @ts-nocheck
export class PrototypeTokenNameSyncFeature {
    static hooks() {
        Hooks.once("init", () => {
            game.settings.register("fatex", "autoUpdateTokenName", {
                name: game.i18n.localize("FAx.Settings.autoUpdateTokenName.Name"),
                hint: game.i18n.localize("FAx.Settings.autoUpdateTokenName.Hint"),
                scope: "world",
                config: true,
                default: true,
                type: Boolean,
            });
        });

        Hooks.on("preUpdateActor", (actor, changes) => {
            if (!game.settings.get("fatex", "autoUpdateTokenName")) return;
            if (!("name" in changes)) return;

            if (!actor.isToken) {
                if (actor.prototypeToken.name !== actor.name) return;
                changes.prototypeToken = { ...changes.prototypeToken, name: changes.name };
            }

            if (actor.isToken) {
                const token = actor.token.parent.tokens.get(actor.token.id);
                if (token.name !== actor.name) return;

                token.update({ name: changes.name });
            }
        });
    }
}
