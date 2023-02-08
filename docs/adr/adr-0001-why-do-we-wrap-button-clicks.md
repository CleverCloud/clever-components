---
kind: '📌 Architecture Decision Records'
---

# ADR 0001: Why do we wrap `<button>` clicks in a custom event `cc-button:click`?

🗓️ 2019-10-01 · ✍️ Hubert Sablonnière

This ADR tries to explain why we moved from just letting native clicks bubble to a custom event named `cc-button:click`.

## Context?

We started really simple when we created the `<cc-button>` Web component.
We tried to keep it close to standard behaviours.
That's why we first decided to just let the inner native element `<button>` fire and bubble native `click` events.

## Problems?

* When the `<cc-button>` was used in a flexbox context (or any other situation where its height is augmented) we received native `click` events when the surrounding margin was clicked.
* When the inner native `<button>` was `disabled` we still had clicks in Chrome (maybe others).
* When researching a delay mechanism (user clicks but the click is actually fired after a delay of X secs), it was not possible to achieve this in all browsers.

## Solution?

* All users of this `<cc-button>` need to listen to `cc-button:click` instead of `click` and everything will be fine.
