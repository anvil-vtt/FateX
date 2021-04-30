import { CharacterSheet } from "./CharacterSheet";

export class InlineActorSheetFate extends CharacterSheet {
    getData(_options?: Application.RenderOptions) {
        const data = super.getData();

        if (this.options.referenceID) {
            data.referenceID = this.options.referenceID;
        }

        if (this.options.combatant) {
            data.defeated = this.options.combatant.defeated;
            data.hidden = this.options.combatant.hidden;
        }

        return data;
    }

    get id() {
        return this.options.id ? this.options.id : `inline-app-${this.appId}`;
    }

    get popOut() {
        return false;
    }

    get template() {
        return "systems/fatex/templates/inline-sheet/character.hbs";
    }

    /**
     * Circumvent BaseEntitySheet::render() as it wouldn't allow InlineActorSheets
     * to update for actors which the user has no view-permission for.
     */
    render(force = false, options = {}) {
        this._render(force, options);
        return this;
    }

    _injectHTML(html, options) {
        $(`#${options.group.id} .fatex__actor_group__inlinesheets`).append(html);
        this._element = html;
    }
}
