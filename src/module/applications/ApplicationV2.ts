// The bundled document typings predate V2. Keep the runtime API boundary here;
// all applications use the native Foundry 13/14 implementations.
export const applications = (foundry as any).applications;
export const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = applications.api;
export const { ActorSheetV2, ItemSheetV2 } = applications.sheets;

export const renderTemplate = (path: string, context: any) => applications.handlebars.renderTemplate(path, context);
export const enrichHTML = (content: string, document?: any) =>
    applications.ux.TextEditor.implementation.enrichHTML(content ?? "", {
        async: true,
        relativeTo: document,
        secrets: document?.isOwner ?? false,
    });

export async function confirmDeletion(title: string, content: string): Promise<boolean> {
    return (
        (await DialogV2.confirm({
            window: { title },
            content,
            classes: ["fatex", "fatex-dialog"],
            yes: { label: game.i18n.localize("FAx.Dialog.Confirm") },
            no: { label: game.i18n.localize("FAx.Dialog.Cancel"), default: true },
            rejectClose: false,
        })) === true
    );
}

/** Shared V2 sheet behavior, without a V1 lifecycle or a second form handler. */
export function FateSheetMixin(Base: any) {
    return class FateSheet extends HandlebarsApplicationMixin(Base) {
        constructor(...args: any[]) {
            super(...args);
        }

        get isEditable() {
            return this.options.editable !== false && super.isEditable;
        }

        async _onRender(context, options) {
            await super._onRender(context, options);
            for (const input of this.element.querySelectorAll(
                "[data-focus-id][contenteditable], [data-edit][contenteditable]",
            )) {
                input.contentEditable = String(this.isEditable);
            }
        }

        // Handlebars preserves named input focus; embedded item text uses data-focus-id.
        _preSyncPartState(partId, newElement, priorElement, state) {
            super._preSyncPartState(partId, newElement, priorElement, state);
            const focused = priorElement.querySelector("[data-focus-id]:focus");
            if (!focused) return;
            const selection = focused.ownerDocument.getSelection();
            const path: number[] = [];
            let node = selection?.focusNode;
            while (node && node !== focused && focused.contains(node)) {
                path.unshift(Array.prototype.indexOf.call(node.parentNode.childNodes, node));
                node = node.parentNode;
            }
            state.fatexFocus = { id: focused.dataset.focusId, path, offset: selection?.focusOffset ?? 0 };
        }

        _syncPartState(partId, newElement, priorElement, state) {
            super._syncPartState(partId, newElement, priorElement, state);
            if (!state.fatexFocus) return;
            const { id, path, offset } = state.fatexFocus;
            const focused = newElement.querySelector(`[data-focus-id="${CSS.escape(id)}"]`);
            if (!focused) return;
            focused.focus();
            let node = focused;
            for (const index of path) node = node.childNodes[index] ?? node;
            const range = focused.ownerDocument.createRange();
            range.setStart(
                node,
                Math.min(offset, node.nodeType === Node.TEXT_NODE ? node.textContent.length : node.childNodes.length),
            );
            range.collapse(true);
            const selection = focused.ownerDocument.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
        }
    };
}
