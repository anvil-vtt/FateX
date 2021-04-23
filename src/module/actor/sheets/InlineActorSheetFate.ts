import { CharacterSheet } from "./CharacterSheet";

export class InlineActorSheetFate extends CharacterSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            baseApplication: "InlineActorSheetFate",
        } as BaseEntitySheet.Options);
    }

    getData(options?: Application.RenderOptions & { referenceID?: string }) {
        const data = super.getData();

        if (options?.referenceID) {
            data.referenceID = options.referenceID;
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
        return "systems/fatex/templates/inline-sheet/character.html";
    }

    _injectHTML(html, options) {
        $(`#${options.group.id} .fatex__actor_group__inlinesheets`).append(html);
        this._element = html;
    }

    render(force = false, options: Application.RenderOptions & { token?: Token; group?: Application; referenceID?: string } = {}) {
        return super.render(force, options);
    }
}
