import '../../src/emails/cc-email.js';
import '../../src/emails/cc-email.smart.js';
import { createStateMutator } from '../../src/emails/stateHelpers.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const SAMPLE_EMAIL_ADDRESS = 'sample.email@clever-cloud.com';
const ANOTHER_SAMPLE_EMAIL_ADDRESS = 'another.sample.email@clever-cloud.com';
const YET_ANOTHER_SAMPLE_EMAIL_ADDRESS = 'yet.another.sample.email@clever-cloud.com';
const HUGE_EMAIL_ADDRESS = `hugeemaila${'d'.repeat(500)}ress@clever-cloud.com`;

const primary = { address: { value: SAMPLE_EMAIL_ADDRESS, verified: true } };
const primaryUnverified = { address: { value: SAMPLE_EMAIL_ADDRESS, verified: false } };
const secondaryAddresses = [
  {
    address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
  },
  {
    address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
  },
];
const secondaryEmpty = [];

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
      state: {
        type: 'loaded',
        data: {
          primary,
          secondaryAddresses,
        },
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
      state: {
        type: 'error',
        error: 'loading',
      },
    },
  ],
});

export const errorWithEmptyEmail = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        data: {
          primary,
          secondaryAddresses,
        },
      },
      _formState: {
        type: 'idle',
        input: '',
        error: 'empty',
      },
    },
  ],
});

export const errorWithInvalidEmail = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        data: {
          primary,
          secondaryAddresses,
        },
      },
      _formState: {
        type: 'idle',
        input: 'invalid e-mail !!',
        error: 'invalid',
      },
    },
  ],
});

export const dataLoadedWithUnverifiedPrimaryEmailAddress = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        data: {
          primary: primaryUnverified,
          secondaryAddresses: [],
        },
      },
    },
  ],
});

export const dataLoadedWithHugeEmail = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        data: {
          primary: { address: { value: HUGE_EMAIL_ADDRESS, verified: true } },
          secondaryAddresses: [
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
      state: {
        type: 'loaded',
        data: {
          primary: { address: { value: HUGE_EMAIL_ADDRESS, verified: true } },
          secondaryAddresses: [],
        },
      },
    },
  ],
});

export const sendingConfirmationEmail = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        data: {
          primary: { ...primaryUnverified, state: 'sending-confirmation-email' },
          secondaryAddresses,
        },
      },
    },
  ],
});

export const addingSecondary = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        data: {
          primary,
          secondaryAddresses,
        },
      },
      _formState: {
        type: 'adding',
        input: 'secondary@clever-cloud.com',
      },
    },
  ],
});

export const deletingSecondary = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        data: {
          primary,
          secondaryAddresses: [
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
      state: {
        type: 'loaded',
        data: {
          primary,
          secondaryAddresses: [
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
      state: {
        type: 'loaded',
        data: {
          primary,
          secondaryAddresses: [
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
      createStateMutator(component).data(
        {
          primary: primaryUnverified,
          secondaryAddresses: secondaryEmpty,
        },
      );
    }),
    storyWait(2000, ([component]) => {
      createStateMutator(component).data(
        {
          ...component.state.data,
          primary: { ...primaryUnverified, state: 'sending-confirmation-email' },
        },
      );
    }),
    storyWait(2000, ([component]) => {
      createStateMutator(component).data({
        ...component.state.data,
        primary,
      });
    }),
  ],
});

export const simulationsWithSecondary = makeStory(conf, {
  items: [
    {},
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      createStateMutator(component).data({
        primary: primary,
        secondaryAddresses: secondaryEmpty,
      });
    }),
    storyWait(2000, ([component]) => {
      component.formInput('invalid email');
    }),
    storyWait(2000, ([component]) => {
      component.formAdding();
    }),
    storyWait(2000, ([component]) => {
      component.formError('invalid');
    }),
    storyWait(2000, ([component]) => {
      component.formInput(ANOTHER_SAMPLE_EMAIL_ADDRESS);
    }),
    storyWait(2000, ([component]) => {
      component.formAdding();
    }),
    storyWait(2000, ([component]) => {
      component.resetForm();
      createStateMutator(component).data({
        ...component.state.data,
        secondaryAddresses: [
          {
            address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: false },
          },
        ],
      });
    }),
    storyWait(2000, ([component]) => {
      component.formInput(YET_ANOTHER_SAMPLE_EMAIL_ADDRESS);
    }),
    storyWait(2000, ([component]) => {
      component.formAdding();
    }),
    storyWait(2000, ([component]) => {
      component.resetForm();

      createStateMutator(component).data({
        ...component.state.data,
        secondaryAddresses: [
          {
            address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: false },
          },
          {
            address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: false },
          },
        ],
      });
    }),
    storyWait(2000, ([component]) => {
      createStateMutator(component).data({
        ...component.state.data,
        secondaryAddresses: [
          {
            address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
          },
          {
            address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
          },
        ],
      });
    }),
    storyWait(2000, ([component]) => {
      createStateMutator(component).data({
        ...component.state.data,
        secondaryAddresses: [
          {
            address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            state: 'marking-as-primary',
          },
          {
            address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
          },
        ],
      });
    }),
    storyWait(2000, ([component]) => {
      createStateMutator(component).data({
        primary: { address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true } },
        secondaryAddresses: [
          {
            address: { value: SAMPLE_EMAIL_ADDRESS, verified: true },
          },
          {
            address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
          },
        ],
      });
    }),
    storyWait(2000, ([component]) => {
      createStateMutator(component).data({
        ...component.state.data,
        secondaryAddresses: [
          {
            address: { value: SAMPLE_EMAIL_ADDRESS, verified: true },
            state: 'deleting',
          },
          {
            address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
          },
        ],
      });
    }),
    storyWait(2000, ([component]) => {
      createStateMutator(component).data({
        ...component.state.data,
        secondaryAddresses: [
          {
            address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
          },
        ],
      });
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
