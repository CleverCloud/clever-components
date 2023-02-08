---
kind: '📌 Architecture Decision Records'
---

# ADR 0006: Why the `<cc-overview>` uses slots?

🗓️ 2019-10-17 · ✍️ Hubert Sablonnière

This ADR tries to explain why we decided to use slots for the `<cc-overview>` component instead of composing an abstraction layer over the 6 child components.

## Context?

In the console, we want to display an overview like this:

```
+---------------------------------------------------------------------------------------------+
|                                                                                             |
| <cc-header-app>                                                                             |
|                                                                                             |
+---------------------+-----------------------+-----------------------+-----------------------+
|                     |                       |                       |                       |
|                     |                       |                       |                       |
| <cc-tile-instances> | <cc-tile-scalability> | <cc-tile-deployments> | <cc-tile-consumption> |
|                     |                       |                       |                       |
|                     |                       |                       |                       |
+---------------------+-----------------------+-----------------------+-----------------------+
|                                                                                             |
| <cc-logsmap>                                                                                |
|                                                                                             |
|                                                                                             |
|                                                                                             |
|                                                                                             |
|                                                                                             |
|                                                                                             |
|                                                                                             |
|                                                                                             |
+---------------------------------------------------------------------------------------------+
```

The first idea we had was to create a `<cc-overview>` component that would be a "blackbox" encapsulating those 6 child components.

## Problems?

If we implement it this way (strong encapsulation), we would have to:

* 👎 expose and pass down many of the different properties/attributes
* 👎 it also means renaming the different `error` to 6 different `error-*` properties
* 👎 expose the `addPoints()` method from `<cc-logsmap>`

If we want to add another tile component in the overview (or remove one), we would need to update this component.
This coupling is a bit too strong and it's too much code just to layout 6 components.

👍 Positive fact: we would not have to listen to events and re-emit them since they already bubble up.

## Solution?

We decided to use the [slot](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Slot) mechanism from Web Components (with names).
This way, the user will do something like this:

```html
<cc-overview>
    <cc-header-app slot="head"></cc-header-app>
    <cc-tile-instances slot="tiles"></cc-tile-instances>
    <cc-tile-scalability slot="tiles"></cc-tile-scalability>
    <cc-tile-deployments slot="tiles"></cc-tile-deployments>
    <cc-tile-consumption slot="tiles"></cc-tile-consumption>
    <cc-logsmap slot="main"></cc-logsmap>
</cc-overview>
```

The component's only purpose is to layout its children to achieve the fluid "grid" design we want.

With this implementation:

* 👍 We can use the different child components directly (properties, attributes, events...).
* 👍 We can add/remove parts of this overview without touching to `<cc-overview>`.
* 👍 We can create other look-alike overviews with other components.

We think we can apply this *slot* style for any "presentational" component where:

* It groups other components
* There is only HTML/CSS and almost no JavaScript
* There is no state/data links between components
