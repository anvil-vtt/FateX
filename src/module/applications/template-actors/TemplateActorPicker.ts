import { FateActor } from "../../actor/FateActor";
import { SheetSetup } from "../sheet-setup/SheetSetup";
import { TemplateActorSettings } from "./TemplateActorSettings";

import { ActorDataProperties } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";

export class TemplateActorPicker extends TemplateActorSettings {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: game.i18n.format("SIDEBAR.Create", { type: game.i18n.localize("DOCUMENT.Actor") }),
            template: "/systems/fatex/templates/apps/template-actors-picker.hbs",
            id: "template-actor-picker",
            resizable: true,
            classes: ["fatex", "fatex-sheet", "fatex-sheet--app"],
            width: 860,
        });
    }

    getData() {
        const data = super.getData();

        // @ts-ignore
        data.AppTitle = game.i18n.format("SIDEBAR.Create", { type: game.i18n.localize("DOCUMENT.Actor") });

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".fatex-js-choose-template").click((e) => this._chooseTemplate.call(this, e));
        html.find(".fatex-js-empty-template").click((e) => this._emptyTemplate.call(this, e));
        html.find(".fatex-js-template-header-button").click(() => this._openSettings.call(this));
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

        const data: Partial<ActorDataProperties> = {
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
        const template = duplicate(game.actors?.get(data.template));
        const fatexFlags = template.flags?.fatex as Record<string, unknown>;

        // Add current template as a flag for later use
        fatexFlags.templateActor = template._id;

        // Delete id, specific flags and the actors image
        // @ts-ignore
        delete template._id;

        delete fatexFlags.isTemplateActor;

        // @ts-ignore
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
