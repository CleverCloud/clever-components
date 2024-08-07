import { produce } from '../../lib/immer.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-ssh-key-list.js';
import './cc-ssh-key-list.smart.js';

const NEW_KEY = {
  name: 'Work laptop',
  key: 'ssh-ed25519 ACABC3NzaCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxltMkfjBkNv',
};

const PRIVATE_KEY = `-----BEGIN OPENSSH PRIVATE KEY-----
b3Blbnxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx5jb20B
-----END OPENSSH PRIVATE KEY-----
`;

const DUMMY_KEY_1 = {
  state: 'idle',
  name: 'Work laptop',
  fingerprint: 'SHA256:tk3u9yxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxlTIKLk',
};
const DUMMY_KEY_2 = {
  state: 'idle',
  name: 'Work PC',
  fingerprint: 'SHA256:nfIaqPxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx57zFs',
};
const DUMMY_KEY_3 = {
  state: 'idle',
  name: 'Macbook Air Pro',
  fingerprint: '00:03:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:7f:62',
};

const baseItem = {
  keyData: {
    state: 'loaded',
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
 */

const conf = {
  component: 'cc-ssh-key-list',
};

export const defaultStory = makeStory(conf, {
  items: [baseItem],
});

export const emptyStory = makeStory(conf, {
  items: [
    {
      keyData: {
        state: 'loaded',
        isGithubLinked: true,
        personalKeys: [],
        githubKeys: [],
      },
    },
  ],
});

export const dataLoadedWithMultipleItems = makeStory(conf, {
  items: [
    {
      keyData: {
        state: 'loaded',
        isGithubLinked: true,
        personalKeys: [DUMMY_KEY_1, DUMMY_KEY_2, DUMMY_KEY_3],
        githubKeys: [DUMMY_KEY_1, DUMMY_KEY_2, DUMMY_KEY_3],
      },
    },
  ],
});

export const dataLoadedWithLongNames = makeStory(conf, {
  items: [
    {
      keyData: {
        state: 'loaded',
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
  items: [
    {
      keyData: {
        state: 'loaded',
        isGithubLinked: false,
        personalKeys: [DUMMY_KEY_1],
      },
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {
      keyData: {
        state: 'loading',
      },
    },
  ],
});

export const waitingWithAddingPersonalKey = makeStory(conf, {
  items: [
    {
      ...baseItem,
      createKeyFormState: { type: 'creating' },
    },
  ],
  onUpdateComplete: (component) => {
    component._createFormRef.value.name.value = NEW_KEY.name;
    component._createFormRef.value.publicKey.value = NEW_KEY.key;
  },
});

export const waitingWithDeletingPersonalKey = makeStory(conf, {
  items: [
    {
      keyData: {
        state: 'loaded',
        isGithubLinked: true,
        personalKeys: [
          DUMMY_KEY_1,
          {
            ...DUMMY_KEY_2,
            state: 'deleting',
          },
          DUMMY_KEY_3,
        ],
        githubKeys: [],
      },
    },
  ],
});

export const waitingWithImportingGithubKey = makeStory(conf, {
  items: [
    {
      keyData: {
        state: 'loaded',
        isGithubLinked: true,
        personalKeys: [DUMMY_KEY_1, DUMMY_KEY_3],
        githubKeys: [
          {
            ...DUMMY_KEY_2,
            state: 'importing',
          },
        ],
      },
    },
  ],
});

export const errorWithWhenListingKeys = makeStory(conf, {
  items: [
    {
      keyData: {
        state: 'error',
      },
    },
  ],
});

export const errorWithWhenNameIsEmpty = makeStory(conf, {
  items: [baseItem],
  onUpdateComplete: (component) => {
    component._createFormRef.value.name.value = '';
    component._createFormRef.value.publicKey.value = NEW_KEY.key;
    component._createFormRef.value.name.validate();
    component._createFormRef.value.name.reportInlineValidity();
  },
});

export const errorWithWhenPublicKeyIsEmpty = makeStory(conf, {
  items: [baseItem],
  onUpdateComplete: (component) => {
    component._createFormRef.value.name.value = NEW_KEY.name;
    component._createFormRef.value.publicKey.value = '';
    component._createFormRef.value.publicKey.validate();
    component._createFormRef.value.publicKey.reportInlineValidity();
  },
});

export const errorWithWhenAllInputsAreEmpty = makeStory(conf, {
  items: [baseItem],
  onUpdateComplete: (component) => {
    component._createFormRef.value.name.value = '';
    component._createFormRef.value.publicKey.value = '';
    component._createFormRef.value.name.validate();
    component._createFormRef.value.name.reportInlineValidity();
    component._createFormRef.value.publicKey.validate();
    component._createFormRef.value.publicKey.reportInlineValidity();
  },
});

export const errorWithWhenPublicKeyIsPrivate = makeStory(conf, {
  items: [baseItem],
  onUpdateComplete: (component) => {
    component._createFormRef.value.name.value = NEW_KEY.name;
    component._createFormRef.value.publicKey.value = PRIVATE_KEY;
    component._createFormRef.value.name.validate();
    component._createFormRef.value.name.reportInlineValidity();
    component._createFormRef.value.publicKey.validate();
    component._createFormRef.value.publicKey.reportInlineValidity();
  },
});

export const simulationWithAddingKey = makeStory(conf, {
  items: [
    {
      keyData: {
        state: 'loaded',
        isGithubLinked: true,
        personalKeys: [DUMMY_KEY_2],
        githubKeys: [DUMMY_KEY_3],
      },
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component._createFormRef.value.name.value = NEW_KEY.name;
    }),
    storyWait(500, ([component]) => {
      component._createFormRef.value.publicKey.value = NEW_KEY.key;
    }),
    storyWait(1500, ([component]) => {
      component.createKeyFormState = { type: 'creating' };
    }),
    storyWait(2000, ([component]) => {
      component.resetCreateKeyForm();
      component.createKeyFormState = { type: 'idle' };
      component.keyData = produce(component.keyData, (keyData) => {
        keyData.personalKeys.push(DUMMY_KEY_1);
      });
    }),
  ],
});

export const simulationWithDeletingKey = makeStory(conf, {
  items: [
    {
      keyData: {
        state: 'loaded',
        isGithubLinked: true,
        personalKeys: [DUMMY_KEY_1, DUMMY_KEY_2],
        githubKeys: [DUMMY_KEY_3],
      },
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.keyData = produce(component.keyData, (keyData) => {
        keyData.personalKeys[1].state = 'deleting';
      });
    }),
    storyWait(1500, ([component]) => {
      component.keyData = produce(component.keyData, (keyData) => {
        keyData.personalKeys = [DUMMY_KEY_1];
      });
    }),
  ],
});

export const simulationWithImportingGithubKey = makeStory(conf, {
  items: [
    {
      keyData: {
        state: 'loaded',
        isGithubLinked: true,
        personalKeys: [DUMMY_KEY_1],
        githubKeys: [DUMMY_KEY_2, DUMMY_KEY_3],
      },
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.keyData = produce(component.keyData, (keyData) => {
        keyData.githubKeys[0].state = 'importing';
      });
    }),
    storyWait(1500, ([component]) => {
      component.keyData = produce(component.keyData, (keyData) => {
        keyData.personalKeys = [DUMMY_KEY_1, DUMMY_KEY_2];
        keyData.githubKeys = [DUMMY_KEY_3];
      });
    }),
  ],
});
