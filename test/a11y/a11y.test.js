import { fixture, expect } from '@open-wc/testing';
import { modes } from '../../src/components/cc-button/cc-button.stories.js';

it('passes accessibility test', async () => {
  const el = await fixture(modes({}, {
    globals: {
      locale: {
        name: 'Language',
        description: 'i18n language',
        defaultValue: 'en',
        toolbar: {
          icon: 'globe',
          items: 'en',
        },
      },
    },
  }));
  await expect(el).to.be.accessible();
});
