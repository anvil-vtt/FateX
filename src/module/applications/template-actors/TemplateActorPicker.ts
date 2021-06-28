import { FateActor } from "../../actor/FateActor";
import { SheetSetup } from "../sheet-setup/SheetSetup";
import { TemplateActorSettings } from "./TemplateActorSettings";
import { ActorDataFate } from "../../actor/ActorTypes";

export class TemplateActorPicker extends TemplateActorSettings {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: game.i18n.localize("ACTOR.Create"),
            template: "/systems/fatex/templates/apps/template-actors-picker.hbs",
            id: "template-actor-picker",
            resizable: true,
            classes: ["fatex fatex__app_sheet"],
            width: 1000,
            height: 430,
        } as FormApplication.Options);
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".fatex-eb-choose-template").click((e) => this._chooseTemplate.call(this, e));
        html.find(".fatex-eb-empty-template").click((e) => this._emptyTemplate.call(this, e));
        html.find(".fatex__template__header__settings").click(() => this._openSettings.call(this));
    }

    /*************************
     * EVENT HANDLER
     *************************/

    async _openSettings() {
        CONFIG.FateX.applications.templateSettings?.render(true);
    }

    async _emptyTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        const data: Partial<ActorDataFate> = {
            name: game.i18n.localize("FAx.Template.Picker.Empty"),
            type: "character",
        };

        if (this.options.folder) {
            data.folder = this.options.folder;
        }

        // Create actor without template data
        const newActor = await FateActor._create(data, { renderSheet: true });

        // Open sheet setup by default for new empty actors
        const sheetSetup = new SheetSetup(newActor, {});
        sheetSetup.render(true);

        await this.close();
    }

    async _chooseTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const template = duplicate(game.actors?.get(data.template)) as Partial<Actor.Data>;
        const fatexFlags = template.flags?.fatex as Record<string, unknown>;

        // Add current template as a flag for later use
        fatexFlags.templateActor = template._id;

        // Delete id, specific flags and the actors image
        delete template._id;

        delete fatexFlags.isTemplateActor;

        delete template.img;

        if (this.options.folder) {
            template.folder = this.options.folder;
        }

        // Create the real actor
        await FateActor._create(template, { renderSheet: true });
        await this.close();
    }

    async _updateObject() {
        // No update necessary
    }
}
