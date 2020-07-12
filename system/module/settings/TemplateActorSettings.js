import { TemplateActorPicker } from "./TemplateActorPicker.js";

export class TemplateActorSettings extends FormApplication {

    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            title: game.i18n.localize("FAx.Settings.Templates.Title"),
            template: "/systems/fatex/templates/settings/template-actors.html",
            id: 'template-actors',
            resizable: true,
            classes: options.classes.concat([
                'fatex fatex__settings_sheet',
            ]),
            height: 400,
            width: 600,
        });

        return options;
    }

    getData(options = {}) {
        let filteredActors = game.actors.filter(actor => actor.isTemplateActor);

        return {
            options: this.options,
            templateActors: duplicate(filteredActors)
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.fatex__template__create').click((e) => this._createTemplate.call(this, e));
        html.find('.fatex__template__delete').click((e) => this._deleteTemplate.call(this, e));
        html.find('.fatex__template__configure').click((e) => this._configureTemplate.call(this, e));
    }

    async _configureTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const template = game.actors.get(data.template);

        if(!template) {
            return;
        }

        template.sheet.render(true);
    }

    async _deleteTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const template = game.actors.get(data.template);

        if(!template) {
            return;
        }

        (new Dialog({
            title: `Delete ${template.name}`,
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
                    callback: async () => {
                        await template.delete();
                        this.render(true);

                        // Update picker if its open
                        // TODO: Only open if already there
                        /*let picker = new TemplateActorPicker();
                        picker.render(true);*/
                    }
                }
            }
        }, {
            classes: ['fatex', 'fatex__dialog'],
        })).render(true);
    }

    async _createTemplate(e) {
        e.preventDefault();

        const createData = {
            name: game.i18n.localize('FAx.Settings.Templates.New'),
            type: 'character',
            flags: {
                fatex: {
                    isTemplateActor: true
                }
            }
        };

        await Actor.create(createData, {renderSheet: false});
        this.render(true);

        // Update picker if its open
        // TODO: Only open if already there
        /*let picker = new TemplateActorPicker();
        picker.render(true);*/
    }

    async _updateObject(event, formData) {
        // Do nothing
    }
}
