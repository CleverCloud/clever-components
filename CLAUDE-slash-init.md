# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`@clevercloud/components` — a library of ~150 Web Components built with [Lit](https://lit.dev), published on npm and on a CDN, showcased with Storybook. Source is plain ES modules with JSDoc type annotations (no TypeScript source files, but `tsc --checkJs` typechecking is enforced). Components are split between low-level UI atoms (`cc-button`, `cc-input-text`) and Clever Cloud domain components (`cc-addon-backups`, `cc-pricing-product`).

Runtime is `mise`-managed: Node 24, pnpm 11. Always use `pnpm`, never `npm`/`yarn`.

## Commands

```bash
pnpm storybook:dev              # main dev loop, localhost:6006, live reload

pnpm test                       # all unit + a11y tests (Web Test Runner, headless Chrome)
pnpm test path/to/file.test.js  # single test file
pnpm test:watch                 # watch mode; press `F` to focus, `D` to debug in a real browser
pnpm test:group unit            # only test/**/*.test.*
pnpm test:group test:cc-input-date   # unit tests of one component
pnpm test:group a11y:cc-input-date   # a11y tests generated from that component's stories
pnpm test:mocha                 # Node-side tests (CEM plugins, custom ESLint & Prettier rules)
pnpm test:visual                # visual regression (usually CI-only, via the `run-visual-tests` PR label)

pnpm lint / pnpm lint:fix       # ESLint (custom plugins in eslint/)
pnpm stylelint                  # CSS inside `css` tagged templates
pnpm format / pnpm format:check # Prettier
pnpm typecheck                  # tsc -p tsconfig.ci.json
pnpm components:check-lit       # lit-analyzer
pnpm components:check-i18n      # missing / unused / dynamic translation keys
pnpm components:events-map-check # verifies the generated events map is in sync

pnpm components:build           # rollup build into dist/
pnpm components:docs            # custom-elements-manifest into dist/
pnpm components:events-map-generate    # regenerate src/lib/events-map.types.d.ts
pnpm components:generate-icons-assets  # regenerate src/assets/cc-*.icons.js from SVGs
```

CI (`.github/workflows/test-and-build.yml`) runs, in order: commitlint, lint, check-lit, typecheck, stylelint, format:check, check-i18n, events-map-check, test, test:mocha, then the builds. `pnpm prepack:prod` runs the same chain locally.

## Layout of a component

Everything for one component lives in `src/components/<cc-name>/`:

| File | Purpose |
| --- | --- |
| `cc-foo.js` | the Lit UI component — rendering only, no data fetching |
| `cc-foo.types.d.ts` | state / data type definitions |
| `cc-foo.events.js` | custom event classes |
| `cc-foo.stories.js` | Storybook stories; **also** the source of a11y and visual tests |
| `cc-foo.smart.js` | optional smart wrapper that fetches data and calls the API |
| `cc-foo.smart.md` | documentation page for the smart wrapper |

`docs/cc-example-component.js`, `docs/cc-example-component.stories.js` and `docs/cc-example-component.smart.md` are annotated templates — copy them when creating a component.

Other source directories: `src/lib/` (framework-agnostic helpers, API clients, i18n, forms, smart runtime), `src/controllers/` (Lit reactive controllers), `src/styles/` (shared styles + `default-theme.css`), `src/translations/`, `src/assets/` (SVGs + generated icon modules), `src/templates/`, `src/directives/`.

## Architecture

### UI components are dumb; smart components fetch

A UI component never calls an API. It exposes properties, renders, and dispatches events. A smart component (`cc-foo.smart.js`) calls `defineSmartComponent({ selector, params, onContextUpdate })` from `src/lib/smart/define-smart-component.js`. `onContextUpdate` receives `{ container, component, context, signal, onEvent, updateComponent }`:

- it is skipped entirely while any non-optional param is `null`/`undefined`;
- `signal` aborts on the next context update or on disconnect — pass it to every API call and listener;
- `updateComponent(prop, value | producerFn)` sets a reactive property, applying Immer when given a function;
- `onEvent(type, cb)` listens on the component and unwraps `event.detail`.

Context comes from a `<cc-smart-container context='{...}'>` ancestor; containers nest and merge their context.

API calls use either `getCcApiClientWithOAuth` / `getCcApiClientWithToken` from `src/lib/cc-api-client.js` (preferred for new code, `client.send(new SomeCommand(...), { signal })`) or the legacy `sendToApi()` wrapper from `src/lib/send-to-api.js`. Both dispatch `cc-api-error` on failure. Existing `sendToApi` usage does not need migrating.

### State is a discriminated union

Components with async data expose a single `state` property (`{ type: Object }`) typed in `cc-foo.types.d.ts` as a union discriminated on `type`: `'loading' | 'error' | 'loaded' | …`. The point is to make impossible states unrepresentable. Multiple independent datasets get separate props (`instancesState`, `backupsState`). Parents map raw data into a child's `state` inside `render()`.

### Events

Every custom event is a class in `cc-foo.events.js` extending `CcEvent` (`src/lib/events.js`), with a `static TYPE = 'cc-kebab-case'` and a JSDoc `@extends {CcEvent<Detail>}`. `CcEvent` always dispatches with `bubbles: true, composed: true` so events reach the smart container.

`src/lib/events-map.types.d.ts` is **generated** from all `*.events.js` files and must never be hand-edited. Run `pnpm components:events-map-generate` after touching events; CI fails otherwise. It augments `GlobalEventHandlersEventMap`, which is what makes `onEvent()` type-safe.

### i18n

`import { i18n } from '../../translations/translation.js'` then `i18n('cc-foo.some.key')` or `i18n('cc-foo.hello', { name })` (params always as a single object).

- Keys **must be static literals** — never `i18n('cc-foo.' + type)`. Use a `switch` returning static keys.
- Keys are prefixed with the component name, `-` inside words, `.` between sections, sorted alphabetically, grouped in `//#region cc-foo` … `//#endregion` blocks in `src/translations/translations.en.js` and `translations.fr.js`.
- A key is never shared between components.
- Values are strings or functions. HTML needs the `sanitize` tagged template, always wrapped in an arrow function: `() => sanitize\`<strong>…\``. It whitelists `<strong> <em> <code> <a>` and escapes params.
- `Intl.*` for dates/numbers; the repo's own `plural()` helper for plurals.

### Forms

Use the `formSubmit(onValid, onInvalid)` directive on `<form>`. CC controls (`cc-input-text`, `cc-input-number`, `cc-input-date`, `cc-select`) extend `CcFormControlElement` and need a `name`. Custom validation goes through `.customValidator` returning `Validation.invalid('code')` / `Validation.VALID` (`src/lib/form/validation.js`), and messages through `.customErrorMessages`. Form components hold a `formState` (`{ type: 'idle'|'loading'|'submitting'|'error', values, errors }`), use `FormErrorFocusController` for focus, and expose `resetForm()` for the smart component to call. See `docs/contributing/forms.md`.

### Styling and theming

Two token layers in `src/styles/default-theme.css`: raw palette choices (`--color-blue-60`) which components must **not** reference, and semantic decisions (`--cc-color-text-*`, `--cc-color-bg-*`, `--cc-focus-outline`, `--cc-border-radius-default`, …) which they consume. Theming = overriding the `--cc-*` layer.

Sizing uses `em`, not `rem` (ADR-0021). CSS declarations are sorted alphabetically (stylelint-enforced). Prefix `css` blocks with `// language=CSS`, and story templates with `// language=HTML`.

### URLs and assets

Never hardcode Clever Cloud URLs. Use `getDocUrl()` / `getDevHubUrl()` (`src/lib/dev-hub-url.js`), `getAssetUrl()` (`src/lib/assets-url.js`), and the wrappers in `src/lib/remote-assets.js` (`getFlagUrl`, `getInfraProviderLogoUrl`).

### Icons

Prefer Remix Icon (`src/assets/cc-remix.icons.js`, alias the import: `import { iconRemixCloudFill as iconLogo }`). Custom SVGs go in `src/assets/` (no hardcoded color, no `stroke`), then `pnpm components:generate-icons-assets`.

### Notifications

Smart components call `notifySuccess()` / `notifyError()` (`src/lib/notifications.js`), which fire a bubbling `cc-notify` event. Display is the host app's job: one `<cc-toaster>` listening for `cc-notify`.

## Component authoring conventions

Member order inside a Lit class (enforced by review, illustrated in `docs/cc-example-component.js`): `static get properties` → `constructor` → getters → setters → public methods → `_privateMethods` → `_onEventHandlers` → custom element lifecycle → Lit lifecycle → `render()` → `_renderSubpart()` → `static get styles`.

- Initialize **every** property in the constructor with a `/** @type {…} */` annotation.
- Private methods and reactive private state are `_`-prefixed (`_privateFoo: { type: Boolean, state: true }`).
- Event handlers are named `_onSomething`; sub-templates `_renderSomething`.
- Bind with `prop=${this.prop}` (no quotes).
- Mark props the component cannot work without using `/** @required */` in the properties block.
- `readonly` disables a control temporarily during an API call (keeps focus); `waiting` does the same for a button; `disabled` is only for permanent unavailability. `waiting` + `disabled` on a button throws.
- JSDoc: `@prop` (not `@attr`), sorted alphabetically, ordered `@prop`, `@fires`, `@slot`, `@cssprop`. Prop descriptions start with a third-person verb; event descriptions with "Fires whenever…".

## Stories

Built with the `makeStory()` helper. Export names follow a convention that drives auto-naming: `defaultStory`, `skeleton`, `loading`, `empty*`, `dataLoaded*`, `simulation*`, `error*`; a `With…` suffix becomes a parenthetical. Stories are also the source of a11y and visual tests — control them per-story or per-conf with `tests: { accessibility: { enable, ignoredRules } , visual: { enable } }`. Both are disabled by default on stories using `simulations`. Details in `docs/contributing/stories.md`.

## Commits

Conventional commits, linted by commitlint in CI. The scope is the component name: `feat(cc-select): add hidden-label property`. When several components are touched, split the commit or use the parent component as scope. Install the hook with `git config core.hooksPath '.githooks'`.

## Where the deeper docs are

`docs/contributing/` (wc-guidelines, i18n, forms, stories, test, smart-component, urls, previews, release) and `docs/adr/` (30 ADRs explaining *why* — e.g. em over rem, the icon system, design tokens, type checking, visual tests). Read the relevant ADR before challenging an existing convention.
