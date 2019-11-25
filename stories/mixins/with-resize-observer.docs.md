# withResizeObserver()

* This mixin uses a [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) and automatically observes the element's resizes once it's attached to the DOM.
* It also automatically unobserves resizes once the element is detached from the DOM.
* A polyfill is lazy loaded for Safari 12 and other who don't support the [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) API.

## Usage

* To use this mixin, your custom element needs to `extends` the result of `withResizeObserver(ParentClass)`.

Example with native HTMLElement:

```js
class MyElement extends withResizeObserver(window.HTMLElement) {
  /* ... */
}
```

Example with native LitElement:

```js
class MyElement extends withResizeObserver(LitElement) {
  /* ... */
}
```

## `onResize()` method

* If you set a `onResize()` method on your element, it is called each time a resize is observed.
* The method is called with an object as first param (with the `width`).

Example:

```js
class MyElement extends withResizeObserver(window.HTMLElement) {
  onResize ({ width }) {
    console.log(`Element width is now: ${width}px`);
  }
}
```

## `breakpoints` property

* If you set a `breakpoints` property in your constructor, `w-lt-*` and `w-gte-*` attributes will automatically be set/removed when the width changes.
  * `breakpoints` must be an object with a `width` property 
  * `width` property is an array of numbers (values in px) 
* This way, you can set attribute selectors with the breakpoints you specified (a bit like you would do with media queries).

JS example:

```js
class MyElement extends withResizeObserver(window.HTMLElement) {
  constructor () {
    super();
    this.breakpoints = {
      width: [150, 300, 450],
    };
  }
}
```

CSS example:

```css
my-element[w-lt-150]            { /*        width < 150 */ }
my-element[w-gte-150][w-lt-300] { /* 150 <= width < 300 */ }
my-element[w-gte-300][w-lt-450] { /* 300 <= width < 450 */ }
my-element[w-gte-450]           { /* 450 <= width       */ }
```
