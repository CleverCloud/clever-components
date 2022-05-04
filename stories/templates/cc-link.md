# `ccLink()` template and `linkStyles` CSS styles

We want all the HTML links included in our components to look the same and have the same behaviour.
Instead of creating a link component, we provide a helper function and some shared styles that any component can import and reuse.

## Features

* Automatic attributes: `target="_blank"` and `rel="nopener noreferrer"` when target origin is different from current origin.
* Default style with 6 color contrast ratio over a white background.
* Hover style with pointer cursor (default) and slightly darker color (primary).
* Focus styles with focus ring (and white background).
* Works well with `.skeleton`.

## How to use it?

In your component, import the template and styles like this:

```js
import { ccLink, linkStyles } from 'src/templates/cc-link.js';
import { defaultThemeStyles } from 'src/styles/default-theme.js';
```

When you need a link, use the `ccLink(url, content, skeleton)` function like this:

```html
<div>
  ${ccLink(null, 'My awesome link', true)}
</div>
```

You also need to add the CSS styles in your LitElement `static get styles()` like this:

```js
static get styles () {
  return [
    defaultThemeStyles,
    linkStyles,
    css`
      /* CSS for component goes here */
    `  
  ]
}
```
