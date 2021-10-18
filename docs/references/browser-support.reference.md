---
kind: '📌 Docs/References'
title: 'Browser support'
---
# Browser support reference

This project targets _modern browsers_.

## What do we mean by _modern browsers_?

Our subjective definition is: **current** AND **previous** stable versions of ![Chrome logo](https://github.com/alrra/browser-logos/raw/main/src/chrome/chrome_16x16.png) Chrome, ![Firefox logo](https://github.com/alrra/browser-logos/raw/main/src/firefox/firefox_16x16.png) Firefox and ![Safari logo](https://github.com/alrra/browser-logos/raw/main/src/safari/safari_16x16.png) Safari.

In the real world, browsers evolve at different speeds.
Many browsers are based on Chromium now, and they often land Web features early.
On the other side, Safari often lands Web features last.
Because of this, we maintain a more explicit list of such _modern browsers_ and we update it every 6 months, a few months after a new Safari release gets out.

| Browser | Version | Comments |
| --- | --- | --- |
| ![Chrome logo](https://github.com/alrra/browser-logos/raw/main/src/chrome/chrome_16x16.png) Chrome | `>=86` | Desktop & Android [details](https://www.chromestatus.com/features/schedule) |
| ![Firefox logo](https://github.com/alrra/browser-logos/raw/main/src/firefox/firefox_16x16.png) Firefox | `>=81` | Desktop & Android [details](https://wiki.mozilla.org/Release_Management/Calendar) |
| ![Safari logo](https://github.com/alrra/browser-logos/raw/main/src/safari/safari_16x16.png) Safari | `>=14` | macOS, iOS + WebView based browsers [details](https://developer.apple.com/documentation/safari-release-notes) |
| | | _browsers based on chromium..._ |
| ![Brave logo](https://github.com/alrra/browser-logos/raw/main/src/brave/brave_16x16.png) Brave | `>=1.15` | Based on Chromium 86 [details](https://github.com/brave/brave-browser/wiki/Brave-Release-Schedule) |
| ![Edge logo](https://github.com/alrra/browser-logos/raw/main/src/edge/edge_16x16.png) Edge | `>=86` | Based on Chromium 86 [details](https://docs.microsoft.com/en-us/deployedge/microsoft-edge-relnote-stable-channel) |
| ![Opera logo](https://github.com/alrra/browser-logos/raw/main/src/opera/opera_16x16.png) Opera | `>=72` | Based on Chromium 86 [details](https://help.opera.com/en/opera-version-history/) |
| ![Samsung Internet logo](https://github.com/alrra/browser-logos/raw/main/src/samsung-internet/samsung-internet_16x16.png) Samsung Internet | `>=14` | Based on Chromium 87 [details](https://en.wikipedia.org/wiki/Samsung_Internet) |
| ![Vivaldi logo](https://github.com/alrra/browser-logos/raw/main/src/vivaldi/vivaldi_16x16.png) Vivaldi | `>=3.4` | Based on Chromium 86 [details](https://vivaldi.com/blog/desktop/releases/) |

ℹ️ The above list is based on browser versions that were out when Safari 14 was released in september 2020.

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
In some rare situations (hello Safari), we can make an exeption and rely on a polyfill with a dependency in this project.
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

## What does it mean for users?

As a user of this component library, you can be sure it will work in _modern browsers_.
If you need wider browser support, you will need to adapt your project configuration and toolchain.

When it comes to CSS features, we don't have a clear solution for you right now.

When it comes to JavaScript language features, you will need to configure your toolchain (bundler, transpiler...) to transform the source of our components to something that works for your context.

When it comes to JavaScript and browser APIs than can be polyfilled, you will need to choose and load the appropriate polyfills yourself before you load our components.

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
