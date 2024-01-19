---
kind: '👋 Contributing'
title: 'Web Components guidelines'
---

# Web Components guidelines

Here are different rules we want any contributor to follow regarding how we write Web Components with LitElement.

## General rules and reminders

* Don't forget to document your component's public API (properties, attributes, methods, events, slots, CSS custom props...)
* Your component should be UI only and NOT COUPLED with where the data comes from
* Don't forget to init your property default values in the constructor (see ['cc-example-component' constructor](https://github.com/CleverCloud/clever-components/blob/master/docs/cc-example-component.js#L76))
* Use the [`dispatchCustomEvent` helper](https://github.com/CleverCloud/clever-components/blob/9c8b046d21a734159b007646f042eb8053297168/src/lib/events.js) and try to emit your value directly on `detail` ([see 'cc-pricing-estimation' _onChangeQuantity method](https://github.com/CleverCloud/clever-components/blob/master/src/pricing/cc-pricing-estimation.js#L83))
* In the data I/O, prefer array of objects (instead of object literals) for collections
* Always name your event handlers "_onSomething"
* Try to sort your CSS sources in each selector (alphabetically) (enforced by the linter)
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
* Global component description can have a `## Type definitions` section to document the `type` and `interface` of the properties and events (see ['cc-example-component' typedef section](https://github.com/CleverCloud/clever-components/blob/master/docs/cc-example-component.js#L80)).
* This `## Type definitions` section consists of a group of code samples using the TypeScript definition format.
* Global component description can have a `## Technical details` section for stuffs that don't concern users.
* Global component description can have other sections specific to custom behaviours.
* Properties' descriptions start with a verb at the 3rd person "Sets", "Enables", "Displays", ...
* Events' descriptions start with "Fires whenever..." or "Fires XXX whenever..." when the event passes data.
* Events' type should be `CustomEvent` or `CustomEvent<MyType>` to describe the type of the `detail` property of a custom event.
* Don't forget to set default values for booleans in the constructor.
* Use `@prop` instead of `@attr`.
* Please sort your props and events alphabetically.
* Respect the following order: `@prop`, `@fires`, `@slot`, `@cssprop`
* Document methods in place, just above the given method.
* Use a `/** @required */` if component breaks without a given property. Must be in the `static get properties` section.

## How to deal with complex component states / data?

<cc-notice intent="info" heading="This section only applies to components handling data">
  <div slot="message">

  These components usually have a fairly complex data structure compared to atomic / molecular UI components that only manage props related to their content or their styling.

  For simpler components (buttons, form inputs, cards, etc.), please use a flat and simple API so that the component props may be set using HTML attributes instead of JavaScript properties.
  </div>
</cc-notice>

Some components may be put in different state types that are mutually exclusive: `loaded`, `loading`, `submitting`, `error`, etc.

In such cases, we do our best to make impossible states impossible.
For instance, developers should not be able to set the component into both a `loaded` and `loading` state.

To do so, we rely on a prop that is typed to reflect the fact that:

- state types are mutually exclusive,
- some state types come with certain expectations about data passed to the component. For instance, the `loading` state type usually means no data has been passed to the component.

### Type definition guidelines

In a `your-component-name.types.d.ts` file, you should define types for your component state following the example below:

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
```ts 
/**
 * @typedef {import('./my-component-name.types.js'.MyComponentState) MyComponentState}
 */

export class MyComponent extends LitElement {
  static get Properties () {
    return {
      state: { type: Object },
    };
  }

  constructor () {
    super();

    /* @type {MyComponentState} a short description */
    // usually the initial state is `loading` but feel free to adapt this example
    this.state = { type: 'loading' }; 
  }

  render () {
    // you should take advantage of the state types to avoid impossible states
    // this also helps typechecking and you get more help from your IDE if you do it right
    if (this.state === 'loading') {
      // this is a simple example, things are trickier when dealing with skeletons
      return html`<cc-loader></cc-loader>`; 
    }

    if (this.state === 'error') {
      return html`<cc-notice intent="warning">${i18n('your-warning-translation')}</cc-notice>`;
    }

    if (this.state === 'loaded') {
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
- the parent component (`cc-article-list`) should expose a global `state` prop. When `loaded`, the  APIshould be responsible for handling the state of all its subcomponents within its `render` method.

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

## How to choose icons?

By default, try to use icons that are parts of the Remix Icon library which is embedded in the main package.

If there is no suiting icon, you can add a custom icon to the Clever Cloud corporate icons (in the `src/assets/` folder).

<cc-notice intent="info" message="The custom icon must be in SVG format, with no hard-coded color and not relying on `stroke`. Its design should match the other icons as well."></cc-notice>
