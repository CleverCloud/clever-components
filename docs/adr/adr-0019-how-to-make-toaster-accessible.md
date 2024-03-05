---
kind: '📌 Architecture Decision Records'
---

# ADR 0019: How to make toaster accessible?

🗓️ 2022-08-26 · ✍️ Pierre de Soyres

This ADR tries to explain what challenges we faced when we implemented the `toast` pattern. (see [ADR 0018: How to give feedback after a user action?](https://www.clever-cloud.com/doc/clever-components/?path=/docs/📌-architecture-decision-records-adr-0018-how-to-give-feedback-after-a-user-action--docs)).

## Context?

When we design a new component, we always try to be as inclusive as possible.
Meaning that the sooner we think about accessibility, the better.
We understood that the `toast` pattern comes, by design, with a lot of accessibility challenges.

## Problems?

* toasts are displayed for a short amount of time and some user may miss the notification
* they are placed in the corner of the screen and therefore, people using a screen magnifier may totally miss them.
* they reveal their intention by using colors (green for success, red for error) which causes issues for colorblind people.
* they may contain buttons which should be focusable with keyboard, but the focus may be lost when the toast disappears.
* If these buttons are related to critical actions, users may miss them because the toast has disappeared before they saw it or even reached it.
* screen readers expect dynamic content to be inserted inside a [live region element](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) which has sporadic support.

## What we implemented

Some issues could be addressed, but we quickly understood we would have to make some compromises.
Here is what we implemented.

### Toast color

Color is not enough to reveal the notification intention, so we added an icon to help colorblind users to understand it.
We also added an `alt` text to that icon so that people using screen readers are aware of the notification intention.
This `alt` text is also translated in English or French depending on the selected language.

### Toasts ordering

In the DOM, `<cc-toast>` elements are ordered from the most recent to the oldest.
But, when the toaster is placed at the bottom of the screen, we want the toasts to be visually stacked from bottom to top with the oldest on top.
However, we want the order of the `<cc-toast>` elements to be consistent for screen readers (they announce things using the DOM order), so we used `flex-direction: column-reverse` to reverse the visual order while keeping the DOM order intact.

### Toast timeout

One of the biggest accessibility issue of the toast pattern is this brief timeout during which the message is visible.
We do not have any perfect solution to address it, but we tried to minimize it with the following:

* We provide a progress bar that indicates that the notification will disappear soon.
* We provide a way to pause the timeout by moving the mouse over the toast or by focusing it with the keyboard.
* We provide a way to set the timeout.
  By default, this timeout is set to 5 seconds but as a developer, you can modify this value.
  And if you want to go further, it is up to you to provide a way for the user to modify this timeout.

### Keyboard navigation

We made the toast focusable so that users can focus the toast using the keyboard.
When the toast is focused, the timeout is paused.
The close button is also focusable and can be activated using the keyboard.

When the close button is clicked using keyboard, the focus is lost because the toast is dismissed and is removed from the DOM.
We did not implement anything on this issue yet, but we know that we have to provide some mechanisms that:

* try to focus to the next toast (if any) or reset focus on the `<body>` element.
* dispatch a kind of _focus lost_ event so that developers can implement their own behaviour.

### ARIA roles

If one wants a content to be announced by screen readers without having to move the focus, they should rely on live regions.
Live regions are typically set by using the `aria-live` attribute which allows to specify:

* whether to interrupt the screen reader (`aria-live="assertive"`) or not (`aria-live="polite"`),
* whether to only announce what has just been inserted (`aria-atomic="false"`, or no `aria-atomic` attribute), or announce everything from the live region everytime something is inserted inside it (`aria-atomic="true"`).

To make the choice easier and to add semantics to these regions, `role` attributes were added:

* `role="alert"` which is the same as setting `aria-live="assertive"` + `aria-atomic="true"`,
* `role="log"` which is the same as setting `aria-live="polite"` + `aria-atomic="false"`,
* `role="status"` which is the same as setting `aria-live="polite"` + `aria-atomic="true"`.

#### Doubts and struggles

We hesitated a lot on how verbose (`aria-atomic`) and how polite (`aria-live`) we wanted the screen reader to be.

Should we interrupt screen readers because we consider errors to be sensitive information?
Should we make the screen readers read all toasts from the area everytime a new toast pops up?

We also had doubts about where to place the `role` attribute:

* place it on the element being dynamically added to the DOM (the `<cc-toast>` element)
* or place it on the container of the dynamically added content (the `<cc-toaster>` element).

#### Test and support

To make a decision, we needed to conduct fairly extensive tests to check how screen readers support the different combinations.
You can find the detail of these tests in the section below.

##### Dynamically inserted live regions

Our tests show that `role` attributes seem to work best when they are not inserted dynamically.
In other words, it seems more robust to use the `role` attribute on the `<cc-toaster>` element instead of the `<cc-toast>` element.
The former is always present in the DOM while the latter is inserted dynamically.

##### Role status

Unfortunately, we found that the support for the `role="status"` was very inconsistent and insufficient (Nothing is announced with JAWS + Firefox).

It is also interesting to note that with some combinations of screen reader + browser (NVDA + Firefox and Talkback + Chrome), it was announced as an `aria-atomic="false"`, meaning only new content inserted in the area was announced.

##### Role log

There is a big issue with the `role="log"` when using VoiceOver (MacOS) + Safari.
The screen reader only announces the differences between content that is already present in the live region and content that has been inserted. For instance:

* the live region contains a toast "Hello World number 1",
* we insert an additional message "Hello Word number 2",
* It announces "2".

The excepted behavior would have been to announce "Hello World number 2".

We faced the same issue when using `aria-live="polite"` with `aria-atomic="false"`.

#### Decision

Considering all this, we decided to use the most robust method to simulate a `role="status"` live region by using both `aria-live="polite` and `aria-atomic="true"`.

We may reconsider this when we add a way for users to review the last toast messages, to make it less verbose but this will mostly depend on the support of the `role="log"` live regions by then, especially with VoiceOver and Safari (MacOS).

## Going further

What did we learn?

As we mentioned before, we had to make some compromises on the accessibility.
We understood that we could not do anything magical that would make the toast pattern fully accessible.
We are now convinced that the toast pattern has its limitation and should not be used everytime.
For example, it isn't suited for the following cases:

* when there is an important action to be added along.
* when the message is very important.
* when the message is too long.

### Actions inside a toast

We decided to avoid any actions inside the toast as it causes with too much accessibility issues.
For instance, some people may not have the time to reach it while some other may not see it at all.
We consider that important actions should be placed in a more accessible place.

### Persistent notifications

We already thought about the next step that would make our notification mechanism more accessible.
We thought about a component that will help user to review all the notifications that have taken place.

## References

### Resources

* [Scott Ohara’s article "A toast to a11y toasts"](https://www.scottohara.me/blog/2019/07/08/a-toast-to-a11y-toasts.html),
* [Defining ‘Toast’ Messages](https://adrianroselli.com/2020/01/defining-toast-messages.html)
* [Are Notifications A Dark Pattern?](https://blog.prototypr.io/are-notifications-a-dark-pattern-2c1a177b26e0)
* [Designing Toast Messages for Accessibility](https://sheribyrnehaber.medium.com/designing-toast-messages-for-accessibility-fb610ac364be)
* [Using role=status to present status messages - WCAG Techniques](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22)

### Live region support details

#### Screen reader versions
| Screen reader       | Version              |
|---------------------|----------------------|
| NVDA                | 2022.1               |
| JAWS                | 2022                 |
| Voice Over (Mac OS) | Big Sur and Monterey |
| Voice Over (iOS)    | 15.5                 |
| Talkback            | 12.2                 |

#### Browser versions
| Browser                    | Version |
|----------------------------|---------|
| Firefox                    | 102.0   |
| Chrome (Windows + Android) | 103     |
| Safari (Mac OS + iOS)      | 15.5    |

#### Result details
|                   | role="alert" on cc-toast | role="alert" on cc-toaster | role="log" on cc-toast    | role="log" on cc-toaster  | aria-live="polite" + aria-atomic="false" | role="status"                    | aria-live="polite" + aria-atomic="true" |
|-------------------|--------------------------|----------------------------|---------------------------|---------------------------|------------------------------------------|----------------------------------|-----------------------------------------|
| NVDA + Firefox    | ❌ Not supported          | ✅ Fully supported          | ❌ Not supported           | ✅ Fully supported         | ✅ Fully supported                        | Partially supported (not atomic) | ✅ Fully supported                       |
| NVDA + Chrome     | ✅ Fully supported        | ✅ Fully supported          | ❌ Not supported           | ✅ Fully supported         | ✅ Fully supported                        | ✅ Fully supported                | ✅ Fully supported                       |
| JAWS + Chrome     | ✅ Fully supported        | ✅ Fully supported          | ❌ Not supported           | ✅ Fully supported         | ✅ Fully supported                        | ✅ Fully supported                | ✅ Fully supported                       |
| JAWS + EDGE       | ✅ Fully supported        | ✅ Fully supported          | ❌ Not supported           | ✅ Fully supported         | ✅ Fully supported                        | ✅ Fully supported                | ✅ Fully supported                       |
| JAWS + Firefox    | ❌ Not supported          | ✅ Fully supported          | ⚠ Partially supported (1) | ✅ Fully supported         | ✅ Fully supported                        | ❌ Not supported                  | ✅ Fully supported                       |
| VO + Safari (Mac) | ✅ Fully supported        | ✅ Fully supported          | ✅ Fully supported         | ⚠ Partially supported (2) | ⚠ Partially supported (2)                | ✅ Fully supported                | ✅ Fully supported                       |
| VO + Safari (iOS) | ✅ Fully supported        | ✅ Fully supported          | ✅ Fully supported         | ✅ Fully supported         | ✅ Fully supported                        | ✅ Fully supported                | ✅ Fully supported                       |
| Talkback + Chrome | ✅ Fully supported        | ✅ Fully supported          | ✅ Fully supported         | ✅ Fully supported         | ✅ Fully supported                        | ⚠ Partially supported (3)        | ✅ Fully supported                       |

**Note** :
* ✅ Fully supported means the aria-live and aria-atomic settings are respected. However, most of the time, **role semantics are not announced**. We consider this a very minor issue in our case because we already convey this semantic through an icon with an alternative text.
* ⚠ Partially supported means that we found issues that makes this solution not robust enough for our use case. Usually, something is announced, but it does not respect the aria-atomic setting.
* ❌ Not supported means nothing is announced.

(1) sometimes not announced at all

(2) wrong announcement

(3) atomicity is not applied
