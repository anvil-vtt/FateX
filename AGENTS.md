# FateX

Fate game system for Foundry VTT, supporting V13 and V14 (`system/system.json`, `compatibility`).
The README section "Development" describes the setup. These are the points that are easy to get wrong.

## Layout

- `src/` TypeScript and SCSS. The entry point `src/fatex.ts` registers the features in `src/module/features`.
- `system/` the folder Foundry loads: manifest, `template.json`, Handlebars templates, languages, preset data.
  `system/system.js` stays empty in git; webpack builds the real bundle.
- All windows are ApplicationV2 (`src/module/applications/ApplicationV2.ts` holds the shared mixin).
  Item types add sheet data and actor sheet listeners through their classes in `src/module/item`.
- `tests/e2e` Playwright tests against a running Foundry.

## Checks

```bash
npx tsc --noEmit
npx tsc -p tests/e2e
npx eslint src tests --ext .ts
npm run build:production
npm run test:e2e
```

Run the E2E tests on V13 and on V14 before a release. Only one Foundry can run behind the dev server at a time,
because the proxy target is fixed to port 30000 in `webpack.config.js`.

## Foundry versions

- V13 and V14 differ in a few APIs: roll modes (`ChatMessage.applyRollMode`) became message modes
  (`ChatMessage.applyMode`) in V14, the join page names its user field differently, and synthetic token actors
  are named after the token in V14 but after the base actor in V13. Check both when you touch such code.
- `template.json` is deprecated in V14 and removed in V16. Moving to DataModels is still open.
- Use `renderChatMessageHTML` for chat cards, so buttons also work in chat notifications and popouts.

## Conventions

- Commits follow Conventional Commits (`fix(groups): …`, `test: …`).
- New strings go into `system/languages/en.json`; other languages fall back to English.
- E2E tests clean up what they create. A test fails on page errors, console errors and FateX deprecation
  warnings, so expected error notifications have to be taken with `foundry.takeErrors()`.
