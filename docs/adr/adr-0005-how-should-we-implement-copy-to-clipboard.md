---
kind: '📌 Architecture Decision Records'
---

# ADR 0005: How should we implement copy to clipboard?

🗓️ 2019-10-05 · ✍️ Hubert Sablonnière

This ADR tries to explain the choices we made to add a copy to clipboard feature on our `<cc-input-text>` component.

## Technical choices?

### Is there a standard way to achieve this?

We use to use [document.execCommand()](https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand) to do so but there is now a standard way to do it which is based on promises.
It's called [clipboard.writeText()](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText).
The problem is that it does not work on Safari 12+.

### Are there any polyfills?

Yes, there is [clipboard-polyfill](https://github.com/lgarron/clipboard-polyfill).
It has most of the `Clipboard` object API but it also means lots of things we don't need.
It's 2.3 KB (min+gzip).

### Alternative?

This polyfill is small and working but we found a smaller lib that only does that: [clipboard-copy](https://github.com/feross/clipboard-copy).
It's basically a "use `clipboard.writeText()` and fallback to `document.execCommand()`" in 433 B (min+gzip).
It's made by [feross](https://github.com/feross) ;-).

## UI/UX choices?

We looked at how others were doing "copy to clipboard" like the copy URL to clone in GitHub and GitLab.
We also looked at 1password and a few others.
Most of them have an icon button on the right which is grouped with the text input.
The button has the same behaviour and states as other buttons in the site.
Sometimes the icon is a clipboard, sometimes it's the classic copy icon (2 files on top of each other).

We tried to adapt our existing `<cc-button>` to support icons and then embed it in the `<cc-input-text>` but it was easier just to use a `<button>` directly.
We also tried to apply the same behaviour and states (focus, active, hover...) we had on our `<cc-buttons>` but it was not a good idea:

* The box shadow thing we have on hover that disappears when active was not working with the rest of the design.
* The whole concept of a button as we have with `<cc-button>` grouped visually with `<cc-input-text>` would not work in `multi` mode with lots of lines since the height can be quite big.

Then we got inspiration from Slack's buttons/actions that are in the main input text of the chat.
Those are just icons at first but they have hover, focus and active states that make sense.

In the end, we decided to:

* Have an icon button like Slack does
* Align it to top right, whatever the height
* Make it display a green tick for a second after the click (just like GitHub does in Pull Request copy branch)
