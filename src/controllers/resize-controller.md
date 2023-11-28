# ResizeController

* This controller uses a [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) and automatically observes the element resizes once it's attached to the DOM.
* It also automatically unobserves resizes once the element is detached from the DOM.
* It exposes a `width` property with the latest observed `width` value.
* It can also be used to automatically add attributes that you may use to style your component based on different breakpoints.
* It accepts a callback to be executed everytime a resize happens.

## How to use it?

To use this controller, you need to initialize a new `ResizeController` within your component `constructor`.

Example:

```js
class MyElement extends LitElement {
  /* ... */
  constructor () {
    this._resizeController = new ResizeController(this);
  }
}
```

## How to retrieve the width of your component?

One of the goals of the `ResizeController` is to allow you to retrieve the size of your component everytime it is resized.

The `ResizeController` saves the observed `width` in a public `width` property that you may use at any point.

The `ResizeController` triggers the update lifecycle of your component everytime it is resized so you may access the current `width` of the component from the `render`, `update` or `updated` hooks.

Example:

```js
class MyElement extends LitElement {
  constructor () {
    this._resizeController = new ResizeController(this);
  }

  render () {
    const { width } = this._resizeController;

    return html`...`;
  }
}
```

**Note:** Currently, the `ResizeController` only exposes the `width` of the observed component because it is the only thing we need.

## How to set attributes and style your component based on breakpoints?

The `ResizeController` is also able to set attributes on your component based on `widthBreakpoints` you provide.

This is useful if you want to style your component differently depending on its `width`.

To use this feature, you need to pass the `widthBreakpoints` as an argument of the `ResizeController` constructor as follows:

```js
const BREAKPOINTS = [150, 300, 450];

class MyElement extends LitElement {
  constructor () {
    new ResizeController(this, {
      widthBreakpoints: BREAKPOINTS,
    });
  }
}
```

For each given breakpoint, the `ResizeController` generates and updates the following attributes everytime the component is resized:

* `w-lt-${breakpoint}`,
* `w-gte-${breakpoint}`.

You may use these from your component CSS as follows:

```css
:host([w-lt-150])           { /*        width < 150 */ }
:host([w-gte-150][w-lt-300]) { /* 150 <= width < 300 */ }
:host([w-gte-300][w-lt-450]) { /* 300 <= width < 450 */ }
:host([w-gte-450])          { /* 450 <= width       */ }
```

**Note:** Currently, the `ResizeController` only supports breakpoints based on the `width` of the component because it is the only thing we need.

## How and when to pass a callback to the resize controller?

You may use the `callback` option when you need to perform an action after a resize and after the Lit update lifecycle is complete.

Note that the callback is given the `width` as an argument if you need to access this data.

For instance, in the `cc-map` component, we want to call the leaflet `invalidateSize` method everytime a resize happens.

To do so, you need to pass your callback as an option when instantiating `resizeController`:

```js
// Make sure to use `this.updateComplete` if you want your callback to be executed after the Lit lifecycle
const myCallback = () => this.updateComplete.then(() => {
  this._map?.invalidateSize();
})

class MyElement extends LitElement {
  constructor () {
    new ResizeController(this, {
      callback: myCallback,
    });
  }
}
```

**Note:** If you want to modify a prop or anything related to your Lit component, please rely on the Lit lifecycle to make sure it is properly handled.

