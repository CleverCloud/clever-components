---
kind: '📌 Architecture Decision Records'
---

# ADR 0002: Why we changed the way i18n works?

🗓️ 2019-10-15 · ✍️ Hubert Sablonnière

This ADR tries to explain the original design for i18n and why we changed.

## Context?

When we started the project, we wanted to decouple everything (we still do :p).
As far as i18n is concerned, we decided that all components should not know how to translate something.
To do this, we tried some kind of dependency injection.
In all our components, we imported a "virtual" module called `@i18n`:

```js
import { i18n } from '@i18n';
```

This way, any user of our components could wire an implementation of the `@i18n` module.
This was done through a custom configuration of the bundler (like webpack and its alias feature).
In the future, it would have been done in a standard way with import maps (if and when they would be standardized).

## Problems?

* Users were required to configure their bundler (if they had the "chance" to have one in their project).
  * This step can be troublesome in some contexts (hello webpack :p).
* This project provided an implementation of the `@i18n` module at `src/lib/i18n.js` and let's face it, nobody would ever wire another implementation. 
* This breaks static code analysis from third party services (like bundlephobia...).
* This was not solving the right problem, and on top of this, our implementation was always loading all languages.

## Solution?

All components now import directly the file like this:

```js
import { i18n } from '../lib/i18n.js';
```

This file does not import all languages anymore.
It's up to the user to do so:
 
```js
import * as en from '@clevercloud/components/dist/translations.en.js';
import * as fr from '@clevercloud/components/dist/translations.fr.js';
import { addTranslations, setLanguage } from '@clevercloud/components/dist/i18n.js';

// Init languages
addTranslations(en.lang, en.translations);
addTranslations(fr.lang, fr.translations);

// Default to English
setLanguage(en.lang);
```
 
It can also be done asynchronously:

```js
import { addTranslations, setLanguage } from '@clevercloud/components/dist/i18n.js';

// When french is detected as default lang
import('@clevercloud/components/dist/translations.fr.js')
  .then(({ lang, translations }) => {
    addTranslations(lang, translations);
    setLanguage(lang);
  })
```

## Future?

* This implementation still achieves the decoupling goal since we could later decide to load the translations for another source (without touching to our components).
* With this change, we allow users to only load the languages they need (smaller bundles FTW).
* We don't provide a way to only load translations for the components you use (but this could be done later with similar tools as the one we use in the check-i18n task).
