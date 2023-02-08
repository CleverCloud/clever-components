---
kind: '📌 Architecture Decision Records'
---

# ADR 0004: Why do we wrap `<input>` and `<textarea>` in a `div.wrapper` and puts styles on this wrapper?

🗓️ 2019-10-05 · ✍️ Hubert Sablonnière

This ADR tries to explain why we wrap `<input>` and `<textarea>` in a `div.wrapper` and puts styles on this wrapper.

## Context?

* We started by adding styles directly on `<input>` and `<textarea>` (including styles for states like `disabled`,  `:focus`,  `:hover`...).
* We chose not to wrap text in mulitline `<textarea>` and remove the scrollbar.

## Problems?

* The behaviour of padding/margin in Chrome/Safari is not the same as Firefox when the text does not wrap.
* We want the Firefox behaviour (where the margin/padding are not part of the scollable zone).

## Solution?

* Move all styles to a `div.wrapper` (including `:focus` and  `:hover`)
* This allowed us to listen to some events directly on this wrapper
* This allowed us to simplify the computation of the auto height when multiline
