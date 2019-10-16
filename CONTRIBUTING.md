# Contributing to Clever Components

Here are some details on the different npm tasks we use.
You'll also want to read the details about Web Components contributions in `WEB-COMPONENTS.md`.

## We use ESLint

We use [ESLint](https://eslint.org/) to enforce JS coding style and spot linting errors ASAP.
Our configuration is based on [standardJS](https://standardjs.com/) + some small tweaks (see `.eslintrc.js`).

All JavaScript files in `components`, `stories` and `tasks` are scanned.

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

All our components and the different JavaScript files in `components/lib` are minified with [Terser](https://github.com/terser-js/terser) and end up in `dist`.
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

We also expose all components on the package directly with `index.js`.
Don't forget to add your new components in this.
This way, users can also import any component like this:

```js
import { CCButton } from '@clevercloud';
```

## We translate our components

When you work on a component, you need to follow several steps...

Step 1, in your component, import the function from the module:

NOTE: you may need to adjust the path to the file since it's relative.

```js
import { i18n } from '../lib/i18n.js';
```

Step 2, use the function in your code with just the key:

```html
<input placeholder=${i18n('my-component.i18n-key')}>
```

or with the key AND named params:

```html
<input placeholder=${i18n('my-component.i18n-key', { name: 'John' })}>
```

Step 3, make sure translations exists in `components/translations/translations.[lang].js` and add an entry to the object with the text value:

```js
{
  'my-component.i18n-key': `Hello`,
}
```

or with an arrow function and destructured named params:

```js
{
  'my-component.i18n-key': ({ name }) => `Hello ${name}`,
}
```

## We check our components' translations

Using [i18n-extract](https://github.com/oliviertassinari/i18n-extract), we created a task that scans all source files.
It checks two things:

* Look for `i18n('key', args)` in the code and make sure all translations exist
* Look for translations in `components/translations` and make sure we use all defined translations

You can run this check with:

```bash
npm run components:check-i18n
```

WARNING: This means you CANNOT use the `i18n` with a dynamic string.
