import { DataManager } from "./DataManager";
import { FateActor } from "../../actor/FateActor";

const CLEAR = {
    EVERYTHING: 0,
    ASPECTS: 1,
    CONSEQUENCES: 2,
    SKILLS: 3,
    STRESS: 4,
};

const TYPES = {
    1: "aspect",
    2: "consequence",
    3: "skill",
    4: "stress",
};

export class SheetSetup extends FormApplication<any, any, FateActor> {
    constructor(object, options) {
        super(object, options);

        this.actor.apps[this.appId] = this;
    }

    get actor() {
        return this.object;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: game.i18n.localize("FAx.Apps.Setup.Title"),
            template: "/systems/fatex/templates/apps/sheet-setup.hbs",
            resizable: true,
            classes: ["fatex", "fatex-sheet", "fatex-sheet--app"],
            width: 600,
            height: 700,
            scrollY: [".desk__content"],
            tabs: [
                {
                    navSelector: ".fatex__vertical_tabs__navigation",
                    contentSelector: ".fatex__vertical_tabs__content",
                },
            ],
        } as FormApplication.Options);
    }

    async getData() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {
            options: this.options,
            isOwnedBy: this.actor ? this.actor.name : false,

            hasAspects: !!this.actor.items.filter((i) => i.type === "aspect").length,
            hasSkills: !!this.actor.items.filter((i) => i.type === "skill").length,
            hasConsequences: !!this.actor.items.filter((i) => i.type === "consequence").length,
            hasStress: !!this.actor.items.filter((i) => i.type === "stress").length,
            hasAny: !!this.actor.items.size,
        };

        const dataManager = new DataManager();
        data.systems = await dataManager.getSystems();

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Clear actions
        html.find(".fatex-eb-clear").click((e) => this._onClear.call(this, e, CLEAR.EVERYTHING));
        html.find(".fatex-eb-clear-stress").click((e) => this._onClear.call(this, e, CLEAR.STRESS));
        html.find(".fatex-eb-clear-skills").click((e) => this._onClear.call(this, e, CLEAR.SKILLS));
        html.find(".fatex-eb-clear-consequences").click((e) => this._onClear.call(this, e, CLEAR.CONSEQUENCES));
        html.find(".fatex-eb-clear-aspects").click((e) => this._onClear.call(this, e, CLEAR.ASPECTS));

        // Setup actions
        html.find(".fatex-eb-add-selection").click((e) => this._onSetupType.call(this, e));
        html.find(".fatex-eb-toggle-selection").click((e) => this._onToggleType.call(this, e));
    }

    /*************************
     * EVENT HANDLER
     *************************/

    async _onSetupType(event) {
        event.preventDefault();

        const button = $(event.currentTarget);
        const type = button.parents(".fatex-sheet-setup__section").first();
        const entries = type.find("input:checked");

        if (!entries.length) {
            return;
        }

        const itemData = entries.toArray().map((item) => {
            if (!item.dataset.entity) {
                return {};
            }

            return JSON.parse(item.dataset.entity);
        });

        await this.actor.createOwnedItem(itemData);
        this.render(true);
    }

    async _onToggleType(event) {
        event.preventDefault();

        const button = $(event.currentTarget);
        const type = button.parents(".fatex-sheet-setup__section, .fatex__sheet_setup__group").first();
        const entries = type.find("input");

        entries.prop("checked", !entries.first().prop("checked"));
    }

    async _onClear(event, type) {
        event.preventDefault();

        // Return early to not lose items by any chance
        if (type === undefined) {
            return;
        }

        new Dialog(
            {
                title: game.i18n.localize("FAx.Dialog.ActorClear"),
                content: game.i18n.localize("FAx.Dialog.ActorClearText"),
                default: "cancel",
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
                            await this._doClear(type);
                        },
                    },
                },
            },
            {
                classes: ["fatex", "fatex-dialog"],
            }
        ).render(true);
    }

    async _doClear(type) {
        let items = this.actor.data.items;

        if (type > 0) {
            items = items.filter((i) => i.type === TYPES[type]);
        }

        const deletions = items.map((i) => i._id);
        await this.actor.deleteOwnedItem(deletions);

        this.render(true);
    }

    async _updateObject() {
        // No update necessary.
    }
}
