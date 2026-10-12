import { CharacterSheet } from "./CharacterSheet";
import { applications } from "../../applications/ApplicationV2";

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

    _configureRenderParts(_options) {
        // Inline sheets always use the compact layout, also for limited actors.
        return foundry.utils.deepClone((this.constructor as typeof InlineActorSheetFate).PARTS);
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
        // Like the limited character sheet, players with limited permission only see name and portrait.
        data.limitedView = !game.user?.isGM && this.actor.limited;
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
        for (const type of ["click", "contextmenu", "change", "submit"]) {
            this.element.addEventListener(type, (event) => event.stopPropagation());
        }
        // Group membership drops (actors, actor folders, tokens) belong to the group.
        // Everything else, e.g. items, belongs to the displayed actor only.
        this.element.addEventListener("drop", (event) => {
            if (!InlineActorSheetFate.isMembershipDrop(event)) event.stopPropagation();
        });
    }

    static isMembershipDrop(event: DragEvent): boolean {
        const data: any = applications.ux.TextEditor.implementation.getDragEventData(event);
        return (
            ["Actor", "Token"].includes(data?.type) ||
            (data?.type === "Folder" && (data.documentName ?? (foundry.utils as any).fromUuidSync(data.uuid)?.type) === "Actor")
        );
    }
}
