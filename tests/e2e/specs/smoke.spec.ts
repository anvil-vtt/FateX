import { expect, test } from "../fixtures";

test("FateX loads without errors", async ({ gm }) => {
    const info = await gm.eval(() => ({
        system: window.game.system.id,
        ready: window.game.ready,
        version: window.game.version,
    }));
    expect(info).toMatchObject({ system: "fatex", ready: true });
});
