---
kind: '📌 Architecture Decision Records'
---

# ADR 0022: Implementing a new icon system

🗓️ 2023-01-20 · ✍️ Robert Tran, Florian Sanders

## The context

Historically, icons are displayed from static assets in our Clever Components.

Basically, it is SVG files as source of `<img>` tags, whether it is directly coded in the component or via a property, like in the `<cc-button>` component.

```javascript
// MyComponent.js
const fooSvg = new URL('assets/foo.svg', import.meta.url).href;

function render () {
  return html`<span class="my-icon"><img src=${fooSvg} alt=""></span>`;
}
```

And from a usage perspective, whenever a new icon is needed, it must be created and added to the assets.

## The problem

While the implementation is quite straightforward, it unfortunately comes with downsides.

Note: this implementation was done at a time when the Clever Components was a one-person project and where the pros of this kind of "technical shortcut" outweighed the cons. 

### Standardization

As the number of icons increases, the risk of disparateness increases as well, managing them becomes harder and harder.
This solution does not scale well.

And icon creation and/or picking can be pretty tedious.

### Customization

When referenced using an `<img>` tag, it is not possible to update a SVG `stroke` and `fill` properties using CSS (more details in [this article about SVG customization](https://css-tricks.com/the-many-ways-to-change-an-svg-fill-on-hover-and-when-to-use-them/)).

Thus, color customization is quite restricted and forces us to have a one file per color usage for each icon. Another consequence is making theme implementation more difficult (especially for a dark theme).

### Compatibility

From a technical point, icons are imported with the `new URL('./foo.svg', import.meta.url).href` syntax in our components.
This is plain standard JavaScript syntax that works in modern browsers, but it's still not accepted as is in modern JavaScript toolchains like bundlers.

This created more complexity in our stacks with a dedicated [Rollup](https://www.npmjs.com/package/@web/rollup-plugin-import-meta-assets) plugin in our components and a dedicated [Babel](https://www.npmjs.com/package/@babel/plugin-syntax-import-meta) plugin in some projects where our components are used.

Same consideration on Vue.js projects and any projects using Vite where this syntax triggers errors: more details on this topic in [issue #130](https://github.com/CleverCloud/clever-components/issues/130).

## The solution

As the Clever Components grew bigger and bigger, we needed to tackle the aforementioned issues and think of a more robust icon strategy.

We decided to:

- change how we displayed icons,
- change how the assets were processed,
- add a backing icon library.

This was done by:

- creating an icon component,
- adding a rollup plugin,
- adding a backing icon library.

### The icon component

We wanted a technical layer helping us with displaying icons.
Naturally, it comes as a new (atomic) component, as part of our Clever Components.
More precisely as a Web Component built on top of [Lit](https://lit.dev/).

This `<cc-icon>` component allows us to have a better control on how the icon is displayed through:

- component properties: on size and skeleton mode,
- CSS custom properties: on size (as an override mechanism) and color.

These two points are made possible because the component renders the SVG content inline.
Having a dedicated component also helps to implement more accessible icons (see below).

This SVG rendering point brings us to another part of the new icon system: the Rollup plugin.

### The Rollup plugin

We wanted to change the way icons were loaded in components, in order to get rid of the `new URL('./foo.svg', import.meta.url).href` syntax.
The simplest and effective way in our case is by importing the icon as an ES object: that's where the plugin comes into play.

Its roles are to:

- parse the icon assets,
- clean and optimize them (with [SVGO](https://github.com/svg/svgo)),
- transform them into ES objects,
- write them in a valid ES module file.

Those actions are done at build time and at runtime (only in development environment).
The generated content can be imported and used by the `<cc-icon>` component through one of its properties.
This method also benefits from tree-shaking because we import icons from ES modules.

```javascript
import { iconFoo } from 'assets/icon-library.js';

function render () {
  return html`<cc-icon .icon="${iconKey}"></cc-icon>`;
} 
```

Although the component and plugin worked well with our current icons, we wanted to offer more choices for future development.
In the next section, meet Remix Icon.

### The icon library

We wanted a library that:

- matched our branding,
- provided professional-looking icons,
- provided a sufficient amount of icons,
- provided SVG icons (ideally squared icons & easily customisable),
- allowed commercial use.

A library that matches all those points is [Remix Icon](https://remixicon.com/), which was our winner.
Having this kind of backing library removes the tediousness of searching for basic icons and offers a lot of special icons that may come in handy.

### Other options considered 

At some point, we considered the external [symbol sprite](https://cloudfour.com/thinks/svg-icon-stress-test/#external-symbol-sprite) method.
But its main problem is that the sprite file will contain every single icon, which is not optimal for a component library, where each component would load icons it does not use.
A solution would be to generate a distinct sprite file per component but the ensuing complexity seems not worth it.

The standard symbol [sprite method](https://cloudfour.com/thinks/svg-icon-stress-test/#symbol-sprite), where the sprite content is directly inlined in the document, is not suited for a library component, especially compared to inlined SVG.

## Accessible icons

### Basic principles and images in general

When it comes to icons or images, we know that we have two cases to take into account:

* decorative icons, which are supposed to be ignored by assistive technologies,
* informative icons, which are supposed to be identified as images by assistive technologies that should also retrieve their information.

An icon is neither decorative nor informative in absolute, it always comes down to its context.

Let's take the example of a warning icon:

* By itself, without any surrounding text saying something like "caution", "warning", etc. it should be considered informative.
* With a surrounding text saying something like "caution", "warning", etc. it should be considered decorative.

### Making `<svg>` elements accessible

In an ideal world, with full accessibility support for `<svg>` elements, we would only need to use the `<title>` tag inside an `<svg>` element to convey information when it's relevant.

However, the accessibility support for `<svg>` elements is still far from perfect and requires some ARIA additions to make sure they are handled properly by browsers and assistive technologies.

* To make sure informative icons are identified as images and their information is retrieved, we typically need to add a `role="img"` as well as an `aria-label` or an `aria-labelledby` attribute.
* To make sure decorative icons are ignored by assistive technologies, we typically need to add an `aria-hidden="true"` or a `role="presentation` on the `<svg>` element itself.

#### Using the custom element itself

In our case, the `<svg>` element is inserted in a `<cc-icon>` element, the custom element itself at runtime.

Considering most of our icons are decorative because our icons come with a visible text providing information as much as possible, we wanted to see if we could cut some corners.

We wanted to see if we could avoid unnecessary DOM manipulations by:

1. processing all `<svg>` elements as decorative (adding an `aria-hidden="true"` to all `<svg>` elements) during the build phase.
2. for informative icons, adding a `role="img"` and `aria-label` on the `<cc-icon>` element itself at runtime.

Example of a decorative `<cc-icon>`:
```html
<cc-icon>
  <svg aria-hidden="true">...</svg>
</cc-icon>
```

Example of an informative `<cc-icon>`:
```html
<cc-icon role="img" aria-label="Caution">
  <svg aria-hidden="true">...</svg>
</cc-icon>
```

Unfortunately, testing this implementation in real life showed that informative icons were ignored by VoiceOver on macOS and iOS.

Using `role="img"` and `aria-label` attributes on a custom element does not seem to be supported on Safari.

#### Using the `<svg>` element itself

Since we could not rely on the custom element itself, we had to rely on the `<svg>` element and manipulate it depending on its context.

If the developer does not provide any `a11y-name` prop, the component adds an `aria-hidden="true"` attribute to the inner `<svg>` element.
If the developer does provide an `a11y-name` prop, the component adds to the inner `<svg>` element:

* A `role="img"` attribute,
* An `aria-label` which value matches the value of the `a11y-name` prop,
* A `<title>` element which value matches the value of the `a11y-name` prop.

The addition of the `<title>` element is not necessary but this is the native HTML way for informative `<svg>` elements so we decided to keep it.

Example of an informative `<cc-icon>`:
```html
<cc-icon a11y-name="Caution">
  <svg role="img" aria-label="Caution">
    <title>Caution</title>
    ...
  </svg>
<cc-icon>
```

#### Deciding on prop names

We discussed several options about the component API and how developers should use it.

##### Using ARIA attributes directly

This option was only possible if we used the `<cc-icon>` element itself (see "Using the `<svg>` element itself" above).

Developers would directly add `aria-hidden=true` or `role="img"` + `aria-label` to the `<cc-icon>` element itself.

We did not choose to go this way because:

* There was too much room for mistakes. Developers could add the `role="img"` attribute and forget to add the `aria-label` attribute.
* Relying on the `<cc-icon>` element itself and not the `<svg>` does not work on Safari.

##### Reproducing the img API

We considered using an `alt` prop and attribute to mimic the `<img>` API.

We did not choose to go this way because we want to avoid using existing native attributes like `title` for instance.

##### Using a custom a11y-name attribute

We chose to use a `a11y-name` attribute that should only be used if the icon conveys information.

This simplifies the API for developers because:

* In most cases, icons are decorative so there is nothing to do.
* When the icon is informative, they only have one attribute to add.
* We already use an `a11y-name` attribute on the `<cc-button>`. This means this attribute should be familiar for developers using our components. It is also a well-known concept for many people who have worked on accessibility before.

## Limits and prospects

Where Remix Icon is a great library, it seems to be currently on [pause](https://github.com/Remix-Design/RemixIcon/issues/232).

_edit (2023-09-15)_: actually, the Remix Icon project [resumed its activity](https://github.com/Remix-Design/RemixIcon/issues/232#issuecomment-1017140063) since early 2023! 🎉

As we strictly limited the first version of the new icon system to our use cases, there are some options worth considering for future improvements:

- add more component properties to tweak the icon rendering: `flip`, `rotation`, `badge`, etc.
- implement an icon [provider](https://core.clarity.design/foundation/icons/) to facilitate usage outside the Clever Components scope.

## Resources

### In English

* [a11y support - `<svg>` + `<title>` elements](https://a11ysupport.io/tests/html_svg_inline_with_title)
* [Accessible SVGs: Perfect Patterns For Screen Reader Users by Carie Fisher on Smashing Magazine](https://www.smashingmagazine.com/2021/05/accessible-svg-patterns-comparison/)

### In French

* <a href="https://access42.net/svg-accessible?lang=fr" lang="fr">Comment intégrer du SVG de manière accessible ? - Access42</a>,
* <a href="https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.5" lang="fr">Critère 1.1.5 - balise `<svg>` porteuse d'information - Référentiel Général d'Amélioration d'Accessibilité</a>
