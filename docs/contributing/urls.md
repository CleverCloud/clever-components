---
kind: '👋 Contributing'
title: 'Documentation and asset URLs'
---

# Documentation and asset URLs

When working on components, you'll often need to link to documentation, developer hub pages, or static assets. This guide explains how to handle these URLs correctly.

Going through these helpers is what makes the base URLs overridable by consumers of the library, see [Customizing base URLs](🏡-getting-started-customizing-base-urls--docs).

## Documentation URLs

Use `getDocUrl()` to generate URLs for documentation pages on the Clever Cloud developer hub.

### Import the helper

```js
import { getDocUrl } from '../../lib/dev-hub-url.js';
```

<cc-notice intent="info" message="The path to `dev-hub-url.js` is relative to your component's file."></cc-notice>

### Use the helper

```js
const url = getDocUrl('/billing/unified-invoices');
// => 'https://www.clever.cloud/developers/doc/billing/unified-invoices'

// Empty argument defaults to doc root
const url = getDocUrl();
// => 'https://www.clever.cloud/developers/doc'
```

**_🧐 OBSERVATIONS:_**

* Always use a leading slash: `getDocUrl('/path/to/doc')`.
* You can use the helper directly in templates, as a constant, or in translation files.
* The helper preserves query parameters and URL fragments.

### Usage in translation files

You can use `getDocUrl()` in translation files to generate documentation links:

```js
import { getDocUrl } from '../lib/dev-hub-url.js';

export const translations = {
  'my-component.doc-link': () => sanitize`
    Read more in the <cc-link href="${getDocUrl('/path/to/doc')}">documentation</cc-link>.
  `,
};
```

Inside translations, links MUST use `<cc-link>`: the `sanitize` tag function is not aware of the `<a>` tag and would strip it.
See [Translate and localize](👋-contributing-translate-and-localize--docs) for the full list of allowed tags and attributes.

## Developer hub URLs

Use `getDevHubUrl()` to generate URLs for general developer hub pages (not under `/doc/`).

### Import the helper

```js
import { getDevHubUrl } from '../../lib/dev-hub-url.js';
```

### Use the helper

```js
const url = getDevHubUrl('/api/v4');
// => 'https://www.clever.cloud/developers/api/v4'

// Supports fragments and query params
const url = getDevHubUrl('/api/howto/#oauth1');
// => 'https://www.clever.cloud/developers/api/howto/#oauth1'
```

## Asset URLs

Use `getAssetUrl()` to generate URLs for static assets that are not part of the components project.

### Import the helper

```js
import { getAssetUrl } from '../../lib/assets-url.js';
```

### Use the helper

```js
const url = getAssetUrl('/logos/java-jar.svg');
// => 'https://assets.clever-cloud.com/logos/java-jar.svg'

// Preserves query parameters and fragments
const url = getAssetUrl('/images/logo.png?v=2');
// => 'https://assets.clever-cloud.com/images/logo.png?v=2'
```

### Helper functions for common assets

The `remote-assets.js` file provides convenient wrapper functions for frequently used assets:

```js
import { getFlagUrl, getInfraProviderLogoUrl } from '../../lib/remote-assets.js';

// Country flags
const flag = getFlagUrl('fr');
// => 'https://assets.clever-cloud.com/flags/fr.svg'

// Infrastructure provider logos
const logo = getInfraProviderLogoUrl('ovh');
// => 'https://assets.clever-cloud.com/infra/ovh.svg'
```

Both helpers return `null` when they receive `null`, and `getFlagUrl()` lowercases the country code for you.

## Best practices

### Always use the helpers

**DON'T DO THIS:**

```js
// ❌ Hardcoded URLs
const url = 'https://www.clever.cloud/developers/doc/addons/postgresql';
const asset = 'https://assets.clever-cloud.com/logos/java-jar.svg';
```

**DO THIS:**

```js
// ✅ Use the helpers
const url = getDocUrl('/addons/postgresql');
const asset = getAssetUrl('/logos/java-jar.svg');
```

