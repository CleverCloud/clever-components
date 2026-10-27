---
kind: '👋 Contributing'
title: 'Quick accessibility reminders'
---

# Quick accessibility reminders

<cc-notice intent="warning" message="This doc is a work in progress..."></cc-notice>

## Explicit accessible names for links

When UI contains several links with the same text, like "Read more" links for instance, we need to make sure each link is as explicit as possible for people using assistive technologies.

To do so, we rely on the `aria-label` attribute.
Its value **must begin with the visible text** and the **additional information must be placed after**:

`aria-label="visible text - additional info"` (you can skip the "-" if you want, only the order is important here)


### Example:
A "Read the documentation" link leading to the "JavaScript application" documentation page should be as follows:
```html
<a href="..." aria-label="Read the documentation - JavaScript application">Read the documentation</a>
```

To learn more about this subject, see the [G208 Technique of WCAG 2.2 - "Including the text of the visible label as part of the accessible name"](https://www.w3.org/WAI/WCAG22/Techniques/general/G208).

### The `a11y-name` convention

Several of our components (`cc-button`, `cc-icon`, `cc-img`, `cc-loader`, `cc-popover`...) expose an `a11y-name` attribute (`a11yName` property) to let consumers set an explicit accessible name.

The same rule applies to its value: when the element has a visible text, the `a11y-name` **must** start with that visible text.
For instance `a11y-name="Add to estimation - NodeJS XS"` on a button labelled "Add to estimation".

## Visually hidden text

When you need a text that is only exposed to assistive technologies, use the `visually-hidden` class.

It is not a global class, it comes from the shared `accessibilityStyles` defined in `src/styles/accessibility.js` and you have to add it to your component styles:

```js
import { accessibilityStyles } from '../../styles/accessibility.js';

static get styles() {
  return [
    accessibilityStyles,
    // language=CSS
    css`
      /* your styles */
    `,
  ];
}
```

Never use `display: none`, `visibility: hidden` or a zero size to hide such a text, these remove the element from the accessibility tree.

## Decorative SVGs

In components, icons are rendered with the [`cc-icon`](🧬-atoms-cc-icon--docs) component, which already applies the rules below: it sets `aria-hidden="true"` on the inner `<svg>` by default, and only exposes it (with `role="img"`, `aria-label` and a `<title>`) when the `a11y-name` attribute is set.
So in most cases you have nothing to do, just don't set `a11y-name` on a decorative icon.

The rest of this section applies if you write an `<svg>` element by hand. If you use an `<img>` tag, rely on the `alt` attribute.

With `<svg>` elements, apply the same logic as you do with `<img>` elements to determine whether it is decorative or it conveys information.
In most cases, it probably is decorative because we try to provide text next to the icon as much as possible.

If the `<svg>` is decorative, then we need to make sure its content is not read by screen readers.
To do so, we use the `aria-hidden="true"` attribute on the `<svg>` element.

### Example:
```html
<svg aria-hidden="true"></svg>
```

**Note**: Make sure your `<svg>` element:
* has no other `aria-` attribute (`aria-label`, etc.),
* has no `role` attribute,
* and has no `<title>` or `<desc>` tags.

These do not make sense for a decorative `<svg>` and screen readers may try to announce these elements if you try to name them even though they are not supposed to be exposed (`aria-hidden="true"`).

## The `title` attribute

We only use this attribute on interactive elements that contain only an image and no text (a close button containing an "x" icon, a "+" button, etc.).

When we use this attribute, it should always be as a `description` and not as an `accessible name` because it is not robust enough.

To use the `title` as a description, you must provide an accessible name:

* use the `alt` attribute value if the button contains only an `<img>` tag.
* use a visually hidden text if the button contains only a `<svg>` tag and hide the `<svg>` with `aria-hidden="true"`.

### Example
This means that for a close button, we do this:
```html
<button title="Close this notification">
  <img src="..." alt="Close this notification">
</button>
```

Or with an `<svg>`:
```html
<button title="Close this notification">
  <svg aria-hidden="true">
  </svg>
  <span class="visually-hidden">Close this notification</span>
</button>
```

**Note**: This means we provide redundant info for screen reader users (description = accessible name).
These cases are rare because we try to provide a text next to the icon as much as possible (in which case, a `title` is unnecessary)

The `title` attribute is a complex subject, if you want to learn more about it, see [the a11y project - Use title attributes](https://www.a11yproject.com/posts/title-attributes/)) and the resources linked in this article.

## Grouping form controls

Related form controls must be grouped and the group must have an accessible name.

`<fieldset>` and `<legend>` are the standard way to do it and some components still use them.
But `<legend>` is very hard to style reliably, especially when it has to be displayed next to the group instead of above it.
For these cases, we moved to `<div>` elements with `role="group"` and `aria-labelledby`, see [ADR 0025: Moving away from `fieldset` and `legend`](📌-architecture-decision-records-adr-0025-moving-away-from-fieldset-and-legend--docs):

```html
<div role="group" aria-labelledby="legend">
  <p id="legend">Our legend</p>
  <!-- inputs and labels -->
</div>
```

## Announcing dynamic changes

When a user action changes one part of the UI and the result shows up in another part, without moving the focus, the change must be announced.

Typical examples:

- Copying a value to the clipboard displays a toast at the edge of the screen.
- Adding an item to a cart or changing an option updates a price displayed somewhere else on the screen.

We rely on live regions for this: a container that is already in the DOM before the change, with `aria-live="polite"` and, most of the time, `aria-atomic="true"`.

```html
<div aria-live="polite" aria-atomic="true">${this._price}</div>
```

The container must exist and be rendered **before** the content changes, otherwise the change is not announced.
This is why several components render an empty live region and only fill it later.

The `cc-toaster` component is one implementation of this pattern (an action, a temporary message displayed elsewhere, the focus left untouched), the reasoning behind it is detailed in [ADR 0019: How to make toaster accessible](📌-architecture-decision-records-adr-0019-how-to-make-toaster-accessible--docs).

### When not to use a live region

A misused live region does more harm than no live region at all. Do not use one when the focus can go to the message:

- An inline error message stays associated with its form control, it is not announced through a live region.
- After a form submit, or for a group of error messages, move the focus to the error summary or to the first invalid control.

If the focus can be moved to the message, move it and do not use a live region.
