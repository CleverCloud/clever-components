---
kind: '📌 Architecture Decision Records'
---

# ADR 0008: Why an event called `requestimplicitsubmit`?

🗓️ 2020-01-07 · ✍️ Hubert Sablonnière

This ADR tries to explain why we introduced a custom event on `<cc-input-text>` called `cc-input-text:requestimplicitsubmit`.

## Context?

In most browsers, there is a standard implemented for forms called [Implicit submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission).
This is the reason, you can submit some forms while you have the focus on one of the `<input>` fields.

There are rules that cover if the focus `<input>` has the right `type=`, if the submit button is not disabled and many others.
Because of the strict isolation of the shadow DOM, it is not possible to achieve right now.
The lack of this very feature is discussed in [this w3c/webcomponents issue thread](https://github.com/w3c/webcomponents/issues/815).

## Ideas?

We identified two solutions to achieve such behaviour.

### Light DOM

The first one is not to use the shadow DOM for form elements while we wait for improvements of the specs.
There are works on [AOM](https://wicg.github.io/aom/explainer.html) and [form associated custom element (FACE)](https://github.com/whatwg/html/pull/4383) that are really interesting but not ready for prime time yet.
In the meantime ING, which are very important and smart users of Web Components, found an interesting way to use the light DOM with LitElement with slots.

This is a very clever idea, the implementation is controlled by [this mixin](https://github.com/ing-bank/lion/blob/master/packages/core/src/SlotMixin.js).
This is also the best way to have strong a11y in any user agent.

Sadly, we don't see ourselves using such a mixin right now.
We're a very small team of ~1 person and it would impact lot of the code we already wrote.

### Custom event

Inspired by the discussions in [this w3c/webcomponents issue thread](https://github.com/w3c/webcomponents/issues/815), we went for a custom event.

As of now, depending on the situation, the `<cc-input-text>` will emit `cc-input-text:requestimplicitsubmit` events:

* When `enter` key is pressed in simple mode and tags mode
  * This is closed to standard behaviour as users are concerned 
* When `ctrl+enter` key is pressed in multi mode
  * This is a bonus that standard behaviour would not give us
  
In both cases, it's up to the user of `<cc-input-text>` to listen for those events and trigger the form submission if possible (submit button no disabled etc...).

## Future?

We may reconsider this when we'll find time to deep dive into our a11y problems.
We also may consider created a component working with this event to handle the submit button disabled etc...
