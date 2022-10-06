---
kind: 📌 Docs
---
# How to contribute?

Here are some details on the different npm tasks we use.
You'll also want to read the details about Web Components contributions in [`web-components-guidelines.stories.mdx`](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%93%8C-docs-web-components-guidelines-at-clever-cloud--page).

## We use ESLint

We use [ESLint](https://eslint.org/) to enforce JS coding style and spot linting errors ASAP.
Our configuration is based on [standardJS](https://standardjs.com/) + some small tweaks (see `.eslintrc.js`).

All JavaScript files in `src`, `stories` and `tasks` are scanned.

You can run the lint check with:

```bash
npm run lint
```

You can run the lint check (with autofix) with:

```bash
npm run lint:fix
```

## We use Storybook

You can have a local preview of the [Storybook](https://storybook.js.org/) (with live reload).
It's a great development experience when you work on a component.

You can start the local Storybook with:

```bash
npm run storybook:dev
```

When the `master` branch is updated, the latest version of the Storybook is automatically published on the [public preview](https://www.clever-cloud.com/doc/clever-components/).

The production build of the public Storybook is done with:

```bash
npm run storybook:build
```

## We build our components

All our components and the different JavaScript files in `src/lib` are minified with [Terser](https://github.com/terser-js/terser) and end up in `dist`.
We also use a specific babel plugin to minify the HTML and the CSS in our LitElement components: [babel-plugin-template-html-minifier](https://github.com/cfware/babel-plugin-template-html-minifier).

To process those files through babel and terser and keep the sourcemaps, we wrote a small script in `tasks/minify-components.js`.

You can run the build process with:

```bash
npm run components:build
```

## We document our components

To document our Web Components, we use [web-component-analyzer](https://github.com/runem/web-component-analyzer).
We chose the markdown output, they all end up in `.component-docs` and we integrate them manually in Storybook's stories as notes.

You can generate the components' docs with:

```bash
npm run components:docs
```

## We package our components for npm

To distribute our components for npm, we only package what's in `dist`.
When we publish a new version, a build (`npm run components:build`) of the components is automatically triggered.

You can import any given component like this:

```js
import '@clevercloud/components/dist/atoms/cc-button.js';
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
