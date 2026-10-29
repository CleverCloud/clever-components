---
kind: '👋 Contributing'
title: 'Codebase map'
---

# Codebase map

Detailed map of the repository: where things live and how they are wired.
A condensed version, meant to be loaded by AI coding agents on every session, lives in `AGENTS.md` at the root.

## `src/`

### `src/components/`

One directory per component, named after the custom element tag. Files inside are always prefixed with that tag.

| File                | Required         | Role                                                                                                 |
|---------------------|------------------|------------------------------------------------------------------------------------------------------|
| `cc-foo.js`         | yes              | The Lit element. Ends with `window.customElements.define('cc-foo', CcFoo)`.                          |
| `cc-foo.stories.js` | expected         | Storybook stories, built with `makeStory()`. Also the source of the generated a11y and visual tests. |
| `cc-foo.types.d.ts` | common           | Public types, imported in JSDoc as `./cc-foo.types.js`.                                              |
| `cc-foo.events.js`  | ~51 components   | `CcEvent` subclasses dispatched by the component.                                                    |
| `cc-foo.smart.js`   | optional         | API wiring container, declared with `defineSmartComponent()`.                                        |
| `cc-foo.smart.md`   | with `.smart.js` | Smart component docs: params and API calls. Published in the Storybook.                              |
| `cc-foo.test.js`    | rare (~11)       | Hand-written browser tests, for behaviour stories can't cover.                                       |

Variants and helpers:

- A component can have several smart flavours: `cc-addon-credentials.smart-cellar.js` + `.smart-cellar.md`, `.smart-pulsar.js`, `.smart-elastic.js`.
- A few components ship a `*.client.js` (API helper) or plain helper modules without the `cc-` prefix (`logs-controller.js`, `kv-utils.js`, `products-controller.js`).
- Test files may carry a sub-feature suffix: `cc-logs.follow.test.js`, `cc-logs.inspect.test.js`.

Two shared files sit at the root of `src/components/`:

- `common.types.d.ts`: types shared across components.
- `common.events.js`: event classes not owned by a single component.

### `src/lib/`

Everything that is not a component.

| Path                                                  | Role                                                                                                                                                                             |
|-------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `events.js`                                           | The `CcEvent` base class.                                                                                                                                                        |
| `events-map.types.d.ts`                               | **Generated.** Maps event types to classes for typechecking.                                                                                                                     |
| `cc-api-client.js`                                    | Glue to `@clevercloud/client` (see `api-client.md`). `send-to-api.events.js` and `send-to-api.types.d.ts` only hold the `cc-api-error` event and the config types it still uses. |
| `smart/`                                              | `define-smart-component.js`, `smart-manager.js`: the smart component runtime.                                                                                                    |
| `form/`                                               | `cc-form-control-element.abstract.js`, validation, submit directive.                                                                                                             |
| `i18n/`                                               | Date, number, string and sanitize helpers used by translations.                                                                                                                  |
| `notifications.js`                                    | Toaster API.                                                                                                                                                                     |
| `date/`, `logs/`, `ansi/`, `leaflet/`                 | Domain helpers.                                                                                                                                                                  |
| `dom.js`, `clipboard.js`, `color.js`, `pricing.js`, … | Utilities.                                                                                                                                                                       |

### `src/styles/`

Shared Lit `css` modules (`skeleton.js`, `accessibility.js`, `waiting.js`, `info-tiles.js`, `shoelace.js`) plus the design token theme `default-theme.css` and `undefined-components.css`.

Tokens come in two layers: the raw palette (`--color-blue-70`) is private, components must only use the decision tokens (`--cc-color-*`, `--cc-ff-*`). See ADR-0017 and ADR-0020.

### `src/translations/`

`translations.en.js`, `translations.fr.js`, `translation.js` (the `i18n()` function) and `translation.types.d.ts`.

Adding a key: add it to **both** files, inside the `//#region <tag>` block for the component, keeping the regions and the keys inside them alphabetically sorted. Static text is a template literal; parameterized text is an arrow function with a JSDoc `@param`; text containing HTML must go through `sanitize`. Custom ESLint rules under `eslint/` enforce this, and `pnpm components:check-i18n` reports missing or unused keys.

### `src/stories/`

Storybook **infrastructure**, not stories:

- `lib/make-story.js`: the factory every `*.stories.js` must use.
- `fixtures/`: shared mock data (there is no `src/stubs/`).
- `assets/`: story images, including committed visual-test artifacts.
- autodocs templates.

### Other

- `src/controllers/`: reusable reactive controllers (`lost-focus-controller.js`, `resize-controller.js`), each with a `.md` and a `.stories.js`.
- `src/directives/`: Lit directives (`has-slotted-children.js` and its test).
- `src/templates/`: sub-templates reused by several components (currently one).
- `src/assets/`: SVGs, geo data, and the **generated** icon modules.

## Tests

| Kind                 | Location                                                                                                      | Runner                                                                                                                                                          |
|----------------------|---------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/lib` unit tests | `test/**/*.test.js`, mirroring the lib subdirectories                                                         | `pnpm test` (Web Test Runner, group `unit`)                                                                                                                     |
| Component tests      | `src/components/<tag>/<name>.test.js`                                                                         | `pnpm test`                                                                                                                                                     |
| a11y tests           | **generated** from `*.stories.js` by `web-test-runner/story-file-to-a11y-tests-file-plugin.js`                | `pnpm test:group a11y:cc-badge`                                                                                                                                 |
| Visual regression    | **generated** from `*.stories.js` by `web-test-runner/visual-tests/story-file-to-visual-tests-file-plugin.js` | `pnpm test:visual` (Playwright chromium, desktop + mobile), baselines via `pnpm test:visual:update-expectation`, reports in `visual-test-reports/` (gitignored) |
| Tooling tests        | `test-mocha/**/*.test.js` with `*.test-data.js` and `fixtures/`                                               | `pnpm test:mocha` (these need Node, not a browser)                                                                                                              |

## Generated artifacts

| Artifact                                             | Generator                                                                                                | CI check                           |
|------------------------------------------------------|----------------------------------------------------------------------------------------------------------|------------------------------------|
| `src/lib/events-map.types.d.ts`                      | `pnpm components:events-map-generate` (`tasks/generate-events-map.js`, scans `src/**/*.events.js`)       | `pnpm components:events-map-check` |
| `src/assets/cc-remix.icons.js`, `cc-clever.icons.js` | `pnpm components:generate-icons-assets`                                                                  | none                               |
| `dist/custom-elements.json`                          | `pnpm components:docs` (`cem analyze`, config `custom-elements-manifest.config.mjs` + plugins in `cem/`) | none                               |
| `dist/` npm bundle                                   | `pnpm components:build` (rollup configs in `rollup/`)                                                    | none                               |
| `storybook-static/`                                  | `pnpm storybook:build`                                                                                   | none                               |

The root `custom-elements.json` is a 64-byte stub pointing at `dist/custom-elements.json`.

## Tooling directories

- `tasks/`: Node scripts behind the `pnpm` scripts (i18n check, events map, icons, CDN and preview CLIs, usage graph, typechecking stats).
- `cem/`: Custom Elements Manifest plugins (see ADR-0016). They consume JSDoc tags such as `@cssdisplay`, which is why component JSDoc must include it.
- `eslint/`: custom ESLint rules, notably the i18n and Lit ones, tested in `test-mocha/`.
- `rollup/`: npm and CDN build configs.
- `web-test-runner/`: WTR plugins, including the a11y and visual test generators.
- `.storybook/`: Storybook config. `main.js` pulls in `README.md`, `CONTRIBUTING.md`, `docs/**/!(*example*).md` and `src/**/*smart*.md`, which is why anything added under `docs/` becomes public documentation.

## Quality gates

`pnpm check` is the code quality gate, run in parallel: `format:check`, `lint`, `stylelint`, `components:check-lit` (lit-analyzer), `typecheck` (`tsc -p tsconfig.ci.json`), `components:check-i18n`, `components:events-map-check`.

The full gate is the `test-and-build` CI workflow (`.github/workflows/test-and-build.yml`), run on every pull request: the same checks, then `test`, `test:mocha`, `components:build`, `components:docs`, `cdn-release:build`.

Note that `stylelint` only runs on `src/components/*/*.js`: it lints the CSS embedded in Lit templates and enforces declaration sorting (ADR-0011).
