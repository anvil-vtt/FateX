const CLEAR = {
    EVERYTHING: 0,
    ASPECTS: 1,
    CONSEQUENCES: 2,
    SKILLS: 3,
    STRESS: 4
}

const TYPES = {
    1: "aspect",
    2: "consequence",
    3: "skill",
    4: "stress"
}

export class CharacterBuilder extends FormApplication {
    constructor(object, options) {
        super(object, options);

        this.entity.apps[this.appId] = this;
    }

    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            title: game.i18n.localize("FAx.Apps.Builder.Title"),
            template: "/systems/fatex/templates/apps/character-builder.html",
            resizable: true,
            classes: options.classes.concat([
                'fatex fatex__app_sheet',
            ]),
            width: 600,
            height: 700,
            scrollY: [".desk__content"],
            tabs: [{
                navSelector: ".fatex__vertical_tabs__navigation",
                contentSelector: ".fatex__vertical_tabs__content",
                initial: "core"
            }],
        });

        return options;
    }

    get actor() {
        return this.object;
    }

    getData() {
        return {
            options: this.options,
            isOwnedBy: this.actor ? this.actor.name : false,

            hasAspects: !!this.actor.items.filter(i => i.type === 'aspect').length,
            hasSkills: !!this.actor.items.filter(i => i.type === 'skill').length,
            hasConsequences: !!this.actor.items.filter(i => i.type === 'consequence').length,
            hasStress: !!this.actor.items.filter(i => i.type === 'stress').length,
            hasAny: !!this.actor.items.entries.length,
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.fatex__character_builder--import-core').click((e) => this._onImport.call(this, e, 'core'));
        html.find('.fatex__character_builder--import-condensed').click((e) => this._onImport.call(this, e, 'condensed'));
        html.find('.fatex__character_builder--import-accelerated').click((e) => this._onImport.call(this, e, 'accelerated'));

        html.find('.builder_action--clear').click((e) => this._onClear.call(this, e, CLEAR.EVERYTHING));
        html.find('.builder_action--clear-stress').click((e) => this._onClear.call(this, e, CLEAR.STRESS));
        html.find('.builder_action--clear-skills').click((e) => this._onClear.call(this, e, CLEAR.SKILLS));
        html.find('.builder_action--clear-consequences').click((e) => this._onClear.call(this, e, CLEAR.CONSEQUENCES));
        html.find('.builder_action--clear-aspects').click((e) => this._onClear.call(this, e, CLEAR.ASPECTS));
    }


    /*************************
     * EVENT HANDLER
     *************************/

    async _onImport(event, name) {
        event.preventDefault();

        const pack = game.packs.find(p => p.collection === `fatex.fate-${name}`);
        const packItems = await pack.getContent();

        let itemData = duplicate(packItems);
        itemData.sort((a,b) => a.flags.fatex.importSort - b.flags.fatex.importSort)

        await this.actor.createOwnedItem(itemData);
        this.render(true);
    }

    async _onClear(event, type) {
        event.preventDefault();

        // Return early to not lose items by any chance
        if(type === undefined) {
            return;
        }

        (new Dialog({
            title: game.i18n.localize('FAx.Dialog.ActorClear'),
            content: game.i18n.format('FAx.Dialog.ActorClearText'),
            default: 'cancel',
            buttons: {
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("FAx.Dialog.Cancel"),
                    callback: () => null
                },
                submit: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("FAx.Dialog.Confirm"),
                    callback: async () => {
                        await this._doClear(type);
                    }
                }
            }
        }, {
            classes: ['fatex', 'fatex__dialog'],
        })).render(true);
    }

    async _doClear(type) {
        let items = this.actor.data.items;

        if(type > 0) {
            items = items.filter(i => i.type === TYPES[type]);
        }

        const deletions = items.map(i => i._id);
        await this.actor.deleteOwnedItem(deletions);

        this.render(true);
    }


    async _updateObject() {}
}
