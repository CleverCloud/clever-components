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
    [slot='footer'] p {
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

const DEFAULT_SLOTTED_CONTENT = `<div slot="footer">
  <p>This content is slotted. You should keep it short because it's a header component.</p>
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
      innerHTML: DEFAULT_SLOTTED_CONTENT,
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
      innerHTML: DEFAULT_SLOTTED_CONTENT,
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
      innerHTML: DEFAULT_SLOTTED_CONTENT,
    },
  ],
});

export const dataLoadedWithSlottedContentCustomStyling = makeStory(conf, {
  css: `
    [slot="footer"] {
      background-color: var(--cc-color-bg-primary);
      color: white;
      padding: 2em;
      margin: 0;
      border-top: solid 2px #000;
    }
  `,
  items: [
    {
      /** @type {HeaderOrgaStateLoaded} */
      state: DEFAULT_ORGA_STATE,
      innerHTML: `
      <div slot="footer">
        <p>The slotted content container has a default styling: <code>background-color</code>, <code>padding</code> and <code>border-top</code>.</p>
        <p>You may change any of these by styling the tag on which you have added the <code>slot="footer"</code> attribute.</p>
        <p><strong>Caution:</strong> the default styling was designed to remain consistent with the header body and avoid drawing too much attention to it. You should stick to the default styling as much as possible and stay as close as possible to it. This example is only here to demo that anything can be customized.
      </div>
    `,
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, { innerHTML: DEFAULT_SLOTTED_CONTENT }, {}],
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
