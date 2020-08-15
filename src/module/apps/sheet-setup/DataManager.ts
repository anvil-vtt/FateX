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

    async getSystems() {
        const { lang, availableSystems } = await this.getAvailableSystems();

        return Promise.all(availableSystems.map(async (systemName) => await this.fetchSystemByName(lang, systemName)));
    }

    async fetchSystemByName(lang, systemName) {
        const response = await fetch(`systems/fatex/data/${lang}/systems/${systemName}.json`);
        return response.status === 200 ? await response.json() : {};
    }
}
