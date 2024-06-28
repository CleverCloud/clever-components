import '../cc-smart-container/cc-smart-container.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import './cc-redis-explorer.js';

defineSmartComponent({
  selector: 'cc-ssh-key-list',
  params: {
    apiConfig: { type: Object },
  },
  onContextUpdate ({ component, context, onEvent, updateComponent, signal }) {

    updateComponent('createSshKeyForm', CcSshKeyList.CREATE_FORM_INIT_STATE);
    updateComponent('keyData', { state: 'loading' });

    refreshList();
  },
});

async function fetchAllKeys ({ apiConfig, signal, cacheDelay }) {
  const [user, personalKeys] = await Promise.all([
    getUser({}).then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY })),
    getSshKeys().then(sendToApi({ apiConfig, signal, cacheDelay })),
  ]);

  const isGithubLinked = user.oauthApps.includes('github');
  let githubKeys;
  if (isGithubLinked) {
    githubKeys = await getKeys().then(sendToApi({ apiConfig, signal, cacheDelay }));
  }

  return { isGithubLinked, personalKeys, githubKeys };
}

async function addKey ({ apiConfig, key }) {
  const name = encodeURIComponent(key.name);
  const publicKey = key.key;
  return addSshKey({ key: name }, JSON.stringify(publicKey))
    .then(sendToApi({ apiConfig }));
}

const importKey = addKey;

async function deleteKey ({ apiConfig, key }) {
  const name = encodeURIComponent(key.name);
  return removeSshKey({ key: name })
    .then(sendToApi({ apiConfig }));
}
