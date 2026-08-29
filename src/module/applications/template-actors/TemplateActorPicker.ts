import { FateActor } from "../../actor/FateActor";
import { SheetSetup } from "../sheet-setup/SheetSetup";
import { TemplateActorSettings } from "./TemplateActorSettings";
import { ApplicationV2 } from "../ApplicationV2";

export class TemplateActorPicker extends TemplateActorSettings {
    static DEFAULT_OPTIONS = {
        id: "template-actor-picker",
        actions: {
            chooseTemplate: function (this: TemplateActorPicker, _event, target) {
                return this._chooseTemplate(target.dataset.template);
            },
            emptyTemplate: function (this: TemplateActorPicker) {
                return this._emptyTemplate();
            },
            createGroup: function (this: TemplateActorPicker) {
                return this._createGroup();
            },
            templateSettings: function () {
                if (game.user?.isGM) CONFIG.FateX.applications.templateSettings?.render({ force: true });
            },
        },
    };

    static PARTS = {
        sheet: {
            template: "systems/fatex/templates/apps/template-actors-picker.hbs",
            scrollable: [".fatex-desk__content"],
        },
    };
    creationData: Record<string, any> = {};

    get title() {
        return game.i18n.format("SIDEBAR.Create", { type: game.i18n.localize("DOCUMENT.Actor") });
    }

    _canRender(options) {
        ApplicationV2.prototype._canRender.call(this, options);
        if (!FateActor.canUserCreate(game.user!)) throw new Error(game.i18n.localize("ERROR.NoPermission"));
    }

    async _prepareContext(options) {
        const data = await super._prepareContext(options);
        data.AppTitle = this.title;
        data.canCreateGroup = !!game.user?.isGM && FateActor.canUserCreate(game.user);
        return data;
    }

    async _createGroup() {
        const group = await FateActor.createGroup(this.creationData);
        if (group) await this.close();
    }

    async _emptyTemplate() {
        if (!FateActor.canUserCreate(game.user!)) return;
        const actor = await FateActor._create(
            {
                ...this.creationData,
                name: this.creationData.name ?? game.i18n.localize("FAx.Template.Picker.Empty"),
                type: "character",
            },
            { renderSheet: true },
        );
        if (!actor) return;
        new SheetSetup({ document: actor }).render({ force: true });
        await this.close();
    }

    async _chooseTemplate(id: string) {
        if (!FateActor.canUserCreate(game.user!)) return;
        const source = game.actors?.get(id);
        if (!source || !(source as FateActor).isTemplateActor) return;
        const template = source.toObject() as any;
        template.flags ??= {};
        template.flags.fatex ??= {};
        template.flags.fatex.templateActor = template._id;
        delete template._id;
        delete template.flags.fatex.isTemplateActor;
        delete template.img;
        Object.assign(template, this.creationData);
        await FateActor._create(template, { renderSheet: true });
        await this.close();
    }
}
