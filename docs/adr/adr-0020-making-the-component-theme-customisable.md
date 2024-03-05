---
kind: '📌 Architecture Decision Records'
---

# ADR 0020: Making the component theme customisable

🗓️ 2022-08-26 · ✍️ Florian Sanders

## The context

As explained in the ADR #0017 - Finding accessible colors and creating Design Tokens, we introduced design tokens divided into two categories:

* "choices" that represent the colors used by our components. They are supposed to be private, not exposed and not customizable. For instance `--color-red: #be242d`.
* "decisions" that represent our semantic choices applying specific colors for specific content types. These are supposed to be public and customizable. For instance `--color-text-success`.

These tokens were stored as CSS Custom Props, inside a JavaScript file that needed to be imported by components.

The goal of our semantic tokens, the "decisions", is that they can be used as some kind of API for theme customisation.
If one wanted to customise the common theme (mainly the colors at the moment) of our components, they would insert their own colors as values of these semantic tokens.
For instance:
```css
--color-text-success: your value;
```

## The problems

There were several limitations that made properly customising the theme impossible.
These limitations were actually well known because the first step was building the theme system before making it customisable.

### Serving and using the theme

The theme was contained in a JavaScript file and every component had to import it.

```js
import { defaultThemeStyles } from '../styles/default-theme.js';
...
static get styles () {
  return [
    defaultTheme,
    css`
      ...
    `,
  ],
}
```

This meant that our tokens were processed as a constructable stylesheet and it was very difficult to override their values from a CSS file outside the components.

Keeping the JavaScript file to provide our tokens would have meant relying on the build process to allow people to customise the tokens.
Since we also make our components available via a CDN, we did not want to rely on the build process to allow people to override our token values.

### Planning for a dark theme

Our components had issues with background colors that would block theme customisation:

* some of them did not define a default background color. This did not cause any issue as long as the context in which they were integrated used a white color background, but as soon as you changed the background color of their parent, some issues appeared.
* some of them had a background color hard coded. If you wanted to use the components in a dark mode, changing our `color-bg-default` token would have no effect and the component backgrounds would remain white. On the other hand, their default font color was inherited. Thus, you could end up with a white text color, inherited from your website dark mode colors, over a white background color, hard coded within the components.

## The solutions

### Serving and using the theme

We decided to move the theme from the JavaScript file to a CSS file.

This has several advantages:

* the CSS file can be easily swapped for another,
* it does not require you to hook into the build process,
* CSS files work and integrate easily in any web project,
* components do not need to import the theme anymore.

It also has drawbacks:

* people now have to use the CSS file and integrate it in their workflow,
* people might forget to use the CSS file.

In other words, it makes the theme a little bit less easy to use but way easier to customise.

We decided to make it so our components are not completely broken without the CSS file.
They are black and white, text is still readable and the component states (selected, etc.) are still visible.
The goal was that people would notice that something is wrong.

#### Updating the build process

Before that, we did not use CSS files.
We had to update the build process so that the CSS file would now be part of the final bundle both for the CDN and the npm package.

##### npm package

For the npm package, we decided to copy the CSS file inside the "styles" folder.

To do so, we rely on the [rollup plugin copy](https://www.npmjs.com/package/rollup-plugin-copy).
We also minify the CSS file even though it is really small for the moment.

Rollup npm config:
```js
  plugins: [
    ...,
    copy({
      targets: [
        {
          src: 'src/styles/default-theme.css',
          dest: 'dist/styles',
          transform: (stylesheet) => minifyStylesheet(stylesheet),
        },
      ],
    }),
  ]
```

To use the components inside a project, one needs to import this CSS file from `node_modules`.
The procedure to do so depends on the project stack.
We tried to give a few examples in [how to use the components theme](https://www.clever-cloud.com/doc/clever-components/?path=/docs/🏡-getting-started-install-via-npm--docs).

##### CDN

We needed to update the CDN so that it would serve a CSS file on a specific endpoint.
We wanted to provide a dynamic endpoint that would handle Semantic Versioning correctly, for instance:
`/styles.css?version=9.0.0`

Considering the CSS file was not going to change a lot, we did not want to generate a new file for every component version.
We did not want to store `default-theme-9.0.0.css` and `default-theme-9.0.1.css` if both these files actually had the exact same content.

This meant that the CDN backend needed a way to map what CSS file was related to each version (one file could be related to several component versions).

The CDN already uses a system to do this exact thing for components.
Filenames contain a hash that is generated by rollup based on their content.
This means their filenames only change if their content changes.
The CDN relies on a manifest to match a component and its version with the specific files related to it (the component code and its dependencies).

###### Providing a filename and a hash for the CSS file

To be given a filename with a hash, the CSS file needed to be processed by rollup as part of the bundle.
This meant we could not rely on the copy rollup plugin like we did for the npm build.

Because Rollup typically only processes JavaScript files, our new CSS file was not part of its bundle.
It was neither copied nor given a filename with a hash based on its content.

That is why we created a custom plugin named `stylesAssetsPlugin`.
This plugin reads the CSS file, minifies it, and uses the rollup `emitFile` function to generate a CSS file that is part of the rollup bundle.

```js
const stylesheet = fs.readFileSync('src/styles/default-theme.css', 'utf8');
const minifiedStylesheet = transform(stylesheet);

this.emitFile({
  type: 'asset',
  name: 'default-theme.css',
  source: minifiedStylesheet,
});
```

Rollup generates a filename with a hash based on the file content.

##### Deps manifest

Then, the file needed to be referenced inside the manifest to be associated with a given version (9.0.0 for instance).
The manifest is a JSON file, specific to a version of the components.
For instance, the manifest for the version 9.0.0 of the components is named `deps-manifest-9.0.0.json`.

All of this is done inside the `deps-manifest` plugin.

We updated this plugin to provide a new `styles` property.
We also decided to bump the `manifestVersion` to 2.

Example of a manifest with the new `styles` property.
```js
{
  "manifestVersion": "2",
  "packageVersion": "X.Z.Y",
  "files": [...],
  "styles": [
    {
      "path": "assets/default-theme-1c68a163.css"
    }
  ]
}
```

##### Serving the CSS file content

After this, we updated the CDN backend to provide the new endpoint.

For components and their dependencies, we typically serve a file that splits the request into several smaller ones to optimize performance.

For instance:
```js
// VERSION: 9.0.0
// LANG: en
import { addTranslations, setLanguage } from './i18n-c01b14e6.js';
import './i18n-string-245486dd.js';
import { lang, translations } from './translations.en-3abf14d8.js';
addTranslations(lang, translations);
setLanguage(lang);
import('./vendor-a9a067b7.js');
import('./cc-link-0578da85.js');
import('./cc-button-893cac78.js');
```

Contrary to the components, there was no need to split the request into several smaller requests.

The payload is actually very small and there are no dependencies, only the CSS itself.

This is why we decided to inline the content of the CSS file directly into the response. This way, there is only one very small call to make to the server.

After this, we updated the CDN UI to allow developers to directly copy the link tag corresponding to the selected version.

For instance:
```html
<link rel="stylesheet" href="https://components.clever-cloud.com/styles.css?version=9.0.0">
```

### Avoiding variable conflicts

Since we chose to provide our tokens through global CSS Custom Properties, we needed to make sure they would not conflict with other custom properties.

To do so, we chose to prefix all our global CSS Custom Properties, our semantic tokens, with `--cc-`.

```css
--color-text-success
```
became
```css
--cc-color-text-success
```

**Note:** 

* "Choices" are not prefixed because they are not meant to be exposed anyway.
* CSS Custom properties defined at component level are not prefixed since they are not global.

### Planning for dark theme

When working on theme customisation, we always had dark mode in mind because it is probably the most challenging of all the theme customisations we plan on supporting.

#### Handling default background and text colors

When thinking about a dark theme, the most obvious thing to do is to allow swapping the default font color as well as the default background color.

It might seem trivial but some components needed their background color to be transparent while some others needed a default background color using a design token.

For instance, `<cc-button>` in an outlined mode needed to be transparent, to avoid having buttons that look weird inside a notice or a neutral background while `<cc-input-*>` and other form fields needed a default background to make sure they would always stand out from the rest.

As for the font color, the question was whether components should inherit it or always define their default text color using our token at the component level (`:host`)?

We chose to let the default font color be inherited everytime it was possible (there were only a few exceptions).
This is closer to what most of the standard HTML elements do and it is way simpler to deal with.

This does mean however that if you need to switch the default font color, you have to:

* define your font color in the parent of the components (`body` would make sense most of the time),
* and apply the same color to `--cc-color-default-text`.

#### Changing design token names to avoid confusion

We renamed "light" suffixes to "weak" in our design tokens to avoid confusion when using a dark theme:
```css
--cc-color-text-light
```
became
```css
--cc-color-text-weak
```

The idea is that this color is meant to stand out less than the default text color:

* In a light theme, it usually means it's a lighter shade than the default text color.
* In a dark theme, it might actually mean the opposite: a darker shade than the default text color.

## The next steps

We have a lot more coming:

* remove the "choices" design tokens (our color variables) from the theme published via npm and the CDN to make sure no component rely on these and avoid shipping a layer of variables that is not supposed to be customised anyway (see [issue #495](https://github.com/CleverCloud/clever-components/issues/495)).
* publish documentation about the design tokens and how to customise the theme (see [issue #507](https://github.com/CleverCloud/clever-components/issues/507)).
* use this opportunity to define clear terminology for our token layers as discussed in [Naming design tokens by Lukas Oppermann](https://uxdesign.cc/naming-design-tokens-9454818ed7cb).
* continue to grow the design tokens (see [issue #398](https://github.com/CleverCloud/clever-components/issues/398)).
* introduce a dark theme, which might be done in several steps as we grow our design tokens (see [issue #371](https://github.com/CleverCloud/clever-components/issues/371)).
