import { getFlagUrl } from '../../lib/remote-assets.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-zone-card.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-zone-card>',
  component: 'cc-zone-card',
};

const cleverIcon = new URL('../../stories/assets/clevercloud.svg', import.meta.url);

const conf = {
  component: 'cc-zone-card',
};

/**
 * @typedef {import('./cc-zone-card.js').CcZoneCard} CcZoneCard
 */

/** @type {Partial<CcZoneCard>} */
const DEFAULT_ITEM = {
  code: 'par',
  name: 'Paris',
  selected: false,
  images: [{ url: cleverIcon, alt: 'infra: Clever Cloud' }],
  flagUrl: getFlagUrl('FR'),
  countryCode: 'FR',
  country: 'France',
};

/** @type {Partial<CcZoneCard>} */
const LONG_CODE = {
  code: 'very-very-very-very-very-very-very-long-code',
  name: 'Zone',
  selected: false,
  images: [{ url: cleverIcon, alt: 'infra: Clever Cloud' }],
  flagUrl: getFlagUrl('FR'),
  countryCode: 'FR',
  country: 'France',
};

/** @type {Partial<CcZoneCard>} */
const LONG_NAME = {
  code: 'code',
  name: 'very-very-very-very-very-very-very-long-name',
  selected: false,
  images: [{ url: cleverIcon, alt: 'infra: Clever Cloud' }],
  flagUrl: getFlagUrl('FR'),
  countryCode: 'FR',
  country: 'France',
};

/** @type {Partial<CcZoneCard>} */
const LONG_CODE_AND_NAME = {
  code: 'very-very-very-very-very-very-very-long-code',
  name: 'very-very-very-very-very-very-very-long-name',
  selected: false,
  images: [{ url: cleverIcon, alt: 'infra: Clever Cloud' }],
  flagUrl: getFlagUrl('FR'),
  countryCode: 'FR',
  country: 'France',
};

export const defaultStory = makeStory(conf, {
  items: [DEFAULT_ITEM],
});

export const disabled = makeStory(conf, {
  items: [{ ...DEFAULT_ITEM, disabled: true }],
});

export const selected = makeStory(conf, {
  items: [{ ...DEFAULT_ITEM, selected: true }],
});

export const longCode = makeStory(conf, {
  items: [
    { ...LONG_CODE, style: 'width: 10em' },
    { ...LONG_CODE, style: 'width: 20em' },
    { ...LONG_CODE, style: 'width: 30em' },
    LONG_CODE,
  ],
});

export const longName = makeStory(conf, {
  items: [
    { ...LONG_NAME, style: 'width: 10em' },
    { ...LONG_NAME, style: 'width: 20em' },
    { ...LONG_NAME, style: 'width: 30em' },
    LONG_NAME,
  ],
});

export const longCodeAndLongName = makeStory(conf, {
  items: [
    { ...LONG_CODE_AND_NAME, style: 'width: 10em' },
    { ...LONG_CODE_AND_NAME, style: 'width: 20em' },
    { ...LONG_CODE_AND_NAME, style: 'width: 30em' },
    LONG_CODE_AND_NAME,
  ],
});
