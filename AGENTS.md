# clever-components

Library of about 140 Clever Cloud Web Components, built with [Lit](https://lit.dev/), documented with Storybook, published on npm as `@clevercloud/components` and on a smart CDN.
Plain JavaScript + JSDoc types (no TypeScript source), ESM only, `pnpm` as package manager, Node/pnpm versions pinned in `mise.toml`.

This file is the canonical instruction set for AI coding agents. Tool-specific entry points (`CLAUDE.md`, …) should point here rather than duplicate it.

## Always do this

- **After editing any file, before saying you are done:** `pnpm format` then `pnpm lint`, and `pnpm stylelint` if you touched CSS inside a component. These three are part of the publish gate (`prepack:prod`); skipping them means the change fails CI.
- **Before writing a new pattern, look at how an existing component does it.** This library is highly consistent by design: copy the closest neighbour rather than inventing.
- **Never hand-edit generated files** (see Gotchas). Run the generator instead.
- **Commit messages follow [conventional commits](https://www.conventionalcommits.org)**, scope = the component name: `fix(cc-badge): ...`. The scope drives the CHANGELOG, so a wrong scope ships a wrong release note.

## Layout

| Path | What |
|---|---|
| `src/components/<tag>/` | One directory per component, files named after the tag |
| `src/lib/` | Non-component logic: events, API glue, i18n engine, smart-component runtime, form abstractions |
| `src/styles/` | Shared Lit style modules + design tokens (`default-theme.css`) |
| `src/translations/` | `translations.en.js` / `translations.fr.js` + the `i18n()` function |
| `src/stories/` | Storybook infrastructure (`lib/make-story.js`, fixtures), **not** the stories themselves |
| `src/controllers/`, `src/directives/` | Reusable reactive controllers and Lit directives |
| `test/` | Browser unit tests for `src/lib` (Web Test Runner) |
| `test-mocha/` | Node-side tests for build tooling (CEM plugins, custom ESLint rules) |
| `tasks/`, `cem/`, `rollup/`, `eslint/`, `web-test-runner/` | Build, analysis and test tooling |
| `docs/` | Contributor docs, **published in the Storybook**, so anything added here is public |

## Component anatomy

Only `cc-foo.js` is mandatory; `cc-foo.stories.js` is expected for any new component. Optional siblings: `.types.d.ts`, `.events.js`, `.smart.js` + `.smart.md`, `.test.js`.

- Tag `cc-kebab-case`, class `CcPascalCase`, registered with `window.customElements.define()` at the bottom of the file.
- Types live in `cc-foo.types.d.ts` but are imported as `./cc-foo.types.js` in JSDoc `@import`. This is intentional, don't "fix" it.
- Events: `class CcFooBarEvent extends CcEvent` with `static TYPE = 'cc-foo-bar'`, all of a component's event classes in its `cc-foo.events.js`.
- Smart components call the API through `src/lib/cc-api-client.js` + `@clevercloud/client/cc-api-commands/`. The legacy path (`sendToApi`, `@clevercloud/client/esm/api/`) has been removed from this repository: never reintroduce it.
- Public CSS API: `--cc-<component>-<thing>`, documented with `@cssprop`. Use the semantic tokens from `default-theme.css`, never raw palette values.
- Design tokens always get a fallback: `var(--cc-color-text-success, #098846)`, never `var(--cc-color-text-success)`, so the component still looks decent when the theme is not loaded. Many existing components omit it: don't copy that from a neighbour.
- i18n keys: `'<tag>.<section>.<detail>'`, added to **both** language files, alphabetically, inside the `//#region <tag>` block.
- `docs/cc-example-component.js` + `.stories.js` + `.smart.md` is the canonical template for a new component.

## Gotchas

- **Generated, never edit by hand:** `src/lib/events-map.types.d.ts` (`pnpm components:events-map-generate`), `src/assets/cc-*.icons.js` (`pnpm components:generate-icons-assets`), `dist/`, root `custom-elements.json` (a stub, the real manifest is `dist/custom-elements.json`, built by `pnpm components:docs`). Adding a `*.events.js` class without regenerating the events map fails CI.
- **a11y and visual test files do not exist on disk.** They are synthesized from `*.stories.js` at test time. Don't look for `cc-foo.a11y.test.js`; fix the story instead.
- **Stories must use `makeStory()`** from `src/stories/lib/make-story.js`: ad-hoc CSF exports silently break the derived a11y and visual tests.
- **Two test runners:** `pnpm test` (Web Test Runner, browser) and `pnpm test:mocha` (Node, tooling only).
- **Typechecking is opt-in per file**: `pnpm typecheck` uses `tsconfig.ci.json`, check its include/exclude lists before assuming a file is checked.

## Running scripts

`docs/contributing/tasks.md` documents every script. What matters for an agent:

- **Safe:** `format`, `lint`, `stylelint`, `typecheck`, `test`, `test:group`, `test:mocha`, `components:check-i18n`, `components:check-lit`, `components:events-map-check`, `components:build`, `components:docs`.
- **Long-running / needs a human:** `storybook:dev` (dev server), `test:watch*`, `test:visual` (Playwright, slow).
- **Never run unasked:** anything `preview:*`, `cdn-preview:*`, `cdn-release:*` (they publish to shared Cellar buckets and need secrets), `prepack*` (release path), `test:visual:update-expectation` (rewrites visual baselines).

## Load on demand

Read these when the task matches. For a small change to an existing file, the neighbouring code is usually enough; open the doc when the code around your change does not already show the pattern you need.

| Task | Read |
|---|---|
| Understand where things are, in detail | `docs/contributing/codebase-map.md` |
| Use `gh`, `playwright-cli`, Figma MCP, `clever-tools` | `docs/contributing/agent-tooling.md` |
| Call the API, test a local client build | `docs/contributing/clever-client.md` |
| Create a new component | **Always:** `docs/contributing/wc-guidelines.md`, `docs/contributing/wc-accessibility.md`, `docs/contributing/stories.md` |
| Change an existing component | `docs/contributing/wc-guidelines.md`; add `docs/contributing/wc-accessibility.md` when the change touches markup, labels, focus or anything announced to screen readers |
| Write or change a smart component | `docs/contributing/smart-component.md` |
| Write or change stories | `docs/contributing/stories.md` |
| Forms | `docs/contributing/forms.md` |
| i18n | `docs/contributing/i18n.md` |
| Tests | `docs/contributing/test.md` |
| Prepare or understand a release, the CHANGELOG, versioning | `docs/contributing/release.md` |
| Why something is the way it is | `docs/adr/` |
