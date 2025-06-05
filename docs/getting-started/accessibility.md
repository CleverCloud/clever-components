---
kind: '🏡 Getting Started'
title: 'Accessibility'
---

# Our approach to accessibility

<cc-notice>
  <div slot="message">
    <p>For now, most of our components <strong>cannot be considered accessible</strong>.</p>
    <p>The following document reflects our <strong>goals and the fundamental principles we want to follow</strong>.</p>
    <p>We still need to tackle a <a href="https://github.com/CleverCloud/clever-components/issues/834">few issues</a> before we can actually live up to these principles.</p>
  </div>
</cc-notice>

## What is Web Accessibility?

When we design and develop components, we do our best to make sure they can be used by anyone, whatever their disabilities and the tools or technologies they use.

> Web accessibility means that websites, tools, and technologies are designed and developed so that people with disabilities can use them. More specifically, people can:
>
>  - perceive, understand, navigate, and interact with the Web
>  - contribute to the Web
>
> Web accessibility encompasses all disabilities that affect access to the Web, including:
>
>  - auditory,
>  - cognitive,
>  - neurological,
>  - physical,
>  - speech,
>  - visual.

*Source: [Web Accessibility Initiative - Accessibility Fundamentals](https://www.w3.org/WAI/fundamentals/accessibility-intro/)*

## Accessibility should never be an afterthought

When designing a component, we always consider the potential accessibility issues and solutions.
If possible and relevant, we discuss issues even before we start developing.

We try to only publish components that meet the accessibility requirements (compliant with the [WCAG 2.1](https://www.w3.org/TR/WCAG21/)).

This means that we fix accessibility issues before we release our components.

**Only accessible components should be considered production ready**.

## Accessibility should be tested both automatically and manually

Good intentions and hard work are not enough: we need to make sure our components match the expectations.

Since product ready components should be accessible, every component goes through automated tests before any pull request is merged.
In fact, if one of the tests fails, the pull request cannot be merged.

We mainly rely on automated tests to catch silly mistakes and regressions.

Because most accessibility issues cannot be detected automatically, we have also established a list of things to check manually before a component can be released.
This list focuses on the following aspects:

- the content should still be legible at any zoom level up to 400%,
- the content should still be legible when text size is increased to 200%,
- no information is given through color usage only,
- the HTML implements the proper semantic tags,
- ARIA attributes are used in a proper way, and only when relevant,
- if the component implements ARIA attributes and/or a specific ARIA Design Pattern, it has been tested with screen readers,
- every action that can be done with a mouse also works using the keyboard only.

<details>
  <summary>Screen readers used for testing</summary>
  <table>
    <caption>Screen reader & browser combinations</caption>
    <thead>
      <tr>
        <th>Screen reader</th>
        <th>Browser</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>NVDA (up-to-date)</th>
        <td>Firefox</td>
      </tr>
      <tr>
        <th>NVDA (up-to-date)</th>
        <td>Chrome</td>
      </tr>
      <tr>
        <th>JAWS (Previous major version)</th>
        <td>Chrome</td>
      </tr>
      <tr>
        <th>JAWS (up-to-date)</th>
        <td>Chrome</td>
      </tr>
      <tr>
        <th>VoiceOver (up-to-date)</th>
        <td>Safari</td>
      </tr>
      <tr>
        <th>Talkback (up-to-date)</th>
        <td>Chrome</td>
      </tr>
      <tr>
        <th>VoiceOver - iOS (up-to-date)</th>
        <td>Safari</td>
      </tr>
    </tbody>
  </table>

  This list is extracted from the official French guidelines that can be found on the [Testing environments page (In French)](https://accessibilite.numerique.gouv.fr/methode/environnement-de-test/).

  The version used for testing is based on results of screen reader usage surveys that show most users tend to update NVDA and VoiceOver but not JAWS because updates are not free.
</details>

## Accessibility is a process, not a milestone

Once a component is released, it does not mean it is fully accessible:

- we may have missed issues,
- it may be compliant with the WCAG but still present usability issues or room for improvements,
- what was working back when we tested and published the component may not work with the current assistive technologies.

In any case, we know that a component's life is made of fixes, tweaks, improvements.
Some of our very first components still receive updates every now and then to patch things or improve their user experience, accessibility or performance.

If you encounter an issue with one of our components, please [open an issue on our GitHub repository](https://github.com/CleverCloud/clever-components/issues/new).

## Accessibility can be hard

Although we do our best, sometimes we fall short.

We think the most important things when it comes to accessibility are <strong>humility and transparency</strong>.

The list of [pending accessibility issues](https://github.com/CleverCloud/clever-components/labels/a11y) is always visible from out GitHub repository.

When we know our components have accessibility limitations but we cannot solve these directly, we do as follows:

- warn about the accessibility limitations within the component documentation, in a clearly visible and dedicated section.
- recommend alternative or complementary solutions to mitigate the issues.

### The toaster example

A good example is the `cc-toaster` & `cc-toast` components. Even though they are technically accessible, we know that:

- they can still cause accessibility issues if they are not used properly (for instance if they contain interactive content),
- some users may not see them, not have enough time to read them, etc.

We did our best to provide a good user experience (the timeout is paused on `hover` / on `focus`) and we want to add a way to view past notifications and interact with them.

We have documented all of this in the [ADR 19 - How to make toaster accessible?](📌-architecture-decision-records-adr-0019-how-to-make-toaster-accessible--docs).
