---
kind: '📌 Docs'
---
# Quick accessibility reminders

NOTE: This doc is a work in progress...

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

## Decorative SVGs

This section only applies if you use `<svg>` elements. If you use an `<img>` tag, rely on the `alt` attribute.

With `<svg>` elements, apply the same logic as you do with `<img>` elements to determine whether it is decorative or it conveys information.
In most cases, it probably is decorative because we try to provide text next to the icon as much as possible.

If the `<svg>` is decorative, then we need to make sure its content is not read by screen readers.
To do so, we use the `<aria-hidden="true">` attribute on the `<svg>` element.

### Example:
```html
<svg aria-hidden="true"></svg>
```

**Note**: Make sure your `<svg>` element:
* has no other `aria-` attribute (`aria-label`, etc.),
* `role` attribute,
* and no `<title>` or `<desc>` tags.

These do not make sense for a decorative `<svg>` and screen readers may try to announce these elements if you try to name them even though they are not supposed to be exposed (`aria-hidden="true"`).

## The `title` attribute

We only use this attribute on interactive elements that contain only an image and no text (a close button containing an icon, a "+" button, etc.).

When we use this element, it should always be as a `description` and not as an `accessible name` (`aria-labelledby`, `aria-label`, content, `for / id`) because it is not robust enough.

### Example
This means that for a close button, we do this:
```html
<button title="Close this notification">
  <img src="..." alt="Close this notification">
</button>
```

**Note**: This means we provide redundant info for screen reader users (description = accessible name).
These cases are rare because we try to provide a text next to the icon as much as possible (in which case, a `title` is unnecessary)

The `title` attribute is a complex subject, if you want to learn more about it, see [the a11y project - Use title attributes](https://www.a11yproject.com/posts/title-attributes/)) and the resources linked in this article.
