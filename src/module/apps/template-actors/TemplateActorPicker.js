import { ActorFate } from "../../actor/ActorFate.js";
import { TemplateActorSettings } from "./TemplateActorSettings.js";

export class TemplateActorPicker extends TemplateActorSettings {
    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            title: game.i18n.localize("ACTOR.Create"),
            template: "/systems/fatex/templates/apps/template-actors-picker.html",
            id: "template-actor-picker",
            resizable: true,
            classes: options.classes.concat(["fatex fatex__app_sheet"]),
            width: 1000,
            height: 430,
        });

        return options;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".fatex__template__choose").click((e) => this._chooseTemplate.call(this, e));
        html.find(".fatex__template__empty").click((e) => this._emptyTemplate.call(this, e));
        html.find(".fatex__template__header__settings").click((e) => this._openSettings.call(this, e));
    }

    /*************************
     * EVENT HANDLER
     *************************/

    async _openSettings() {
        CONFIG.FateX.applications.templateSettings.render(true);
    }

    async _emptyTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        const data = {
            name: game.i18n.localize("FAx.Template.Picker.Empty"),
            type: "character",
        };

        // Create actor without template data
        await ActorFate._create(data, { renderSheet: true });
        await this.close();
    }

    async _chooseTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const template = duplicate(game.actors.get(data.template));

        // Add current template as a flag for later use
        template.flags.fatex.templateActor = template._id;

        // Delete id, specific flags and the actors image
        delete template._id;
        delete template.flags.fatex.isTemplateActor;
        delete template.img;

        // Create the real actor
        await ActorFate._create(template, { renderSheet: true });
        await this.close();
    }

    async _updateObject() {}
}
