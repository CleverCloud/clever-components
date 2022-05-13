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
