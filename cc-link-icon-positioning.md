# cc-link: Support for icons before and after link text

## Problem

Currently, `cc-link` only supports displaying an icon **before** the link text via the `icon` property. There's no built-in way to add a custom icon **after** the link text.

While the component automatically adds icons after the text for special cases (external links and downloads), users cannot add their own custom trailing icons. This forces developers to place the icon outside the component in a wrapper and manually handle styling to match link colors.

### Slotting an icon causes underline gap

Slotting an icon inside the link creates an underlined gap between the text and icon:

```html
<cc-link href="${url}">
  Go to dashboard
  <cc-icon .icon="${iconArrowRight}"></cc-icon>
</cc-link>
```

<!-- Paste screenshot here -->

### Current workaround

Place icon outside the link with manual styling:

```js
html`
  <div class="dashboard-link">
    <cc-link href="${url}">Go to dashboard</cc-link>
    <cc-icon class="dashboard-link__icon" .icon="${iconArrowRight}"></cc-icon>
  </div>
`

.dashboard-link__icon {
  --cc-icon-color: var(--cc-color-text-primary-highlight);
}
```

## Proposed Solution

Add two new properties to `cc-link`:

### Option A: Separate properties for before/after

```js
/** @type {IconModel|null} Icon displayed before the link text */
iconBefore: { type: Object, attribute: 'icon-before' }

/** @type {string|null} Accessibility name for the before icon */
iconBeforeA11yName: { type: String, attribute: 'icon-before-a11y-name' }

/** @type {IconModel|null} Icon displayed after the link text */
iconAfter: { type: Object, attribute: 'icon-after' }

/** @type {string|null} Accessibility name for the after icon */
iconAfterA11yName: { type: String, attribute: 'icon-after-a11y-name' }
```

Usage:
```html
<cc-link href="${url}" .iconAfter="${iconArrowRight}">
  Go to dashboard
</cc-link>

<!-- With both icons -->
<cc-link 
  href="${url}" 
  .iconBefore="${iconInfo}" 
  .iconAfter="${iconArrowRight}"
>
  Documentation
</cc-link>
```

### Option B: Single object-based API (more flexible but less HTML-like)

```js
/** 
 * @typedef {Object} LinkIcon
 * @property {IconModel} icon - The icon to display
 * @property {string} [a11yName] - Accessibility name for the icon
 */

/** @type {LinkIcon|null} Icon displayed before the link text */
iconBefore: { type: Object, attribute: false }

/** @type {LinkIcon|null} Icon displayed after the link text */
iconAfter: { type: Object, attribute: false }
```

Usage:
```js
html`
  <cc-link 
    href="${url}" 
    .iconAfter=${{ icon: iconArrowRight }}
  >
    Go to dashboard
  </cc-link>
`
```

## Considerations

### Accessibility
Both before and after icons need optional accessibility names:
- Some icons are purely decorative (no a11y name needed)
- Some icons convey additional meaning and need labels

### Option A: Separate properties (HTML-like)
- ✅ Consistent with existing `icon` + `iconA11yName` pattern
- ✅ Easier for HTML-oriented developers
- ❌ More verbose (4 new properties)

### Option B: Object-based API (JavaScript-centric)
- ✅ More compact (2 properties)
- ✅ Groups related data together
- ❌ Requires JavaScript object syntax, cannot use HTML attributes
- ❌ Less familiar pattern for web components

### Backward Compatibility
The existing `icon` and `iconA11yName` properties could:
1. Be deprecated and mapped internally to `iconBefore`/`iconBeforeA11yName`
2. Remain as-is if we choose not to deprecate

## Impact Analysis

**~22 usages across 19 components** currently use the `.icon=` property, including:
- `cc-grafana-info`, `cc-domain-management`, `cc-jenkins-info` (multiple usages each)
- `cc-token-oauth-list`, `cc-orga-member-list`, `cc-addon-credentials-beta`, `cc-invoice-list`, `cc-matomo-info`, `cc-addon-info`, `cc-ssh-key-list`, `cc-heptapod-info`, `cc-elasticsearch-info`, `cc-network-group-member-list`, `cc-env-var-form`, and others

If `icon` is deprecated, these components would need gradual migration.

## Open Questions

1. Option A or Option B for the API design?
2. Should we deprecate the existing `icon` property or keep it alongside the new properties?
3. Should automatic icons (external link, download) come before or after custom `iconAfter`?
4. How should `image` property interact with `iconBefore`? (Currently `image` and `icon` are mutually exclusive)
