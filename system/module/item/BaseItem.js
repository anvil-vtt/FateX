export class BaseItem {

    /**
     * Allows each item to prepare its data before its rendered.
     * This can be used to add additional information right before rendering.
     */
    static prepareItemForActorSheet(item) {
        return item;
    }

    /**
     * Allows every item to register its own listeners for rendered actor sheets.
     * Implements base listeners for adding, configuring and deleting embedded items.
     *
     * @param html
     * @param sheet
     */
    static activateActorSheetListeners(html, sheet) {
        if(!this.entityName) {
            throw new Error("A subclass of the BaseItem must provide an entityName field or implement their own _onItemAdd() method.");
        }

        // Default listeners for adding, configuring and deleting embedded items
        html.find(`.fatex__${this.entityName}__add`).click((e) => this._onItemAdd.call(this, e, sheet));
        html.find(`.fatex__${this.entityName}__settings`).click((e) => this._onItemSettings.call(this, e, sheet));
        html.find(`.fatex__${this.entityName}__delete`).click((e) => this._onItemDelete.call(this, e, sheet));
    }

    /**
     * Allows each item to add data to its own sheet.
     */
    static getSheetData(sheetData, sheet) {
        sheetData.skillReferences = this.getSkillReferences(sheet.item);
        sheetData.actorSkills = this.getActorSkills(sheet);

        return sheetData;
    }

    /**
     * Allows each item to add data to its owners actorsheet.
     */
    static getActorSheetData(sheetData) {
        return sheetData;
    }

    /**
     * Helper function to create a new item.
     * Render parameter determines if the items sheet should be rendered.
     */
    static _createNewItem(itemData, sheet, render = true) {
        // Create item and render sheet afterwards
        sheet.actor.createOwnedItem(itemData).then((item) => {
            if(!render) return;

            // We have to reload the item for it to have a sheet
            const createdItem = sheet.actor.getOwnedItem(item._id);
            createdItem.sheet.render(true);
        });
    }

    static activateListeners(html, sheet) {
        html.find('.fatex__skill__reference__create').on('click', (e) => this._onAddReference.call(this, e, sheet));
        html.find('.fatex__skill__reference__remove').on('click', (e) => this._onRemoveReference.call(this, e, sheet));
    }


    /*************************
     * EVENT HANDLER
     *************************/

    static async _onAddReference(e, sheet) {
        e.preventDefault();

        const item = sheet.entity;
        await this.addSkillReference(item);
    }

    static async _onRemoveReference(e, sheet) {
        e.preventDefault();

        const dataset = e.currentTarget.dataset;
        const index = dataset.index;

        const item = sheet.entity;
        await this.removeSkillReference(item, index);
    }

    /**
     * Itemtype agnostic handler for creating new items via event.
     */
    static _onItemAdd(e, sheet) {
        e.preventDefault();
        e.stopPropagation();

        if(!this.entityName) {
            throw new Error("A subclass of the BaseItem must provide an entityName field or implement their own _onItemAdd() method.");
        }

        const itemData = {
            name: this.defaultName ?? this.getDefaultName(),
            type: this.entityName,
        };

        this._createNewItem(itemData, sheet);
    }

    /**
     * Itemtype agnostic handler for opening an items sheet via event.
     */
    static _onItemSettings(e, sheet) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(data.item);

        if(item) {
            item.sheet.render(true);
        }
    }

    /**
     * Itemtype agnostic handler for deleting an item via event.
     */
    static _onItemDelete(e, sheet) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const item = sheet.actor.getOwnedItem(data.item);

        (new Dialog({
            title: `Delete ${item.name}`,
            content: game.i18n.format('FAx.Dialog.EntityDelete'),
            default: 'submit',
            buttons: {
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("FAx.Dialog.Cancel"),
                    callback: () => null
                },
                submit: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("FAx.Dialog.Confirm"),
                    callback: () => {
                        sheet.actor.deleteOwnedItem(data.item);
                    }
                }
            }
        }, {
            classes: ['fatex', 'fatex__dialog'],
        })).render(true);
    }


    /*************************
     * HELPER FUNCTIONS
     *************************/

    /**
     * Helper function to determine a new items name.
     * Defaults to the entityName with the first letter capitalized.
     */
    static getDefaultName() {
        return this.entityName.charAt(0).toUpperCase() + this.entityName.slice(1);
    }


    /**
     * Adds a new skill reference to a given item
     *
     * @param item
     *  The item for the skill reference to be added
     */
    static async addSkillReference(item) {
        const currentReferences = this.getSkillReferences(item);
        const references = duplicate(currentReferences);

        references.push({
            "skill": Math.random(),
            "condition": 0,
            "action": 0,
            "argument": 0
        });

        await item.setFlag('fatex', 'skillReferences', references);
    }

    static async removeSkillReference(item, index) {
        const currentReferences = this.getSkillReferences(item);
        const references = duplicate(currentReferences);

        references.splice(index, 1);

        await item.setFlag('fatex', 'skillReferences', references);
    }

    static getSkillReferences(item) {
        return item.getFlag('fatex', 'skillReferences') || [];
    }

    static getActorSkills(sheet) {
        const actor = duplicate(sheet.actor);
        const items = actor.items;
        const skills = items.filter(item => item.type === 'skill');

        return skills.map((skill) => skill.name);
    }
}
