import { FateActor } from "../../actor/FateActor";
import { SheetSetup } from "../sheet-setup/SheetSetup";

export class TemplateActorSettings extends FormApplication<any, any, any> {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: game.i18n.localize("FAx.Settings.Templates.App.Title"),
            template: "/systems/fatex/templates/apps/template-actors.hbs",
            id: "template-actors",
            resizable: true,
            classes: ["fatex", "fatex-sheet", "fatex-sheet--app"],
            width: 860,
        });
    }

    getData() {
        const filteredActors = duplicate(game.actors?.filter((actor) => (actor as FateActor).isTemplateActor) as Record<any, any>[]);

        filteredActors.forEach((actorDocument) => {
            actorDocument.stress = actorDocument.items.filter((item) => item.type === "stress");
            actorDocument.aspects = actorDocument.items.filter((item) => item.type === "aspect");
            actorDocument.skills = actorDocument.items.filter((item) => item.type === "skill");
            actorDocument.consequences = actorDocument.items.filter((item) => item.type === "consequence");
        });

        return {
            options: this.options,
            templateActors: filteredActors,
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".fatex-js-create-template").on("click", (e) => this._createTemplate.call(this, e));
        html.find(".fatex-js-delete-template").on("click", (e) => this._deleteTemplate.call(this, e));
        html.find(".fatex-js-configure-template").on("click", (e) => this._configureTemplate.call(this, e));
        html.find(".fatex-js-duplicate-template").on("click", (e) => this._duplicateTemplate.call(this, e));
    }

    /*************************
     * EVENT HANDLER
     *************************/

    async _configureTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const template = game.actors?.get(data.template);

        if (!template) {
            return;
        }

        template.sheet?.render(true);
    }

    async _deleteTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const template = game.actors?.get(data.template);

        if (!template) {
            return;
        }

        new Dialog(
            {
                title: `${game.i18n.localize("FAx.Dialog.DocumentDelete")} ${template.name}`,
                content: game.i18n.localize("FAx.Dialog.DocumentDeleteText"),
                default: "submit",
                buttons: {
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: game.i18n.localize("FAx.Dialog.Cancel"),
                        callback: () => null,
                    },
                    submit: {
                        icon: '<i class="fas fa-check"></i>',
                        label: game.i18n.localize("FAx.Dialog.Confirm"),
                        callback: async () => {
                            await template.delete();

                            // Re-render this settings window and the picker if open
                            this.render(true);
                            CONFIG.FateX.applications.templatePicker?.render();
                        },
                    },
                },
            },
            {
                classes: ["fatex", "fatex-dialog"],
            }
        ).render(true);
    }

    async _createTemplate(e) {
        e.preventDefault();

        const createData = {
            name: game.i18n.localize("FAx.Settings.Templates.New"),
            type: "character",
            flags: {
                fatex: {
                    isTemplateActor: true,
                },
            },
        };

        const newTemplateActor = await FateActor._create(createData, { renderSheet: true });

        // Open sheet setup by default for new templates
        const sheetSetup = new SheetSetup(newTemplateActor, {});
        sheetSetup.render(true);

        // Re-render this settings window and the picker if open
        this.render(true);
        CONFIG.FateX.applications.templatePicker?.render();
    }

    async _duplicateTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        const data = e.currentTarget.dataset;
        const template = duplicate(game.actors?.get(data.template));

        if (!template) {
            return;
        }

        // Delete id
        // @ts-ignore
        delete template._id;

        // Change name
        template.name = template.name + ` (${game.i18n.localize("FAx.Settings.Templates.Copy")})`;

        // Create new duplicate
        await Actor.create(template, { renderSheet: true });

        // Re-render this settings window and the picker if open
        this.render(true);
        CONFIG.FateX.applications.templatePicker?.render();
    }

    async _updateObject() {
        // No update necessary.
    }
}
