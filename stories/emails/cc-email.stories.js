import '../../src/emails/cc-email.js';
import '../../src/emails/cc-email.smart.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const SAMPLE_EMAIL_ADDRESS = 'sample.email@clever-cloud.com';
const ANOTHER_SAMPLE_EMAIL_ADDRESS = 'another.sample.email@clever-cloud.com';
const YET_ANOTHER_SAMPLE_EMAIL_ADDRESS = 'yet.another.sample.email@clever-cloud.com';
const HUGE_EMAIL_ADDRESS = `hugeemaila${'d'.repeat(500)}ress@clever-cloud.com`;

const primary = { address: { value: SAMPLE_EMAIL_ADDRESS, verified: true } };
const primaryUnverified = { address: { value: SAMPLE_EMAIL_ADDRESS, verified: false } };
const secondary = {
  addresses: [
    {
      address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
    },
    {
      address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
    },
  ],
};
const secondaryEmpty = {
  addresses: [],
};

export default {
  title: '🛠 Emails/<cc-email>',
  component: 'cc-email',
};

const conf = {
  component: 'cc-email',
  // language=CSS
  css: `cc-email {
    margin-bottom: 1rem;
  }`,
};
export const defaultStory = makeStory(conf, {
  items: [
    {
      state: 'loaded',
      data: {
        primary,
        secondary,
      },
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {},
  ],
});

export const errorWithLoading = makeStory(conf, {
  items: [
    {
      state: 'error-loading',
    },
  ],
});

export const errorWithEmptyEmail = makeStory(conf, {
  items: [
    {
      state: 'loaded',
      data: {
        primary,
        secondary,
      },
      _addAddressInputValue: '',
      _addAddressInputError: 'empty',
    },
  ],
});

export const errorWithInvalidEmail = makeStory(conf, {
  items: [
    {
      state: 'loaded',
      data: {
        primary,
        secondary,
      },
      _addAddressInputValue: 'invalid e-mail !!',
      _addAddressInputError: 'invalid',
    },
  ],
});

export const dataLoadedWithUnverifiedPrimaryEmailAddress = makeStory(conf, {
  items: [
    {
      state: 'loaded',
      data: {
        primary: primaryUnverified,
        secondary: {
          addresses: [],
        },
      },
    },
  ],
});

export const dataLoadedWithHugeEmail = makeStory(conf, {
  items: [
    {
      state: 'loaded',
      data: {
        primary: { address: { value: HUGE_EMAIL_ADDRESS, verified: true } },
        secondary: {
          addresses: [
            {
              address: { value: HUGE_EMAIL_ADDRESS, verified: true },
            },
            {
              address: { value: HUGE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      },
    },
  ],
});

export const dataLoadedWithNoSecondaryEmails = makeStory(conf, {
  items: [
    {
      state: 'loaded',
      data: {
        primary: { address: { value: HUGE_EMAIL_ADDRESS, verified: true } },
        secondary: {
          addresses: [],
        },
      },
    },
  ],
});

export const sendingConfirmationEmail = makeStory(conf, {
  items: [
    {
      state: 'loaded',
      data: {
        primary: { ...primaryUnverified, state: 'sending-confirmation-email' },
        secondary,
      },
    },
  ],
});

export const addingSecondary = makeStory(conf, {
  items: [
    {
      state: 'loaded',
      data: {
        primary,
        secondary: { ...secondary, state: 'adding' },
      },
    },
  ],
});

export const deletingSecondary = makeStory(conf, {
  items: [
    {
      state: 'loaded',
      data: {
        primary,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              state: 'deleting',
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      },
    },
    {
      state: 'loaded',
      data: {
        primary,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              state: 'deleting',
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              state: 'deleting',
            },
          ],
        },
      },
    },
  ],
});

export const markingSecondaryAsPrimary = makeStory(conf, {
  items: [
    {
      state: 'loaded',
      data: {
        primary,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              state: 'marking-as-primary',
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      },
    },
  ],
});

export const simulationsWithPrimary = makeStory(conf, {
  items: [
    {},
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.state = 'loaded';
      component.data = {
        primary: primaryUnverified,
        secondary: secondaryEmpty,
      };
    }),
    storyWait(2000, ([component]) => {
      component.data = {
        ...component,
        primary: { ...primaryUnverified, state: 'sending-confirmation-email' },
      };
    }),
    storyWait(2000, ([component]) => {
      component.data = {
        ...component,
        primary,
      };
    }),
  ],
});

export const simulationsWithSecondary = makeStory(conf, {
  items: [
    {},
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.state = 'loaded';
      component.data = {
        primary: primary,
        secondary: secondaryEmpty,
      };
    }),
    storyWait(2000, ([component]) => {
      component._addAddressInputValue = 'invalid email';
    }),
    storyWait(2000, ([component]) => {
      component.data = {
        ...component,
        secondary: { ...secondaryEmpty, state: 'adding' },
      };
    }),
    storyWait(2000, ([component]) => {
      component._addAddressInputError = 'invalid';
      component.data = {
        ...component,
        secondary: { ...secondaryEmpty },
      };
    }),
    storyWait(2000, ([component]) => {
      component.reset();
      component._addAddressInputValue = ANOTHER_SAMPLE_EMAIL_ADDRESS;
      component.data = {
        ...component,
        secondary: { ...secondaryEmpty, state: 'adding' },
      };
    }),
    storyWait(2000, ([component]) => {
      component.reset();
      component.data = {
        ...component,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: false },
            },
          ],
        },
      };
    }),
    storyWait(2000, ([component]) => {
      component.reset();
      component._addAddressInputValue = YET_ANOTHER_SAMPLE_EMAIL_ADDRESS;
      component.data = {
        ...component,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: false },
            },
          ],
        },
      };
    }),
    storyWait(2000, ([component]) => {
      component.reset();
      component._addAddressInputValue = YET_ANOTHER_SAMPLE_EMAIL_ADDRESS;
      component.data = {
        ...component,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: false },
            },
          ],
          state: 'adding',
        },
      };
    }),
    storyWait(2000, ([component]) => {
      component.reset();

      component.data = {
        ...component,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: false },
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: false },
            },
          ],
        },
      };
    }),
    storyWait(2000, ([component]) => {
      component.data = {
        ...component,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      };
    }),
    storyWait(2000, ([component]) => {
      component.data = {
        ...component,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              state: 'marking-as-primary',
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      };
    }),
    storyWait(2000, ([component]) => {
      component.primary = { address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true } };
      component.data = {
        ...component,
        secondary: {
          addresses: [
            {
              address: { value: SAMPLE_EMAIL_ADDRESS, verified: true },
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      };
    }),
    storyWait(2000, ([component]) => {
      component.data = {
        ...component,
        secondary: {
          addresses: [
            {
              address: { value: SAMPLE_EMAIL_ADDRESS, verified: true },
              state: 'deleting',
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      };
    }),
    storyWait(2000, ([component]) => {
      component.data = {
        ...component,
        secondary: {
          addresses: [
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  errorWithLoading,
  errorWithEmptyEmail,
  errorWithInvalidEmail,
  sendingConfirmationEmail,
  addingSecondary,
  deletingSecondary,
  markingSecondaryAsPrimary,
  dataLoadedWithUnverifiedPrimaryEmailAddress,
  dataLoadedWithHugeEmail,
  dataLoadedWithNoSecondaryEmails,
  simulationsWithPrimary,
  simulationsWithSecondary,
});
