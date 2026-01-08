---
name: migrate-clever-components-tests-to-vitest
description: Migrate Clever Components Tests to Vitest (project)
---

# Migrate Clever Components Tests to Vitest

This skill describes how to migrate test files from the old @open-wc/testing framework to Vitest with browser mode.

## When to Use

Use this skill when migrating test files in the `test/` directory to work with the new Vitest setup.

## Key Files

- **Test helpers**: `test/helpers/element-helper.js` - provides `fixture`, `elementUpdated`, `defineCE`, `nextFrame`, `triggerFocusFor`, `typeText`, `replaceText`, `clearText`
- **Reference migrated test**: `test/ansi/ansi-palettes.test.js` - example of a properly migrated test

## Migration Steps

### 1. Update Imports

Replace old testing imports with Vitest and helper imports:

```javascript
// OLD
import { expect } from '@open-wc/testing';
import { fixture, html } from '@open-wc/testing-helpers';

// NEW
import { html } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { describe, expect, it, vi } from 'vitest';
import { defineCE, elementUpdated, fixture } from '../helpers/element-helper.js';
```

### 2. Handle Dynamic Tag Names

When creating fixtures with dynamic custom element tag names, use `staticHtml` with `unsafeStatic`:

```javascript
// OLD
const element = await fixture(`<${customElement}></${customElement}>`);

// NEW
const element = await fixture(staticHtml`<${unsafeStatic(customElement)}></${unsafeStatic(customElement)}>`);
await elementUpdated(element);
```

### 3. Keep Component Render Using Regular `html`

The component's `render()` method must use regular `html` from `'lit'`, NOT `staticHtml`:

```javascript
// Component render - use regular html
render() {
  return html`<div>${this.value}</div>`;
}
```

### 4. CRITICAL: Avoid `fixture()` for Secondary Elements

**The `fixture()` function clears the fixture container before creating new elements.** This means if you:
1. Create element A with `fixture()`
2. Create element B with `fixture()`

Element A gets removed from the DOM!

**Solution for Node elements (like error messages):** Create them directly with DOM methods:

```javascript
// BAD - will clear the fixture container and remove formControl from DOM
formControl.element.errorMessage = await fixture(staticHtml`${unsafeHTML('<div>error</div>')}`);

// GOOD - create Node directly without affecting fixture container
const tempDiv = document.createElement('div');
tempDiv.innerHTML = '<div>error message</div>';
formControl.element.errorMessage = tempDiv.firstElementChild;
```

### 5. Update Test Utilities

| Old | New |
|-----|-----|
| `sinon.spy()` | `vi.fn()` |
| `sinon.stub(obj, 'method')` | `vi.spyOn(obj, 'method')` |
| `spy.calledOnce` | `spy.mock.calls.length === 1` |
| `spy.calledWith(arg)` | `expect(spy).toHaveBeenCalledWith(arg)` |
| `stub.returns(value)` | `vi.spyOn(...).mockReturnValue(value)` |

### 6. Wait for Element Updates

Always await `elementUpdated()` after creating fixtures or changing properties:

```javascript
const element = await fixture(staticHtml`<my-element></my-element>`);
await elementUpdated(element);

element.value = 'new value';
await elementUpdated(element);
```

## Common Patterns

### Creating a Test Custom Element

```javascript
function getCustomElement(settings = {}) {
  return defineCE(
    class extends SomeBaseClass {
      // ... class definition
      render() {
        return html`...`; // Use regular html here
      }
    },
  );
}
```

### Test with Form Elements

```javascript
const customElement = getCustomElement();
const formElement = await fixture(
  staticHtml`<form><${unsafeStatic(customElement)} name="input"></${unsafeStatic(customElement)}></form>`,
);
await elementUpdated(formElement);
```

### Creating Node Elements for Properties

```javascript
// When you need to pass a DOM Node as a property value
const tempDiv = document.createElement('div');
tempDiv.innerHTML = '<div>Content with <b>HTML</b></div>';
const nodeElement = tempDiv.firstElementChild;
element.someProperty = nodeElement;
await elementUpdated(element);
```

## Running Tests

Tests must be run manually by the user in their nix environment. After making changes, ask the user to run the tests and paste the output.

Example prompt: "Please run the tests for this file and paste the output so I can check if the migration is successful."

## Checklist

- [ ] Update imports (vitest, lit, helpers)
- [ ] Replace string templates with `staticHtml` + `unsafeStatic` for dynamic tags
- [ ] Keep component `render()` using regular `html` from 'lit'
- [ ] Replace `fixture()` with direct DOM creation for secondary Node elements
- [ ] Update spy/stub syntax from sinon to vitest
- [ ] Add `await elementUpdated()` after fixture creation and property changes
- [ ] Run tests to verify migration
