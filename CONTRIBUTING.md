---
kind: '👋 Contributing'
title: 'Contribute'
---

# How to contribute?

## We use ESLint

We use [ESLint](https://eslint.org/) to enforce JS coding style and spot linting errors ASAP.
Our configuration is a [flat config](https://eslint.org/docs/latest/use/configure/configuration-files) defined in `eslint.config.js`.
It is based on the shared [`@clevercloud/eslint-config`](https://github.com/CleverCloud/tooling-javascript) package, plus several project specific configs and plugins that live in the `eslint` folder (i18n, Lit, Lit a11y and Web Components rules).

All JavaScript files of the repository are scanned, except the ones ignored through `.gitignore`.

You can run the lint check with:

```bash
pnpm run lint
```

You can run the lint check (with autofix) with:

```bash
pnpm run lint:fix
```

## We use Prettier

We use [Prettier](https://prettier.io/) to format all the files of the project (see `prettier.config.js` and `.prettierignore`).
You can get more details by reading [the related ADR](📌-architecture-decision-records-adr-0026-introducing-prettier-as-a-formatter--docs).

You can format the whole project with:

```bash
pnpm run format
```

You can check the formatting (like the CI does) with:

```bash
pnpm run format:check
```

## We use Stylelint

We use [Stylelint](https://stylelint.io/) to enforce our CSS coding style directly inside the template literals of our components (see `stylelint.config.js`).
You can get more details by reading [the related ADR](📌-architecture-decision-records-adr-0023-adding-stylelint--docs).

```bash
pnpm run stylelint
pnpm run stylelint:fix
```

## We check types and Lit templates

We use [TypeScript](https://www.typescriptlang.org/) in `checkJs` mode to typecheck our JSDoc annotated JavaScript (see `tsconfig.ci.json`).
You can get more details by reading [the related ADR](📌-architecture-decision-records-adr-0027-enabling-type-checking--docs).

We also use [lit-analyzer](https://github.com/runem/lit-analyzer) to spot errors inside our Lit templates.

```bash
pnpm run typecheck
pnpm run components:check-lit
```

## We have a global quality gate

All the checks that must pass before publishing are chained by the `prepack:prod` task, see [the tasks documentation](👋-contributing-tasks--docs) for the full list and the details of each task.

## We use Storybook

You can have a local preview of the [Storybook](https://storybook.js.org/) (with live reload).
It's a great development experience when you work on a component.

You can start the local Storybook with:

```bash
pnpm run storybook:dev
```

When the `master` branch is updated, the latest version of the Storybook is automatically published on the [public preview](https://www.clever.cloud/developers/clever-components/).

The production build of the public Storybook is done with:

```bash
pnpm run storybook:build
```

## We build our components

All our components and the different JavaScript files in `src` (except tests and stories) are bundled with [Rollup](https://rollupjs.org/) and end up in `dist`, with their sourcemaps.
The JavaScript is minified with [Terser](https://github.com/terser-js/terser), the stylesheets we copy in `dist/styles` are minified with [clean-css](https://github.com/clean-css/clean-css) and the SVG assets are optimized with [SVGO](https://github.com/svg/svgo).

See `rollup/rollup-npm.config.js` and `rollup/rollup-common.js` for more details.

You can run the build process with:

```bash
pnpm run components:build
```

## We document our components

To document our Web Components, we use the [Custom Elements Manifest analyzer](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/analyzer).
It produces a single `dist/custom-elements.json` file that Storybook consumes to generate the documentation of each component.
The analyzer is configured in `custom-elements-manifest.config.mjs` and relies on several custom plugins that live in the `cem` folder.
You can get more details by reading [the related ADR](📌-architecture-decision-records-adr-0016-embracing-custom-elements-manifest--docs).

You can generate the components' docs with:

```bash
pnpm run components:docs
```

## We package our components for npm

To distribute our components for npm, we only package what's in `dist`.
When we publish a new version, a build (`pnpm run components:build`) of the components is automatically triggered.

You can import any given component like this:

```js
import '@clevercloud/components/dist/cc-button.js';
```

##  We have precise rules for commit message format

Commit messages must respect [conventional commit](https://www.conventionalcommits.org).

Possible types are `fix:`, `feat:`, `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`.

The scope should be the name of the component affected.
If many components are affected, consider the following options:
* split into multiple commits
* use the main component. For instance, refactoring `cc-tcp-redirection` component may surely affect `cc-tcp-redirection-form` component too. In this case, prefer using the parent component as scope: `refactor(cc-tcp-redirection-form)`.
* avoid specifying any scope and add some details instead. However, you must understand that details won't be dumped into the CHANGELOG.

If none of these options suits your need, you can follow [this how-to](https://github.com/googleapis/release-please#what-if-my-pr-contains-multiple-fixes-or-features) that will let you generate multiple CHANGELOG entries with one single commit.

To help you respect the rules, you should install a commit linter with the following command:

```shell
cd ${PATH_TO_THE_REPOSITORY_ROOT}
git config core.hooksPath '.githooks'
```
