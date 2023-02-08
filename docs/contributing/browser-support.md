---
kind: '👋 Contributing'
title: 'Browser support'
---

# Browser support

## What does it mean for contributors?

As a contributor of this component library, you need to make sure a given Web feature (HTML, CSS, JS, SVG, browser API...) is supported by _modern browsers_ before using it.

When it comes to CSS features, we're not using [autoprefixer](https://autoprefixer.github.io/) yet.
This could change in the future.
For now, this means you really need to wait for native support in _modern browsers_.

When it comes to JavaScript language features, we decided **not to use** any transpilation provided by tools like [Babel](https://babeljs.io/).
We made this decision out of simplicity.
We don't intend to change this in the future.
For now, this means you really need to wait for native support in _modern browsers_.

When it comes to JavaScript and browser APIs than can be polyfilled, we try to wait for native support in _modern browsers_.
In some rare situations (hello Safari), we can make an exception and rely on a polyfill with a dependency in this project.
We did this in the past with:

* [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
* [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

If you're not sure if a given feature is supported by _modern browsers_, you can find out on those sites:

* [Can I use?](https://caniuse.com/) works really well for HTML, CSS, SVG and browser APIs
* [Kangax's compat table](https://kangax.github.io/compat-table/es6/) works really well for specific JavaScript features
* [MDN](https://developer.mozilla.org/en-US/) works well in for all features

Browser vendors also maintain platform/feature status pages:

* https://www.chromestatus.com/features
* https://developer.microsoft.com/en-us/microsoft-edge/status/
* https://platform-status.mozilla.org/
* https://webkit.org/status/

## What features are we waiting for?

There are lots of exciting new Web features we'd like to use in this project, but we still need to wait.

### Features landed in some browsers

* [JS: Top level await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
  * Waiting for Safari 15
* [JS: Intl.NumberFormat - currencySymbol: 'narrow'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
  * Waiting for Safari 14.1
* [JS: Private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)
  * Waiting for Safari 14.1
* [CSS: gap with Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)
  * Waiting for Safari 14.1
* [CSS: Subgrids](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Subgrid)
  * Waiting for Chrome and Safari

### Promising/WIP features

* [CSS: Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
  * Very early but supported in Chrome with a flag
* [JS: Temporal](https://github.com/tc39/proposal-temporal)
* [JS: .at() method on all the built-in indexables](https://github.com/tc39/proposal-relative-indexing-method)
* [JS: New Set methods](https://github.com/tc39/proposal-set-methods)
* [JS: Decorators](https://github.com/tc39/proposal-decorators)
