import { ActorSheetFate } from "./ActorSheetFate";

export class InlineActorSheetFate extends ActorSheetFate {
    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            baseApplication: "InlineActorSheetFate",
        });

        return options;
    }

    get id() {
        return this.options.id ? this.options.id : `inline-app-${this.appId}`;
    }

    get popOut() {
        return false;
    }

    get template() {
        return "systems/fatex/templates/inline-actor/character.html";
    }

    _injectHTML(html, options) {
        $(`#${options.group.id} .fatex__actor_group__inlinesheets`).append(html);
        this._element = html;
    }

    render(force = false, options: RenderOptions & { token?: Token; group?: Application } = {}) {
        return super.render(force, options);
    }
}
