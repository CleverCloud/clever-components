---
kind: '👋 Contributing'
title: 'Browser support'
---

# Browser support

## Browser compatibility approach

When contributing to our components, it's important to understand our browser support strategy. We follow the **Baseline widely available** approach for browser compatibility, which is explained in detail in our [Browser Support Getting Started guide](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%8F%A1-getting-started-browser-support--docs).

The key points to remember:

- We support browsers that implement features that have been widely available for at least 30 months,
- We do not transpile or transform our code to support older browsers,
- We may use "newly available" features as progressive enhancements,
- In rare cases, we may use critical features that require polyfills (see below).

## Tracked web features

When developing components, you need to be mindful of which web platform features you can use. We maintain a tracker of web features that are compatible with our browser support strategy:

<cc-web-features-tracker></cc-web-features-tracker>

For more details on how to use and interpret the feature tracker, see the [Web Features Tracker documentation](../components/cc-web-features-tracker.md).

## Polyfills

We minimize our use of polyfills to maintain performance and simplicity. However, in some cases, polyfills are necessary to support critical functionality.

The conditions for adding a new polyfill to the project are:

1. The feature must be essential for component functionality,
2. The feature must be implemented in at least one major browser based on a ratified specification,
3. The polyfill must be well-maintained and have minimal performance impact.

If you need to add a polyfill to support a new component or feature, please update the [Browser Support Getting Started guide](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%8F%A1-getting-started-browser-support--docs).
