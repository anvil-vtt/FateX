// @ts-nocheck
export class MagicDie extends foundry.dice.terms.FateDie {
    static DENOMINATION = "m";

    roll({ minimize = false, maximize = false } = {}) {
        const roll = { result: undefined, active: true };
        if (minimize) roll.result = -1;
        else if (maximize) roll.result = 1;
        else roll.result = Math.ceil(CONFIG.Dice.randomUniform() * this.faces - 2);
        if (roll.result === -1) roll.failure = true;
        if (roll.result === 1) roll.success = true;
        roll.count = roll.result === 1 ? 2 : roll.result;
        this.results.push(roll);
        return roll;
    }
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

            if (game.settings.get("fatex", "guildCodexMagicSystemEnabled")) {
                CONFIG.Dice.terms["m"] = MagicDie;
            }
        });

        Hooks.once("diceSoNiceReady", (dice3d) => {
            if (!game.settings.get("fatex", "guildCodexMagicSystemEnabled")) return;

            dice3d.addDicePreset(
                {
                    type: "dm",
                    labels: ["−", " ", "+", "−", " ", "+"],
                    values: { min: -1, max: 1 },
                    fontScale: 2,
                    system: "standard",
                },
                "d6",
            );
        });
    }
}
