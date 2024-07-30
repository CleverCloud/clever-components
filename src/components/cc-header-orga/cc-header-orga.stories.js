import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-header-orga.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Overview/<cc-header-orga>',
  component: 'cc-header-orga',
};

const conf = {
  component: 'cc-header-orga',
  // language=CSS
  css: `
   p {
      margin: 0;
    }
  `,
};

/**
 * @typedef {import('./cc-header-orga.js').CcHeaderOrga} CcHeaderOrga
 * @typedef {import('./cc-header-orga.types.js').HeaderOrgaStateLoaded} HeaderOrgaStateLoaded
 * @typedef {import('./cc-header-orga.types.js').HeaderOrgaStateLoading} HeaderOrgaStateLoading
 * @typedef {import('./cc-header-orga.types.js').HeaderOrgaStateError} HeaderOrgaStateError
 */

/** @type {HeaderOrgaStateLoaded} */
const DEFAULT_ORGA_STATE = {
  type: 'loaded',
  name: 'ACME corporation world',
  avatar: 'http://placekitten.com/350/350',
  cleverEnterprise: true,
  emergencyNumber: '+33 6 00 00 00 00',
};

const DEFAULT_SLOTTED_CONTENT_FOOTER_LEFT = `<div slot="footer-left">
  <p>This content is slotted on the left footer side.</p>
</div>`;

const DEFAULT_SLOTTED_CONTENT_FOOTER_RIGHT = `<div slot="footer-right">
  <p>This content is slotted on the right footer side.</p>
</div>`;

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateLoaded} */
      state: DEFAULT_ORGA_STATE,
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateLoading} */
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateError} */
      state: { type: 'error' },
    },
  ],
});

export const dataLoadedWithClassicClient = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateLoaded} */
      state: {
        ...DEFAULT_ORGA_STATE,
        name: 'ACME Startup',
        cleverEnterprise: false,
        emergencyNumber: null,
      },
    },
  ],
});

export const dataLoadedWithClassicClientAndSlottedContent = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateLoaded} */
      state: {
        ...DEFAULT_ORGA_STATE,
        name: 'ACME Startup',
        cleverEnterprise: false,
        emergencyNumber: null,
      },
      innerHTML: DEFAULT_SLOTTED_CONTENT_FOOTER_LEFT,
    },
  ],
});

export const dataLoadedWithClassicClientNoAvatar = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateLoaded} */
      state: {
        ...DEFAULT_ORGA_STATE,
        name: 'ACME Startup',
        avatar: null,
        cleverEnterprise: false,
        emergencyNumber: null,
      },
    },
  ],
});

export const dataLoadedWithEnterpriseClient = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateLoaded} */
      state: {
        ...DEFAULT_ORGA_STATE,
        emergencyNumber: null,
      },
    },
  ],
});

export const dataLoadedWithEnterpriseClientAndSlottedContent = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateLoaded} */
      state: {
        ...DEFAULT_ORGA_STATE,
        emergencyNumber: null,
      },
      innerHTML: DEFAULT_SLOTTED_CONTENT_FOOTER_LEFT,
    },
  ],
});

export const dataLoadedWithEnterpriseClientEmergencyNumber = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateLoaded} */
      state: DEFAULT_ORGA_STATE,
    },
  ],
});

export const dataLoadedWithEnterpriseClientEmergencyNumberAndSlottedContent = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateLoaded} */
      state: DEFAULT_ORGA_STATE,
      innerHTML: DEFAULT_SLOTTED_CONTENT_FOOTER_LEFT,
    },
  ],
});

export const dataLoadedWithSlottedContentFooterLeft = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateLoaded} */
      state: DEFAULT_ORGA_STATE,
      innerHTML: DEFAULT_SLOTTED_CONTENT_FOOTER_LEFT,
    },
  ],
});

export const dataLoadedWithSlottedContentFooterRight = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateLoaded} */
      state: DEFAULT_ORGA_STATE,
      innerHTML: DEFAULT_SLOTTED_CONTENT_FOOTER_RIGHT,
    },
  ],
});

export const dataLoadedWithSlottedContentFooterLeftAndRight = makeStory(conf, {
  items: [
    {
      /** @type {HeaderOrgaStateLoaded} */
      state: DEFAULT_ORGA_STATE,
      innerHTML: [DEFAULT_SLOTTED_CONTENT_FOOTER_LEFT, DEFAULT_SLOTTED_CONTENT_FOOTER_RIGHT],
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, { innerHTML: DEFAULT_SLOTTED_CONTENT_FOOTER_LEFT }, {}],
  simulations: [
    storyWait(
      3000,
      /** @param {CcHeaderOrga[]} components */
      ([component, componentNoAvatar, componentWithSlottedContent, componentError]) => {
        component.state = DEFAULT_ORGA_STATE;
        componentWithSlottedContent.state = {
          ...DEFAULT_ORGA_STATE,
          emergencyNumber: null,
        };
        componentNoAvatar.state = {
          ...DEFAULT_ORGA_STATE,
          avatar: null,
        };
        componentError.state = { type: 'error' };
      },
    ),
  ],
});
