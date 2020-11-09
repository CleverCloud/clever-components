# Clever Components changelog

## Unreleased (????-??-??)

* `<cc-zone-input>`: fix scrollIntoView behaviour
* `<cc-map>`: fix race conditions on view-zoom update (and other attrs)

## 5.1.0 (2020-11-03)

* `<cc-zone-input>`: change default internal `view-zoom` to `1`

## 5.0.0 (2020-11-03)

### ⚠️ BREAKING CHANGES

* `<cc-map>`: rework the API to place markers with something more generic
* `<cc-heptapod-info>`:
  * rename `statistics` properties
  * set default display to `block`
  * remove max-width
  * rework `loading`/`skeleton` logic
* Remove `<cc-elasticsearch-options>`, replaced by `<cc-addon-elasticsearch-options>`
  * Merge many attrs/props into `options`

### Components

* New components:
  * `<cc-addon-option>`
  * `<cc-addon-option-form>`
  * `<cc-addon-elasticsearch-options>`
  * `<cc-addon-postgresql-options>`
  * `<cc-addon-mysql-options>`
  * `<cc-addon-mongodb-options>`
  * `<cc-map-marker-dot>`
  * `<cc-map-marker-server>`
  * `<cc-zone>`
  * `<cc-zone-input>`
* `<cc-header-app>`: add `zone` details
* `<cc-img>`: add CSS custom prop `--cc-img-fit` to customize object-fit (default is cover)
* `<cc-env-var-form>`: fix restart button margin
* `<cc-flex-gap>`: add `--cc-align-items` CSS property
* Rework the way we format bytes and use it in `<cc-heptapod-info>`, `<cc-tile-scalability>` and `<cc-addon-elasticsearch-options>`

### For devs

* Update @clevercloud/client to 7.0.0
* docs: add some details about properties/attributes in cc-example-component.js
* Replace cypress by web-test-runner (and fix a test)
* Add tests for `prepareNumberUnitFormatter()`, refine implementation and adapt tests
* Refactor:
  * `<cc-logsmap>`: absorb logic that was in `<cc-map>` and use `<cc-map-marker-dot>`
  * `<cc-map>`: simplify setters and remove useless country property in point object
  * `<cc-heptapod-info>`: fix small issues (lint, CSS, story, API...)

## 4.1.2 (2020-08-14)

### Components

* `<cc-heptapod-info>`: Fix heptapod about link href

## 4.1.1 (2020-08-13)

### Components

* `<cc-heptapod-info>`:
  * Fix price translations
  * Change default width from 500px to 600px

## 4.1.0 (2020-08-13)

### Components

* New component: `<cc-heptapod-info>`

## 4.0.0 (2020-07-16)

### ⚠️ BREAKING CHANGES

* We moved our internal build to rollup and changed the way we link to images from non-standard syntax to `import.meta.url`.
  * Depending on the way you bundle our components, you may need some config to support this.
* We removed the outter margin on `:host` of several components:
  * `<cc-toggle>`
  * `<cc-input-text>`
  * `<cc-button>`
* We renamed all `<env-var-*>` components to `<cc-env-var-*>`
* `<cc-button>`: always display text when `image` is used
* We removed `index.js`, if you were using it, you now need to import the components one by one with their direct paths

### Components

* You can now set objects and arrays via attributes (as JSON)
* New components:
  * `<cc-flex-gap>`
  * `<cc-tcp-redirection-form>`
  * `<cc-tcp-redirection>`
* `<cc-addon-admin>`: simplify i18n (fix #103)
* `<cc-block>`: align icon on top (flex-start)
* `<cc-button>`:
  * Add `waiting` state
  * Handle `delay=0`
  * Fix image height with new inner grid system
  * Fix JSDoc
  * Fix story doc
* `<cc-env-form>`: fix overflow pb with inner button focus rings
* `<cc-env-var-form>`: fix overflow behaviour with inner input focus rings
* `<cc-env-var-input>`: fix story data (was broken for ages...)
* `<cc-expand>`: fix spring effect
* `<cc-header-orga>`: fix vertical alignment
* `<cc-input-text>`:
  * Adjust tag border-radius
  * Display placeholders in italics
  * Fix undefined behaviour
  * Force white background
* `<cc-link>`: fix lint issue
* `<cc-toggle>`:
  * Add multiple mode (with checkboxes)
  * Add color story and rework examples
  * Add subtle display mode
  * Add image feature (and image only feature)
  * Add `--cc-toggle-img-filter*` custom props and a toolbar story
  * Add a legend to describe the whole group
  * Add active state with small change on background size
  * Enhance backgroud display (hover & selected)
  * Fix component's and stories' docs
  * Fix CSS order
  * Fix JSDoc for event `cc-toggle:input-multiple`
  * Fix vertical text alignement
  * Only show focus ring when not hovered
  * Refactor CSS and move borders on labels
  * Refactor CSS to group and comment sections
  * Remove box-shadow when hovered (we already have a cursor:pointer)
  * Revert to button like border-radius
  * Show boolean example with "activated" choice on the right in the story
  * Switch layout strategy (txt+padding => height+line-height)

### Docs

* Update CONTRIBUTING.md
* Storybook
  * Show list of images used by a component in docs page
  * Add link to source for each component in docs page 
  * Add details about component default CSS `display` in docs page
  * Force white background in preview (iPad gets dark auto mode)
  * Improve show code display (and remove hack)
* Startup examples/docs:
  * Rename `ExampleComponent.js` to `cc-example-component.js` and improve examples and docs
  * Introduce `cc-example-component.stories.js` with examples and docs

### For devs

* Update deps
* Update gitlab-ci scaling config
* build: use rollup to build the components
* Storybook
  * Remove useless hacks
  * Simplify i18n-knob hack
  * Use proper story root separator "/" ("|" is deprecated)
  * Load event names from custom-elements.json (addon action)
  * Simplify markdown docs loading
* Refactor:
  * Rename "skeleton" to "skeletonStyles" (fix #92)
  * Rename "instanceDetails" to "instanceDetailsStyles" (fix #92)
  * Change the way we declare skeleton constant data
  * Move all assets (svg icons and geojson) into "assets" dir
  * Big bang rename from `components` to `src`
  * Remove dead code in `<cc-button>` method `_cancelClick()`
  * Add `.cc-waiting` for subtle blinking animations
* ESLint:
  * add custom rule "sort-lit-element-css-declarations"
  * add lit-html specific rules
  * add ES import rules (sort, extensions, dev deps...)
* Add `component:check-lit` task using lit-analyzer to lint/check our components

## 3.0.2 (2020-03-27)

* Update @clevercloud/client to 5.0.1

## 3.0.1 (2020-03-26)

* Change `<cc-beta>` default to `display:grid` so it fixes `<cc-overview>` in Safari with `<cc-logsmap>`

## 3.0.0 (2020-03-14)

### Components

* New component: `<env-var-linked-services>`
* `<env-var-form>`:
  * center overlay blocks in env editor
  * introduce `context` (and `appName`) to provide several translated heading & descriptions
  * pause skeleton on loading errors
  * remove `@env-var-form:dismissed-error` for loading errors
  * just mention "variables" without environment in i18n
  * add docs for default slot
  * remove promise based API

### For devs

* Add Apache 2 license
* Update dev deps (build, tasks...)
* Update to Storybook 5.3.17

### ⚠️ BREAKING CHANGES

* `<env-var-full>`: remove component

NOTE: This component was a bit too high level and the composition was hard to struggle with

## 2.0.2 (2020-03-06)

* `<env-var-form>`: fix parsing/serialization pb with simple/export mode

NOTE: This is a bug fix but if you copy/paste stuffs in the expert mode that was serialized in the old version you could have some problems.

## 2.0.1 (2020-03-05)

* `<cc-elasticsearch-options>`: fix translations/wording
* `<cc-elasticsearch-info>`: fix translations/wording

## 2.0.0 (2020-03-04)

* Update `@clevercloud/client` to `2.3.1`
* New component: `<cc-elasticsearch-options>`
* `<cc-toggle>`:
  * reflect attribute `value`
  * allow `choices` as JSON attribute
  * expose and document cc-toggle-color

### ⚠️ BREAKING CHANGES

* `<cc-elasticsearch-info>`: make all links optional

## 1.4.0 (2020-02-11)

### Components

#### New components for add-ons:

* New component: `<cc-header-addon>`
* New component: `<cc-elasticsearch-info>`
* New component: `<cc-addon-credentials>`
* New component: `<cc-addon-features>`
* New component: `<cc-addon-admin>`
* New component: `<cc-addon-backups>`
* New component: `<cc-addon-linked-apps>`

#### New molecules for all our components:

* New component: `<cc-block>` and `<cc-block-section>`
* New component: `<cc-error>` (and remove `iconStyles`)
* New template: `ccLink()` (with `linkStyles`)

#### Existing components

* `<cc-button>`:
  * add `.focus()` method
  * add `link` feature
  * fix image alignement
  * prevent native click events from propagating/bubbling
  * unset `font-size`
* `<cc-input-text>`:
  * add `tags` feature
  * add `label` feature
  * add `requestimplicitsubmit` event
  * fix hover behaviour on clipboard/secret buttons
* `<cc-logsmap>`: add `<strong>` tags in i18n strings to highlight orga/app name in legend
* `<cc-map>`: don't display no heatmap points when there is an error
* `<cc-overview>`: allow multiple heads with `--cc-overview-head-count`
* `<cc-tile-requests>`: add `<strong>` tags in i18n strings to highlight time window in help
* `<env-var-create>`: add `<code>` tags in i18n strings to highlight error messages
* `<env-var-create>`: use `cc-input-text:requestimplicitsubmit`
* `<env-var-editor-expert>`: add `<code>` tags in i18n strings to highlight error messages
* `<env-var-form>`: use `cc-input-text:requestimplicitsubmit`
* `<env-var-input>`: fix alignment between name and value

### For devs

* Skeleton: add paused state
* Add `sanitize` tag template function to be used in i18n strings containing HTML
  * With cypress test runner
* i18n: Add "Missing lang" to help identify hard coded strings
* Add ADR describing our Storybook migration
* Storybook: update to Storybook 5.3.x ;-)
* Storybook: reload stories when translations are updated
* Tasks: add total count to tasks size
* Removed twemoji depencendy
* Update deps

## 1.3.0 (2019-12-21)

### Components

- New component: `<cc-beta>`
- New component: `<cc-datetime-relative>`
- New component: `<cc-img>`
- New component: `<cc-logsmap>`
- New component: `<cc-map>`
- New component: `<cc-header-app>`
- New component: `<cc-header-orga>`
- New component: `<cc-overview>`
- New component: `<cc-tile-consumption>`
- New component: `<cc-tile-deployments>`
- New component: `<cc-tile-instances>`
- New component: `<cc-tile-requests>`
- New component: `<cc-tile-scalability>`
- New component: `<cc-tile-status-codes>`
- New mixin: `withResizeObserver()`
- `<cc-button>`
  * move away from native click event to custom event `cc-button:click`
  * add warning mode
  * add delay mechanism
- `<cc-input-text>`
  * add copy-to-clipboard feature with `clipboard`
  * add show/hide secret feature with `secret`

### For devs

- New task: `size`
- New i18n system
- New dependencies:
  * [chart.js](https://www.npmjs.com/package/chart.js)
  * [chartjs-plugin-datalabels](https://www.npmjs.com/package/chartjs-plugin-datalabels)
  * [clipboard-copy](https://www.npmjs.com/package/clipboard-copy)
  * [leaflet](https://www.npmjs.com/package/leaflet)
  * [leaflet.heat](https://www.npmjs.com/package/leaflet.heat)
  * [resize-observer-polyfill](https://www.npmjs.com/package/resize-observer-polyfill)
  * [statuses](https://www.npmjs.com/package/statuses)
  * [twemoji](https://www.npmjs.com/package/twemoji)

### Storybook

- Update storybook to 5.3.0-rc
- Update stories to CSF (with a `makeStory` helper) and some MDX documents
- Move from `@storybook/html` to `@storybook/web-components`
- Add a11y addon
- Add viewport addon

## 1.2.0 (2019-07-25)

- Use @clevercloud/client utils to handle env vars

## 1.1.0 (2019-07-15)

- env-var-create: rename button "create" => "add"

## 1.0.7 (2019-07-10)

- cc-toggle: fix isolation of name in shadow DOM for Safari
- cc-input-text: remove Safari box-shadow

## 1.0.6 (2019-07-10)

- cc-input-text: update monospace font

## 1.0.5 (2019-07-10)

- env-var-input: fix button alignment
- env-var-create: fix button alignment
- env-var-input: switch outline for delete/keep button

## 1.0.4 (2019-07-10)

- env-var-input: switch colors for delete/keep button

## 1.0.3 (2019-07-09)

- env-var-input: fix keep/delete
- env-var-form: fix reset form
- env-var-create: fix focus after click on create

## 1.0.2 (2019-07-09)

- cc-input-text: stop propagation on keypress as well

## 1.0.1 (2019-07-09)

- Update npm scripts (move stuffs from `install` to `prestart`)

## 1.0.0 (2019-07-09)

First public stable release

- Expose env-var utils
- Expose i18n helper (with fr and en translations)
- New component: `cc-button`
- New component: `cc-expand`
- New component: `cc-input-text`
- New component: `cc-loader`
- New component: `cc-toggle`
- New component: `env-var-create`
- New component: `env-var-editor-expert`
- New component: `env-var-editor-simple`
- New component: `env-var-form`
- New component: `env-var-full`
- New component: `env-var-input`
