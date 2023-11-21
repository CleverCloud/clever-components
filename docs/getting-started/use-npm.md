---
kind: '🏡 Getting Started'
title: 'Install via NPM'
---

# How to install components via NPM?

## Prerequisite

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

<cc-notice intent="info" message="You can use a bundler, but it is not mandatory."></cc-notice>

## Installation

First, install Clever Components as a dependency:

```bash
npm install @clevercloud/components
```

## Components

You can import our components from various ways depending on your stack: the most straightforward way is directly from HTML via a `<script>` tag. 

```html
<script type="module" src="node_modules/@clevercloud/components/dist/cc-notice.js"></script>
```

Or from your JavaScript using the `import()` function.

```js
import('@clevercloud/components/dist/cc-notice.js');
```

## Theme

The CSS file is available at `/dist/styles/default-theme.css` in the npm package [`@clevercloud/components`](https://www.npmjs.com/package/@clevercloud/components).

The specific solution to import this CSS file depends a lot on your project stack and config.

### Importing CSS from HTML

If your toolchain supports it, you can import the CSS file like this:

```html
<link rel="stylesheet" src="/node_modules/@clevercloud/components/dist/styles/default-theme.css">
```

### Importing CSS from CSS

If your toolchain supports it, you can import the CSS file like this:

```css
@import '@clevercloud/components/dist/styles/default-theme.css';
```

If it doesn't work, you could try directly from the `node_modules` folder:

```css
@import '/node_modules/@clevercloud/components/dist/styles/default-theme.css';
```

### Importing CSS from JavaScript

If your bundler supports it, you can import the CSS file like this:

```js
import '@clevercloud/components/dist/styles/default-theme.css';
```

## Localization

If you're using our component library, you'll need to:

1. Load the language file(s)
2. Register language(s)
3. Select the language selected by your user

Depending on your context, the setup can be done synchronously or asynchronously.

### Asynchronous setup example

It's always better if you can only load the language you need.

```js
// Import function from system
import { addTranslations, setLanguage } from '@clevercloud/components/dist/i18n.js';

// Load the language files asynchronously (ex: french only) 
import('@clevercloud/components/dist/translations.fr.js')
  .then(({ lang, translations }) => {
    // Register languages (ex: french)
    addTranslations(lang, translations);
    // Select the language selected by your user (ex: french)
    setLanguage(lang);
  })
```

### Synchronous setup example

```js
// Load the language files synchronously (ex: english and french) 
import * as en from '@clevercloud/components/dist/translations.en.js';
import * as fr from '@clevercloud/components/dist/translations.fr.js';

// Import function from system
import { addTranslations, setLanguage } from '@clevercloud/components/dist/i18n.js';

// Register languages
addTranslations(en.lang, en.translations);
addTranslations(fr.lang, fr.translations);

// Select the language selected by your user (ex: english)
setLanguage(en.lang);
```
