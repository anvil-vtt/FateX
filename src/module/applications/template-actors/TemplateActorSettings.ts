import { FateActor } from "../../actor/FateActor";
import { SheetSetup } from "../sheet-setup/SheetSetup";
import { ApplicationV2, confirmDeletion, HandlebarsApplicationMixin } from "../ApplicationV2";

export class TemplateActorSettings extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS: any = {
        id: "template-actors",
        classes: ["fatex", "fatex-sheet", "fatex-sheet--app"],
        position: { width: 860, height: 700 },
        window: { title: "FAx.Settings.Templates.App.Title", resizable: true },
        actions: {
            createTemplate: function (this: TemplateActorSettings) {
                return this._createTemplate();
            },
            deleteTemplate: function (this: TemplateActorSettings, _event, target) {
                return this._deleteTemplate(target.dataset.template);
            },
            configureTemplate: function (this: TemplateActorSettings, _event, target) {
                return this._configureTemplate(target.dataset.template);
            },
            duplicateTemplate: function (this: TemplateActorSettings, _event, target) {
                return this._duplicateTemplate(target.dataset.template);
            },
        },
    };
    static PARTS = {
        sheet: {
            template: "systems/fatex/templates/apps/template-actors.hbs",
            scrollable: [".fatex-desk__content"],
        },
    };

    constructor(options = {}) {
        super(options);
    }

    _canRender(options) {
        super._canRender(options);
        if (!game.user?.isGM) throw new Error(game.i18n.localize("ERROR.NoPermission"));
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        const templateActors = (game.actors?.filter((actor) => (actor as FateActor).isTemplateActor) ?? []).map(
            (actor) => {
                const view = actor.toObject() as any;
                for (const [key, type] of Object.entries({
                    stress: "stress",
                    aspects: "aspect",
                    skills: "skill",
                    consequences: "consequence",
                })) {
                    view[key] = view.items.filter((item) => item.type === type);
                }
                return view;
            },
        );
        return Object.assign(context, { options: this.options, templateActors });
    }

    _configureTemplate(id: string) {
        if (game.user?.isGM) return (game.actors?.get(id)?.sheet as any)?.render({ force: true });
    }

    async _deleteTemplate(id: string) {
        if (!game.user?.isGM) return;
        const template = game.actors?.get(id);
        if (!template || !(template as FateActor).isTemplateActor) return;
        if (
            !(await confirmDeletion(
                `${game.i18n.localize("FAx.Dialog.DocumentDelete")} ${template.name}`,
                game.i18n.localize("FAx.Dialog.DocumentDeleteText"),
            ))
        )
            return;
        await template.delete();
        this.refreshApplications();
    }

    async _createTemplate() {
        if (!game.user?.isGM) return;
        const actor = await FateActor._create(
            {
                name: game.i18n.localize("FAx.Settings.Templates.New"),
                type: "character",
                flags: { fatex: { isTemplateActor: true } },
            },
            { renderSheet: true },
        );
        if (actor) new SheetSetup({ document: actor }).render({ force: true });
        this.refreshApplications();
    }

    async _duplicateTemplate(id: string) {
        if (!game.user?.isGM) return;
        const source = game.actors?.get(id);
        if (!source || !(source as FateActor).isTemplateActor) return;
        const template = source.toObject() as any;
        delete template._id;
        template.name += ` (${game.i18n.localize("FAx.Settings.Templates.Copy")})`;
        await FateActor._create(template, { renderSheet: true });
        this.refreshApplications();
    }

    protected refreshApplications() {
        void this.render();
        void CONFIG.FateX.applications.templatePicker?.render();
    }
}
