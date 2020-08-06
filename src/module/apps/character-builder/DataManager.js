export class DataManager {
    async getAvailableSystems() {
        let lang = game.i18n.lang;
        let response = await fetch(`systems/fatex/data/${lang}/systems.json`);

        // Fallback to english systems
        if (response.status !== 200) {
            lang = "en";
            response = await fetch(`systems/fatex/data/${lang}/systems.json`);
        }

        const availableSystems = await response.json();

        return { lang, availableSystems };
    }

    async getSystems(lang, systems) {
        return Promise.all(Object.keys(systems).map(async (systemName) => this.getSystem(lang, systemName)));
    }

    async getSystem(lang, systemName) {
        const system = await this.fetchSystem(lang, systemName);

        // Add additional fields
        system.name = systemName;

        return Promise.resolve(system);
    }

    async fetchSystem(lang, system) {
        let response = await fetch(`systems/fatex/data/${lang}/systems/${system}.json`);

        return response.status === 200 ? await response.json() : {};
    }
}
