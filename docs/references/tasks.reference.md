---
kind: '📌 Docs/References'
title: 'Tasks'
---
# Tasks reference

This project provides a series of tasks you can run as [npm scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts).

## `npm run components:build`

* Build components for npm with [Rollup](https://rollupjs.org/) in `dist` folder.
* See config in `rollup/rollup-npm.config.js` for more details.
* TODO: link to detailed build documentation

## `npm run components:build-cdn`

* Build components for our smart CDN with [Rollup](https://rollupjs.org/) in `dist-cdn` folder.
* See config in `rollup/rollup-cdn.config.js` for more details.
* Requires a `GIT_TAG_NAME` environment variable, you can use `x.y.z` when doing some local tests.
* TODO: link to detailed build documentation

## `npm run components:build-cdn:versions-list`

* Build the version `versions-list.json` file in `dist-cdn`, so it can be uploaded on the smart CDN.
* This is based on the list of tags on the [GitHub repo](https://github.com/CleverCloud/clever-components).

## `npm run components:publish-cdn`

* Upload all assets in `dist-cdn` to the remote object storage.
* TODO: link to detailed build documentation about the CDN mode

## `npm run components:check-i18n`

* Check translations between components and translation files with [i18n-extract](https://github.com/oliviertassinari/i18n-extract).
* Fails if a component tries to use a key undefined in translation files.
* Fails if a translation file has a key unused by components.

## `npm run components:check-lit`

* Check components with [lit-analyzer](https://github.com/runem/lit-analyzer), a code analyzer specific to Lit.

## `npm run components:docs`

* Generate [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) with [CEM analyzer](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/analyzer) in `dist`.

## `npm run components:docs:watch`

* Same as npm run components:docs but in watch mode.
* This is used by [Storybook](https://storybook.js.org/) in dev mode.

## `npm run test`

* Run all unit tests present in `test` with [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/).

## `npm run test:watch`

* Same as npm run test but in watch mode.

## `npm run lint`

* Check source files with [ESLint](https://eslint.org/).

## `npm run lint:fix`

* Check source files with [ESLint](https://eslint.org/) and fix errors automatically when it's possible.

## `npm run prepack`

* Run all tasks required before publishing on npm:
  * `npm run test`
  * `npm run lint`
  * `npm run components:check-lit`
  * `npm run components:check-i18n`
  * `npm run components:build`
  * `npm run components:docs`
* This is run automatically before a `npm pack` and therefore before a `npm publish`.

## `npm run prestorybook:build`

* Run all tasks required before building [Storybook](https://storybook.js.org/):
  * `npm run components:docs`
* This is run automatically before a `npm run storybook:build`.

## `npm run preview:list`

* List all the available branches on the preview system.

## `npm run preview:publish`

* Publish (create or update) a branch on the preview system.
* It uses current branch name by default, but you can provide a CLI param to override the name. 

## `npm run preview:delete`

* Delete a branch on the preview system.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `npm run start`

* Start a static HTTP server to serve the [Storybook](https://storybook.js.org/) from `storybook-static`.

## `npm run storybook:build`

* Build [Storybook](https://storybook.js.org/) in production mode to `storybook-static`.

## `npm run storybook:dev`

* Start prebuilt [Storybook](https://storybook.js.org/) in dev mode with [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/).
* This implicitly generates the [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) on each file change.
