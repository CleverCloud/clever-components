---
kind: '👋 Contributing'
title: 'Tasks'
---

# Tasks

This project provides a series of tasks you can run as [pnpm scripts](https://pnpm.io/cli/run).

## `pnpm run cdn-preview:build`

* Builds a CDN preview.
* It uses current branch name by default, but you can provide a `PREVIEW` environment variable to override the name.

## `pnpm run cdn-preview:delete`

* Delete a CDN preview.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `pnpm run cdn-preview:get`

* Get details of a CDN preview.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `pnpm run cdn-preview:list`

* List all the available CDN previews.

## `pnpm run cdn-preview:publish`

* Publish (create or update) a CDN preview.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `pnpm run cdn-preview:ui`

* Upload all assets in `cdn-ui` to the preview CDN remote object storage.
* You can get more details by reading:
  * [the documentation about the preview](👋-contributing-previews--docs).
  * [the documentation about the release](👋-contributing-release--docs).

## `pnpm run cdn-release:build`

* Build components for our smart CDN with [Rollup](https://rollupjs.org/) in `dist-cdn` folder.
* See config in `rollup/rollup-cdn.config.js` for more details.
* Requires a `VERSION` environment variable, you can use `0.0.0` when doing some local tests.
* You can get more details by reading:
  * [the documentation about the preview](👋-contributing-previews--docs).
  * [the documentation about the release](👋-contributing-release--docs).

## `pnpm run cdn-release:publish`

* Upload all assets in `dist-cdn` to the CDN remote object storage.
* You can get more details by reading:
  * [the documentation about the preview](👋-contributing-previews--docs).
  * [the documentation about the release](👋-contributing-release--docs).

## `pnpm run cdn-release:ui`

* Upload all assets in `cdn-ui` to the CDN remote object storage.
* You can get more details by reading [the documentation about the release](👋-contributing-release--docs).

## `pnpm run components:build`

* Build components for npm with [Rollup](https://rollupjs.org/) in `dist` folder.
* See config in `rollup/rollup-npm.config.js` for more details.
* You can get more details by reading [the global contributing page](👋-contributing-contribute--docs).

## `pnpm run components:check-i18n`

* Check translations between components and translation files with [i18n-extract](https://github.com/oliviertassinari/i18n-extract).
* Fails if a component tries to use a key undefined in translation files.
* Fails if a translation file has a key unused by components.

## `pnpm run components:check-lit`

* Check components with [lit-analyzer](https://github.com/runem/lit-analyzer), a code analyzer specific to Lit.

## `pnpm run components:docs`

* Generate [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) with [CEM analyzer](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/analyzer) in `dist`.

## `pnpm run components:generate-icons-assets`

* Bundles SVG icons in a JavaScript file to facilitate inlining them in components.
* Two files are generated:
  * `src/assets/cc-clever.icons.js` from the SVG files in `src/assets/`,
  * `src/assets/cc-remix.icons.js` from the `remixicon` dependency.
* Should be executed each time an icon is added, removed or updated.
* You can get more details by reading [the related ADR](📌-architecture-decision-records-adr-0022-implementing-a-new-icon-system--docs).

## `pnpm run components:graph-usage`

* ⚠️ Don't forget to add `--` between the command and your params. (e.g: `pnpm run components:graph-usage -- --uses cc-notice`)
* Params:
  * --depth (alias -d): Depth of the tree - value: number. (mandatory)
  * --all (alias -a): The depth of tree will be infinity - value: no value.
  * --uses (alias -u): Lists the components that use the component given in value param - value: global for all the components|cc-component for a specific component.
  * --used-by : Lists the components needed by the component given in value param - value: global for all the components|cc-component for a specific component.

## `pnpm run format`

* Formats source code.

## `pnpm run format:check`

* Checks that files are formatted correctly, used by the CI.

## `pnpm run lint`

* Check source files with [ESLint](https://eslint.org/).

## `pnpm run lint:fix`

* Check source files with [ESLint](https://eslint.org/) and fix errors automatically when it's possible.

## `pnpm run lint:fix`

* Runs the [ESLint config inspector](https://github.com/eslint/config-inspector).
* The config inspector opens up in a new browser tab but you can access `http://localhost:7777` if it doesn't open automatically.
* The inspector can be useful to visualize the ESLint config and help troubleshooting.

## `pnpm run prepack`

* Run all tasks required before publishing on npm:
  * `pnpm run test`
  * `pnpm run lint`
  * `pnpm run components:check-lit`
  * `pnpm run components:check-i18n`
  * `pnpm run components:build`
  * `pnpm run components:docs`
* This is run automatically before a `pnpm pack` and therefore before a `pnpm publish`.

## `pnpm run prestorybook:build`

* Run all tasks required before building [Storybook](https://storybook.js.org/):
  * `pnpm run components:docs`
* This is run automatically before a `pnpm run storybook:build`.

## `pnpm run preview:delete`

* Delete a branch on the preview system.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `pnpm run preview:get`

* Prints the preview detail.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `pnpm run preview:list`

* List all the available branches on the preview system.

## `pnpm run preview:publish`

* Publish (create or update) a branch on the preview system.
* It uses current branch name by default, but you can provide a CLI param to override the name.

## `pnpm run start`

* Start a static HTTP server to serve the [Storybook](https://storybook.js.org/) from `storybook-static`.

## `pnpm run storybook:build`

* Build [Storybook](https://storybook.js.org/) in production mode to `storybook-static`.

## `pnpm run storybook:dev`

* Start prebuilt [Storybook](https://storybook.js.org/) in dev mode with [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/).
* This implicitly generates the [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) on each file change.

## `pnpm run stylelint`

Check the CSS of our components with [Stylelint](https://stylelint.io/).

## `pnpm run stylelint:fix`

Check the CSS of our components with [Stylelint](https://stylelint.io/) and fix errors automatically when it's possible.

## `pnpm run test`

* Run all unit tests present in `test` with [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/).

## `pnpm run test:group`

* Run tests for a specific group with Web Test Runner
* Groups available:
  * `unit` - Runs all unit tests from test/**/*.test.*
  * Individual component groups in format:
    * `stories:${componentName}` - Run tests for a component's stories
    * `test:${componentName}` - Run tests for a component's test file
* Usage: `pnpm run test:group <group-name>`

## `pnpm run test:mocha`

* Run unit tests present in `test-mocha` with [Mocha](https://mochajs.org/).
* These tests cannot be run with `wtr` because they rely on Node.js / commonjs APIs.

## `pnpm run test:mocha:watch`

* Run unit tests present in `test-mocha` with [Mocha](https://mochajs.org/) in watch mode.
* These tests cannot be run with `wtr` because they rely on Node.js / commonjs APIs.

## `pnpm run test:watch`

* Run all unit tests present in `test` with [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) in watch mode.

## `pnpm run test:watch:group`

* Run tests for a specific group with Web Test Runner in watch mode
* Takes same group parameters as `test:group` command
* Usage: `pnpm run test:watch:group <group-name>`

## `pnpm run test:visual`

* Run visual regression tests with [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/),
* This task is designed to be run in CI.

## `pnpm run test:visual:update-expectation`

* Update visual regression test expectations with [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/),
* This task is designed to be run in CI.

## `pnpm run typecheck`

* Run the TypeScript compiler to typecheck every file matching the criteria specified within the `tsconfig.ci.json` file.

## `pnpm run typecheck:stats`

* Report how many files are typechecked through CI for some categories
  * Components
  * Components (smart)
  * Components (test)
  * Components (stories)
  * Controllers
  * Libs
