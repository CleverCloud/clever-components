# Clever Components changelog

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
