import { GetProfileCommand } from '@clevercloud/client/cc-api-commands/profile/get-profile-command.js';
import { CreatePersonalSshKeyCommand } from '@clevercloud/client/cc-api-commands/ssh-key/create-personal-ssh-key-command.js';
import { DeletePersonalSshKeyCommand } from '@clevercloud/client/cc-api-commands/ssh-key/delete-personal-ssh-key-command.js';
import { ListGithubSshKeyCommand } from '@clevercloud/client/cc-api-commands/ssh-key/list-github-ssh-key-command.js';
import { ListPersonalSshKeyCommand } from '@clevercloud/client/cc-api-commands/ssh-key/list-personal-ssh-key-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-ssh-key-list.js';

const ONE_DAY = 1000 * 60 * 60 * 24;

/**
 * @import { CcSshKeyList } from './cc-ssh-key-list.js'
 * @import { SshKey, GithubSshKey, SshKeyListStateLoadedAndLinked, SshKeyListStateLoadedAndUnlinked } from './cc-ssh-key-list.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-ssh-key-list',
  params: {
    apiConfig: { type: Object },
  },
  /**
   * @param {OnContextUpdateArgs<CcSshKeyList>} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig } = context;
    const api = new Api({ apiConfig, signal });

    // Retrieving SSH keys is done in two steps, hidden in the `fetchAllKeys()` implementation:
    // - first, we retrieve the current user information to check if their GitHub account is linked to their main account;
    // - then, we fetch the personal SSH keys and the GitHub keys if needed.
    // Note: we intentionally show `loading` type only on initial load and not on further actions, to keep a responsive UI.
    function refreshList() {
      return api
        .fetchAllKeys()
        .then(({ isGithubLinked, personalKeys, githubKeys }) => {
          updateComponent('keyListState', {
            type: 'loaded',
            // linked (or unlinked) GitHub account type passed to the component
            isGithubLinked,
            // internal key states initialization (to `idle`) after API fetch, to separate fetched data from UI infos
            personalKeys: personalKeys.map((key) => ({ ...key, type: 'idle' })),
            githubKeys: githubKeys?.map((key) => ({ ...key, type: 'idle' })),
          });
        })
        .catch((error) => {
          console.error(error);
          updateComponent('keyListState', { type: 'error' });
        });
    }

    onEvent('cc-ssh-key-create', ({ name, publicKey }) => {
      component.createKeyFormState = { type: 'creating' };

      api
        .addKey({ key: { name: name.trim(), key: publicKey.trim() } })
        .then(() => {
          // re-fetching keys because we need fingerprint info sent from API to properly display newly created keys
          refreshList().then(() => {
            notifySuccess(i18n('cc-ssh-key-list.success.add', { name }));
            component.resetCreateKeyForm();
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(error, i18n('cc-ssh-key-list.error.add', { name }));
        })
        .finally(() => {
          component.createKeyFormState = { type: 'idle' };
        });
    });

    onEvent('cc-ssh-key-delete', ({ name }) => {
      updateComponent(
        'keyListState',
        /** @param {SshKeyListStateLoadedAndLinked|SshKeyListStateLoadedAndUnlinked} keyListState */
        (keyListState) => {
          const key = keyListState.personalKeys.find((key) => key.name === name);
          key.type = 'deleting';
        },
      );

      api
        .deleteKey({ key: { name } })
        .then(() => {
          // refreshing both personal and GitHub keys because we don't know if we should add the deleting key back to the GitHub list
          refreshList().then(() => notifySuccess(i18n('cc-ssh-key-list.success.delete', { name })));
        })
        .catch((error) => {
          console.error(error);
          notifyError(error, i18n('cc-ssh-key-list.error.delete', { name }));
          updateComponent(
            'keyListState',
            /** @param {SshKeyListStateLoadedAndLinked|SshKeyListStateLoadedAndUnlinked} keyListState */
            (keyListState) => {
              const key = keyListState.personalKeys.find((key) => key.name === name);
              key.type = 'idle';
            },
          );
        });
    });

    onEvent('cc-ssh-key-import', ({ name, key, fingerprint }) => {
      updateComponent(
        'keyListState',
        /** @param {SshKeyListStateLoadedAndLinked} keyListState */
        (keyListState) => {
          const key = keyListState.githubKeys.find((key) => key.name === name);
          key.type = 'importing';
        },
      );

      api
        .importKey({ key: { name, key } })
        .then(() => {
          notifySuccess(i18n('cc-ssh-key-list.success.import', { name }));
          updateComponent(
            'keyListState',
            /** @param {SshKeyListStateLoadedAndLinked} keyListState */
            (keyListState) => {
              keyListState.personalKeys.push({ type: 'idle', name, fingerprint });
              keyListState.githubKeys = keyListState.githubKeys.filter((k) => k.name !== name);
            },
          );
        })
        .catch((error) => {
          console.error(error);
          notifyError(error, i18n('cc-ssh-key-list.error.import', { name }));
          updateComponent(
            'keyListState',
            /** @param {SshKeyListStateLoadedAndLinked} keyListState */
            (keyListState) => {
              const key = keyListState.githubKeys.find((key) => key.name === name);
              key.type = 'idle';
            },
          );
        });
    });

    updateComponent('keyListState', { type: 'loading' });
    component.createKeyFormState = { type: 'idle' };
    component.resetCreateKeyForm();

    refreshList();
  },
});

// -- API calls
class Api {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, signal }) {
    this._ccApiClient = getCcApiClientWithOAuth(apiConfig);
    this._signal = signal;
  }

  /**
   * @return {Promise<{
   *   isGithubLinked: boolean,
   *   personalKeys: Array<SshKey>,
   *   githubKeys: Array<GithubSshKey>,
   * }>}
   */
  async fetchAllKeys() {
    const [user, personalKeys] = await Promise.all([
      this._ccApiClient.send(new GetProfileCommand(), { signal: this._signal, cache: { ttl: ONE_DAY } }),
      this._ccApiClient.send(new ListPersonalSshKeyCommand(), { signal: this._signal, cache: { ttl: 0 } }),
    ]);

    const isGithubLinked = user.isLinkedToGitHub;
    let githubKeys;
    if (isGithubLinked) {
      githubKeys = await this._ccApiClient.send(new ListGithubSshKeyCommand(), { signal: this._signal });
    }

    return { isGithubLinked, personalKeys, githubKeys };
  }

  /**
   * @param {object} params
   * @param {{name: string, key: string}} params.key
   * @return {Promise<any>}
   */
  addKey({ key }) {
    return this._ccApiClient.send(new CreatePersonalSshKeyCommand(key));
  }

  /**
   * @param {object} params
   * @param {{name: string, key: string}} params.key
   * @return {Promise<any>}
   */
  importKey({ key }) {
    return this.addKey({ key });
  }

  /**
   * @param {object} params
   * @param {{name: string}} params.key
   * @return {Promise<any>}
   */
  deleteKey({ key }) {
    return this._ccApiClient.send(new DeletePersonalSshKeyCommand(key));
  }
}
