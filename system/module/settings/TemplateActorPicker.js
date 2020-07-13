import { ActorFate } from "../actor/ActorFate.js";
import { TemplateActorSettings } from "./TemplateActorSettings.js";

export class TemplateActorPicker extends FormApplication {

    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            title: game.i18n.localize("FAx.Template.Picker.Title"),
            template: "/systems/fatex/templates/settings/template-actors-picker.html",
            id: 'template-actor-picker',
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

        html.find('.fatex__template__choose').click((e) => this._chooseTemplate.call(this, e));
        html.find('.fatex__template__empty').click((e) => this._emptyTemplate.call(this, e));
        html.find('.fatex__template__header__settings').click((e) => this._openSettings.call(this, e));
    }

    async _openSettings() {
        CONFIG.FATEx.applications.templateSettings.render(true);
    }

    async _emptyTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        const data = {
            'name': game.i18n.localize('FAx.Template.Picker.Empty'),
            'type': 'character',
        }

        // Create actor without template data
        ActorFate._create(data, { renderSheet: true });
        this.close();
    }

    async _chooseTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const template = duplicate(game.actors.get(data.template));

        // Add current template as a flag for later use
        template.flags.fatex.templateActor = template._id;

        // Delete id and flags
        delete template._id;
        delete template.flags.fatex.isTemplateActor;

        // Create the real actor
        ActorFate._create(template, { renderSheet: true });
        this.close();
    }

    async _updateObject(event, formData) {
        // Do nothing
    }
}
