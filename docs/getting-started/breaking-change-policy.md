---
kind: '🏡 Getting Started'
title: 'Breaking change policy'
---

# Breaking change policy

When a new version of our components is released, we need to consider the potential impact of changes made and how we label them.

> Breaking changes are changes that can potentially break an integration.
> Additive changes are changes that should not break an integration.

*Source: [GitHub's Breaking Changes](https://docs.github.com/en/rest/overview/breaking-changes)*

This is why our project is based on [Semantic Versioning](https://semver.org/) (or Semver) to define version number: a major version introduces at least one breaking change.

As a consequence, for each major version, the accompanying changelog includes a "Breaking changes" section, listing API incompatibilities.
When relevant, this section also includes information to help you migrate from your current version.

## Breaking changes for components

Regarding how [our components](https://www.clever-cloud.com/doc/clever-components/?path=/story/%F0%9F%93%8C-docs-web-components-guidelines-at-clever-cloud--page) are made, the elements exposed to a breaking change are (but not limited to):

* attributes,
* properties,
* slots,
* events,
* CSS custom properties,
* methods,
* host `display` property.

Therefore, the following should be considered breaking changes:

* renaming or deleting one of those elements,
* modifying the type of an attribute or property,
* modifying the signature of a public method,
* modifying the type of the object included in an event.

On the contrary, the following should be considered non-breaking changes:

* adding one of those elements,
* updating the default value of an attribute or a property.

## Breaking changes for tokens

Tokens used by this project are separated into two categories:

* core tokens, for instance `--color-blue`. These tokens are used only within `default-theme.css` to reference color choices,
* semantic tokens, prefixed with `cc`, for instance `--cc-color-text-primary`. The tokens are used in components and overridden in custom themes.

**Only semantic tokens are subject to breaking changes** because they are the only tokens supposed to be used by components and custom themes.

Furthermore, we consider that **color and design changes do not generate breaking changes**. These changes are part of the evolution of our components design in general.

Therefore, the following should be considered breaking changes:

* removing a semantic token,
* renaming a semantic token.

On the contrary, the following should be considered non breaking changes:

* any change or additions to core tokens,
* adding a new semantic token,
* modifying the value of a semantic token.

Note: modifying the value of a token should not lead to a breaking change because the name of the token should reflect its scope.
For instance, changing `--cc-color-border-neutral: #eee` to include the `border-style` and `border-width` would require to rename the token at the same time: `--cc-border-neutral: 1px solid #eee`.

## Resources used to write down this policy

* [GitHub's Breaking Changes](https://docs.github.com/en/rest/overview/breaking-changes?apiVersion=2022-11-28),
* [Morning Star Design System: Versioning & Breaking Changes](https://designsystem.morningstar.com/legacy/v/2.6.0/about/versioning.html),
* [Kaizen Design System GitHub issue: "What is a breaking change in Kaizen?"](https://github.com/cultureamp/kaizen-design-system/issues/675).
