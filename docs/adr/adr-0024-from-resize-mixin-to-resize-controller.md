---
kind: '📌 Architecture Decision Records'
---
# ADR 0024: Moving our `ResizeObserver` from a mixin to a reactive controller

🗓️ 2023-11-09 · ✍️ Florian Sanders

## The context

### We cannot rely on the viewport

Some of our components need to be able to adapt their styles or their rendered HTML based on how much space is available.

Since we work with components, we cannot rely on the `viewport` size using media queries like one typically does.
Just because the `viewport` shrinks does not mean the component shrinks as well.
It depends on whether the component spreads across the whole viewport or only a part of it.

This is why we rely on JavaScript by using a `ResizeObserver`.

### A mixin that matches our specific needs

This observer is implemented through a [mixin](https://lit.dev/docs/composition/mixins/).
We use this `ResizeObserver` mixin for two purposes:

- detect resizes and compute the current `width` of the component,
- if needed, add / remove attributes based on given breakpoints so we can style our component based on its `width`:
  - a `w-lt-${breakpoint}` attribute when the `width` of the component is lower than the breakpoint,
  - a `w-gte-${breakpoint}` attribute when it is equal to the breakpoint or higher.

<details>
  <summary>Example of how to use the mixin</summary>

```js
class MyComponent extends withResizeObserver(LitElement) {
  constructor () {
    this.breakpoints = {
      width: [200, 400],
    };
  }

  onResize({ width }) {
    this._width = width;
  }

  static get styles () {
    return [
      css`
        :host([w-lt-200]) {
          color: blue;
        }

        :host([w-gte-400]) {
          color: red;
        }
      `
    ]
  }
}
```
</details>

### Lit Reactive Controllers

With Lit 2.0, [Reactive Controllers](https://lit.dev/docs/composition/controllers/) were introduced and we decided to move from a mixin to a `Reactive Controller`

## Considered solutions

### Transforming the `mixin` into a `Reactive Controller`

Our first option was to transform the `mixin` into a `Reactive Controller` and continue using the same API to retrieve the `width` of the component and add / remove the attributes.

For it to work, the component needs to expose the following:

- A public `onResize` method with `width` as a parameter. This method is called by the observer everytime it detects a resize.
- A public `breakpoints` property containing an array of breakpoints. This property is read by the observer. If it is present, the observer adds and removes `w-lt-${breakpoint}` / `w-gte-${breakpoint}` attributes for each breakpoint.

<details>
  <summary>Example of how to use the controller</summary>

```js
class MyComponent extends LitElement {
  constructor () {
    new ResizeController(this);

    this.breakpoints = {
      width: [200, 400],
    };
  }

  onResize({ width }) {
    this._width = width;
  }

  static get styles () {
    return [
      css`
        :host([w-lt-200]) {
          color: blue;
        }

        :host([w-gte-400]) {
          color: red;
        }
      `
    ]
  }
}
```
</details>

### Using the Lit Labs `ResizeController` and keeping our API

Our second option was to ditch the `mixin` and import the [Lib Labs ResizeController](https://www.npmjs.com/package/@lit-labs/observers).

The controller accepts a callback to be called everytime a resize happens.

We can use this callback to set attributes on our component and get its `width` by exposing the `onResize` method and `breakpoints` property on the component as we did with the mixin.

<details>
  <summary>Example of how to use the controller</summary>

```js
class MyComponent extends LitElement {
  constructor () {
    new ResizeController(this, {
      callback: (entries) => {
        // stuff that sets / removes attributes based on the width of the component
      }
    });

    this.breakpoints = {
      width: [200, 400],
    };
  }

  onResize({ width }) {
    this._width = width;
  }

  static get styles () {
    return [
      css`
        :host([w-lt-200]) {
          color: blue;
        }

        :host([w-gte-400]) {
          color: red;
        }
      `
    ]
  }
}
```
</details>

### Using the Lit Labs `ResizeController` and relying on its API

Our third option was to ditch the `mixin` as well as our API to rely on the `ResizeController` API itself.

The `ResizeController` API works like this:

- You provide a callback to be called everytime a resize happens.
- This callback should return a value and this value will be stored within a `value` property of the controller instance.
- You may retrieve the value from the controller instance within the update lifecycle or the render. This is possible because the controller calls `requestUpdate` to trigger the update lifecycle of the component.

This means we can handle everything from within the lifecycle of our component instead of exposing a public method and a public property.

For instance, we can retrieve the `width` of our component from the `render` method and call a function to set the appropriate attributes corresponding to this `width` from there (or from the `willUpdate` method instead).

<details>
  <summary>Example of how to use the controller</summary>

```js
class MyComponent extends LitElement {
  constructor () {
    this._resizeController = new ResizeController(this, {
      callback: (entries) => {
        // stuff that returns the current `width` of the component
      }
    });
  }

  render () {
    const width = this._resizeController.value;
    setStylingAttributes(this, width, { 
      width: [200, 400],
    });

    return html`...`;
  }

  static get styles () {
    return [
      css`
        :host([w-lt-200]) {
          color: blue;
        }

        :host([w-gte-400]) {
          color: red;
        }
      `
    ]
  }
}
```
</details>

## Solution

We chose to mix our options and go for our <strong>own reactive controller with an API that relies on the Lit update lifecycle</strong>.

The controller also accepts a `callback` to handle actions outside the lit lifecycle and make sure a function is always executed when a resize happens and only when a resize happens.

For instance, we use this `callback` option to trigger [leaflet `invalidateSize`](https://leafletjs.com/reference.html#map-invalidatesize) method everytime a resize happens.

<details>
  <summary>Example of how to use the controller</summary>

```js
// Make sure to use `this.updateComplete` if you want your callback to be executed after the Lit lifecycle
const myCallback = () => this.updateComplete.then(() => {
  ...
})

class MyComponent extends LitElement {
  constructor () {
    this._resizeController = new ResizeController(this, {
      widthBreakpoints: [200, 400],
      callback: myCallback,
    });
  }

  render () {
    // the `resizeController` exposes a public `width` property with the latest observed `width` of the component
    const { width } = this._resizeController;

    return html`...`;
  }

  static get styles () {
    return [
      css`
        :host([w-lt-200]) {
          color: blue;
        }

        :host([w-gte-400]) {
          color: red;
        }
      `
    ]
  }
}
```
</details>

### Advantages

We thought the Lit Labs implementation was really good but we wanted the best of both worlds:

- A reactive controller tailored to our specific needs. The reactive controller should handle the addition / removal of the attributes based on breakpoints.
- A straightforward API. We want to pass the breakpoints directly to our controller and we want the controller to trigger the update lifecycle because we think it's a really great idea from Lit Labs.

### Limits

- Moving away from the mixin means that this code only works with Lit Elements. The mixin could be used with native elements but the reactive controller cannot. This is something we accept because we actually work only with Lit Elements and we needed a solution for this usecase.
- The Lit Labs implementation allowed to observe several elements from the same controller but this is something we don't need.

## What's next?

When [Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries) and [Container query length units](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries#container_query_length_units) support is good enough, the breakpoints feature of the controller will be obsolete.

When this happens, our `ResizeController` will only have one job: trigger the update lifecycle everytime the component is resized.

By then, if the `ResizeObserverEntry.contentBoxSize` support is good enough, we can return the entry and rely on it instead of using `element.getBoundingClientRect()`.

## Resources

* [Resize Observer - MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver),
* [Lit - Reactive controllers](https://lit.dev/docs/composition/controllers/),
* [Lit Labs - Observers](https://www.npmjs.com/package/@lit-labs/observers): our `ResizeController` is heavily inspired by their implementation,
* [Container queries - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries).
