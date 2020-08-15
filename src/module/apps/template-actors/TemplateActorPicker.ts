import { ActorFate } from "../../actor/ActorFate";
import { SheetSetup } from "../sheet-setup/SheetSetup";
import { TemplateActorSettings } from "./TemplateActorSettings";

export class TemplateActorPicker extends TemplateActorSettings {
    static get defaultOptions() {
        const options = super.defaultOptions;

        if (!options.classes) {
            options.classes = [];
        }

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
        html.find(".fatex__template__header__settings").click(() => this._openSettings.call(this));
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
        const newActor = await ActorFate._create(data, { renderSheet: true });

        // Open sheet setup by default for new empty actors
        const sheetSetup = new SheetSetup(newActor, {});
        sheetSetup.render(true);

        await this.close();
    }

    async _chooseTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const template = duplicate(game.actors.get(data.template));

        // Add current template as a flag for later use
        //@ts-ignore
        template.flags.fatex.templateActor = template._id;

        // Delete id, specific flags and the actors image
        //@ts-ignore
        delete template._id;

        //@ts-ignore
        delete template.flags.fatex.isTemplateActor;

        //@ts-ignore
        delete template.img;

        // Create the real actor
        await ActorFate._create(template, { renderSheet: true });
        await this.close();
    }

    async _updateObject() {
        // No update necessary
    }
}
