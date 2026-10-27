---
kind: '👋 Contributing'
title: 'Web Components guidelines'
---

# Web Components guidelines

Here are different rules we want any contributor to follow regarding how we write Web Components with LitElement.

## Naming

* The custom element tag name is kebab-case and always prefixed with `cc-`: `cc-foo`, `cc-addon-backups`.
* The class name is the PascalCase version of the tag name: `CcFoo`, `CcAddonBackups`.
* The element is registered at the very bottom of the component module with `window.customElements.define('cc-foo', CcFoo)`.

The files that make up a component and where they live are described in the [Codebase map](👋-contributing-codebase-map--docs).

## General rules and reminders

* Don't forget to document your component's public API (properties, attributes, methods, events, slots, CSS custom props...)
* Your component should be UI only and NOT COUPLED with where the data comes from
* Don't forget to init your property default values in the constructor (see ['cc-example-component' constructor](https://github.com/CleverCloud/clever-components/blob/master/docs/cc-example-component.js))
* In the data I/O, prefer array of objects (instead of object literals) for collections
* Always name your event handlers "_onSomething"
* Try to sort your CSS sources in each selector (alphabetically) (enforced by the linter, see [ADR 0011: Sorting CSS declarations](📌-architecture-decision-records-adr-0011-sorting-css-declarations--docs))
* Declare all public properties in the static get properties (['cc-example-component' property getter](https://github.com/CleverCloud/clever-components/blob/master/docs/cc-example-component.js))
* Think about what will happen when there's an error
* Think about what will happen when the data is not there yet, <br/> for this, we use the "skeleton screen" pattern
* Think about what will happen when the data is empty, <br/> don't forget to add a message
* Think about the focus, where does it go when something is validated or when an element disappears
* Use `// language=CSS` over your `css` declaration so WebStorm can apply syntaxic coloration and more (see ['cc-example-component-stories'](https://github.com/CleverCloud/clever-components/blob/master/docs/cc-example-component.stories.js#L18))
* Use `// language=HTML` in your stories so WebStorm can apply syntaxic coloration and more
* Try to avoid the quotes for this `prop="${this.prop}"` and do this instead: `prop=${this.prop}`
* Make sure all texts are translated
* Prefix all translation keys with the component name and split parts with dots (see ['translation-example'](https://github.com/CleverCloud/clever-components/blob/master/docs/translations.example.js#L37))

## How to order stuff in a custom element using LitElement?

In order to help anyone reading this code base to find what s.he's looking for,
we're proposing this order for the different pars of a custom element built with LitElement:

1. LitElement's properties descriptor <br/> `static get properties () {}`
1. Constructor <br/> `constructor () {}`
1. property getters <br/> `get myProp () {}`
1. property setters <br/> `set myProp (value) {}`
1. public methods <br/> `myMethodName (arg0, arg1) {}`
1. private methods (prefixed with an underscore) <br/> `_myMethodName (arg0, arg1) {}`
1. event handlers (almost always private, prefixed with `_on`) <br/> `_onClickToggle (e) {}`
1. custom element lifecycle callbacks <br/> `connectedCallback () {}`
1. LitElement lifecycle callbacks <br/> `firstUpdated () {}`
1. LitElement's render method <br/> `render () {}`
1. sub render private methods <br/> `_renderFoobar () {}`
1. LitElement's styles descriptor <br/> `static get styles () {}`

## How to order attributes when you use a component?

1. `class` attribute
1. other attributes
1. event listeners

## How to document a component?

* Always start a description with an upper case letter and end it with a dot.
* Global component description starts with "A component", "A wrapper", "A helper", "An input", "A form", ...
* Global component description is a simple one-liner.
* Global component description can have a `## Details` section with a bullet list of informations.
* Global component description can have a `## Technical details` section for stuffs that don't concern users.
* Global component description can have other sections specific to custom behaviours.
* A `### Type Definitions` section is generated automatically for the docs, you don't write it by hand. <br/> It is built by the `support-typedef-jsdoc` plugin (in `cem/`) from the types you reference with the `@import` JSDoc tag, see the "Documenting types" section below.
* Properties are **not** documented with `@prop` or `@attr` tags. <br/> They are documented where they are initialized in the constructor, with a `/** @type {TheType} The description. */` comment. <br/> The Custom Elements Manifest analyzer reads both the `static get properties()` descriptor and these comments.
* Properties' descriptions start with a verb at the 3rd person "Sets", "Enables", "Displays", ...
* Events are **not** documented with `@fires` tags either. <br/> They are documented in the event class itself, in the `*.events.js` file, see the "How to deal with events" section below.
* Don't forget to set default values for booleans in the constructor.
* Please sort your properties alphabetically in the `static get properties()` descriptor.
* Every component **must** have a `@cssdisplay` tag stating its default CSS `display` value. <br/> It is consumed by the `support-cssdisplay-jsdoc` plugin (in `cem/`) which adds a `cssDisplay` field to the Custom Elements Manifest and injects a "🎨 default CSS display" line in the generated docs.
* Put `@cssdisplay` first, then the `@slot` and `@cssprop` tags. <br/> The relative order of `@slot` and `@cssprop` is not enforced by any tool and both orders exist in the codebase, so just follow the closest component.
* Document methods in place, just above the given method.
* Use a `/** @required */` if component breaks without a given property. Must be in the `static get properties` section.

### Documenting types

Types shared between the component, its stories and its consumers live in a `cc-foo.types.d.ts` file, next to the component.

Inside the component module, they are imported in a dedicated JSDoc block with the `@import` tag, and the import path uses the `.js` extension (not `.d.ts`):

```js
/**
 * @import { ArticleListState } from './cc-article-list.types.js'
 * @import { IconModel } from '../common.types.js'
 */
```

The old `@typedef {import('./cc-foo.types.js').Foo} Foo` form is deprecated, use `@import` instead.

## How to deal with complex component states / data?

<cc-notice intent="info" heading="This section only applies to components handling data">
  <div slot="message">

  These components usually have a fairly complex data structure compared to atomic / molecular UI components that only manage props related to their content or their styling.

  For simpler components (buttons, form inputs, cards, etc.), please use a flat and simple API so that the component props may be set using HTML attributes instead of JavaScript properties.
  </div>
</cc-notice>

The rationale behind this section is detailed in [ADR 0028: Making our component APIs more robust](📌-architecture-decision-records-adr-0028-making-our-component-apis-more-robust--docs).

Some components may be put in different state types that are mutually exclusive: `loaded`, `loading`, `submitting`, `error`, etc.

In such cases, we do our best to make impossible states impossible.
For instance, developers should not be able to set the component into both a `loaded` and `loading` state.

To do so, we rely on a prop that is typed to reflect the fact that:

- state types are mutually exclusive,
- some state types come with certain expectations about data passed to the component. For instance, the `loading` state type usually means no data has been passed to the component.

### Type definition guidelines

In a `cc-your-component-name.types.d.ts` file, you should define types for your component state following the example below:

```ts
// this type should be applied to the component prop conveying the state
// these 3 states types are the most common but feel free to remove or add state types when relevant
export type MyComponentState = MyComponentStateLoaded | MyComponentStateLoading | MyComponentStateError

// `loading` and `error` states usually are fairly simple since they have no data
interface MyComponentStateLoading {
  type: 'loading';
}

interface MyComponentStateError {
  type: 'error';
}

// usually we try to make the state prop as flat as possible
interface MyComponentStateLoaded {
  type: 'loaded';
  avatar: string; // this is just an example of data
  name: string; // this is just an example of data
  // since we use `type` for the status of data, you may need to use a synonym of `type` to avoid clashes
  kind: 'premium'|'classic';
  ...
}

// alternatively, you may decide to store data in an object to
// avoid clashes or just because you think it's better this way
interface MyComponentStateLoaded {
  type: 'loaded';
  orga: { // please use a meaningful name instead of a generic name like "data"
    avatar: string;
    name: string;
    type: 'premium'|'classic';
  }
}

// if your components loaded data is only made of a list you should do as follows
interface MyComponentStateLoaded {
  type: 'loaded';
  memberList: Member[]; // this is just an example, the important thing is that you use a meaningful name here
}
```

### Component state prop guidelines

The component prop containing the state should be named `state`.

You need to import the type you defined for this state and apply it to the `state` prop within the component constructor.

Example of a component:
```js
/**
 * @import { MyComponentState } from './cc-my-component.types.js'
 */

export class CcMyComponent extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {MyComponentState} a short description */
    // usually the initial state is `loading` but feel free to adapt this example
    this.state = { type: 'loading' };
  }

  render() {
    // you should take advantage of the state types to avoid impossible states
    // this also helps typechecking and you get more help from your IDE if you do it right
    if (this.state.type === 'loading') {
      // this is a simple example, things are trickier when dealing with skeletons
      return html`<cc-loader></cc-loader>`;
    }

    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('your-warning-translation')}"></cc-notice>`;
    }

    if (this.state.type === 'loaded') {
      // you can pass data to your loaded subRender function
      return this._renderLoaded(...);
    }
  }
}
```

**Note:**
If your component deals with two different sets of data that do not share the same state (for instance one data set could be `loaded` while the other is still `loading`), you should create separate `state` props and name them with a meaningful prefix followed by `State`, for instance:
`instancesState`, `applicationState`, `memberListState`, etc.

### Subcomponent states

Parent components should avoid exposing their subcomponent states.
For instance when dealing with a parent component which manages a list of items, with each item being a subcomponent:

- the parent should expose a standard `state` prop,
- data to be passed to subcomponents (items data) should be plain data,
- plain data should be transformed into a `state` by the parent component within its `render` or `subrender` methods before passing it to its subcomponents.

For instance, subcomponents like [cc-article-card](https://github.com/CleverCloud/clever-components/blob/master/src/components/cc-article-card/cc-article-card.js) are only used by [cc-article-list](https://github.com/CleverCloud/clever-components/blob/master/src/components/cc-article-list/cc-article-list.js).
These subcomponents can either be `loaded` or `loading` but their state is actually dictated by a single API call that loads all articles at once.

In such cases:

- the subcomponent (`cc-article-card`) should still expose a `state` API,
- the parent component (`cc-article-list`) should expose a global `state` prop. When `loaded`, the parent should be responsible for handling the state of all its subcomponents within its `render` method.

```ts
// cc-article-card.types.d.ts
export type ArticleCardState = ArticleCardStateLoaded | ArticleCardStateLoading;

export interface ArticleCardStateLoaded extends ArticleCard {
    type: 'loaded';
}

export interface ArticleCardStateLoading {
    type: 'loading';
}

export interface ArticleCard {
    banner: string;
    date: string;
    description: string;
    link: string;
    title: string;
}

// cc-article-list.types.d.ts
import { ArticleCard } from '../cc-article-card/cc-article-card.types.js';

export type ArticleListState = ArticleListStateLoaded | ArticleListStateLoading | ArticleListStateError;

export interface ArticleListStateLoaded {
  type: 'loaded';
  articles: ArticleCard[];
}

export interface ArticleListStateLoading {
  type: 'loading';
}

export interface ArticleListStateError {
  type: 'error';
}

// cc-article-list.js render method
...
${this.state.articles.map((article) => html`
  <cc-article-card .state=${{ type: 'loaded', ...article }}></cc-article-card>
`)}
...
```

**Note:**
An exception should be made when subcomponents may be set to states that are not shared with the rest of the list.

For instance, if one of the items within the list may be set to `waiting`, then its state should be exposed by the parent component so it can be manipulated from outside.

A good example of such case is [cc-tcp-redirection-form](https://github.com/CleverCloud/clever-components/blob/master/src/components/cc-tcp-redirection-form/cc-tcp-redirection-form.js) and [cc-tcp-redirection](https://github.com/CleverCloud/clever-components/blob/master/src/components/cc-tcp-redirection/cc-tcp-redirection.js).

## How to deal with events


### Event definition structure

- Every component's events **must** be defined in a dedicated file ending with `.events.js` (e.g., `cc-component-name.events.js`),
- Events shared by several components are defined in `src/components/common.events.js` (`CcClickEvent`, `CcCloseEvent`, `CcSelectEvent`...), reuse them instead of creating duplicates,
- Every event **must** be a subclass of the `CcEvent` class defined in `src/lib/events.js`,
- `CcEvent` extends the native `CustomEvent` and always dispatches with `bubbles: true` and `composed: true`,
- Each event class should have a static `TYPE` property defining the event name,
- Event class names are PascalCase, start with `Cc` and end with `Event` (e.g. `CcAddonOptionChangeEvent`),
- Event name **must** be prefixed with `cc-`,
- Event name **must** be in kebab case,
- Every event **must** be properly documented with JSDoc

### Event class implementation

Here's how to implement an event class correctly:

```js
import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when something happens in the component.
 * @extends {CcEvent<EventDetailType>}
 */
export class CcComponentNameSomethingEvent extends CcEvent {
  static TYPE = 'cc-something-happen';

  /**
   * @param {EventDetailType} detail
   */
  constructor(detail) {
    super(CcComponentNameSomethingEvent.TYPE, detail);
  }
}
```

### Event documentation requirements

Events must be properly documented:

- Include a clear description of when and why the event is dispatched,
- Always use the `@extends` JSDoc tag to specify the `detail` property type,
- Document the constructor parameter with the proper type.

This JSDoc is what ends up in the generated documentation: the `support-cc-events` plugin (in `cem/`) discards the events the standard Custom Elements Manifest analyzer detects, and rebuilds the events documentation of a component from the `*.events.js` modules it imports.
This means an event only shows up in the docs of a component if that component imports its event class.

### Synchronizing the events map

The file `src/lib/events-map.types.d.ts` is a generated map of every `CcEvent` subclass in the project.
It gives TypeScript the mapping between event names and event types, so that `addEventListener('cc-something-happen', ...)` is correctly typed.

It is generated, never edit it by hand.
After creating, renaming or removing events, run:

```
pnpm run components:events-map-generate
```

The CI checks that this file is up to date with `pnpm run components:events-map-check`.

## How to style a component?

### Design tokens

All the design tokens are declared as CSS custom properties on `:root` in `src/styles/default-theme.css`.
This file is shipped as a plain CSS file (not a JavaScript module) precisely so that consumers can override the tokens from the outside, see [ADR 0020: Making the component theme customisable](📌-architecture-decision-records-adr-0020-making-the-component-theme-customisable--docs).

The tokens are split in two categories, see [ADR 0017: Finding accessible colors and creating Design Tokens](📌-architecture-decision-records-adr-0017-finding-accessible-colors-and-creating-design-tokens--docs):

* **choices**, the raw palette, prefixed with `--color-` (`--color-blue-70`, `--color-grey-20`...). <br/> They are private, they are **not** part of the public API and they must **not** be referenced from a component.
* **decisions**, the semantic tokens, prefixed with `--cc-` (`--cc-color-text-danger`, `--cc-color-bg-neutral`, `--cc-spacing-3`...). <br/> These are the ones you use inside components, and the ones consumers may override to theme the components.

Since the theme lives outside the component styles, always provide a fallback value when you reference a token, so the component still looks decent if the theme is not loaded:

```css
.foobar {
  color: var(--cc-color-text-danger, #be242d);
  padding: var(--cc-spacing-3, 0.5em);
}
```

### Units

Use `em` instead of `rem` for sizes, spacings and font sizes, so that a component can be scaled by simply setting a `font-size` on it or on one of its ancestors.
The rationale is detailed in [ADR 0021: Switching from rem to em units](📌-architecture-decision-records-adr-0021-switching-from-rem-to-em-units--docs).

## What to do with components during API calls and when to use `disabled`

Different attributes should be used depending on whether you want to temporarily disable a component during an API call or permanently disable it.
The rationale is detailed in [ADR 0029: Limited Usage of the `disabled` Attribute](📌-architecture-decision-records-adr-0029-limited-usage-of-the-disabled-attribute--docs).

### During API calls

For form controls (except buttons):
- Use `readonly` attribute to temporarily disable the control while preserving focus

Example:
```html
<cc-input-text readonly>
<cc-select readonly>
```

For buttons:
- Use `waiting` attribute to indicate an ongoing API call

Example:
```html
<cc-button waiting>
```

### For permanent disability

Use `disabled` attribute when a control should be:

- Permanently disabled
- Not participating in form validation
- Completely non-interactive

Example:
```html
<cc-input-text disabled>
<cc-button disabled>
```

### Important notes

- Never use both `waiting` and `disabled` simultaneously on buttons (will throw an error)
- Using `disabled`:
  - Removes the element from tab order
  - Prevents focus
  - Excludes from form validation
- Using `readonly`:
  - Preserves focus behavior
  - Still allows interaction but prevents changes
  - Better for temporary states during API calls
- Using `waiting`:
  - Specific to buttons
  - Indicates an ongoing action
  - Preserves focus behavior
  - Prevents triggering new actions

Use the attribute that matches your intent:

- `readonly` for temporary API call states on form controls
- `waiting` for temporary API call states on buttons
- `disabled` only for permanent disability states

## How to choose icons?

Icons are rendered with the `cc-icon` component and imported as JavaScript modules, see [ADR 0022: Implementing a new icon system](📌-architecture-decision-records-adr-0022-implementing-a-new-icon-system--docs).

By default, try to use icons that are parts of the Remix Icon library which is embedded in the main package, in `src/assets/cc-remix.icons.js`.
Always alias the import so the variable name carries the meaning rather than the icon name:

```js
import { iconRemixCloudFill as iconLogo } from '../../assets/cc-remix.icons.js';
```

If there is no suiting icon, you can add a custom icon to the Clever Cloud corporate icons by dropping an SVG file in the `src/assets/` folder and running `pnpm run components:generate-icons-assets`.
This task regenerates `src/assets/cc-clever.icons.js` (from `src/assets/**/*.svg`) and `src/assets/cc-remix.icons.js` (from the `remixicon` package), both files are generated and must not be edited by hand.

<cc-notice intent="info" message="The custom icon must be in SVG format, with no hard-coded color and not relying on `stroke`. Its design should match the other icons as well."></cc-notice>
