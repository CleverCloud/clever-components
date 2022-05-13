import '../../src/emails/cc-email.js';
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
const model = { primary, secondary };

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
      model,
    },
    {
      model: { primary: primaryUnverified, secondary: [] },
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {},
    { model: {} },
    { model: { primary } },
    { model: { secondary } },
  ],
});

export const errorWithLoadingPrimaryEmail = makeStory(conf, {
  items: [{ model: { primary: 'loadingError', secondary } }],
});

export const errorWithLoadingSecondaryEmail = makeStory(conf, {
  items: [{ model: { primary, secondary: 'loadingError' } }],
});

export const errorWithSendingConfirmationEmail = makeStory(conf, {
  items: [
    {
      model: {
        primary: { ...primaryUnverified, error: 'sendingConfirmationEmail' },
        secondary,
      },
    },
  ],
});

export const errorWithAddingSecondaryEmailAddress = makeStory(conf, {
  items: [
    {
      model: {
        primary,
        secondary: { ...secondary, error: 'adding' },
      },
    },
  ],
});

export const errorWithDeletingSecondaryEmailAddress = makeStory(conf, {
  items: [
    {
      model: {
        primary,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              error: 'deleting',
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

export const errorWithMarkingAsPrimary = makeStory(conf, {
  items: [
    {
      model: {
        primary,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              error: 'markingAsPrimary',
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

export const errorWithEmptyEmail = makeStory(conf, {
  items: [
    {
      model: {
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
      model: {
        primary,
        secondary,
      },
      _addAddressInputValue: 'invalid e-mail !!',
      _addAddressInputError: 'invalid',
    },
  ],
});

export const dataLoadedWithHugeEmail = makeStory(conf, {
  items: [
    {
      model: {
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
      model: {
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
      model: {
        primary: { ...primaryUnverified, state: 'sendingConfirmationEmail' },
        secondary,
      },
    },
  ],
});

export const addingSecondary = makeStory(conf, {
  items: [
    {
      model: {
        primary,
        secondary: { ...secondary, state: 'adding' },
      },
    },
  ],
});

export const deletingSecondary = makeStory(conf, {
  items: [
    {
      model: {
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
      model: {
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
      model: {
        primary,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              state: 'markingAsPrimary',
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
      component.model = {
        primary: primaryUnverified,
        secondary: secondaryEmpty,
      };
    }),
    storyWait(2000, ([component]) => {
      component.model = {
        primary: { ...primaryUnverified, state: 'sendingConfirmationEmail' },
        secondary: secondaryEmpty,
      };
    }),
    storyWait(2000, ([component]) => {
      component.model = {
        primary: { ...primaryUnverified, error: 'sendingConfirmationEmail' },
        secondary: secondaryEmpty,
      };
    }),
    storyWait(2000, ([component]) => {
      component.model = {
        primary: { ...primaryUnverified, state: 'sendingConfirmationEmail' },
        secondary: secondaryEmpty,
      };
    }),
    storyWait(2000, ([component]) => {
      component.model = {
        primary,
        secondary: secondaryEmpty,
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
      component.model = {
        primary,
        secondary: secondaryEmpty,
      };
    }),
    storyWait(2000, ([component]) => {
      component._addAddressInputValue = 'invalid email';

      component.model = {
        primary,
        secondary: secondaryEmpty,
      };
    }),
    storyWait(2000, ([component]) => {
      component.model = {
        primary,
        secondary: { ...secondaryEmpty, state: 'adding' },
      };
    }),
    storyWait(2000, ([component]) => {
      component._addAddressInputError = 'invalid';

      component.model = {
        primary,
        secondary: { ...secondaryEmpty },
      };
    }),
    storyWait(2000, ([component]) => {
      component.reset();
      component._addAddressInputValue = ANOTHER_SAMPLE_EMAIL_ADDRESS;

      component.model = {
        primary,
        secondary: { ...secondaryEmpty, state: 'adding' },
      };
    }),
    storyWait(2000, ([component]) => {
      component.reset();

      component.model = {
        primary,
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

      component.model = {
        primary,
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

      component.model = {
        primary,
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

      component.model = {
        primary,
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
      component.model = {
        primary,
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
      component.model = {
        primary,
        secondary: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              state: 'markingAsPrimary',
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      };
    }),
    storyWait(2000, ([component]) => {
      component.model = {
        primary: { address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true } },
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
      component.model = {
        primary: { address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true } },
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
      component.model = {
        primary: { address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true } },
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
  errorWithLoadingPrimaryEmail,
  errorWithLoadingSecondaryEmail,
  errorWithSendingConfirmationEmail,
  errorWithAddingSecondaryEmailAddress,
  errorWithDeletingSecondaryEmailAddress,
  errorWithMarkingAsPrimary,
  errorWithEmptyEmail,
  errorWithInvalidEmail,
  sendingConfirmationEmail,
  addingSecondary,
  deletingSecondary,
  markingSecondaryAsPrimary,
  dataLoadedWithHugeEmail,
  dataLoadedWithNoSecondaryEmails,
  simulationsWithPrimary,
  simulationsWithSecondary,
});
