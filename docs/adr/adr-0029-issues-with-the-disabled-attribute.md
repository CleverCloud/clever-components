---
kind: '📌 Architecture Decision Records'
---
# ADR 0029: Limited Usage of the `disabled` Attribute

🗓️ 2025-02-10 · ✍️ Florian Sanders

## Context

We have faced several challenges with the `disabled` attribute in our web components.

We used to rely on the `disabled` attribute in two cases:

- to disable the `cc-button` "Update changes" in `cc-env-var-form` until there are some pending changes,
- in most components, to disable `cc-button` and `cc-input-*` components during API calls (posting a form, deleting an item, etc.).

One thing to remember is that when set to `disabled`, native elements cannot receive focus.

## Different `disabled` implementations in our codebase

For our `cc-button` component, since there are many cases where pressing `Enter` or `Space` would trigger the API call, we did not want the focus to be lost when it was set to `disabled` during API calls.

This is why within the `cc-button` component, we rely on `aria-disabled` instead of `disabled` on the native `<button>`:

```html
<cc-button disabled>
    #shadow-dom
    <button aria-disabled="true">...</button>
</cc-button>
```

Since `aria-disabled` only handles the semantics, we prevent actions from going through with this:

```js
// in `cc-button.js` we disable the click handler if the component is disabled
_onClick(e) {
    e.stopPropagation();

    // we need to check that because we use aria-disabled which doesn't prevent the onclick event to be fired.
    if (this.disabled || this.skeleton || this.waiting) {
      return;
    }
  ...
}
```

On the contrary, within the `cc-input-*` components, we rely on the native `disabled` attribute:

```js
<cc-input-text disabled>
    #shadow-dom
    <input disabled>
</cc-input-text>
```

## Focus losses during API calls

### With `cc-input-*` components

During API calls, we always set `cc-input-*` components in `disabled`.
This may lead to focus being lost in the following scenario:

1. The user focuses the `input` within `cc-input-text`,
2. The user enters the value of their choice,
3. The user presses `Enter` to submit the form,
4. The native `input` being focused is set to `disabled`,
5. The focus is lost (usually reset to the `body` but this is browser heuristics territory).

This situation happens fairly often and is perfectly logical.

### With Form Associated components

Recently, we have implemented Form-Associated Custom Elements for all our form controls (`cc-input-*`, `cc-select` & `cc-button`).

This means these elements are recognized as form controls by browsers and inherit certain perks.

This has led to new situations where focus is lost but only with the Chrome browser:

1. The user focuses a `button` inside a `cc-button` form associated component,
2. The user presses `Space` or `Enter` to submit the form,
3. The `cc-button` is set to `disabled` and the `button` being focused is set to `aria-disabled="true"`,
4. The focus is lost (usually reset to `body` but this is browser heuristics territory).

This does not make sense because the native button being focused is not set to `disabled`, only `aria-disabled`.

Unfortunately, the `host`, the `cc-button` itself is considered a form control.
As such, setting it to `disabled` means the focus is reset to `body` even though its content is focusable.

This only happens in Chrome at the moment and this only happens when you set the `disabled` attribute on the `host`.
Setting the `disabled` property instead on the `host` does not trigger the focus reset.

You may go to our [minimal reproduction on JSBin](https://jsbin.com/munohafoqa/1/edit?html,css,js,output) to see the bug in action (with a Chromium-based browser).

## Solutions we have considered

### Using only `aria-disabled` within our components

The idea is to keep the `disabled` attribute on `hosts` but rely on `aria-disabled` with `tabIndex="-1"` within the components.
In other words, same implementation as our `cc-button` but everywhere.

- Pros: Consistent behavior across components
- Cons:
  - Deviates from native element behavior,
  - Does not solve the Chrome issue since the component host would still receive a `disabled` attribute.

### Using readonly during API calls

- Pros:
  - Native-like API,
  - Already implemented in our `cc-input-*` components,
  - `readonly` elements can receive focus so no focus loss issues, even with Form Associated components in Chrome.
- Cons:
  - Not available for all elements (e.g. `<select>`).
  - `readonly` doesn't make sense for `cc-button` but it already has a `waiting` property/attribute that is supposed to be used exclusively during API calls.

### Adding a `waiting` property/attribute to all form controls

- Pros: Clear separation of concerns
- Cons:
  - `waiting` in `cc-button` triggers a different style but we don't really want that for `cc-input-*` components (too many animations would be bad for UX).

### Custom `disabled` prop with "relaxed"/"strict" values

The idea is to move away from the native `disabled` boolean attribute and require a string value like this:
- `relaxed` to preserve focus during API calls `<cc-input-text disabled="relaxed">`,
- `strict` to prevent focus like the native `disabled` attribute `<cc-input-text disabled="strict">`,

- Pros:
  - Prevents impossible states,
  - Clear API while remaining fairly close to the HTML syntax.
- Cons:
  - People may try to use the `disabled` attribute like the native one (boolean style),
  - Doesn't solve the Chrome issue since `disabled` is still used as an attribute.

### Use the `disabled` property only

- Pros:
  - Solves the Chrome issue,
- Cons:
  - Not HTML friendly which is sad for form controls,
  - Would still require some refactoring to make sure `cc-input-*` components rely on `aria-disabled` instead of `disabled` inside our Shadow DOM.

## Decision

We have decided to:

1. Avoid using `disabled` for temporary states:
   - For form controls (except `cc-button` components):
    - Use `readonly` during API calls
    - This means we also have to implement a `readonly` prop/attribute on the `cc-select` element.
   - For `cc-button` components:
    - Use a new `waiting` attribute/property instead of `disabled`,
    - Throw errors if both `disabled` and `waiting` are set to `true` at the same time.

2. Only use `disabled` when:
   - The control should be permanently disabled
   - The control should not participate in form validation
   - The control should be completely non-interactive

## Consequences

### Positive

- Better focus management
- Improved accessibility
- More predictable behavior across browsers
- Clearer separation between temporary and permanent disabled states

### Negative

- Need to maintain multiple ways to handle disabled-like states
- Slightly more complex implementation
- Requires clear documentation and guidelines for developers

## Implementation Guidelines

1. Form Controls:
```javascript
// During API calls
<cc-input-text readonly>
// For permanent disability
<cc-input-text disabled>
```

2. Buttons:
```javascript
// During API calls
<cc-button waiting>
// For permanent disability
<cc-button disabled>
```

3. Error Prevention:
```javascript
// We prevent using both states simultaneously
<cc-button waiting disabled> // Will not render and an error will be printed to console
```
