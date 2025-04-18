---
kind: '🏡 Getting Started'
title: 'Browser support'
---
# Browser support

This project relies on Baseline widely available features for browser support.

## What is Baseline?

[Baseline](https://web.dev/baseline/) is an initiative that identifies which web platform features work reliably across major browsers.
Baseline features come in two categories:

- **Newly available** (🔵): Features that work in the latest versions of major browsers but may not be supported in older versions.
These features have been implemented across browsers but haven't yet reached the "widely available" threshold.

- **Widely available** (🟢): Features that have been supported across browsers for at least thirty months (two years and six months), providing excellent backwards compatibility and reliability.
These features work in both current and many older browser versions.

We use **Baseline widely available** features as our foundation for browser support, which means our components will work in browser versions that are up to thirty months old, including Extended Support Release (ESR) and Long Term Support (LTS) versions of:

- ![Chrome logo](https://github.com/alrra/browser-logos/raw/main/src/chrome/chrome_16x16.png) Chrome (desktop & Android)
- ![Firefox logo](https://github.com/alrra/browser-logos/raw/main/src/firefox/firefox_16x16.png) Firefox (desktop & Android)
- ![Safari logo](https://github.com/alrra/browser-logos/raw/main/src/safari/safari_16x16.png) Safari (macOS & iOS)

As well as other modern browsers based on these engines.

## Exceptions to the "Widely Available" Rule

While we generally rely on Baseline widely available features, we make two types of exceptions:

1. **Progressive Enhancements**: We may use features that are only "newly available" (🔵) if they qualify as progressive enhancements. This means the feature gracefully degrades in browsers that don't support it, while providing enhanced functionality in modern ones. In these cases, no polyfill is required since the absence of the feature doesn't break core functionality.

2. **Critical Features Requiring Polyfills**: In rare cases, we may use features that aren't yet widely available if they're essential for component functionality AND at least one major browser has implemented the feature based on a ratified specification. For these exceptions, developers need to implement specific polyfills to support older browsers. We will never rely on features that exist only in draft specifications or that haven't been implemented in any browser.

## Required Polyfills

The following polyfills are required in specific browser scenarios:

- **ElementInternals API**: The [ElementInternals polyfill](https://github.com/calebdwilliams/element-internals-polyfill) is required for Safari versions prior to 16.4. This polyfill enables critical form-associated custom element features that our components rely on. Make sure to include this polyfill before loading any components if you need to support older Safari versions.

## What does it mean for users?

As a user of this component library, you can expect reliable functionality across all major modern browsers.
The use of Baseline widely available features means:

1. No need to maintain complex browser version lists
2. Consistent behavior across different browsers and versions
3. Long-term stability and compatibility

If you need to support browsers that don't meet Baseline widely available requirements, you may need to:

- Configure your JavaScript toolchain (bundler, transpiler) to transform our components' source code
- Add appropriate polyfills for JavaScript APIs before loading our components
- Accept that some progressive enhancement features may not be available in older browsers
