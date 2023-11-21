---
kind: '🏡 Getting Started'
title: 'Breaking down'
---

# How are structured our Clever Components?

## Components

Our components are [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) built on [Lit](https://lit.dev/).
Simply put, Web Components allow us to create our own HTML tags using existing web standards, Lit being a simple library helping us with the boilerplate.

Our library is following the [atomic design](https://bradfrost.com/blog/post/atomic-web-design/) methodology: a quick summary would be that bigger components are built using and/or on top of smaller components.

## Theme

The components rely on a common default theme.
This default theme is essentially made of CSS Custom Properties contained in a CSS file.
This means that you need to import this CSS file so that components work as intended.

<cc-notice intent="info" message="If the components are displayed in black and white, it means you forgot or failed to import the default theme file."></cc-notice>

## Localization

The translation and localization of our component library is managed by a dedicated system:

* this system is agnostic to how the different components of this library are coded/implemented,
* this system is agnostic to the code/stack of your target application,
* this system tries to have the smallest API surface in our components, just a `i18n(key, params)` function with 2 args,
* this system assumes your users MUST reload the page to apply a language change,
* we don't have a way to only load the translations for a set of components (but we'd like to).
