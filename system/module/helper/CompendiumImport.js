export class CompendiumImport {

    async static importCompendium(name) {
        const pack = game.packs.find(p => p.collection === `fatex.fate-${name}`);
        const response = await fetch("systems/fatex/packs/raw/" + name + ".json");
        const content = await response.json();
        const packItems = await pack.getContent();

        // Delete all current compendium entires
        for (let item of packItems) {
            pack.deleteEntity(item.id);
        }

        // Create temporary items from JSON
        let newItems = await Item.create(content, {temporary: true});

        // Make sure items are iteratable
        newItems = newItems instanceof Array ? newItems : [newItems];

        // Helper for later importing items in the right order
        let importSortIndex = 0;

        for (let item of newItems) {
            // Add importSort Flag
            i.data.flags = {fatex: {importSort: importSortIndex}};

            // Import into compendium
            await pack.importEntity(i);

            // Increment sorting index
            importSortIndex++;
        }
    }

}
