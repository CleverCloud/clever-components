import { produce } from '../../lib/immer.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-ssh-key-list.js';
import './cc-ssh-key-list.smart.js';

/** @type {NewKey} */
const NEW_KEY = {
  name: 'Work laptop',
  publicKey: 'ssh-ed25519 ACABC3NzaCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxltMkfjBkNv',
};

const PRIVATE_KEY = `-----BEGIN OPENSSH PRIVATE KEY-----
b3Blbnxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx5jb20B
-----END OPENSSH PRIVATE KEY-----
`;

/** @type {SshKeyState} */
const DUMMY_KEY_1 = {
  type: 'idle',
  name: 'Work laptop',
  fingerprint: 'SHA256:tk3u9yxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxlTIKLk',
};

/** @type {SshKeyState} */
const DUMMY_KEY_2 = {
  type: 'idle',
  name: 'Work PC',
  fingerprint: 'SHA256:nfIaqPxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx57zFs',
};
/** @type {SshKeyState} */
const DUMMY_KEY_3 = {
  type: 'idle',
  name: 'Macbook Air Pro',
  fingerprint: '00:03:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:7f:62',
};

/** @type {Partial<CcSshKeyList>} */
const baseItem = {
  keyListState: {
    type: 'loaded',
    isGithubLinked: true,
    personalKeys: [DUMMY_KEY_1],
    githubKeys: [DUMMY_KEY_2],
  },
};

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-ssh-key-list>',
  component: 'cc-ssh-key-list',
};

/**
 * @typedef {import('./cc-ssh-key-list.js').CcSshKeyList} CcSshKeyList
 * @typedef {import('./cc-ssh-key-list.types.js').SshKeyState} SshKeyState
 * @typedef {import('./cc-ssh-key-list.types.js').SshKeyListStateLoadedAndLinked} SshKeyListStateLoadedAndLinked
 * @typedef {import('./cc-ssh-key-list.types.js').NewKey} NewKey
 * @typedef {import('../cc-input-text/cc-input-text.js').CcInputText} CcInputText
 */

const conf = {
  component: 'cc-ssh-key-list',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [baseItem],
});

export const emptyStory = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [
    {
      keyListState: {
        type: 'loaded',
        isGithubLinked: true,
        personalKeys: [],
        githubKeys: [],
      },
    },
  ],
});

export const dataLoadedWithMultipleItems = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [
    {
      keyListState: {
        type: 'loaded',
        isGithubLinked: true,
        personalKeys: [DUMMY_KEY_1, DUMMY_KEY_2, DUMMY_KEY_3],
        githubKeys: [DUMMY_KEY_1, DUMMY_KEY_2, DUMMY_KEY_3],
      },
    },
  ],
});

export const dataLoadedWithLongNames = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [
    {
      keyListState: {
        type: 'loaded',
        isGithubLinked: true,
        personalKeys: [
          {
            ...DUMMY_KEY_1,
            name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel erat euismod, egestas turpis eget, facilisis ante. Etiam ac pharetra nibh. Nulla facilisi.',
          },
          {
            ...DUMMY_KEY_2,
            name: 'LoremipsumdolorsitametconsecteturadipiscingelitSedvelerateuismodegestasturpisegetfacilisisanteEtiamacpharetranibhNullafacilisi',
          },
        ],
        githubKeys: [
          {
            ...DUMMY_KEY_1,
            name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel erat euismod, egestas turpis eget, facilisis ante. Etiam ac pharetra nibh. Nulla facilisi.',
          },
          {
            ...DUMMY_KEY_2,
            name: 'LoremipsumdolorsitametconsecteturadipiscingelitSedvelerateuismodegestasturpisegetfacilisisanteEtiamacpharetranibhNullafacilisi',
          },
        ],
      },
    },
  ],
});

export const dataLoadedWithGithubUnlinked = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [
    {
      keyListState: {
        type: 'loaded',
        isGithubLinked: false,
        personalKeys: [DUMMY_KEY_1],
      },
    },
  ],
});

export const skeleton = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [
    {
      keyListState: {
        type: 'loading',
      },
    },
  ],
});

export const waitingWithAddingPersonalKey = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [
    {
      ...baseItem,
      createKeyFormState: { type: 'creating' },
    },
  ],
  /** @param {CcSshKeyList} component */
  onUpdateComplete: (component) => {
    /** @type {CcInputText} */
    const nameInputElement = component._createFormRef.value.querySelector('[name="name"]');
    /** @type {CcInputText} */
    const publicKeyInputElement = component._createFormRef.value.querySelector('[name="publicKey"]');
    nameInputElement.value = NEW_KEY.name;
    publicKeyInputElement.value = NEW_KEY.publicKey;
  },
});

export const waitingWithDeletingPersonalKey = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [
    {
      keyListState: {
        type: 'loaded',
        isGithubLinked: true,
        personalKeys: [
          DUMMY_KEY_1,
          {
            ...DUMMY_KEY_2,
            type: 'deleting',
          },
          DUMMY_KEY_3,
        ],
        githubKeys: [],
      },
    },
  ],
});

export const waitingWithImportingGithubKey = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [
    {
      keyListState: {
        type: 'loaded',
        isGithubLinked: true,
        personalKeys: [DUMMY_KEY_1, DUMMY_KEY_3],
        githubKeys: [
          {
            ...DUMMY_KEY_2,
            type: 'importing',
          },
        ],
      },
    },
  ],
});

export const errorWithWhenListingKeys = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [
    {
      keyListState: {
        type: 'error',
      },
    },
  ],
});

export const errorWithWhenNameIsEmpty = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [baseItem],
  /** @param {CcSshKeyList} component */
  onUpdateComplete: (component) => {
    /** @type {CcInputText} */
    const nameInputElement = component._createFormRef.value.querySelector('[name="name"]');
    /** @type {CcInputText} */
    const publicKeyInputElement = component._createFormRef.value.querySelector('[name="publicKey"]');
    nameInputElement.value = '';
    publicKeyInputElement.value = NEW_KEY.publicKey;
    nameInputElement.validate();
    nameInputElement.reportInlineValidity();
  },
});

export const errorWithWhenPublicKeyIsEmpty = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [baseItem],
  /** @param {CcSshKeyList} component */
  onUpdateComplete: (component) => {
    /** @type {CcInputText} */
    const nameInputElement = component._createFormRef.value.querySelector('[name="name"]');
    /** @type {CcInputText} */
    const publicKeyInputElement = component._createFormRef.value.querySelector('[name="publicKey"]');
    nameInputElement.value = NEW_KEY.name;
    publicKeyInputElement.value = '';
    publicKeyInputElement.validate();
    publicKeyInputElement.reportInlineValidity();
  },
});

export const errorWithWhenAllInputsAreEmpty = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [baseItem],
  /** @param {CcSshKeyList} component */
  onUpdateComplete: (component) => {
    /** @type {CcInputText} */
    const nameInputElement = component._createFormRef.value.querySelector('[name="name"]');
    /** @type {CcInputText} */
    const publicKeyInputElement = component._createFormRef.value.querySelector('[name="publicKey"]');
    nameInputElement.value = '';
    publicKeyInputElement.value = '';
    nameInputElement.validate();
    nameInputElement.reportInlineValidity();
    publicKeyInputElement.validate();
    publicKeyInputElement.reportInlineValidity();
  },
});

export const errorWithWhenPublicKeyIsPrivate = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [baseItem],
  /** @param {CcSshKeyList} component */
  onUpdateComplete: (component) => {
    /** @type {CcInputText} */
    const nameInputElement = component._createFormRef.value.querySelector('[name="name"]');
    /** @type {CcInputText} */
    const publicKeyInputElement = component._createFormRef.value.querySelector('[name="publicKey"]');
    nameInputElement.value = NEW_KEY.name;
    publicKeyInputElement.value = PRIVATE_KEY;
    nameInputElement.validate();
    nameInputElement.reportInlineValidity();
    publicKeyInputElement.validate();
    publicKeyInputElement.reportInlineValidity();
  },
});

export const simulationWithAddingKey = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [
    {
      keyListState: {
        type: 'loaded',
        isGithubLinked: true,
        personalKeys: [DUMMY_KEY_2],
        githubKeys: [DUMMY_KEY_3],
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {Array<CcSshKeyList>} components */
      ([component]) => {
        /** @type {CcInputText} */
        const nameInputElement = component._createFormRef.value.querySelector('[name="name"]');
        nameInputElement.value = NEW_KEY.name;
      },
    ),
    storyWait(
      500,
      /** @param {Array<CcSshKeyList>} components */
      ([component]) => {
        /** @type {CcInputText} */
        const publicKeyInputElement = component._createFormRef.value.querySelector('[name="publicKey"]');
        publicKeyInputElement.value = NEW_KEY.publicKey;
      },
    ),
    storyWait(
      1500,
      /** @param {Array<CcSshKeyList>} components */
      ([component]) => {
        component.createKeyFormState = { type: 'creating' };
      },
    ),
    storyWait(
      2000,
      /** @param {Array<CcSshKeyList>} components */
      ([component]) => {
        component.resetCreateKeyForm();
        component.createKeyFormState = { type: 'idle' };
        component.keyListState = produce(
          component.keyListState,
          /** @param {SshKeyListStateLoadedAndLinked} state */
          (state) => {
            state.personalKeys.push(DUMMY_KEY_1);
          },
        );
      },
    ),
  ],
});

export const simulationWithDeletingKey = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [
    {
      keyListState: {
        type: 'loaded',
        isGithubLinked: true,
        personalKeys: [DUMMY_KEY_1, DUMMY_KEY_2],
        githubKeys: [DUMMY_KEY_3],
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {Array<CcSshKeyList>} components */
      ([component]) => {
        component.keyListState = produce(
          component.keyListState,
          /** @param {SshKeyListStateLoadedAndLinked} state */
          (state) => {
            state.personalKeys[1].type = 'deleting';
          },
        );
      },
    ),
    storyWait(
      1500,
      /** @param {Array<CcSshKeyList>} components */
      ([component]) => {
        component.keyListState = produce(
          component.keyListState,
          /** @param {SshKeyListStateLoadedAndLinked} state */
          (state) => {
            state.personalKeys = [DUMMY_KEY_1];
          },
        );
      },
    ),
  ],
});

export const simulationWithImportingGithubKey = makeStory(conf, {
  /** @type {Partial<CcSshKeyList>[]} */
  items: [
    {
      keyListState: {
        type: 'loaded',
        isGithubLinked: true,
        personalKeys: [DUMMY_KEY_1],
        githubKeys: [DUMMY_KEY_2, DUMMY_KEY_3],
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {Array<CcSshKeyList>} components */
      ([component]) => {
        component.keyListState = produce(
          component.keyListState,
          /** @param {SshKeyListStateLoadedAndLinked} state */
          (state) => {
            state.githubKeys[0].type = 'importing';
          },
        );
      },
    ),
    storyWait(
      1500,
      /** @param {Array<CcSshKeyList>} components */
      ([component]) => {
        component.keyListState = produce(
          component.keyListState,
          /** @param {SshKeyListStateLoadedAndLinked} state */
          (state) => {
            state.personalKeys = [DUMMY_KEY_1, DUMMY_KEY_2];
            state.githubKeys = [DUMMY_KEY_3];
          },
        );
      },
    ),
  ],
});
