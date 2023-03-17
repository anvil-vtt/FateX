// @ts-nocheck
export class MagicDie extends FateDie {
    static DENOMINATION = "m";
}

export class MagicSystem {
    static hooks() {
        Hooks.once("init", () => {
            game.settings.register("fatex", "guildCodexMagicSystemEnabled", {
                name: game.i18n.localize("FAx.Settings.magicSystemEnabled.Name"),
                hint: game.i18n.localize("FAx.Settings.magicSystemEnabled.Hint"),
                scope: "world",
                config: true,
                default: false,
                requiresReload: true,
                type: Boolean,
            });

            CONFIG.Dice.terms["m"] = MagicDie;

            FateDie.MODIFIERS["e"] = function magicModifier(_modifier) {
                this.results = this.results.map((result) => ({
                    ...result,
                    count: result.result === 1 ? 2 : result.result,
                }));
            };
        });

        Hooks.once("diceSoNiceReady", (dice3d) => {
            if (!game.settings.get("fatex", "guildCodexMagicSystemEnabled")) return;

            dice3d.addDicePreset(
                {
                    type: "dm",
                    labels: ["−", " ", "+"],
                    values: { min: -1, max: 1 },
                    fontScale: 2,
                    system: "standard",
                },
                "d6"
            );
        });
    }
}
