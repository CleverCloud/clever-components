---
kind: '📌 Docs'
---

# How to use the components theme?

The components rely on a common default theme.
This default theme is essentially made of CSS Custom Properties contained in a CSS file.
This means that you need to import this CSS file so that components work as intended.

**Note:**
If the components are displayed in black and white, it means you forgot or failed to import the default theme file.

## Using npm

The CSS file is available at `/dist/styles/default-themes.css` in the npm package [`@clevercloud/components`](https://www.npmjs.com/package/@clevercloud/components).

The specific solution to import this CSS file depends a lot on your project stack and config.

### Importing CSS from HTML

If your toolchain supports it, you can import the CSS file like this:

```html
<link rel="stylesheet" src="/node_modules/@clevercloud/components/dist/styles/default-themes.css">
```

### Importing CSS from CSS

If your toolchain supports it, you can import the CSS file like this:

```css
@import '@clevercloud/components/dist/styles/default-themes.css';
```

If it doesn't work, you could try directly from the `node_modules` folder:

```css
@import '/node_modules/@clevercloud/components/dist/styles/default-themes.css';
```

### Importing CSS from JavaScript

If your bundler supports it, you can import the CSS file like this:

```js
import '@clevercloud/components/dist/styles/default-themes.css';
```

## Copy-pasting the file

If your project toolchain is not based on Node.js and npm, you can copy-paste the CSS file in your own source code.

**Warning:**
With this solution, you won't get automatic updates. You will need to check the [changelog](https://github.com/CleverCloud/clever-components/blob/master/CHANGELOG.md) for potential breaking changes and update your local copy every time.

The CSS file to copy is available at (replace `<VERSION>` with the one you're using):

```
https://github.com/CleverCloud/clever-components/blob/<VERSION>/src/styles/default-theme.css
```
