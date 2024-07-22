---
kind: '👋 Contributing'
title: 'Tasks'
---

# Tasks

This project provides a series of tasks you can run as [npm scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts).

## `npm run cdn-preview:build`

* Builds a CDN preview.
* It uses current branch name by default, but you can provide a `PREVIEW` environment variable to override the name.

## `npm run cdn-preview:delete`

* Delete a CDN preview.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `npm run cdn-preview:get`

* Get details of a CDN preview.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `npm run cdn-preview:list`

* List all the available CDN previews.

## `npm run cdn-preview:publish`

* Publish (create or update) a CDN preview.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `npm run cdn-preview:ui`

* Upload all assets in `cdn-ui` to the preview CDN remote object storage.
* You can get more details by reading:
  * [the documentation about the preview](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%91%8B-contributing-previews--docs). 
  * [the documentation about the release](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%91%8B-contributing-release--docs). 

## `npm run cdn-release:build`

* Build components for our smart CDN with [Rollup](https://rollupjs.org/) in `dist-cdn` folder.
* See config in `rollup/rollup-cdn.config.js` for more details.
* Requires a `VERSION` environment variable, you can use `0.0.0` when doing some local tests.
* You can get more details by reading:
  * [the documentation about the preview](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%91%8B-contributing-previews--docs).
  * [the documentation about the release](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%91%8B-contributing-release--docs).

## `npm run cdn-release:publish`

* Upload all assets in `dist-cdn` to the CDN remote object storage.
* You can get more details by reading:
  * [the documentation about the preview](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%91%8B-contributing-previews--docs).
  * [the documentation about the release](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%91%8B-contributing-release--docs).

## `npm run cdn-release:ui`

* Upload all assets in `cdn-ui` to the CDN remote object storage.
* You can get more details by reading [the documentation about the release](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%91%8B-contributing-release--docs).

## `npm run components:build`

* Build components for npm with [Rollup](https://rollupjs.org/) in `dist` folder.
* See config in `rollup/rollup-npm.config.js` for more details.
* You can get more details by reading [the global contributing page](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%91%8B-contributing-contribute--docs).

## `npm run components:check-i18n`

* Check translations between components and translation files with [i18n-extract](https://github.com/oliviertassinari/i18n-extract).
* Fails if a component tries to use a key undefined in translation files.
* Fails if a translation file has a key unused by components.

## `npm run components:check-lit`

* Check components with [lit-analyzer](https://github.com/runem/lit-analyzer), a code analyzer specific to Lit.

## `npm run components:check-type-imports`

* Check that each component has:
  * types present in `@fires` event are imported.
  * types present in the constructor are imported.

## `npm run components:docs`

* Generate [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) with [CEM analyzer](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/analyzer) in `dist`.

## `npm run components:generate-icons-assets`

* Bundles SVG icons in a JavaScript file to facilitate inlining them in components.
* Two files are generated:
  * `src/assets/cc-clever.icons.js` from the SVG files in `src/assets/`,
  * `src/assets/cc-remix.icons.js` from the `remixicon` dependency.
* Should be executed each time an icon is added, removed or updated.
* You can get more details by reading [the related ADR](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%93%8C-architecture-decision-records-adr-0022-implementing-a-new-icon-system--docs).

## `npm run components:graph-usage`

* ⚠️ Don't forget to add `--` between the command and your params. (e.g: `npm run components:graph-usage -- --uses cc-notice`)
* Params:
  * --depth (alias -d): Depth of the tree - value: number. (mandatory)
  * --all (alias -a): The depth of tree will be infinity - value: no value.
  * --uses (alias -u): Lists the components that use the component given in value param - value: global for all the components|cc-component for a specific component.
  * --used-by : Lists the components needed by the component given in value param - value: global for all the components|cc-component for a specific component.

## `npm run format`

* Formats source code.

## `npm run format:check`

* Checks that files are formatted correctly, used by the CI.

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

## `npm run preview:delete`

* Delete a branch on the preview system.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `npm run preview:get`

* Prints the preview detail.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `npm run preview:list`

* List all the available branches on the preview system.

## `npm run preview:publish`

* Publish (create or update) a branch on the preview system.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `npm run start`

* Start a static HTTP server to serve the [Storybook](https://storybook.js.org/) from `storybook-static`.

## `npm run storybook:build`

* Build [Storybook](https://storybook.js.org/) in production mode to `storybook-static`.

## `npm run storybook:dev`

* Start prebuilt [Storybook](https://storybook.js.org/) in dev mode with [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/).
* This implicitly generates the [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) on each file change.

## `npm run stylelint`

Check the CSS of our components with [Stylelint](https://stylelint.io/).

## `npm run stylelint:ci`

Used by our GitHub action to check our CSS and report errors.

## `npm run stylelint:fix`

Check the CSS of our components with [Stylelint](https://stylelint.io/) and fix errors automatically when it's possible.

## `npm run test`

* Run all unit tests present in `test` with [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/).

## `npm run test:cem`

* Run unit tests present in `cem/test` with [Mocha](https://mochajs.org/).

## `npm run test:cem:watch`

* Run unit tests present in `cem/test` with [Mocha](https://mochajs.org/) in watch mode.

## `npm run test:watch`

* Run all unit tests present in `test` with [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) in watch mode.

## `npm run typecheck`

* Run the TypeScript compiler to typecheck every file matching the criteria specified within the `tsconfig.ci.json` file.

## `npm run typecheck:stats`

* Report how many files are typechecked through CI for some categories
  * Components
  * Components (smart)
  * Components (test)
  * Components (stories)
  * Controllers
  * Libs
