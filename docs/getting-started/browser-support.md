---
kind: '🏡 Getting Started'
title: 'Browser support'
---

# Browser support

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

<cc-notice intent="info" message="The above list is based on browser versions that were out when Safari 14 was released in september 2020."></cc-notice>

## What does it mean for users?

As a user of this component library, you can be sure it will work in _modern browsers_.
If you need wider browser support, you will need to adapt your project configuration and toolchain.

When it comes to CSS features, we don't have a clear solution for you right now.

When it comes to JavaScript language features, you will need to configure your toolchain (bundler, transpiler...) to transform the source of our components to something that works for your context.

When it comes to JavaScript and browser APIs than can be polyfilled, you will need to choose and load the appropriate polyfills yourself before you load our components.
