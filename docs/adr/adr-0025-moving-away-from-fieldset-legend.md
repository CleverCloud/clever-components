---
kind: '📌 Architecture Decision Records'
---
# ADR 0025: Moving away from `fieldset` and `legend`

🗓️ 2023-12-04 · ✍️ Florian Sanders

## The context

Our [`cc-toggle` component](https://www.clever-cloud.com/doc/clever-components/?path=/docs/🧬-atoms-cc-toggle--docs) is a group of radio buttons or checkboxes.

The group is wrapped inside a `<fieldset>` element and the subject of the group is provided through a `<legend>` element.

Example:

```html
<fieldset>
  <legend>Our legend</legend>
  <!-- inputs and labels -->
</fieldset>
```

This is standard HTML that allows the group to be identified and announced with the appropriate context by assistive technologies.

## The issue

Sometimes, we need the legend of the group to be displayed "inline", next to the group.

This is where the issue comes up: when you need to move the legend from its original position.

Usually, to place the legend next to the group, we would use `display: flex` and voilà!

But the `<legend>` element is special and the solution above does not work.

The only solution we found was to use `float: left` on the `<legend>` element.
We found this solution in the following article [Today I learned: How to style a &lt;fieldset&gt;'s &lt;legend&gt; element as display inline](https://morgan.cugerone.com/blog/how-to-make-a-fieldset-legend-inline/) from Morgan Cugerone.

This solution works cross-browser but it does not appear to be officially documented.

Unfortunately, we faced a situation where a small space was added on top of the `<fieldset>` when our component was used in a grid context.

We could solve this by tweaking the display property on our `host` or on the `<fieldset>` itself but:

- The `display` property of the `<legend>` element is partially out of our control (see [Styling with CSS - Fieldset - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset#styling_with_css)).
- We did not fully understand the issue and the solutions that worked even if we found some that did work.
- We can't be sure the `float` solution we rely on will continue to work forever in all browsers.

This is why, we have decided to move away from `<fieldset>` + `<legend>` and use a more robust solution within the `cc-toggle` component.

## The solution

We decided to rely on `ARIA` for semantics and use `<div>` elements.

This allows us to style the group in a simpler and more importantly a more robust way.

The code with `ARIA` attributes is as follows:

```html
<div role="group" aria-labelledby="legend">
  <p id="legend">Our legend</p>
  <!-- inputs and labels -->
</div>
```

This solution is well documented (see [Grouping Controls - Approach 2: Associating related controls with WAI-ARIA](https://www.w3.org/WAI/tutorials/forms/grouping/#associating-related-controls-with-wai-aria)) and it has been tested with the following combinations:

<details>
  <summary>Screen reader test results</summary>
  <table>
    <caption>Screen reader & browser combinations</caption>
    <thead>
      <tr>
        <th>Screen reader</th>
        <th>Browser</th>
        <th>Group semantics announced upon focusing the input</th>
        <th>Legend of the group announced upon focusing the input</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>NVDA (version 2023.3)</th>
        <td>Firefox (version 120)</td>
        <td>✅ Fully supported</td>
        <td>✅ Fully supported</td>
      </tr>
      <tr>
        <th>NVDA (version 2023.3)</th>
        <td>Chrome (version 119)</td>
        <td>✅ Fully supported</td>
        <td>✅ Fully supported</td>
      </tr>
      <tr>
        <th>JAWS (version 2022)</th>
        <td>Firefox (version 120)</td>
        <td>
          ❌ Not supported
          <p><strong>Note:</strong> the result is the same with <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>.</p>
        </td>
        <td>
          ❌ Not supported
          <p><strong>Note:</strong> the result is the same with <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>.</p>
        </td>
      </tr>
      <tr>
        <th>JAWS (version 2022)</th>
        <td>Chrome (version 119)</td>
        <td>✅ Fully supported</td>
        <td>✅ Fully supported</td>
      </tr>
      <tr>
        <th>VoiceOver (version MacOS Ventura 13.1)</th>
        <td>Safari (version 16.2)</td>
        <td>✅ Fully supported</td>
        <td>✅ Fully supported</td>
      </tr>
      <tr>
        <th>Talkback (version 14.0)</th>
        <td>Chrome (version 119)</td>
        <td>✅ Fully supported</td>
        <td>
          ❌ Not supported
          <p><strong>Note:</strong> the result is the same <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>.</p>
        </td>
      </tr>
      <tr>
        <th>VoiceOver - iOS (version 16.2)</th>
        <td>Safari (version 16.2)</td>
        <td>
          ❌ Not supported
          <p><strong>Note:</strong> the result is the same <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>.</p>
        </td>
        <td>
          ❌ Not supported
          <p><strong>Note:</strong> when using <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code> instead, the legend is announced if the user is browsing with the rotor set to `form elements`.</p>
        </td>
      </tr>
    </tbody>
  </table>

  Even though our tests revealed some issues, the results are the same as with `fieldset` and `legend` so we consider the support for this technique is good enough.

</details>

**Note:** We will continue using `<fieldset>` and `<legend>` for cases outside the `<cc-toggle>` component since our issues are only related to the inline `<legend>`.

## Resources

- [Today I learned: How to style a &lt;fieldset&gt;'s &lt;legend&gt; element as display inline](https://morgan.cugerone.com/blog/how-to-make-a-fieldset-legend-inline/) - Morgan Cugerone,
- [Grouping Controls - Web Accessibility Initiative](https://www.w3.org/WAI/tutorials/forms/grouping/),
- [Techniques H71 - Providing a description for groups of form controls using fieldset and legend elements - Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG20-TECHS/H71.html), this is the technique we used to rely on,
- [Techniques ARIA17 - Using grouping roles to identify related form controls - Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA17.html), this is the technique we now rely on.
