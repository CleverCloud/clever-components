---
kind: '📌 Architecture Decision Records'
---
# ADR 0026: Enabling type checking

<!-- TODO: change the date -->
🗓️ 2023-03-.. · ✍️ Florian Sanders

## Pure JavaScript, no build steps required

The Clever Components project is a pure JavaScript project.

From the start, the project was designed with the following in mind:

- components should be able to run within the browser as is, without any build step,
- the build step is only here to optimize the code of the components.

## JSDoc to document component APIs

Documentation for developers has also always been at the core of the project: if we want developers to be able to use our components in any context (with or without a JavaScript framework) we need to document APIs for every component we produce.

We mostly rely on `JSDoc` to document how to use our components.

Until now, we primarily documented public APIs of our components.
Recently, we have started documenting private methods and properties to improve the experience of contributors.
This makes the components easier to maintain.

The `JSDoc` comments of public APIs of our components (the class and its properties mainly) are processed by the `@custom-elements-manifest/analyzer`.
Component docs are part of the Custom Element Manifest.
The Custom Element Manifest content is formatted and displayed by Storybook.

## A tiny bit of TypeScript with hand-authored lib files

<!-- TODO: find an example of stuff you cannot do with JSDoc only -->
<!-- TODO: Non en fait il faut comparer comment on définit une interface via JSDoc vs dans un d.ts -->

`JSDoc` is a great start but when it comes to documenting objects and more complex data structures, you may need some help.

And what better than TypeScript to help you document complex types in JavaScript?

For instance, take the following `JSDoc`:

```js
/**
 * @typedef ComponentStateLoaded
 * @prop {'loaded'} type
 * @prop {string[]} list
 */
```

Even for a very simple case like this, this syntax is fairly verbose and the type structure is not obvious.
Within a `d.ts` file, you could go for an interface instead:

```ts
interface ComponentStateLoaded {
  type: 'loaded';
  list: string[];
}
```

Then, within the `.js` file, you only have to import it:
```js
/**
 * @typedef {import('../my-type-file.d.ts').ComponentStateLoaded} ComponentStateLoaded
 */
```

The `d.ts` technique has several advantages:

- The TypeScript syntax is a lot closer to JavaScript than `JSDoc` so it's very easy to understand what you're manipulating with an `interface` or a `type`.
- It is way easier to compose types and rely on [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) in a `d.ts` file than in `JSDoc` comments.

We hand-author `d.ts` files for most of our components.
These files usually contain types corresponding to properties and data other than JavaScript primitives.

## Making our component APIs more robust

### The old way

Most of our components deal with async data.
Our oldest components used to base their logic on whether properties handling data were set or not to determine whether to show a loader or data.
They also used to expose an `error` boolean property to be used when data fetching had failed.

This was very HTML friendly but it meant that you could set `error` to `true` and pass `data` at the same time:

```html
<cc-fake-component error data="toto"></cc-fake-component>
```

Inside the component, our rendering logic would look something like this:

```js
render () {
  if (this.error) {
    return html`<cc-notice intent="warning"></cc-notice>`
  }

  if (this.data == null) {
    return html`<cc-loader></cc-loader>`;
  }

  return html`
    <p>Your data: ${this.data}</p>
  `;
```

The API did not offer any guidance on how to avoid impossible states and preventing silly mistakes.
There was also an issue with `empty` states: if `nullish` data means it's loading, how do you represent empty data?

### The more robust way

Components can usually be set to different states that are mutually exclusive:

- `loading` when initial data to be displayed is being fetched,
- `loaded` once initial data has been fetched and is displayed,
- `error` if something has gone wrong when trying to fetch initial data,
- `saving` when an async operation is pending, for instance after submitting a form, we're waiting for the result of our action.

Component consumers should not be able to set a given component both to `loading` and `loaded` at the same time.

This is why we introduced object properties associated to TypeScript interfaces.

This property is usually named `state`.
In a `state` object, there's always at least a `type` property.
The state type is a string that represents the state of the component like `"loading"`, `"loaded"` or `"error"`.
The `type` property is enough to make sure the component is not both `loading` and `loaded`.
We also decided to make async data part of the state so that we have types that only accept data if the state type is `loaded`:

```ts
// this type should be applied to the component prop conveying the state
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
}
```

The component logic looks like this:

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
    if (this.state.type === 'loading') {
      return html`<cc-loader></cc-loader>`;
    }

    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning">${i18n('your-warning-translation')}</cc-notice>`;
    }

    // you can pass data to your loaded subRender function
    return this._renderLoaded(...);
  }
}
```

This subject is covered more extensively in [How to deal with complex component states / data? - Web Components Guildelines](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%91%8B-contributing-web-components-guidelines--docs).

### TypeChecking everything

Having a more robust public API for our components means that we can also benefit from better TypeChecking and avoid silly mistakes.

For instance, since only the `loaded` state comes with data, forgetting to guard again error or loading states like in the example below raises a TypeScript error:

```js
render () {
  return html`
    <!-- TypeScript throws an error because avatar only exists if the state type is "loaded"  -->
    <cc-img src="${this.state.avatar}"></cc-img>
  `;
}
```

This is a very simple example, the more complex the component gets and the more errors we avoid thanks for TypeChecking.

TODO:

- states ~DONE (exemples à améliorer)
- rules we have decided to disable => pas super intéressant
- lit plugin?
- What it enables within IDE => TODO SECTION REFACTORING
- What about CI? => Pas grand chose à dire
- TS with JSDoc vs pure typescript possibilities => Section limits of JSDocs
- les problèmes des hand authored d.ts => Section limits of `d.ts`
- stuff we follow with:
  https://tc39.es/proposal-type-annotations/
