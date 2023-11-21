---
kind: '📌 Architecture Decision Records'
---

# ADR 0007: Why a text based tags input?

🗓️ 2020-01-06 · ✍️ Hubert Sablonnière

This ADR tries to explain why we decided to create a tags component as a feature of `<cc-input-text>`.

## Context?

Our need is to enable users to edit list of tags: create, rename and delete.
A tag is a string without spaces and the content is pretty specific to the user's needs.
In the future, we'll uncover some behaviours based on the semantics of tags, maybe with a delimiter like `:`.

We don't really need to limit a tag to a fixed predefined list.
We don't need to limit the number.

Most of our users are developers and keyboard usage and being able to copy/paste is very important.

## Problems?

Our need is not so far from what existing "tags components" can achieve. 
This behaviour can be found in many applications, the most famous example is the destination field of a an email client like gmail.

The first idea would be to reuse an existing component:

* http://jsfiddle.net/developit/d5w4jpxq/
* https://baldwmic.github.io/react-input-tags/
* https://derekedelaney.github.io/react-input-tags/
* https://github.com/harshithmullapudi/react-tags
* https://github.com/JohMun/vue-tags-input
* https://github.com/lang-ai/react-tags-input
* https://github.com/optimista/tagsarea
* https://github.com/voerro/vue-tagsinput
* https://jfusco.github.io/react-tagging-input/
* https://mui.wertarbyte.com/#material-ui-chip-input
* https://wikiki.github.io/form/tagsinput/
* https://yaireo.github.io/tagify/

The main problem is that almost all of them are written with and for a specific framework.
We're still in a era where a ligthweight Web Component version does not exist.

The other problem is UX and keyboard usage.
Lots of them have terrible a11y (no real buttons, focus state does not exist or is hard to see).
We could not find one that combine:

* Good a11y with keyboard usage to delete any of the tag
  * Most of the time, you can delete the last one
* Good a11y with keyboard usage to edit any of the tag
  * Most of the time, you need to delete it (with your mouse)
* A way to copy/paste a list of tags (or part of it)

We don't need to be able to sort the tags.
So the crazy ones with drag and drop are too much for us.

## Solution?

We went for the simplest solution as a user: a space separated values string.
To help our users, we decided to highlight the different tags with a colored background.
This clearly achieves all our goals as for a keyboard user, a text input is perfect for copy/paste, editing any part of the string...

First, we tried an approach that does not wrap (but scrolls) with a `<input>`.
We went for this solution first because wrapping instead of scrolling meant using a `<textarea>`.
We would have had to prevent users from entering new lines and other hacks which is always not a good idea and not standard.
It worked fine in Firefox but not in Chrome/Safari since there is no scroll event on `<input>`.

Because of the inability to achieve the same behaviour in Chrome/Safari, we went for the `<textarea>` idea.
For our needs, it works pretty well in the end.
We had to rework the inner DOM tree of the `<cc-input-text>` component to be able to put the colored background behind the text.
