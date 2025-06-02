---
kind: '📌 Architecture Decision Records'
---
# ADR 0028: Making our component APIs more robust

🗓️ 2025-02-10 · ✍️ Florian Sanders

## Context

Most of our components deal with async data.
Our oldest components had a simple logic:
- If their data properties were not `null`, they would display data.
- Otherwise, they would show a loader.

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

## Impossible states

The obvious solution to the issues explained before would be to add a `loading` or `skeleton` boolean property.

This way, we would know that if a component is not `loading` and not in `error`, then it must be `loaded`, right?

Well actually, nothing prevents developers to set the component both in `loading` and `error` at the same time.
What if `error` and `loading` are not set but `data` isn't set as well?

This kind of APIs are only good for simple components that don't deal with async data.
When dealing with complex data coming from remote APIs, we want to provide more guidance and type safety to the component API.
In short, we need to make sure our component's APIs do not allow impossible states (or states that do not make sense if you prefer).

## A more robust way

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

This subject is covered more extensively in [How to deal with complex component states / data? - Web Components Guidelines](https://www.clever-cloud.com/developers/doc/clever-components/?path=/docs/%F0%9F%91%8B-contributing-web-components-guidelines--docs).

## Resources

- [Making Impossible States Impossible by Richard Feldman](https://www.youtube.com/watch?v=IcgmSRJHu_8),
- [Finite State Machines in Vue 3 by Sarah Dayan](https://www.youtube.com/watch?v=fT9p9CCSrn8),
- [Simplify your UI management with (algebraic data) types - Matthias Le Brun (in French)](https://www.youtube.com/watch?v=ugoZKkKIJTE&t=56m40s).
