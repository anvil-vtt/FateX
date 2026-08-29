import { CharacterSheet } from "./CharacterSheet";

export class InlineActorSheetFate extends CharacterSheet {
    static DEFAULT_OPTIONS: any = {
        classes: ["fatex-inline-application"],
        window: { frame: false, positioned: false },
        position: { width: "auto", height: "auto" },
        actions: {
            removeFromGroup: function (this: InlineActorSheetFate) {
                return this.options.group.removeReference(this.options.referenceID);
            },
        },
    };
    static PARTS = {
        sheet: {
            template: "systems/fatex/templates/inline-sheet/character.hbs",
            scrollable: [".fatex__inline_sheet__content"],
        },
    };
    static TABS = {
        primary: {
            initial: "aspects",
            tabs: [{ id: "aspects" }, { id: "consequences" }, { id: "stress" }],
        },
    };

    combatant: any;

    get canRemoveFromGroup(): boolean {
        return this.options.group.canRemoveReference(this.options.referenceID);
    }

    _initializeApplicationOptions(options) {
        const configured = super._initializeApplicationOptions(options);
        configured.uniqueId += `-${options.group.id}-${options.referenceID}`;
        return configured;
    }

    async _prepareContext(options) {
        const data = await super._prepareContext(options);
        data.referenceID = this.options.referenceID;
        data.canRemoveFromGroup = this.canRemoveFromGroup;
        data.defeated = this.combatant?.defeated ?? false;
        data.hidden = this.combatant?.hidden ?? false;
        return data;
    }

    async _onRender(context, options) {
        await super._onRender(context, options);
        const button = this.element.querySelector('[data-action="removeFromGroup"]') as HTMLButtonElement | null;
        // Membership belongs to the group, not to the displayed actor's form.
        if (button) button.disabled = !this.canRemoveFromGroup;
    }

    _insertElement(element: HTMLElement) {
        const host = this.options.group.element.querySelector(".fatex-js-actor-group-sheets");
        if (!host) throw new Error("FateX | Inline sheet has no group container.");
        element.dataset.id = this.options.referenceID;
        host.append(element);
    }

    _attachFrameListeners() {
        super._attachFrameListeners();
        // A child is an independent document form. Its actions must never update
        // the group document or another actor rendered in the same group.
        for (const type of ["click", "contextmenu", "change", "submit", "drop", "dragstart"]) {
            this.element.addEventListener(type, (event) => event.stopPropagation());
        }
    }
}
