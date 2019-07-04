import { i18n } from '@i18n';
import { select } from '@storybook/addon-knobs';

// NOTE: this project could be interesting but it's not ready (no npm package and install via github fails)
// https://github.com/CodeByAlex/storybook-i18n-addon

// Save last value so current language is global
let lastValue = 'en';

export function i18nKnob () {

  const i18nValue = select('Language', i18n.availableLanguages, lastValue);

  if (lastValue !== i18nValue) {
    i18n.lang = i18nValue;
    lastValue = i18nValue;
  }
}
